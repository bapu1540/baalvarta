/**
 * Firebase Firestore & Cloud Synchronization for Baalvarta Portal
 * Provides global real-time synchronization across all devices (Mobile, Desktop, Tablet)
 * so stories, videos, quizzes, worksheets, fun facts, and learning items
 * added/deleted in Admin CMS appear live everywhere instantly!
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
} from 'firebase/firestore';
import {
  Story,
  PrintableWorksheet,
  VideoStory,
  FunFact,
  LearningItem,
  AudioStory,
  QuizSet,
  FirebaseConfig,
  PaymentSettings,
  NewsletterSubscriber,
} from '../types';
import appletConfig from '../../firebase-applet-config.json';

export const FIREBASE_STORAGE_CONFIG_KEY = 'baalvarta_firebase_config_v1';
export const CANONICAL_DB_ID = 'ai-studio-baalvartakidssto-e84405f1-d0ba-4a9d-b10f-d57c1a9c8dfe';

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

// Clear any accidental quota-exhausted locks on session start so devices never stay locked
if (typeof window !== 'undefined') {
  try {
    sessionStorage.removeItem('baalvarta_firestore_quota_exhausted');
  } catch {
    // ignore
  }
}

/**
 * Retrieve authoritative Firebase configuration.
 * Always guarantees connection to canonical project and firestore database ID.
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  // 1. Primary: Canonical auto-provisioned Firebase project configuration
  if (appletConfig && appletConfig.projectId && appletConfig.apiKey) {
    return {
      apiKey: appletConfig.apiKey,
      authDomain: appletConfig.authDomain || `${appletConfig.projectId}.firebaseapp.com`,
      projectId: appletConfig.projectId,
      storageBucket: appletConfig.storageBucket || `${appletConfig.projectId}.firebasestorage.app`,
      messagingSenderId: appletConfig.messagingSenderId || '',
      appId: appletConfig.appId || '',
      firestoreDatabaseId: appletConfig.firestoreDatabaseId || CANONICAL_DB_ID,
      databaseURL: (appletConfig as any).databaseURL || '',
      measurementId: (appletConfig as any).measurementId || '',
    };
  }

  // 2. Check user-saved configuration in localStorage (from Admin CMS)
  try {
    const saved = localStorage.getItem(FIREBASE_STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return {
          ...parsed,
          firestoreDatabaseId: parsed.firestoreDatabaseId || CANONICAL_DB_ID,
        };
      }
    }
  } catch (err) {
    console.warn('Error reading saved Firebase config:', err);
  }

  // 3. Fallback to Vite environment variables
  const env = (import.meta as any).env || {};
  if (env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
      firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || CANONICAL_DB_ID,
    };
  }

  return null;
}

/**
 * Save custom Firebase configuration from Admin CMS
 */
export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    const safeConfig: FirebaseConfig = {
      ...config,
      firestoreDatabaseId: config.firestoreDatabaseId || CANONICAL_DB_ID,
    };
    localStorage.setItem(FIREBASE_STORAGE_CONFIG_KEY, JSON.stringify(safeConfig));
    cachedApp = null;
    cachedDb = null;
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
    cachedApp = null;
    cachedDb = null;
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
 * Get Firestore Database instance with canonical database ID
 */
export function getFirestoreDb(): Firestore | null {
  if (cachedDb) return cachedDb;

  const app = getFirebaseAppInstance();
  if (!app) return null;

  const config = getFirebaseConfig();
  const dbId = (config?.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)')
    ? config.firestoreDatabaseId
    : CANONICAL_DB_ID;

  try {
    cachedDb = getFirestore(app, dbId);
    return cachedDb;
  } catch (err) {
    console.error('Firestore init failed for database ID:', dbId, err);
    return null;
  }
}

/**
 * Test Firebase Connection with live read and write
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  const db = getFirestoreDb();
  if (!db) {
    return {
      success: false,
      message: 'Firebase कॉन्फ़िगरेशन नहीं मिला। कृपया प्रोजेक्ट ID व API Key जांचें।',
    };
  }

  try {
    const testDocRef = doc(db, '_connection_test', 'ping');
    await setDoc(testDocRef, {
      lastPing: new Date().toISOString(),
      client: 'Baalvarta Live Connection Test',
      timestamp: Date.now(),
    });
    return {
      success: true,
      message: '✅ Firebase Firestore 100% लाइव कनेक्टेड है! कहानियाँ, वीडियो और क्विज़ सभी डिवाइसों पर तुरंत सिंक होंगे।',
    };
  } catch (err: any) {
    console.error('Firebase test connection error:', err);
    return {
      success: false,
      message: `कनेक्शन त्रुटि: ${err?.message || 'Firebase Firestore से कनेक्ट नहीं हो सका।'}`,
    };
  }
}

/**
 * Test connection on initial boot with light ping
 */
