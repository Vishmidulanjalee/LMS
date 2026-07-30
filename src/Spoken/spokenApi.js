/**
 * Firestore + Storage access for the Spoken programme.
 *
 * Three collections, one per section of the dashboard:
 *   spokenRecordings   { title, date, duration, folder, videoUrl, visible }
 *   spokenAssessments  { title, type: 'quiz' | 'assignment', link, expiresAt, visible }
 *   spokenDocuments    { title, uploadedAt, fileName, fileUrl, storagePath, visible }
 *
 * Reads use onSnapshot, so anything an admin publishes shows up on a student's
 * dashboard without either side reloading.
 */

import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export const SPOKEN = {
  recordings: 'spokenRecordings',
  assessments: 'spokenAssessments',
  documents: 'spokenDocuments',
};

/**
 * Live subscription to one collection.
 *
 * Ordering is done on the client rather than with orderBy() so that documents
 * written before a given field existed still come back — a server-side orderBy
 * silently drops any doc missing that field.
 */
export const watchSpoken = (name, onData, onError) =>
  onSnapshot(
    collection(db, name),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error(`Failed to read ${name}:`, err);
      if (onError) onError(err);
    },
  );

export const createSpoken = (name, data) =>
  addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });

export const updateSpoken = (name, id, data) => updateDoc(doc(db, name, id), data);

export const deleteSpoken = (name, id) => deleteDoc(doc(db, name, id));

/** Uploads a document to Storage and returns the fields to save on the doc. */
export const uploadSpokenFile = async (file) => {
  const storagePath = `spokenDocuments/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return { fileName: file.name, fileUrl: await getDownloadURL(fileRef), storagePath };
};

/**
 * Best-effort cleanup of a replaced/deleted upload. A failure here (missing
 * object, permissions) must not block the Firestore write that matters.
 */
export const deleteSpokenFile = async (storagePath) => {
  if (!storagePath) return;
  try {
    await deleteObject(ref(storage, storagePath));
  } catch (err) {
    console.warn('Could not remove stored file:', err);
  }
};

/** Newest-first by the given date field, falling back to the write timestamp. */
export const sortByDate = (items, field) =>
  [...items].sort((a, b) => {
    const av = a[field] ? new Date(a[field]).getTime() : (a.createdAt?.seconds ?? 0) * 1000;
    const bv = b[field] ? new Date(b[field]).getTime() : (b.createdAt?.seconds ?? 0) * 1000;
    return bv - av;
  });
