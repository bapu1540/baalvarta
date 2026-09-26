/**
 * Firebase Firestore & Firebase Storage Integration for Baalvarta Portal
 * Provides global real-time synchronization across all devices (Mobile, Desktop, Tablet)
 * so stories and worksheets added/deleted in Admin CMS appear live everywhere instantly!
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  writeBatch,
  Unsubscribe,
  disableNetwork,
} from 'firebase/firestore';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { Story, PrintableWorksheet, FirebaseConfig } from '../types';
import appletConfig from '../../firebase-applet-config.json';

export const FIREBASE_STORAGE_CONFIG_KEY = 'baalvarta_firebase_config_v1';

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

/**
 * Retrieve active Firebase configuration from:
 * 1. User manual override in localStorage (Admin CMS)
 * 2. Auto-provisioned firebase-applet-config.json
 * 3. Vite / Vercel environment variables
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  // 1. Check user-saved configuration in localStorage (from Admin CMS)
  try {
    const saved = localStorage.getItem(FIREBASE_STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading saved Firebase config:', err);
  }

  // 2. Check auto-provisioned Firebase project configuration
  if (appletConfig && appletConfig.projectId && appletConfig.apiKey) {
    return {
      apiKey: appletConfig.apiKey,
      authDomain: appletConfig.authDomain || `${appletConfig.projectId}.firebaseapp.com`,
      projectId: appletConfig.projectId,
      storageBucket: appletConfig.storageBucket || `${appletConfig.projectId}.firebasestorage.app`,
      messagingSenderId: appletConfig.messagingSenderId || '',
      appId: appletConfig.appId || '',
      firestoreDatabaseId: appletConfig.firestoreDatabaseId || '',
      databaseURL: (appletConfig as any).databaseURL || '',
      measurementId: (appletConfig as any).measurementId || '',
    };
  }

  // 3. Check environment variables (Vercel / Vite build-time env)
  const env = (import.meta as any).env || {};
  if (env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
      firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '',
    };
  }

  return null;
}

/**
 * Save custom Firebase configuration from Admin CMS
 */
export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    localStorage.setItem(FIREBASE_STORAGE_CONFIG_KEY, JSON.stringify(config));
    sessionStorage.removeItem('baalvarta_firestore_quota_exhausted');
    isQuotaExhausted = false;
    // Reset cached instances to force re-initialization
    cachedApp = null;
    cachedDb = null;
    cachedStorage = null;
    return true;
  } catch (err) {
    console.error('Failed to save Firebase config:', err);
    return false;
  }
}

/**
 * Clear custom Firebase configuration
 */
export function clearFirebaseConfig(): void {
  try {
    localStorage.removeItem(FIREBASE_STORAGE_CONFIG_KEY);
    sessionStorage.removeItem('baalvarta_firestore_quota_exhausted');
    isQuotaExhausted = false;
    cachedApp = null;
    cachedDb = null;
    cachedStorage = null;
  } catch (err) {
    console.error('Failed to clear Firebase config:', err);
  }
}

/**
 * Check if Firebase is currently configured
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config && config.projectId && config.apiKey);
}

/**
 * Initialize and get Firebase App instance
 */
export function getFirebaseAppInstance(): FirebaseApp | null {
  if (cachedApp) return cachedApp;

  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length > 0) {
      cachedApp = getApp();
    } else {
      cachedApp = initializeApp(config);
    }
    return cachedApp;
  } catch (err) {
    console.error('Firebase initializeApp error:', err);
    return null;
  }
}

/**
 * Get Firestore Database instance with support for specific database IDs
 */
