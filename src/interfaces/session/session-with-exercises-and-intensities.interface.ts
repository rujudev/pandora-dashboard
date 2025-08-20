
import { ExerciseWithIntensity } from "../exercise/exercise-with-intensity.interface";
import { Session } from "./session.interface";

export interface SessionWithExercisesAndIntensities extends Session {
    exercises: ExerciseWithIntensity[];
}