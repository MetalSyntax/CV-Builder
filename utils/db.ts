import { ResumeData } from '../types';
import { INITIAL_DATA } from '../constants';

export interface ResumeRecord {
  id: string;
  name: string;
  updatedAt: number;
  data: ResumeData;
}

const DB_NAME = 'cv-builder-db';
const STORE_NAME = 'resumes';

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-updated', 'updatedAt');
      }
    };
  });
};

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getAllResumes = async (): Promise<ResumeRecord[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('by-updated');
    const request = index.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const saveResume = async (resume: ResumeRecord): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      ...resume,
      updatedAt: Date.now(),
    });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteResume = async (id: string): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const createNewResume = async (name: string): Promise<ResumeRecord> => {
  const newResume: ResumeRecord = {
    id: crypto.randomUUID(),
    name,
    updatedAt: Date.now(),
    data: JSON.parse(JSON.stringify(INITIAL_DATA)),
  };
  await saveResume(newResume);
  return newResume;
};
