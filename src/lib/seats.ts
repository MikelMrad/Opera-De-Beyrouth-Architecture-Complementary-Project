import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  addDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Auditorium } from '@/types';

export async function getReservedSeats(auditorium: string): Promise<string[]> {
  const q = query(
    collection(db, 'seats'),
    where('auditorium', '==', auditorium),
    where('reserved', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().seatId as string);
}

export async function reserveSeats(
  seatIds: string[],
  auditorium: Auditorium,
  name: string,
  email: string
): Promise<void> {
  // Write reservation document
  await addDoc(collection(db, 'reservations'), {
    seatIds,
    auditorium,
    name,
    email,
    timestamp: serverTimestamp(),
  });

  // Update each seat document
  const updates = seatIds.map((seatId) =>
    setDoc(doc(db, 'seats', `${auditorium}_${seatId}`), {
      seatId,
      auditorium,
      reserved: true,
      reservedBy: email,
    })
  );
  await Promise.all(updates);
}

export function subscribeToSeats(
  auditorium: string,
  callback: (ids: string[], error?: Error) => void
): () => void {
  const q = query(
    collection(db, 'seats'),
    where('auditorium', '==', auditorium),
    where('reserved', '==', true)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const reservedIds = snapshot.docs.map((d) => d.data().seatId as string);
      callback(reservedIds);
    },
    (err) => {
      // Surface Firestore errors (permission denied, missing index, etc.)
      // so the caller can exit the loading state gracefully.
      console.error('[seats] onSnapshot error:', err);
      callback([], err);
    }
  );

  return unsubscribe;
}
