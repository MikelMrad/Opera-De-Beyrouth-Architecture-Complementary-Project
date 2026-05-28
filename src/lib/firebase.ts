// Replace with your Firebase project config from console.firebase.google.com
// Steps: Project Settings → General → Your Apps → Web App → SDK setup and configuration

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- Lazy initialisation ---
// firebase.ts is imported by seats.ts which is imported by client components
// that Next.js App Router still SSR-renders on the Node.js server.
// The Firebase web SDK is not designed for Node.js, so calling initializeApp /
// getFirestore at module level throws on that first SSR pass (causing the
// "fails on first render, works on reload" bug).
//
// Solution: never call Firebase at module load time.
// getDb() is only ever invoked from useEffect callbacks (browser-only).

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

export function getDb(): Firestore {
  if (_db) return _db;
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  _db = getFirestore(_app);
  return _db;
}
