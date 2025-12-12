// --- Helper Functions ---
export const getIconName = (code: number): string => {
    if (code === 0) return 'sun';
    if (code >= 1 && code <= 3) return 'cloud';
    if ([45, 48].includes(code)) return 'cloud';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'cloud-snow';
    if ([95, 96, 99].includes(code)) return 'storm';
    return 'cloud';
};

export const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

export const formatForecastDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }); 
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return { day, dateStr };
};
    
export const getActivityColor = (score: number): [string, string] => {
    if (score >= 80) return ['#10B981', '#059669'];
    if (score >= 60) return ['#F59E0B', '#D97706'];
    return ['#EF4444', '#B91C1C'];
};

export const getCalculatedTide = (dayIndex: number) => {
    const startHour = 9; // Start at 9:00 AM
    const minutesPerDay = 50; 
    
    const totalMinutes = (startHour * 60) + (dayIndex * minutesPerDay);
    const hours = Math.floor(totalMinutes / 60) % 24; // Keep within 24h
    const mins = totalMinutes % 60;
    
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `H ${hours}:${formattedMins}`;
};
