
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, getDocs, query, collection, limit, setDoc } from 'firebase/firestore';
import { User as AppUser, getUserProfile } from '@/lib/data';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completePasswordReset: (code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Seeding function moved here to ensure it runs reliably on startup
async function seedInitialData() {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(query(usersCollection, limit(1)));
    
    if (usersSnapshot.empty) {
        console.log("No users found. Seeding Super Admin...");
        try {
            const superAdminData = {
                name: 'Super Admin',
                email: 'admin@formflow.com',
                role: 'Super Admin' as const,
                mobile: '+1 1234567890',
                avatar: 'https://picsum.photos/seed/SuperAdmin/100/100',
            };
            const defaultPassword = '12345678';

            const userCredential = await createUserWithEmailAndPassword(auth, superAdminData.email, defaultPassword);
            const authUid = userCredential.user.uid;

            await setDoc(doc(db, "users", authUid), {
                ...superAdminData,
                status: 'Active',
            });

            console.log("Super Admin created successfully.");

        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log("Super admin user already exists in Auth.");
            } else {
                console.error("Error seeding Super Admin:", error);
            }
        }
    } else {
        // console.log("Users collection is not empty. Skipping seeding.");
    }
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
        // Run the seeding logic once when the app loads
        await seedInitialData();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                setUser(firebaseUser);
                const profile = await getUserProfile(firebaseUser.uid);
                setUserProfile(profile);
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    };
    
    initializeApp();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting user and profile state,
    // which will trigger a re-render with the correct profile info.
  };

  const logout = async () => {
    await signOut(auth);
    // State will be cleared by onAuthStateChanged
  };

  const sendPasswordReset = async (email: string) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/invite/set-password`,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const completePasswordReset = async (code: string, newPassword: string) => {
    await confirmPasswordReset(auth, code, newPassword);
  }

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    sendPasswordReset,
    completePasswordReset
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
