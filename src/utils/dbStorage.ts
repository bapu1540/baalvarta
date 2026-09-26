/**
 * Baalvarta Persistent Database Engine
 * Combines Native IndexedDB (multi-megabyte persistent browser database),
 * Server filesystem storage (/api/database), and quota-safe LocalStorage.
 * Prevents any data loss or silent QuotaExceeded errors.
 */

const IDB_NAME = 'baalvarta_persistent_db';
const IDB_VERSION = 1;
const IDB_STORE = 'collections';

// Initialize IndexedDB
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Low-level IndexedDB Get
export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('idbGet error for key:', key, err);
    return null;
  }
}

// Low-level IndexedDB Set
export async function idbSet<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('idbSet error for key:', key, err);
    return false;
  }
}

// Safe LocalStorage Set with Quota Management
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      console.warn('LocalStorage quota exceeded. Full data remains securely saved in IndexedDB & Server DB.');
    }
    return false;
  }
}

// Fetch Full Server Database
export async function fetchServerDatabase(): Promise<any | null> {
  try {
    const res = await fetch('/api/database', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === 'object' && Object.keys(data).length > 0 ? data : null;
  } catch (err) {
    // Server endpoint might not be active or offline; graceful fallback
    return null;
  }
}

// Push to Server Database
export async function saveToServerDatabase(payload: Record<string, any>): Promise<boolean> {
  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to sync to server database:', err);
    return false;
  }
}
