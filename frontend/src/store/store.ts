import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

interface AppState {
  user: User | null;
  error: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  error: "",

  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      set({ user, error: "" });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  signUp: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      set({ user, error: "" });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: "" });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));

// Listen to auth state changes globally
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email: user.email,
        createdAt: new Date().toISOString(),
        id: "Fish-" + user.uid,
      });
    }
    useAppStore.setState({ user });
  } else {
    useAppStore.setState({ user: null });
  }
});
