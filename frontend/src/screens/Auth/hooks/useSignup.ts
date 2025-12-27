import { useState } from "react";
import { useAppStore } from "../../../store/store";
import { Alert } from "react-native";

export const useSignup = () => {
    // Hooks 
    const signUp = useAppStore((state) => state.signUp);
    const isLoading = useAppStore((state) => state.isLoading);
    const error = useAppStore((state) => state.error);

    // Local state 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Handlers
    const handleSignup = () => {
        // Validation: Ensure no fields are empty
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Missing Information", "Please fill in your Name, Email, and Password.");
            return;
        }

        // Basic password length check 
        if (password.length < 6) {
            Alert.alert("Weak Password", "Password must be at least 6 characters long.");
            return;
        }

        try {
            signUp(email, password, name);
        } catch (error: any) {
            console.log(error);
            Alert.alert("Error", error.message);
        }
    };

    return {
        name, 
        setName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        handleSignup,
        error,
        isLoading
    }
}