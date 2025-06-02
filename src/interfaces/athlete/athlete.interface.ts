export interface Athlete {
    id_athlete: number;
    first_name: string;
    last_name: string;
    category_weight: number | null;
    birth_day: Date | null;
    sport: string;
    team: string;
    thumbnail: string;
}