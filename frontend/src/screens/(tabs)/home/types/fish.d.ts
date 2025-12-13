export interface FishSpecies {
    name: string;
}

export interface FishRecord {
    date: Date;
    species: string;
    location: string;
    lat?: number;
    lng?: number;
    weight: number;
    createdAt?: Date;
}

export interface SaveFishRecord {
    species: string;
    location: string;
    lat?: number;
    lng?: number;
    weight: number;
}