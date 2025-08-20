import { PostgrestResponse } from "@supabase/supabase-js";
import { supabaseClient } from "../db/config";
import { ExerciseSession } from "../interfaces/exercise-session.interface";
import { Exercise } from "../interfaces/exercise/exercise.interface";
import { IntensityExercise } from "../interfaces/intensity-exercise.interface";
import exercisesSession from "../mocks/exercise_session.json";
import exercises from "../mocks/exercises.json";
import intensityExercises from "../mocks/intensity_exercise.json";
import { ExerciseWithMeta } from "../pages/Exercises";
import { mapToDBTableExercise } from "../utils/exercises";

export const getExercises = async (): Promise<PostgrestResponse<Exercise>> => {
    return await supabaseClient.from('exercises').select('*');
}

export const saveExercises = async (
    exercises: ExerciseWithMeta[]
): Promise<[PostgrestResponse<Exercise[]>, PostgrestResponse<Exercise[]>, PostgrestResponse<Exercise[]>]> => {
    const exercisesToUpdate = exercises.filter(ex => ex.isEditing).map(ex => mapToDBTableExercise(ex));
    const exercisesToInsert = exercises
        .filter(ex => ex.isNew)
        .map(ex => {
            const { id_exercise, ...exercise } = mapToDBTableExercise(ex);

            return exercise
        });
    const exercisesToDelete = exercises.filter(ex => ex.isRemoved).map(ex => mapToDBTableExercise(ex));

    const promises = [
        exercisesToUpdate.length > 0
            ? supabaseClient.from('exercises').upsert(exercisesToUpdate, { onConflict: 'id_exercise' }).select('*')
            : Promise.resolve({} as PostgrestResponse<Exercise[]>),
        exercisesToInsert.length > 0
            ? supabaseClient.from('exercises').insert(exercisesToInsert).select('*')
            : Promise.resolve({} as PostgrestResponse<Exercise[]>),
        exercisesToDelete.length > 0
            ? supabaseClient.from('exercises').delete().in('id_exercise', exercisesToDelete.map(ex => ex.id_exercise)).select('*')
            : Promise.resolve({} as PostgrestResponse<Exercise[]>)
    ];

    const [updateResponse, insertResponse, deleteResponse] = await Promise.all(promises);

    if (updateResponse?.error || insertResponse.error || deleteResponse.error) {
        throw new Error(updateResponse.error?.message || insertResponse.error?.message || deleteResponse.error?.message);
    }

    return [updateResponse, insertResponse, deleteResponse]
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