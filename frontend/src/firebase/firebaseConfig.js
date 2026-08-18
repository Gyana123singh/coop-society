import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Production Configuration for Coop 365 Resident Portal (coop365-d6cbf)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBu8pJwUhRPB35a2X7vB1wtcAV4Et9-t68",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "coop365-d6cbf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "coop365-d6cbf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "coop365-d6cbf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029254087537",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029254087537:web:74f716a5547487913f6cd0"
};

// Initialize Firebase App & Auth synchronously
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

console.log('[Firebase Auth SDK] Initialized live phone OTP service for coop365-d6cbf');

export { auth, firebaseConfig };
export default app;
