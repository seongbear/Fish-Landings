import { useCallback, useState } from "react";
import { ProfileProps } from "../type/profile";
import { editProfileInFirestore, fetchUserProfileById } from "../../../../api/userApi";
import { useAuth } from "../../../Auth/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export const useUserProfile = () => {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inside useUserProfile
  const loadUserProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
     }

    setLoading(true); 

    try {
      const response = await fetchUserProfileById(userId);
      setProfile(response);
      setError(null);
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [loadUserProfile])
  );
    
  return { profile, loading, error, refetch: loadUserProfile };
};

export const useEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editProfile = async (name?: string, imageUrl?: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await editProfileInFirestore(name, imageUrl);

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    editProfile,
    loading,
    success,
    error,
  };
};