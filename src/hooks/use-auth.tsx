
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, signOut, confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { User as AppUser, getUserProfile, updateUserProfile } from '@/lib/data';

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
  refreshUserProfile: (data?: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    let profile = await getUserProfile(firebaseUser.uid);
    // If a user exists in Auth but not in Firestore, create a default profile.
    // This can happen for the seeded admin or if Firestore creation fails.
    if (!profile) {
        console.log(`Profile not found for UID ${firebaseUser.uid}, creating one.`);
        const newUserProfile: AppUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.email!.split('@')[0],
            role: 'Employee', // Default role
            mobile: '',
            avatar: `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
            status: 'Active'
        };
        // Special case for the seeded super admin
        if (firebaseUser.email === 'admin@formflow.com') {
            newUserProfile.role = 'Super Admin';
            newUserProfile.name = 'Super Admin';
        }
        await setDoc(doc(db, "users", firebaseUser.uid), newUserProfile);
        profile = await getUserProfile(firebaseUser.uid);
    }
    setUserProfile(profile);
  }, []);

  const refreshUserProfile = useCallback(async (dataToUpdate?: Partial<AppUser>) => {
    if (user) {
        if (dataToUpdate) {
            await updateUserProfile(user.uid, dataToUpdate);
        }
        // Re-fetch the profile to get the latest data
        await fetchProfile(user); 
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (firebaseUser) {
            setUser(firebaseUser);
            await fetchProfile(firebaseUser);
        } else {
            setUser(null);
            setUserProfile(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting user and profile state.
  };

  const logout = async () => {
    await signOut(auth);
    // State will be cleared by onAuthStateChanged
  };

  const sendPasswordReset = async (email: string) => {
    // This now correctly points to the invitation sender
    const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: false, // The user will be redirected back to the login page.
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };
  
  const completePasswordReset = async (code: string, newPassword: string) => {
    await confirmPasswordReset(auth, code, newPassword);
  }

  const createUser = async (userData: Omit<AppUser, 'id' | 'status'>, password_dont_use: string): Promise<AppUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password_dont_use);
    const authUid = userCredential.user.uid;

    const newUserDoc: AppUser = {
        id: authUid,
        ...userData,
        status: 'Active',
    };
    
    await setDoc(doc(db, "users", authUid), newUserDoc);
    
    return newUserDoc;
  }
  
  const sendInvitationToUser = async (email: string) => {
     const actionCodeSettings = {
        url: `${window.location.origin}/invite/set-password`,
        handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
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
    sendInvitation: sendInvitationToUser,
    refreshUserProfile,
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
