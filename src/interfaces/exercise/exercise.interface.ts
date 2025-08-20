export interface Exercise {
    id_exercise?: number;
    exercise_name: string;
    remarks: string | null;
    abreviation: string;
    id_movement?: number;
    is_new?: boolean;
}