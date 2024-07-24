import { openDB } from 'idb';
import { stringify, parse } from 'flatted';

let dbPromise: Promise<any> | null = null;

// Check if `indexedDB` is available
const isBrowser = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

if (isBrowser) {
  dbPromise = openDB('facilitiesDb', 1, {
    upgrade(db) {
      db.createObjectStore('facilities');
      db.createObjectStore('metadata');
    },
  });
}

export const setItem = async (storeName: any, key: any, value: any) => {
  if (!isBrowser) {
    console.warn('IndexedDB is not available.');
    return;
  }
  
  if (!dbPromise) {
    throw new Error('IndexedDB is not initialized.');
  }
  
  const db = await dbPromise;
  const serializedValue = value !== undefined ? stringify(value) : null;
  return db.put(storeName, serializedValue, key);
};

export const getItem = async (storeName: any, key: any) => {
  if (!isBrowser) {
    console.warn('IndexedDB is not available.');
    return null;
  }
  
  if (!dbPromise) {
    throw new Error('IndexedDB is not initialized.');
  }
  
  const db = await dbPromise;
  const value = await db.get(storeName, key);
  return value ? parse(value) : null;
};
