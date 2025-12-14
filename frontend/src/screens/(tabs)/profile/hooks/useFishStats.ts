import { useMemo } from 'react';
import { useFishRecord } from "../../home/hooks/useFishRecord"; // Adjust path as needed

export const useFishStats = () => {
    // Get data & loading state from your record hook
    const { catchRecords, loading, reload } = useFishRecord();

    // Use useMemo to recalculate ONLY when 'catchRecords' changes
    const stats = useMemo(() => {
        // Guard clause: Return zeros if empty or undefined
        if (!catchRecords || catchRecords.length === 0) {
            return {
                totalCatches: 0,
                totalWeight: "0",
                bestCatch: "0",
                daysActive: 0,
                todayWeightSum: 0
            };
        }

        // A. Total Catches
        const totalCatches = catchRecords.length;

        // B. Total Weight (Handle potential string/number mismatches)
        const weightSum = catchRecords.reduce((total, record) => {
            return total + (Number(record.weight) || 0);
        }, 0);
        const totalWeight = weightSum.toFixed(1); // "125.5"

        // C. Best Catch (Max Weight)
        const weights = catchRecords.map(r => Number(r.weight) || 0);
        const maxWeight = Math.max(...weights);
        const bestCatch = maxWeight === -Infinity ? "0" : maxWeight.toFixed(1);

        // D. Days Active (Unique Dates)
        const uniqueDates = new Set(catchRecords.map(r => {
            const d = r.date instanceof Date ? r.date : new Date(r.date);
            return d.toDateString(); // Groups by "Mon Jan 01 2024"
        }));
        const daysActive = uniqueDates.size;

        // E. Today Catch 
        const today = new Date().toDateString(); // "Mon Jan 01 2024"
        const todayCatch = catchRecords.filter(r => r.date instanceof Date ? r.date.toDateString() === today : new Date(r.date).toDateString() === today);
        const todayWeightSum = todayCatch.reduce((total, record) => {
            return total + (Number(record.weight) || 0);
        }, 0);

        return {
            totalCatches,
            totalWeight,
            bestCatch,
            daysActive,
            todayWeightSum
        };
    }, [catchRecords]); 

    return { 
        stats, 
        loading,
        reload 
    };
};