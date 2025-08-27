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
    const formsSnapshot = await getDocs(query(formsCollection, limit(1)));
    if (formsSnapshot.empty) {
        const batch = writeBatch(db);
        const usersToSeed: Omit<User, 'id'>[] = [
            { name: 'Alice Johnson', email: 'alice.j@example.com', mobile: '123-456-7890', role: 'Admin', avatar: '/avatars/01.png' },
            { name: 'Bob Williams', email: 'bob.w@example.com', mobile: '234-567-8901', role: 'Employee', avatar: '/avatars/02.png' },
            { name: 'Charlie Brown', email: 'charlie.b@example.com', mobile: '345-678-9012', role: 'Employee', avatar: '/avatars/03.png' },
            { name: 'Diana Prince', email: 'diana.p@example.com', mobile: '456-789-0123', role: 'Super Admin', avatar: '/avatars/04.png' },
            { name: 'Ethan Hunt', email: 'ethan.h@example.com', mobile: '567-890-1234', role: 'Admin', avatar: '/avatars/05.png' },
        ];
        usersToSeed.forEach(user => {
            const docRef = doc(usersCollection);
            batch.set(docRef, user);
        });
        await batch.commit();
        console.log("Seeded users data.");
    }
}

// Call seeding function - this might be better placed in a startup script
// seedInitialData();


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
export async function getUsers(): Promise<User[]> {
    const snapshot = await getDocs(query(usersCollection, orderBy("name")));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

// Response functions
export async function getResponses(formId: string): Promise<FormResponse[]> {
    const q = query(responsesCollection, where("formId", "==", formId), orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormResponse));
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
