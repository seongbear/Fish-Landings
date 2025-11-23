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

interface AppState {
  user: User | null;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => {
  // Automatically track user session
  onAuthStateChanged(auth, (user) => {
    if (user) {
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
        set({ user: userCredential.user, error: '' });
      } catch (error: any) {
        set({ error: error.message });
      }
    },
    signUp: async (email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        set({ user: userCredential.user, error: '' });
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