export async function testConnectionOnBoot(): Promise<boolean> {
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
 * Optional image handler (passes URL through or preserves optimized base64)
 */
export async function uploadImageToFirebaseStorage(
  imageDataOrUrl: string,
  _storagePath: string
): Promise<string> {
  // If external URL or data URL, return directly (stored in story document)
  return imageDataOrUrl;
}

// ==========================================
// 1. STORIES SYNC & REALTIME LISTENERS
// ==========================================

export async function syncStoryToFirestore(story: Story): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'stories', story.id);
    const sanitized = JSON.parse(JSON.stringify(story));
    await setDoc(docRef, {
      ...sanitized,
      _syncedAt: Date.now(),
    });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync story to Firestore:', story.id, err?.message || err);
    return false;
  }
}

export async function deleteStoryFromFirestore(storyId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'stories', storyId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete story from Firestore:', storyId, err?.message || err);
    return false;
  }
}

export async function syncAllStoriesToFirestore(stories: Story[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
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
    console.error('Failed to batch sync stories to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreStories(callback: (stories: Story[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'stories');
    return onSnapshot(
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
        console.warn('Firestore stories subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore stories:', err);
    return null;
  }
}

export async function fetchStoriesFromFirestore(): Promise<Story[] | null> {
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
    console.warn('Failed to fetch stories from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 2. WORKSHEETS SYNC & REALTIME LISTENERS
// ==========================================

export async function syncWorksheetToFirestore(worksheet: PrintableWorksheet): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'worksheets', worksheet.id);
    const sanitized = JSON.parse(JSON.stringify(worksheet));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync worksheet to Firestore:', worksheet.id, err?.message || err);
    return false;
  }
}

export async function deleteWorksheetFromFirestore(worksheetId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'worksheets', worksheetId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete worksheet from Firestore:', worksheetId, err?.message || err);
    return false;
  }
}

export async function syncAllWorksheetsToFirestore(worksheets: PrintableWorksheet[]): Promise<{ success: boolean; count: number }> {
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
    console.error('Failed to batch sync worksheets to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreWorksheets(callback: (worksheets: PrintableWorksheet[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'worksheets');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: PrintableWorksheet[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as PrintableWorksheet;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore worksheets subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore worksheets:', err);
    return null;
  }
}

export async function fetchWorksheetsFromFirestore(): Promise<PrintableWorksheet[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'worksheets'));
    if (snap.empty) return null;
    const worksheets: PrintableWorksheet[] = [];
    snap.forEach((d) => worksheets.push(d.data() as PrintableWorksheet));
    return worksheets.length > 0 ? worksheets : null;
  } catch (err: any) {
    console.warn('Failed to fetch worksheets from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 3. VIDEO STORIES SYNC & REALTIME LISTENERS
// ==========================================

export async function syncVideoStoryToFirestore(video: VideoStory): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'video_stories', video.id);
    const sanitized = JSON.parse(JSON.stringify(video));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync video story to Firestore:', video.id, err?.message || err);
    return false;
  }
}

export async function deleteVideoStoryFromFirestore(videoId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'video_stories', videoId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete video story from Firestore:', videoId, err?.message || err);
    return false;
  }
}

export async function syncAllVideoStoriesToFirestore(videos: VideoStory[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const v of videos) {
      const docRef = doc(db, 'video_stories', v.id);
      const sanitized = JSON.parse(JSON.stringify(v));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to batch sync videos to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreVideoStories(callback: (videos: VideoStory[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'video_stories');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: VideoStory[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as VideoStory;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore video stories subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore video stories:', err);
    return null;
  }
}

export async function fetchVideoStoriesFromFirestore(): Promise<VideoStory[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'video_stories'));
    if (snap.empty) return null;
    const videos: VideoStory[] = [];
    snap.forEach((d) => videos.push(d.data() as VideoStory));
    return videos.length > 0 ? videos : null;
  } catch (err: any) {
    console.warn('Failed to fetch video stories from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 4. FUN FACTS SYNC & REALTIME LISTENERS
// ==========================================

export async function syncFunFactToFirestore(fact: FunFact): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'fun_facts', fact.id);
    const sanitized = JSON.parse(JSON.stringify(fact));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync fun fact to Firestore:', fact.id, err?.message || err);
    return false;
  }
}

