import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Production Configuration for Coop 365 Resident Portal (coop-society)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAahXxpae6PTKlhiUUIM74Ssb3fp0jry8M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "coop-society.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "coop-society",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "coop-society.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1089000820637",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1089000820637:web:7041f02d84924e4bafa974"
};

// Initialize Firebase App & Auth synchronously
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

console.log('[Firebase Auth SDK] Initialized live phone OTP service for coop-society');

export { auth, firebaseConfig };
export default app;
