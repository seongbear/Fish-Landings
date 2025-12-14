import { FishRecord, FishSpecies, GearType, SaveFishRecord } from "../screens/(tabs)/home/types/fish";
import { collection, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

// Fetch the list of fish species from Firestore
export const fetchFishSpeciesList = async (): Promise<FishSpecies[]> => {
	 try {
      const querySnapshot = await getDocs(collection(firestore, "fish_species"));   
      const species: FishSpecies[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
          return {
            name: data.name,
          } as FishSpecies;
      });
      return species;
    } catch (error) {
      console.error("Error fetching fish species: ", error);
      return [];
  }
}

// Fetch the list of catch records from Firestore
export const fetchCatchRecords = async (): Promise<FishRecord[]> => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('No user logged in');
        return [];
      } else {
        const catchesRef = collection(
          firestore,
          'users',
          userId,
          'fish_records'
        );
        const querySnapshot = await getDocs(catchesRef);
        const records: FishRecord[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            date: data.date ? (data.date as Timestamp).toDate() : new Date(),
            species: data.species,
            gearType: data.gearType,
            location: data.locationName || '',
            lat: data.lat || undefined,
            lng: data.lng || undefined,
            weight: data.weight,
            createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
          } as FishRecord;
        });
        return records;
      }
    } catch (error) {
      console.error("Error fetching catch records: ", error);
      return [];
  }
}

// Fetch the list of gear types from Firestore
export const fetchGearTypeList = async (): Promise<GearType[]> => {
  try {
      const querySnapshot = await getDocs(collection(firestore, "gear_type"));   
      const gearTypes: GearType[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
          return {
            name: data.name,
          } as GearType;
      });
      return gearTypes;
    } catch (error) {
      console.error("Error fetching gear types: ", error);
      return [];
  }
}
    
// Save a fish catch record to Firestore
export const saveCatchToFirestore = async (catchData: SaveFishRecord): Promise<boolean> => {
    try {
    // Ensure user is logged in
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('No user logged in');
      return false;
    }

    // Reference user's catches subcollection
    const catchesRef = collection(
      firestore,
      'users',
      userId,
      'fish_records'
    );

    // Save record
    await addDoc(catchesRef, {
      species: catchData.species,
      gearType: catchData.gearType,
      weight: catchData.weight,
      locationName: catchData.location ?? null,
      lat: catchData.lat ?? null,
      lng: catchData.lng ?? null,
      // Optional date (fallback to now)
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error saving catch to Firestore:', error);
    return false;
  }
};