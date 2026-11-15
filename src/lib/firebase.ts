import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const env = import.meta.env;
const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"],
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
  appId: env["VITE_FIREBASE_APP_ID"],
  measurementId: env["VITE_FIREBASE_MEASUREMENT_ID"],
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "your_api_key_here"
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Analytics only runs in browser environment
    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      });
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
}

export { app, db, auth, analytics };
