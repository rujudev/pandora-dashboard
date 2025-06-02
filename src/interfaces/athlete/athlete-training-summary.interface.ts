import { MuscleMovementWithWeightRef } from "../movement/muscle-movement-weight.interface";

export interface AthleteTrainingSummary {
    id_athlete: number,
    id_training: number,
    start_date: string,
    end_date: string,
    session_count: number,
    muscle_movements: MuscleMovementWithWeightRef[]
}