export interface AchievementProps {
    milestone_100kg: boolean;
    big_game_hunter: boolean;
    community_helper: boolean;
    first_catch: boolean;
    master_fisher: boolean;
    weather_watcher: boolean;
    week_streak: boolean;
    early_bird: boolean;
}

export interface ProfileProps {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    createdAt: string;
    achievements: AchievementProps;
}

export interface EditProfileProps {
    name?: string;
    imageUrl?: string;
}