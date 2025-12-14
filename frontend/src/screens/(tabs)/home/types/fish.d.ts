export interface FishSpecies {
    name: string;
}

export interface GearType {
    name: string;
}

export interface FishRecord {
    date: Date;
    species: string;
    gearType: string;
    location: string;
    lat?: number;
    lng?: number;
    weight: number;
    createdAt?: Date;
}

export interface SaveFishRecord {
    gearType: string;
    species: string;
    location: string;
    lat?: number;
    lng?: number;
    weight: number;
}