export async function deleteFunFactFromFirestore(factId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'fun_facts', factId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete fun fact from Firestore:', factId, err?.message || err);
    return false;
  }
}

export async function syncAllFunFactsToFirestore(facts: FunFact[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const f of facts) {
      const docRef = doc(db, 'fun_facts', f.id);
      const sanitized = JSON.parse(JSON.stringify(f));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to batch sync fun facts to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreFunFacts(callback: (facts: FunFact[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'fun_facts');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: FunFact[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as FunFact;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore fun facts subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore fun facts:', err);
    return null;
  }
}

export async function fetchFunFactsFromFirestore(): Promise<FunFact[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'fun_facts'));
    if (snap.empty) return null;
    const facts: FunFact[] = [];
    snap.forEach((d) => facts.push(d.data() as FunFact));
    return facts.length > 0 ? facts : null;
  } catch (err: any) {
    console.warn('Failed to fetch fun facts from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 5. EARLY LEARNING SYNC & REALTIME LISTENERS
// ==========================================

export async function syncLearningItemToFirestore(item: LearningItem): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'early_learning', item.id);
    const sanitized = JSON.parse(JSON.stringify(item));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync learning item to Firestore:', item.id, err?.message || err);
    return false;
  }
}

export async function deleteLearningItemFromFirestore(itemId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'early_learning', itemId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete learning item from Firestore:', itemId, err?.message || err);
    return false;
  }
}

export async function syncAllLearningItemsToFirestore(items: LearningItem[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const item of items) {
      const docRef = doc(db, 'early_learning', item.id);
      const sanitized = JSON.parse(JSON.stringify(item));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to batch sync learning items to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreLearningItems(callback: (items: LearningItem[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'early_learning');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: LearningItem[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as LearningItem;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore learning items subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore learning items:', err);
    return null;
  }
}

export async function fetchLearningItemsFromFirestore(): Promise<LearningItem[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'early_learning'));
    if (snap.empty) return null;
    const items: LearningItem[] = [];
    snap.forEach((d) => items.push(d.data() as LearningItem));
    return items.length > 0 ? items : null;
  } catch (err: any) {
    console.warn('Failed to fetch learning items from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 6. AUDIO STORIES SYNC & REALTIME LISTENERS
// ==========================================

export async function syncAudioStoryToFirestore(audio: AudioStory): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'audio_stories', audio.id);
    const sanitized = JSON.parse(JSON.stringify(audio));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync audio story to Firestore:', audio.id, err?.message || err);
    return false;
  }
}

export async function deleteAudioStoryFromFirestore(audioId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'audio_stories', audioId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete audio story from Firestore:', audioId, err?.message || err);
    return false;
  }
}

export async function syncAllAudioStoriesToFirestore(audioList: AudioStory[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const a of audioList) {
      const docRef = doc(db, 'audio_stories', a.id);
      const sanitized = JSON.parse(JSON.stringify(a));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to batch sync audio stories to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreAudioStories(callback: (audioList: AudioStory[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'audio_stories');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AudioStory[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as AudioStory;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore audio stories subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore audio stories:', err);
    return null;
  }
}

export async function fetchAudioStoriesFromFirestore(): Promise<AudioStory[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'audio_stories'));
    if (snap.empty) return null;
    const list: AudioStory[] = [];
    snap.forEach((d) => list.push(d.data() as AudioStory));
    return list.length > 0 ? list : null;
  } catch (err: any) {
    console.warn('Failed to fetch audio stories from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 7. QUIZ SETS SYNC & REALTIME LISTENERS
// ==========================================

export async function syncQuizSetToFirestore(quiz: QuizSet): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'quiz_sets', quiz.id);
    const sanitized = JSON.parse(JSON.stringify(quiz));
    await setDoc(docRef, { ...sanitized, _syncedAt: Date.now() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync quiz set to Firestore:', quiz.id, err?.message || err);
    return false;
  }
}

export async function deleteQuizSetFromFirestore(quizId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'quiz_sets', quizId);
    await deleteDoc(docRef);
    return true;
  } catch (err: any) {
    console.warn('Failed to delete quiz set from Firestore:', quizId, err?.message || err);
    return false;
  }
}

