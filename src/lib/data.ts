
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, orderBy, limit, writeBatch, where, documentId, setDoc, getCountFromServer } from "firebase/firestore";
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
            };
            const defaultPassword = '12345678';
            
            // This will fail if the user already exists in Auth, which is fine.
            const userCredential = await createUserWithEmailAndPassword(auth, superAdminData.email, defaultPassword)
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log("Super admin user already exists in Firebase Auth.");
                        return null;
                    }
                    throw error;
                });
            
            if (userCredential) {
                const authUid = userCredential.user.uid;
                await setDoc(doc(db, "users", authUid), {
                    ...superAdminData,
                    status: 'Active',
                });
                console.log("Super Admin created successfully in Firestore.");
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
export async function createUser(userData: Omit<User, 'id' | 'status'>, password_dont_use: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password_dont_use);
    const authUid = userCredential.user.uid;

    const newUser: Omit<User, 'id'> = {
        ...userData,
        status: 'Pending',
    };
    
    await setDoc(doc(usersCollection, authUid), newUser);
    return { ...newUser, id: authUid };
}

export async function getUserProfile(uid: string): Promise<User | null> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data } as User;
    }
    return null;
}

export async function getUsers(): Promise<User[]> {
    const snapshot = await getDocs(query(usersCollection, orderBy("name")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function sendInvitation(email: string) {
    const actionCodeSettings = {
        url: `${window.location.origin}/invite/set-password`,
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
