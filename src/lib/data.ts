

import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, orderBy, limit, writeBatch, where, documentId, setDoc, getCountFromServer, deleteDoc } from "firebase/firestore";
import type { Question } from "@/components/forms/form-builder";
import { db, auth } from "./firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";


export type Form = {
  id: string;
  name: string;
  description: string;
  questions: number;
  responses: number;
  createdAt: string;
  status: 'Active' | 'Inactive';
  questionsData?: Question[];
};

export type User = {
  id: string; // This will be the Firebase Auth UID
  name: string;
  email: string;
  mobile: string;
  role: 'Employee' | 'Admin' | 'Super Admin';
  avatar: string;
  status: 'Pending' | 'Active';
};

export type FormResponse = {
    id: string;
    formId: string;
    submittedAt: string;
    answers: { [key: string]: any };
}

// Firestore collections
const formsCollection = collection(db, "forms");
const usersCollection = collection(db, "users");
const responsesCollection = collection(db, "responses");

// Seeding function to ensure a super admin exists
async function seedInitialData() {
    const snapshot = await getCountFromServer(usersCollection);
    if (snapshot.data().count === 0) {
        console.log("No users found. Seeding Super Admin...");
        try {
            const superAdminData = {
                name: 'Super Admin',
                email: 'admin@formflow.com',
                role: 'Super Admin' as const,
                mobile: '+1 1234567890',
                avatar: `https://picsum.photos/seed/SuperAdmin/100/100`,
                status: 'Active' as const,
            };
            const defaultPassword = '12345678';
            
            let authUid: string | null = null;
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, superAdminData.email, defaultPassword);
                authUid = userCredential.user.uid;
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    console.log("Super admin user already exists in Firebase Auth. Will check Firestore.");
                    // In a real app, you would need a way to get the uid for the existing email.
                    // For this app's purpose, we'll assume a manual setup or a different flow if this happens.
                } else {
                    throw error;
                }
            }

            if (authUid) {
                const userDocRef = doc(db, "users", authUid);
                const userDoc = await getDoc(userDocRef);
                if (!userDoc.exists()) {
                    await setDoc(userDocRef, superAdminData);
                    console.log("Super Admin created successfully in Firestore.");
                } else {
                    console.log("Super Admin document already exists in Firestore.");
                }
            }

        } catch (error) {
            console.error("Error seeding Super Admin:", error);
        }
    }
}

// Run seed function on first import
seedInitialData();


// Form functions
export async function createForm(formData: Omit<Form, 'id'>) {
    const docRef = await addDoc(formsCollection, {
        ...formData,
        createdAt: new Date().toISOString(),
    });
    return docRef.id;
}

export async function getForms(): Promise<Form[]> {
    const snapshot = await getDocs(query(formsCollection, orderBy("createdAt", "desc")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));
}

export async function getRecentForms(count: number): Promise<Form[]> {
    const snapshot = await getDocs(query(formsCollection, orderBy("createdAt", "desc"), limit(count)));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));
}

export async function getForm(id: string): Promise<Form | null> {
    const docRef = doc(db, "forms", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Form;
    }
    return null;
}

export async function updateForm(id: string, formData: Partial<Omit<Form, 'id'>>) {
    const docRef = doc(db, "forms", id);
    await updateDoc(docRef, formData);
}


// User functions
export async function getUserProfile(uid: string): Promise<User | null> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data } as User;
    }
    return null;
}

export async function updateUserProfile(uid: string, data: Partial<User>) {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
}

export async function getUsers(): Promise<User[]> {
    const snapshot = await getDocs(query(usersCollection, orderBy("name")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

// This function is defined and called from useAuth now.
// Leaving it here for reference but it's not the primary entry point.
export async function sendInvitation(email: string) {
    const actionCodeSettings = {
        url: `${window.location.origin}/invite/set-password?email=${email}`,
        handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log(`Password reset/invitation email sent to ${email}.`);
}


// Response functions
export async function getResponses(formId: string): Promise<FormResponse[]> {
    const q = query(responsesCollection, where("formId", "==", formId));
    const snapshot = await getDocs(q);
    const responses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormResponse));
    return responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function createResponse(formId: string, answers: { [key: string]: any }) {
    const responseData = {
        formId,
        answers,
        submittedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(responsesCollection, responseData);
    
    const form = await getForm(formId);
    if (form) {
        await updateForm(formId, { responses: form.responses + 1 });
    }

    return docRef.id;
}


// More user functions
export async function updateUser(uid: string, data: Partial<User>) {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
}

export async function deleteUser(uid: string) {
    // This is a simplified deletion. In a real app, you'd want a Cloud Function
    // to delete the user from Firebase Auth and clean up their associated data.
    const docRef = doc(db, "users", uid);
    await deleteDoc(docRef);
}
