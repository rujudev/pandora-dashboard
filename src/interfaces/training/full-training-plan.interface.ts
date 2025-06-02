import { MovementsWithWeightRef } from "../interfaces_compuestas.interface";
import { SessionWithExercisesAndIntensities } from "../session/session-with-exercises-and-intensities.interface";
import { Training } from "./training.interface";

export interface FullTrainingPlan extends Training {
    id_athlete: number;
    muscle_movements: MovementsWithWeightRef[];
    sessions: SessionWithExercisesAndIntensities[];
}