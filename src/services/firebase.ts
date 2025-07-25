/**
 * Firebase Configuration
 * Initialize and configure Firebase services for the application
 */

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Note: These values are loaded from environment variables in .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD6XhmlF3NULMW3pVOGfZvTmc76XihfpDQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ryukingdom-48b31.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ryukingdom-48b31",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ryukingdom-48b31.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "360816489083",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:360816489083:web:110eaa83a78425d66a68de",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4W1F9R4H0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
