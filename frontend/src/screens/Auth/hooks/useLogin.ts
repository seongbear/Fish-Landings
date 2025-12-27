import { useState } from "react";
import { useAppStore } from "../../../store/store";
import { Alert } from "react-native";

export const useLogin = () => {
    // Hooks 
    const signIn = useAppStore((state) => state.signIn);

    // Local state 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    
    // Handlers
    const handleSignIn = async (email: string, password: string) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password.');
            return;
        }
        try {
            await signIn(email, password);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return {
        email, 
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        handleSignIn,
    }
};