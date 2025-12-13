import { useEffect, useState } from "react";
import { ProfileProps } from "../type/profile";
import { fetchUserProfileById } from "../../../../api/userApi";
import { useAuth } from "../../../Auth/AuthContext";

export const useUserProfile = () => {
    const { userId } = useAuth();
    const [profile, setProfile] = useState<ProfileProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Guard clause: Don't fetch if no ID is provided
        if (!userId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        async function loadUserProfile() {
            setLoading(true);
            setError(null);
            
            try {
                // Simulate fetching user profile data
                const response = await fetchUserProfileById(userId as string);
                
                if (isMounted) {
                    setProfile(response);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error loading profile:", err);
                    setError(err instanceof Error ? err.message : "Failed to load profile");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUserProfile();

        // Cleanup function to prevent state updates if component unmounts
        return () => {
            isMounted = false;
        };
    }, [userId]); // Re-run effect if userId changes

    // Return the state so the component can use it
    return { profile, loading, error };
}