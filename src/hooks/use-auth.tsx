
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, getDocs, query, collection, limit, setDoc } from 'firebase/firestore';
import { User as AppUser, getUserProfile, sendInvitation as sendUserInvitation } from '@/lib/data';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completePasswordReset: (code: string, newPassword: string) => Promise<void>;
  createUser: (userData: Omit<AppUser, 'id' | 'status'>, password_dont_use: string) => Promise<AppUser>;
  sendInvitation: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting user and profile state.
  };

  const logout = async () => {
    await signOut(auth);
    // State will be cleared by onAuthStateChanged
  };

  const sendPasswordReset = async (email: string) => {
    await sendUserInvitation(email);
  };
  
  const completePasswordReset = async (code: string, newPassword: string) => {
    await confirmPasswordReset(auth, code, newPassword);
  }

  const createUser = async (userData: Omit<AppUser, 'id' | 'status'>, password_dont_use: string): Promise<AppUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password_dont_use);
    const authUid = userCredential.user.uid;

    const newUser: Omit<AppUser, 'id'> = {
        ...userData,
        status: 'Pending',
    };
    
    await setDoc(doc(db, "users", authUid), newUser);
    return { ...newUser, id: authUid };
  }
  
  const sendInvitation = async (email: string) => {
    await sendUserInvitation(email);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    sendPasswordReset,
    completePasswordReset,
    createUser,
    sendInvitation
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
