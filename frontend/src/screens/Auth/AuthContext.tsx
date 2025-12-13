import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";


import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";

interface AuthContextData {
  user: User | null;
  userId: string | undefined;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.uid,
        loading,
      }}
    >
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
