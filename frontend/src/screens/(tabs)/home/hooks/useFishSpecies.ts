import { useEffect, useState } from "react";
import { FishSpecies, SaveFishRecord } from "../types/fish";
import { fetchFishSpeciesList, saveCatchToFirestore } from "../../../../api/fishApi";

export const useFishSpecies = () => {
    const [fishSpeciesList, setFishSpeciesList] = useState<FishSpecies[]>([]);
    useEffect(() => {
        let isMounted = true;
        async function loadFishSpecies() {
            try {
                const response = await fetchFishSpeciesList();
                if (isMounted) {
                    setFishSpeciesList(response);
                }
            } catch (error) {
                console.error("Error loading fish species:", error);
            }
        }

        loadFishSpecies();
        return () => {
            isMounted = false;
        }
    }, []);

    const addFishRecord = async (fish: SaveFishRecord) => {
        const success = await saveCatchToFirestore(fish)
        return success;
    };

    return { fishSpeciesList, addFishRecord };
}