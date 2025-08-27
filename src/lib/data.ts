import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, orderBy, limit, writeBatch, where } from "firebase/firestore";
import type { Question } from "@/components/forms/form-builder";
import { db } from "./firebase";

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
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'Employee' | 'Admin' | 'Super Admin';
  avatar: string;
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

// Seeding function for initial data
export async function seedInitialData() {
    const usersSnapshot = await getDocs(query(usersCollection, limit(1)));
    if (usersSnapshot.empty) {
        console.log("No users found. Seeding default super admin...");
        await createUser({
            name: 'Super Admin',
            email: 'admin@formflow.com',
            mobile: '+1 123-456-7890',
            role: 'Super Admin',
            avatar: 'https://picsum.photos/seed/admin/100/100'
        });
        console.log("Default super admin created.");
    }
}

// Call seeding function on startup
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
export async function createUser(userData: Omit<User, 'id'>) {
    const docRef = await addDoc(usersCollection, userData);
    return docRef.id;
}

export async function getUsers(): Promise<User[]> {
    const snapshot = await getDocs(query(usersCollection, orderBy("name")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

// Response functions
export async function getResponses(formId: string): Promise<FormResponse[]> {
    const q = query(responsesCollection, where("formId", "==", formId));
    const snapshot = await getDocs(q);
    const responses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormResponse));
    // Sort by date client-side to avoid composite index
    return responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function createResponse(formId: string, answers: { [key: string]: any }) {
    const responseData = {
        formId,
        answers,
        submittedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(responsesCollection, responseData);
    
    // Also increment the response count on the form
    const form = await getForm(formId);
    if (form) {
        await updateForm(formId, { responses: form.responses + 1 });
    }

    return docRef.id;
}
