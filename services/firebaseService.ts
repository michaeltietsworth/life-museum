import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../constants';
import { JournalEntry, Category, Comment } from '../types';

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth Helpers
export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  return firebaseSignOut(auth);
};

// Data Helpers
// Now scoped to userId
export const subscribeToEntries = (userId: string, callback: (entries: JournalEntry[]) => void) => {
  if (!userId) return () => {};
  
  const userEntriesRef = collection(db, 'users', userId, 'entries');
  const q = query(userEntriesRef, orderBy('date', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JournalEntry[];
    callback(entries);
  });
};

export const addEntry = async (userId: string, text: string, date: string, category: Category, imageUrl?: string, isAiPrompted: boolean = false) => {
  if (!userId) throw new Error("User ID required");
  
  try {
    await addDoc(collection(db, 'users', userId, 'entries'), {
      text,
      date,
      category,
      imageUrl: imageUrl || null,
      timestamp: serverTimestamp(),
      comments: [],
      isAiPrompted
    });
  } catch (error) {
    console.error("Error adding entry: ", error);
    throw error;
  }
};

export const deleteEntry = async (userId: string, entryId: string) => {
  if (!userId || !entryId) return;
  await deleteDoc(doc(db, 'users', userId, 'entries', entryId));
};

export const addComment = async (userId: string, entryId: string, author: string, relation: string, text: string) => {
  if (!userId || !entryId) return;
  
  const comment: Comment = {
    id: crypto.randomUUID(),
    author,
    relation,
    text,
    timestamp: Date.now()
  };

  const entryRef = doc(db, 'users', userId, 'entries', entryId);
  await updateDoc(entryRef, {
    comments: arrayUnion(comment)
  });
};