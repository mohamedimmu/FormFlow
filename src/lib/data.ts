import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  writeBatch,
  where,
  documentId,
  setDoc,
  getCountFromServer,
  deleteDoc,
} from "firebase/firestore";
import type { Question } from "@/components/forms/form-builder";
import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";

export type Form = {
  id: string;
  name: string;
  description: string;
  questions: number;
  responses: number;
  createdAt: string;
  status: "Active" | "Inactive";
  questionsData?: Question[];
};

export type User = {
  id: string; // This will be the Firebase Auth UID
  name: string;
  email: string;
  mobile: string;
  role: "Employee" | "Admin" | "Super Admin";
  avatar: string;
  status: "Pending" | "Active";
};

export type FormResponse = {
  id: string;
  formId: string;
  submittedAt: string;
  answers: { [key: string]: any };
};

// Firestore collections
const formsCollection = collection(db, "forms");
const usersCollection = collection(db, "users");
const responsesCollection = collection(db, "responses");

// Seeding function to ensure a super admin exists
async function seedInitialData() {
  const userDocRef = doc(db, "users", "1BpFOSps9makqKG1nhone9SjQzR2");
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    console.log("No users found. Seeding Super Admin...");
    try {
      const superAdminData = {
        name: "Super Admin",
        email: "admin@formflow.com",
        role: "Super Admin" as const,
        mobile: "+1 1234567890",
        avatar: `https://picsum.photos/seed/SuperAdmin/100/100`,
        status: "Active" as const,
      };

      await setDoc(userDocRef, superAdminData);
      console.log("Super Admin created successfully in Firestore.");
    } catch (error) {
      console.error("Error seeding Super Admin:", error);
    }
  }
}

// Run seed function on first import
seedInitialData();

// Form functions
export async function createForm(formData: Omit<Form, "id">) {
  const docRef = await addDoc(formsCollection, {
    ...formData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getForms(): Promise<Form[]> {
  const snapshot = await getDocs(
    query(formsCollection, orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Form));
}

export async function getRecentForms(count: number): Promise<Form[]> {
  const snapshot = await getDocs(
    query(formsCollection, orderBy("createdAt", "desc"), limit(count))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Form));
}

export async function getForm(id: string): Promise<Form | null> {
  const docRef = doc(db, "forms", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Form;
  }
  return null;
}

export async function updateForm(
  id: string,
  formData: Partial<Omit<Form, "id">>
) {
  const docRef = doc(db, "forms", id);
  await updateDoc(docRef, formData);
}

export async function deleteForm(id: string) {
  // Note: This deletes the form document. In a real-world application,
  // you would also want to delete all associated responses, which would
  // ideally be handled by a Firebase Cloud Function for atomicity.
  const docRef = doc(db, "forms", id);
  await deleteDoc(docRef);
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
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
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
  const responses = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as FormResponse)
  );
  return responses.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function createResponse(
  formId: string,
  answers: { [key: string]: any }
) {
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
  // IMPORTANT: This function only deletes the user's document from Firestore.
  // It does NOT delete the user from Firebase Authentication. Deleting a user
  // from Firebase Auth requires elevated, admin privileges and cannot be done
  // securely from the client-side.
  //
  // The recommended approach is to use a Firebase Cloud Function that is
  // triggered when a user's document is deleted from Firestore. This function
  // would then use the Firebase Admin SDK to safely delete the corresponding
  // user from Firebase Authentication.
  const docRef = doc(db, "users", uid);
  await deleteDoc(docRef);
}
