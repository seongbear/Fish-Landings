import { useEffect, useState } from "react";
import { FishRecord } from "../types/fish";
import { fetchCatchRecords } from "../../../../api/fishApi";

export const useFishRecord = () => {
    const [catchRecords, setCatchRecords] = useState<FishRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component
        async function loadCatchRecords() {
            try {
                const response = await fetchCatchRecords();
                if (isMounted) {
                    setCatchRecords(response);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading catch records:", error);
                setLoading(false);
            }
        }

        loadCatchRecords();
        return () => {
            isMounted = false;
        }
    }, []);

    return { catchRecords, setCatchRecords, loading, setLoading };
}