import { openDB } from 'idb';
import { stringify, parse } from 'flatted';

const dbPromise = openDB('facilitiesDb', 1, {
  upgrade(db) {
    db.createObjectStore('facilities');
    db.createObjectStore('metadata');
  },
});

export const setItem = async (storeName: any, key: any, value: any) => {
  const db = await dbPromise;
  const serializedValue = value !== undefined ? stringify(value) : null;
  return db.put(storeName, serializedValue, key);
};

export const getItem = async (storeName: any, key: any) => {
  const db = await dbPromise;
  const value = await db.get(storeName, key);
  return value ? parse(value) : null;
};
