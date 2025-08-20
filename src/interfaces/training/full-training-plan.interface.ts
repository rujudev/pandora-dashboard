import { MuscleMovementWithWeightRef } from "../movement/muscle-movement-weight.interface";
import { WeeklyBlock } from "../session/weekly-blocks.interface";
import { Training } from "./training.interface";

export interface FullTrainingPlan extends Training {
    id_athlete: number;
    muscle_movements: MuscleMovementWithWeightRef[];
    weekly_blocks: WeeklyBlock[];
}