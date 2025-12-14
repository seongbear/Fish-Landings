import { useEffect, useState } from "react"
import { GearType } from "../types/fish"
import { fetchGearTypeList } from "../../../../api/fishApi";

export const useGearType = () => {
    const [gearTypeList, setGearTypeList] = useState<GearType[]>([]);
    useEffect(() => {
        let isMounted = true;
        async function loadGearTypes() {
            try {
                const response = await fetchGearTypeList();
                if (isMounted) {
                    setGearTypeList(response);
                }
            } catch (error) {
                console.error("Error loading gear types:", error);
            }
        }

        loadGearTypes();
        return () => {
            isMounted = false;
        }
    }, []);

    return { gearTypeList };
}