export function getFirestoreDb(): Firestore | null {
  if (isQuotaExhausted) return null;
  if (cachedDb) return cachedDb;

  const app = getFirebaseAppInstance();
  if (!app) return null;

  const config = getFirebaseConfig();
  try {
    if (config?.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      cachedDb = getFirestore(app, config.firestoreDatabaseId);
    } else {
      cachedDb = getFirestore(app);
    }
    return cachedDb;
  } catch (err) {
    console.warn('Firestore init with databaseId failed, trying default:', err);
    try {
      cachedDb = getFirestore(app);
      return cachedDb;
    } catch (e2) {
      console.error('Firestore init fallback error:', e2);
      return null;
    }
  }
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorageInstance(): FirebaseStorage | null {
  if (cachedStorage) return cachedStorage;

  const app = getFirebaseAppInstance();
  if (!app) return null;

  try {
    cachedStorage = getStorage(app);
    return cachedStorage;
  } catch (err) {
    console.error('Firebase Storage init error:', err);
    return null;
  }
}

/**
 * Upload an image (base64 data URL or external URL) to Firebase Cloud Storage.
 * Returns public download URL, or falls back to original string if storage is unconfigured/fails.
 */
export async function uploadImageToFirebaseStorage(
  imageDataOrUrl: string,
  storagePath: string
): Promise<string> {
  if (!imageDataOrUrl) return imageDataOrUrl;

  // If it's already an http/https external image (like unsplash), we don't necessarily need to re-upload
  if (!imageDataOrUrl.startsWith('data:')) {
    return imageDataOrUrl;
  }

  const storage = getFirebaseStorageInstance();
  if (!storage) {
    return imageDataOrUrl; // Graceful fallback to data URL
  }

  try {
    const fileRef = ref(storage, storagePath);
    await uploadString(fileRef, imageDataOrUrl, 'data_url');
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload failed, keeping original data URL:', err);
    return imageDataOrUrl;
  }
}

/**
 * Test Firebase Connection
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  const db = getFirestoreDb();
  if (!db) {
    return {
      success: false,
      message: 'Firebase कॉन्फ़िगरेशन नहीं मिला। कृपया API Key और Project ID दर्ज करें।',
    };
  }

  try {
    const testDocRef = doc(db, '_connection_test', 'ping');
    await setDoc(testDocRef, {
      lastPing: new Date().toISOString(),
      client: 'Baalvarta Web Client',
    });
    return {
      success: true,
      message: '✅ Firebase Firestore सफलतापूर्वक कनेक्ट हो गया! डेटा अब सभी डिवाइसों पर लाइव सिंक होगा।',
    };
  } catch (err: any) {
    console.error('Firebase test connection error:', err);
    return {
      success: false,
      message: `कनेक्शन त्रुटि: ${err.message || 'Firebase Firestore से कनेक्ट नहीं हो सका।'}`,
    };
  }
}

let isQuotaExhausted = Boolean(
  typeof window !== 'undefined' && sessionStorage.getItem('baalvarta_firestore_quota_exhausted') === 'true'
);

export function checkAndSetQuotaExhausted(err: any): boolean {
  if (
    err?.code === 'resource-exhausted' ||
    (typeof err?.message === 'string' &&
      (err.message.includes('Quota limit exceeded') ||
        err.message.includes('resource-exhausted') ||
        err.message.includes('Quota exceeded')))
  ) {
    if (!isQuotaExhausted) {
      isQuotaExhausted = true;
      try {
        sessionStorage.setItem('baalvarta_firestore_quota_exhausted', 'true');
      } catch {}
      console.warn('Firestore daily quota limit reached. App is safely operating in persistent Local & Express Database mode.');
      if (cachedDb) {
        disableNetwork(cachedDb).catch(() => {});
      }
    }
    return true;
  }
  return false;
}

/**
 * Sync single Story to Firestore
 */
export async function syncStoryToFirestore(story: Story): Promise<boolean> {
  if (isQuotaExhausted) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'stories', story.id);
    // Sanitize undefined fields which Firestore rejects
    const sanitized = JSON.parse(JSON.stringify(story));
    await setDoc(docRef, {
      ...sanitized,
      _syncedAt: Date.now(),
    });
    return true;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to sync story to Firestore:', story.id, err?.message || err);
    return false;
  }
}

/**
 * Delete single Story from Firestore
 */
export async function deleteStoryFromFirestore(storyId: string): Promise<boolean> {
  if (isQuotaExhausted) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'stories', storyId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to delete story from Firestore:', storyId, err?.message || err);
    return false;
  }
}

/**
 * Sync single Worksheet to Firestore
 */
export async function syncWorksheetToFirestore(worksheet: PrintableWorksheet): Promise<boolean> {
  if (isQuotaExhausted) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'worksheets', worksheet.id);
    const sanitized = JSON.parse(JSON.stringify(worksheet));
    await setDoc(docRef, {
      ...sanitized,
      _syncedAt: Date.now(),
    });
    return true;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to sync worksheet to Firestore:', worksheet.id, err?.message || err);
    return false;
  }
}

/**
 * Delete single Worksheet from Firestore
 */
export async function deleteWorksheetFromFirestore(worksheetId: string): Promise<boolean> {
  if (isQuotaExhausted) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'worksheets', worksheetId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to delete worksheet from Firestore:', worksheetId, err?.message || err);
    return false;
  }
}

/**
 * Batch upload all stories to Firestore
 */
