"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth, getFirestoreDb } from "./client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  companyName?: string;
  vkn?: string;
  createdAt?: string;
};

export type SealedHistoryItem = {
  packageId: string;
  sectorSlug: string;
  sectorName: string;
  zipFilename: string;
  masterHash: string;
  importerCostEur: number;
  sealedAt: string;
  quarter: string;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  history: SealedHistoryItem[];
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    companyName?: string,
    vkn?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveSealedToHistory: (item: SealedHistoryItem) => Promise<void>;
  updateCompanyDetails: (companyName: string, vkn: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<SealedHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Yerel depodan mühürlü dosya geçmişini yükle
  const loadLocalHistory = (uid: string) => {
    try {
      const saved = localStorage.getItem(`skdm_history_${uid}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        const generic = localStorage.getItem("skdm_sealed_history");
        if (generic) {
          setHistory(JSON.parse(generic));
        }
      }
    } catch {
      // Hata durumunda yutulur
    }
  };

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser && !currentUser.isAnonymous) {
          try {
            const db = getFirestoreDb();
            const ref = doc(db, "users", currentUser.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              setProfile(snap.data() as UserProfile);
            } else {
              const localProf = localStorage.getItem(`skdm_prof_${currentUser.uid}`);
              if (localProf) {
                setProfile(JSON.parse(localProf));
              } else {
                setProfile({
                  uid: currentUser.uid,
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                });
              }
            }
          } catch {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
            });
          }
          loadLocalHistory(currentUser.uid);
        } else {
          setProfile(null);
          try {
            const generic = localStorage.getItem("skdm_sealed_history");
            if (generic) setHistory(JSON.parse(generic));
          } catch {
            setHistory([]);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      const prof: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        createdAt: new Date().toISOString(),
      };
      setProfile(prof);
      try {
        const db = getFirestoreDb();
        await setDoc(doc(db, "users", cred.user.uid), prof, { merge: true });
      } catch {
        localStorage.setItem(`skdm_prof_${cred.user.uid}`, JSON.stringify(prof));
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    companyName?: string,
    vkn?: string
  ) => {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName });
      const prof: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName,
        companyName,
        vkn,
        createdAt: new Date().toISOString(),
      };
      setProfile(prof);
      try {
        const db = getFirestoreDb();
        await setDoc(doc(db, "users", cred.user.uid), prof, { merge: true });
      } catch {
        localStorage.setItem(`skdm_prof_${cred.user.uid}`, JSON.stringify(prof));
      }
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const saveSealedToHistory = async (item: SealedHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((x) => x.packageId !== item.packageId)];
      try {
        if (user?.uid) {
          localStorage.setItem(`skdm_history_${user.uid}`, JSON.stringify(updated));
        }
        localStorage.setItem("skdm_sealed_history", JSON.stringify(updated));
      } catch {
        // yut
      }
      return updated;
    });

    if (user?.uid) {
      try {
        const db = getFirestoreDb();
        await setDoc(
          doc(db, "users", user.uid, "packages", item.packageId),
          item,
          { merge: true }
        );
      } catch {
        // Firestore offline yutulur
      }
    }
  };

  const updateCompanyDetails = async (companyName: string, vkn: string) => {
    if (!user?.uid) return;
    const updated = { ...profile, companyName, vkn } as UserProfile;
    setProfile(updated);
    try {
      const db = getFirestoreDb();
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });
    } catch {
      localStorage.setItem(`skdm_prof_${user.uid}`, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        history,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        saveSealedToHistory,
        updateCompanyDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