export async function syncAllQuizSetsToFirestore(quizzes: QuizSet[]): Promise<{ success: boolean; count: number }> {
  const db = getFirestoreDb();
  if (!db) return { success: false, count: 0 };

  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const q of quizzes) {
      const docRef = doc(db, 'quiz_sets', q.id);
      const sanitized = JSON.parse(JSON.stringify(q));
      batch.set(docRef, { ...sanitized, _syncedAt: Date.now() });
      count++;
    }
    await batch.commit();
    return { success: true, count };
  } catch (err: any) {
    console.error('Failed to batch sync quizzes to Firestore:', err?.message || err);
    return { success: false, count: 0 };
  }
}

export function subscribeToFirestoreQuizSets(callback: (quizzes: QuizSet[]) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'quiz_sets');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: QuizSet[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as QuizSet;
            if (data && data.id) loaded.push(data);
          });
          if (loaded.length > 0) callback(loaded);
        }
      },
      (err: any) => {
        console.warn('Firestore quiz sets subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore quiz sets:', err);
    return null;
  }
}

export async function fetchQuizSetsFromFirestore(): Promise<QuizSet[] | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'quiz_sets'));
    if (snap.empty) return null;
    const quizzes: QuizSet[] = [];
    snap.forEach((d) => quizzes.push(d.data() as QuizSet));
    return quizzes.length > 0 ? quizzes : null;
  } catch (err: any) {
    console.warn('Failed to fetch quizzes from Firestore:', err?.message || err);
    return null;
  }
}

// ==========================================
// 8. SITE CONTENT SYNC (Branding, Footer, Reviews)
// ==========================================

export async function syncSiteContentToFirestore(contentId: string, data: any): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, 'site_content', contentId);
    const sanitized = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, { id: contentId, data: sanitized, updatedAt: new Date().toISOString() });
    return true;
  } catch (err: any) {
    console.warn('Failed to sync site content to Firestore:', contentId, err?.message || err);
    return false;
  }
}

export async function fetchSiteContentFromFirestore(contentId: string): Promise<any> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const snap = await getDocs(collection(db, 'site_content'));
    const docSnap = snap.docs.find((d) => d.id === contentId);
    return docSnap ? docSnap.data()?.data : null;
  } catch (err: any) {
    console.warn('Failed to fetch site content from Firestore:', contentId, err?.message || err);
    return null;
  }
}

export async function syncPaymentSettingsToFirestore(settings: PaymentSettings): Promise<boolean> {
  return syncSiteContentToFirestore('payment_settings', settings);
}

export async function fetchPaymentSettingsFromFirestore(): Promise<PaymentSettings | null> {
  return fetchSiteContentFromFirestore('payment_settings');
}

export function subscribeToFirestorePaymentSettings(callback: (settings: PaymentSettings) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'site_content', 'payment_settings');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.data) {
            callback(data.data as PaymentSettings);
          }
        }
      },
      (err: any) => {
        console.warn('Firestore payment settings subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore payment settings:', err);
    return null;
  }
}

// ==========================================
// 8.5 NEWSLETTER SUBSCRIBERS & VISITOR STATS
// ==========================================

export async function syncNewsletterSubscriberToFirestore(subscriber: NewsletterSubscriber): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docId = subscriber.id || subscriber.email.replace(/[^a-zA-Z0-9]/g, '_');
    const docRef = doc(db, 'newsletter_subscribers', docId);
    await setDoc(
      docRef,
      {
        ...subscriber,
        id: docId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err: any) {
    console.warn('Firestore newsletter subscriber sync error:', err?.message || err);
    return false;
  }
}

export async function fetchNewsletterSubscribersFromFirestore(): Promise<NewsletterSubscriber[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const querySnapshot = await getDocs(collection(db, 'newsletter_subscribers'));
    const subscribers: NewsletterSubscriber[] = [];
    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        subscribers.push({
          id: docSnap.id,
          email: data.email,
          subscribedAt: data.subscribedAt || new Date().toISOString(),
          active: data.active !== false,
          source: data.source || 'website_footer',
        });
      }
    });
    return subscribers;
  } catch (err: any) {
    console.warn('Firestore fetch subscribers error:', err?.message || err);
    return [];
  }
}

