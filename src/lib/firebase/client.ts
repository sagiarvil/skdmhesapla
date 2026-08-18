import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * carbon-web-1265b WEB app (firebase apps:sdkconfig).
 * NEXT_PUBLIC_* ile override edilebilir; static export için varsayılan gömülü.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCUQ0jDeUQPAr3xfSk-aOO4OqcrNwM3mD0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "carbon-web-1265b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carbon-web-1265b",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "carbon-web-1265b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "7943100684",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:7943100684:web:c4f70343f4af130852d129",
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

/** Anonim oturum — G-22 istemci yazımı için zorunlu. */
export async function ensureAnonymousUser(): Promise<User> {
  const a = getFirebaseAuth();
  if (a.currentUser?.uid) return a.currentUser;
  const cred = await signInAnonymously(a);
  return cred.user;
}

/** Güncel ID token — sunucu otoriteli API çağrıları için Bearer. */
export async function ensureAnonymousUserToken(): Promise<string> {
  const user = await ensureAnonymousUser();
  return user.getIdToken();
}
