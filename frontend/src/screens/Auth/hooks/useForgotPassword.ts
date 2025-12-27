import { useState } from "react";
import { useAppStore } from "../../../store/store"

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Store Hooks 
    const resetPassword = useAppStore((state) => state.resetPassword);
    const isLoading = useAppStore((state) => state.isLoading);
    const error = useAppStore((state) => state.error);

    const accountDoesNotExist = error === "No account found with this email.";

    // Handle reset password 
    const handleResetPassword = async (email: string) => {
        if (!email) return;

        // Reset previous states locally if needed 
        setIsSubmitted(false);

        // Call store action 
        const success = await resetPassword(email);

        // Only show success screen if Firebase didn't throw an error
        if (success) {
            setIsSubmitted(true);
        }
    }

    return {
        email,
        setEmail,
        isSubmitted,
        setIsSubmitted,
        handleResetPassword, 
        error, 
        isLoading,
        accountDoesNotExist
    }
}