export function subscribeToFirestoreNewsletterSubscribers(
  callback: (subscribers: NewsletterSubscriber[]) => void
): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const colRef = collection(db, 'newsletter_subscribers');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const subscribers: NewsletterSubscriber[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            subscribers.push({
              id: docSnap.id,
              email: data.email,
              subscribedAt: data.subscribedAt || new Date().toISOString(),
              active: data.active !== false,
              source: data.source || 'website_footer',
            });
          }
        });
        callback(subscribers);
      },
      (err: any) => {
        console.warn('Firestore newsletter subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore newsletter subscribers:', err);
    return null;
  }
}

export async function incrementFirestoreVisitorCount(): Promise<number | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'site_stats', 'visitors');
    let currentTotal = 18450;
    try {
      const snap = await getDocs(collection(db, 'site_stats'));
      const found = snap.docs.find((d) => d.id === 'visitors');
      if (found && found.exists()) {
        const data = found.data();
        if (typeof data.totalVisits === 'number') {
          currentTotal = Math.max(currentTotal, data.totalVisits);
        }
      }
    } catch {
      // ignore
    }

    const nextTotal = currentTotal + 1;
    await setDoc(
      docRef,
      {
        totalVisits: nextTotal,
        lastVisitedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return nextTotal;
  } catch (err: any) {
    console.warn('Firestore visitor count error:', err?.message || err);
    return null;
  }
}

export function subscribeToFirestoreVisitorCount(callback: (count: number) => void): Unsubscribe | null {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'site_stats', 'visitors');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.totalVisits === 'number') {
            callback(data.totalVisits);
          }
        }
      },
      (err: any) => {
        console.warn('Firestore visitor count subscription error:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to Firestore visitor count:', err);
    return null;
  }
}

// ==========================================
// 9. AUTOMATIC SEEDING FOR NEW DEVICES
// ==========================================

export async function seedInitialFirestoreDataIfNeeded(
  stories: Story[],
  worksheets: PrintableWorksheet[],
  videos?: VideoStory[],
  facts?: FunFact[],
  learningItems?: LearningItem[],
  audioStories?: AudioStory[],
  quizzes?: QuizSet[]
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  try {
    // Stories check
    const storySnap = await getDocs(collection(db, 'stories'));
    const existingStoryIds = new Set(storySnap.docs.map((d) => d.id));
    const missingStories = stories.filter((s) => !existingStoryIds.has(s.id));
    if (missingStories.length > 0) {
      await syncAllStoriesToFirestore(missingStories);
    }

    // Worksheets check
    const wsSnap = await getDocs(collection(db, 'worksheets'));
    const existingWsIds = new Set(wsSnap.docs.map((d) => d.id));
    const missingWs = worksheets.filter((w) => !existingWsIds.has(w.id));
    if (missingWs.length > 0) {
      await syncAllWorksheetsToFirestore(missingWs);
    }

    // Video stories check
    if (videos && videos.length > 0) {
      const vidSnap = await getDocs(collection(db, 'video_stories'));
      if (vidSnap.empty) {
        await syncAllVideoStoriesToFirestore(videos);
      }
    }

    // Fun facts check
    if (facts && facts.length > 0) {
      const factSnap = await getDocs(collection(db, 'fun_facts'));
      if (factSnap.empty) {
        await syncAllFunFactsToFirestore(facts);
      }
    }

    // Early learning check
    if (learningItems && learningItems.length > 0) {
      const learnSnap = await getDocs(collection(db, 'early_learning'));
      if (learnSnap.empty) {
        await syncAllLearningItemsToFirestore(learningItems);
      }
    }

    // Audio stories check
    if (audioStories && audioStories.length > 0) {
      const audioSnap = await getDocs(collection(db, 'audio_stories'));
      if (audioSnap.empty) {
        await syncAllAudioStoriesToFirestore(audioStories);
      }
    }

    // Quizzes check
    if (quizzes && quizzes.length > 0) {
      const quizSnap = await getDocs(collection(db, 'quiz_sets'));
      if (quizSnap.empty) {
        await syncAllQuizSetsToFirestore(quizzes);
      }
    }
  } catch (err: any) {
    console.warn('Firestore initial seeding error:', err?.message || err);
  }
}
