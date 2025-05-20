import { ExerciseSession } from "../interfaces/exercise-session.interface";
import { IntensityExercise } from "../interfaces/intensity-exercise.interface";
import { ExerciseWithIntensity, Session } from "../interfaces/interfaces_compuestas.interface";
import exercisesSession from "../mocks/exercise_session.json";
import exercises from "../mocks/exercises.json";
import intensityExercises from "../mocks/intensity_exercise.json";

const groupExercises = (trainingSessions: Session[], sessionsExercises: ExerciseSession[]) => {
    const grouped = [];

    for (const session of trainingSessions) {
        const exercises = sessionsExercises
            .filter(item => item.id_session === session.id_session)
            .map(item => item.id_exercise);

        grouped.push({
            id_session: session.id_session,
            exercises
        });
    }

    return grouped;
}

export const getExercisesOfTrainingSession = async (trainingId: number | string): Promise<ExerciseWithIntensity[]> => {

}

export const getExerciseSeriesRepetitions = async (exerciseId: number | string): Promise<IntensityExercise[] | null> => {
    return await intensityExercises.filter(intensityExercise => intensityExercise.id_exercise === exerciseId);
}

export const getExercisesBySessionId = async (sessionId: number | string): Promise<ExerciseSession[]> => {
    return await exercisesSession.filter(exerciseSession => exerciseSession.id_session === sessionId);
}

export const getExercise = async (exerciseId: number | string) => {
    return await exercises.find(exercise => exercise.id_exercise === exerciseId) ?? {
        id_exercise: 1,
        exercise_name: "Press Banca",
        remarks: "Ejercicio de pecho",
        abreviation: "PB",
        id_movement: 1
    };
}