import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBGGc-uF2j1oPDRX78EjFQT44wc9TJhcU",
  authDomain: "road-vehicle-safety.firebaseapp.com",
  projectId: "road-vehicle-safety",
  storageBucket: "road-vehicle-safety.firebasestorage.app",
  messagingSenderId: "973855185047",
  appId: "1:973855185047:web:e56bf3a019a5deed16b1d2",
  measurementId: "G-0BQBGC5B60"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function getFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, googleProvider: null };
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!auth) {
    auth = getAuth(app);
  }

  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }

  return { app, auth, googleProvider };
}

export { signInWithPopup, signInWithRedirect, getRedirectResult };
