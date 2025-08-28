// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration.
// This configuration is created automatically by Firebase Studio.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "formflow-hfev3.firebaseapp.com",
  projectId: "formflow-hfev3",
  storageBucket: "formflow-hfev3.appspot.com",
  messagingSenderId: "880417003821",
  appId: "1:880417003821:web:5c99f571a663fa6cf01ba4",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);