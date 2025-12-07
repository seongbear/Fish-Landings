import { create } from 'zustand';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAKdxpk-jylKNZSwHwY3BAoCuubR9YakLM",
  authDomain: "fish-d70e4.firebaseapp.com",
  projectId: "fish-d70e4",
  storageBucket: "fish-d70e4.firebasestorage.app",
  messagingSenderId: "366103675038",
  appId: "1:366103675038:web:2e57777355584b9104bb8f",
  measurementId: "G-R9VBNL8BND"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

interface AppState {
  user: User | null;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => {
  // Track auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user data from Firestore
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        // If new user, create doc
        await setDoc(docRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }
      set({ user });
    } else {
      set({ user: null });
    }
  });

  return {
    user: null,
    error: '',
    signIn: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ensure user document exists in Firestore
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            email: user.email,
            createdAt: new Date().toISOString(),
          });
        }

        set({ user, error: '' });
      } catch (error: any) {
        set({ error: error.message });
      }
    },
    signUp: async (email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        set({ user, error: '' });
      } catch (error: any) {
        set({ error: error.message });
      }
    },
    signOutUser: async () => {
      try {
        await signOut(auth);
        set({ user: null, error: '' });
      } catch (error: any) {
        set({ error: error.message });
      }
    }
  };
});
