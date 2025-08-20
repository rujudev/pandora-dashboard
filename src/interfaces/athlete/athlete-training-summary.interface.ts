import { MuscleMovementWithWeightRef } from "../movement/muscle-movement-weight.interface";
import { WeeklyBlock } from "../session/weekly-blocks.interface";

export interface AthleteTrainingSummary {
    id_athlete?: number,
    id_training: number,
    start_date: string,
    end_date: string,
    sessions_count: number,
    training_movements: MuscleMovementWithWeightRef[],
    updated_at: string,
    blocks: WeeklyBlock[],
    blocks_count: number
}