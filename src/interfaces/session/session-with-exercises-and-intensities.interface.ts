import { Session } from "react-router";
import { ExerciseWithIntensity } from "../exercise/exercise-with-intensity.interface";

export interface SessionWithExercisesAndIntensities extends Session {
    exercises: ExerciseWithIntensity[];
}