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

// Load environment variables
const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} = process.env;

// Firebase config
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
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
