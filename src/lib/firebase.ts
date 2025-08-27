// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration.
// This configuration is created automatically by Firebase Studio.
const firebaseConfig = {
  apiKey: "AIzaSyCKI3JoGAwPuYP29OpOOT4o3XitEGkGU8Q",
  authDomain: "formflow-hfev3.firebaseapp.com",
  projectId: "formflow-hfev3",
  storageBucket: "formflow-hfev3.appspot.com",
  messagingSenderId: "880417003821",
  appId: "1:880417003821:web:5c99f571a663fa6cf01ba4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
