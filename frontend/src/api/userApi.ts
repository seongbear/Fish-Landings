import { firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AchievementProps, ProfileProps } from "../screens/(tabs)/profile/type/profile";


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
