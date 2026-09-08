/**
 * Firestore + Storage access for Spoken programme completion certificates.
 *
 * Collection `certificates` — one doc per issued certificate, doc ID doubles
 * as the certificate ID embedded in the QR code (`/verify/{id}`). The QR
 * carries no student data, only that ID, so verification is always a live
 * read of whatever this doc currently holds.
 */

import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export const CERTIFICATES = 'certificates';

export const watchCertificates = (onData, onError) =>
  onSnapshot(
    collection(db, CERTIFICATES),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error('Failed to read certificates:', err);
      if (onError) onError(err);
    },
  );

export const createCertificate = (data) =>
  addDoc(collection(db, CERTIFICATES), { ...data, issuedAt: serverTimestamp() });

export const updateCertificate = (id, data) => updateDoc(doc(db, CERTIFICATES, id), data);

export const deleteCertificate = (id) => deleteDoc(doc(db, CERTIFICATES, id));

/** Single lookup by ID — used by the public verify page, no auth required. */
export const getCertificate = async (id) => {
  const snap = await getDoc(doc(db, CERTIFICATES, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/** Uploads the student photo to Storage and returns the fields to save on the doc. */
export const uploadCertificatePhoto = async (file, certId) => {
  const storagePath = `certificates/${certId}/photo-${Date.now()}-${file.name}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return { photoUrl: await getDownloadURL(fileRef), photoStoragePath: storagePath };
};

/** Best-effort cleanup of a replaced/deleted photo — must not block the write that matters. */
export const deleteCertificatePhoto = async (storagePath) => {
  if (!storagePath) return;
  try {
    await deleteObject(ref(storage, storagePath));
  } catch (err) {
    console.warn('Could not remove stored photo:', err);
  }
};
