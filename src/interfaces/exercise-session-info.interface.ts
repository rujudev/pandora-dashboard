import { Exercise } from "./exercise.interface";
import { Intensity } from "./intensity.interface";

export interface FullExerciseInfo {
    id_session: number;
    exercise: Exercise;
    intensity: Intensity;
    series: number;
    repetitions: number;
}