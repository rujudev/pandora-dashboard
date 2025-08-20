import { SessionWithExercisesAndIntensities } from "./session-with-exercises-and-intensities.interface";

export interface WeeklyBlock {
    id_block?: number;
    is_active: boolean;
    week_end_date: string;
    week_start_date: string;
    sessions: SessionWithExercisesAndIntensities[];
    is_new?: boolean;
}