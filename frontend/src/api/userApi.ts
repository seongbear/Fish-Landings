import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { AchievementProps, EditProfileProps, ProfileProps } from "../screens/(tabs)/profile/type/profile";


export const fetchUserProfileById = async (
  userId: string
): Promise<ProfileProps | null> => {
  try {
    // Get user profile
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    const userData = userSnap.data();

    // Get achievements (SINGLE document)
    const achievementRef = doc(
      firestore,
      "users",
      userId,
      "achievements",
      "progress"
    );
    const achievementSnap = await getDoc(achievementRef);

    const achievements = achievementSnap.exists()
      ? (achievementSnap.data() as AchievementProps)
      : {
          milestone_100kg: false,
          big_game_hunter: false,
          community_helper: false,
          first_catch: false,
          master_fisher: false,
          weather_watcher: false,
          week_streak: false,
        };

    // 3Return combined profile data
    return {
      id: userSnap.id,
      name: userData.name,
      email: userData.email,
      imageUrl: userData.imageUrl,
      createdAt: userData.createdAt,
      achievements: achievements as AchievementProps,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const editProfileInFirestore = async (
  name?: string,
  imageUrl?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }

    // Build update payload dynamically
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (name !== undefined) updateData.name = name;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // Prevent empty update
    if (Object.keys(updateData).length === 1) {
      return { success: false, message: 'No fields to update' };
    }

    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, updateData);

    return { success: true };

  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
};