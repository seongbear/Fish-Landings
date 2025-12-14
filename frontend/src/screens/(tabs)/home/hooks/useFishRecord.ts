import { useEffect, useState, useCallback } from "react";
import { FishRecord } from "../types/fish";
import { fetchCatchRecords } from "../../../../api/fishApi";

export const useFishRecord = () => {
    const [catchRecords, setCatchRecords] = useState<FishRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadCatchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchCatchRecords();
            setCatchRecords(response);
        } catch (error) {
            console.error("Error loading catch records:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCatchRecords();
    }, [loadCatchRecords]);

    return { 
        catchRecords, 
        setCatchRecords, 
        loading, 
        setLoading, 
        reload: loadCatchRecords 
    };
}