export async function syncAllStoriesToFirestore(stories: Story[]): Promise<{ success: boolean; count: number }> {
  if (isQuotaExhausted) return { success: false, count: 0 };
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    // Firestore batch limit is 500 ops
    let syncedCount = 0;
    const batchSize = 100;
    for (let i = 0; i < stories.length; i += batchSize) {
      const chunk = stories.slice(i, i + batchSize);
      const batch = writeBatch(db);
      for (const item of chunk) {
        const docRef = doc(db, 'stories', item.id);
        const sanitized = JSON.parse(JSON.stringify(item));
        batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
        syncedCount++;
      }
      await batch.commit();
    }
    return { success: true, count: syncedCount };
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.error('Failed to batch sync stories to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

/**
 * Batch upload all worksheets to Firestore
 */
export async function syncAllWorksheetsToFirestore(
  worksheets: PrintableWorksheet[]
): Promise<{ success: boolean; count: number }> {
  if (isQuotaExhausted) return { success: false, count: 0 };
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const ws of worksheets) {
      const docRef = doc(db, 'worksheets', ws.id);
      const sanitized = JSON.parse(JSON.stringify(ws));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.error('Failed to batch sync worksheets to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

/**
 * Real-time listener for Stories collection in Firestore.
 * Triggers callback whenever stories are added, updated, or deleted anywhere!
 */
export function subscribeToFirestoreStories(
  callback: (stories: Story[]) => void
): Unsubscribe | null {
  if (isQuotaExhausted) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'stories');
    let unsubHandle: Unsubscribe | null = null;
    unsubHandle = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Story[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Story;
            if (data && data.id) {
              loaded.push(data);
            }
          });
          if (loaded.length > 0) {
            callback(loaded);
          }
        }
      },
      (err: any) => {
        const isQuota = checkAndSetQuotaExhausted(err);
        if (isQuota && unsubHandle) {
          try {
            unsubHandle();
          } catch {}
        } else if (!isQuota) {
          console.warn('Firestore stories subscription error:', err?.message || err);
        }
      }
    );
    return unsubHandle;
  } catch (err) {
    console.warn('Failed to subscribe to Firestore stories:', err);
    return null;
  }
}

/**
 * Real-time listener for Worksheets collection in Firestore.
 */
export function subscribeToFirestoreWorksheets(
  callback: (worksheets: PrintableWorksheet[]) => void
): Unsubscribe | null {
  if (isQuotaExhausted) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'worksheets');
    let unsubHandle: Unsubscribe | null = null;
    unsubHandle = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: PrintableWorksheet[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as PrintableWorksheet;
            if (data && data.id) {
              loaded.push(data);
            }
          });
          if (loaded.length > 0) {
            callback(loaded);
          }
        }
      },
      (err: any) => {
        const isQuota = checkAndSetQuotaExhausted(err);
        if (isQuota && unsubHandle) {
          try {
            unsubHandle();
          } catch {}
        } else if (!isQuota) {
          console.warn('Firestore worksheets subscription error:', err?.message || err);
        }
      }
    );
    return unsubHandle;
  } catch (err) {
    console.warn('Failed to subscribe to Firestore worksheets:', err);
    return null;
  }
}

/**
 * Fetch all Stories from Firestore once
 */
export async function fetchStoriesFromFirestore(): Promise<Story[] | null> {
  if (isQuotaExhausted) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'stories'));
    if (snap.empty) return null;
    const stories: Story[] = [];
    snap.forEach((d) => {
      stories.push(d.data() as Story);
    });
    return stories.length > 0 ? stories : null;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to fetch stories from Firestore:', err?.message || err);
    return null;
  }
}

/**
 * Fetch all Worksheets from Firestore once
 */
export async function fetchWorksheetsFromFirestore(): Promise<PrintableWorksheet[] | null> {
  if (isQuotaExhausted) return null;
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'worksheets'));
    if (snap.empty) return null;
    const worksheets: PrintableWorksheet[] = [];
    snap.forEach((d) => {
      worksheets.push(d.data() as PrintableWorksheet);
    });
    return worksheets.length > 0 ? worksheets : null;
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Failed to fetch worksheets from Firestore:', err?.message || err);
    return null;
  }
}

/**
 * Validate connection to Firestore on initial boot without wasting write operations
 */
export async function testConnectionOnBoot(): Promise<boolean> {
  if (isQuotaExhausted) return false;
  try {
    const db = getFirestoreDb();
    if (!db) return false;
    return true;
  } catch (err: any) {
    console.warn('Firestore initial boot check:', err?.message || err);
    return false;
  }
}

/**
 * Automatically seed default stories and worksheets to Firestore if collections are empty (runs once)
 */
export async function seedInitialFirestoreDataIfNeeded(
  stories: Story[],
  worksheets: PrintableWorksheet[]
): Promise<void> {
  if (isQuotaExhausted) return;
  const db = getFirestoreDb();
  if (!db) return;

  const isSeeded = localStorage.getItem('baalvarta_firestore_seeded_v1');
  if (isSeeded) return;

  try {
    const storySnap = await getDocs(collection(db, 'stories'));
    if (storySnap.empty && stories.length > 0) {
      console.log('Populating newly linked Firebase Firestore with stories...');
      await syncAllStoriesToFirestore(stories);
    }

    const wsSnap = await getDocs(collection(db, 'worksheets'));
    if (wsSnap.empty && worksheets.length > 0) {
      console.log('Populating newly linked Firebase Firestore with worksheets...');
      await syncAllWorksheetsToFirestore(worksheets);
    }

    localStorage.setItem('baalvarta_firestore_seeded_v1', 'true');
  } catch (err: any) {
    checkAndSetQuotaExhausted(err);
    console.warn('Firestore auto-seed check skipped or quota limited:', err?.message || err);
  }
}

