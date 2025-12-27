import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

interface AppState {
  user: User | null;
  error: string;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  error: "",
  isLoading: false,

  // Sign in
  signIn: async (email, password) => {
    set({isLoading: true, error: ""});
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

  // Sign up
  signUp: async (email, password, name) => { 
    set({ isLoading: true, error: "" });
    try {
      // A. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // B. Save User Details to Firestore
      // We auto-generate the ID here using the UID
      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        name: name, // 2. Save the name
        id: "Fish-" + user.uid.slice(0, 5).toUpperCase(), // 3. Auto-assign ID (e.g. FISH-A1B2C)
        createdAt: new Date().toISOString(),
      });

      set({ user, error: "", isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Sign out
  signOutUser: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: "" });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: "" });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false, error: "" });
      console.log("Password reset email sent.");
      return true; // Return true to let the UI know it succeeded
    } catch (err: any) {
      // Firebase throws specific errors for bad formatting or user not found
      let errorMessage = err.message;
      console.log(errorMessage);
      if (err.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      }
      set({ error: errorMessage, isLoading: false });
      return false; // Return false so UI stays open
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
