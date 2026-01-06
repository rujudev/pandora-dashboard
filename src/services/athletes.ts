import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseClient } from '../db/config';
import { Athlete } from '../interfaces/athlete/athlete.interface';
import { MuscleMovementWithWeightRef } from '../interfaces/movement/muscle-movement-weight.interface';
import { FullTrainingPlan } from '../interfaces/training/full-training-plan.interface';

export const getAthletes = async (): Promise<PostgrestSingleResponse<Athlete[]>> => {
    return await supabaseClient
        .from('athlete')
        .select();
}

export const getAthlete = async (id: number | string): Promise<PostgrestSingleResponse<Athlete>> => {
    return await supabaseClient
        .from('athlete_view')
        .select('*')
        .eq('id_athlete', id)
        .single();
}

export const addAthleteTraining = async (athleteTraining: FullTrainingPlan) => {
    const {
        data: insertTrainingData,
        error: insertTrainingError
    } = await supabaseClient
        .from('training')
        .insert({
            start_date: athleteTraining.start_date,
            end_date: athleteTraining.end_date,
            period: athleteTraining.period,
            week_type: athleteTraining.week_type
        })
        .select()
        .single();

    if (insertTrainingError) throw insertTrainingError

    const {
        error: insertAthleteTrainingError
    } = await supabaseClient
        .from('athlete_training')
        .insert({
            id_athlete: athleteTraining.id_athlete,
            id_training: insertTrainingData.id_training
        })
        .select()
        .single();

    if (insertAthleteTrainingError) throw insertAthleteTrainingError;

    let insertedMovements: MuscleMovementWithWeightRef[] = [];

    for (let movement of athleteTraining.muscle_movements) {
        const {
            data: insertMovementData,
            error: insertMovementError
        } = await supabaseClient
            .from('muscle_movements')
            .insert({
                movement_name: movement.movement_name
            })
            .select()
            .single();

        if (insertMovementError) throw insertMovementError

        movement = {
            ...movement,
            id_movement: insertMovementData.id_movement
        }

        insertedMovements = [
            ...insertedMovements,
            movement
        ]
    }

    const trainingMovements = insertedMovements.map(movement => ({
        id_training: insertTrainingData.id_training,
        id_movement: movement.id_movement,
        weight_ref: movement.weight_ref
    }))

    const {
        error: insertMovementsError
    } = await supabaseClient
        .from('training_movements')
        .insert(trainingMovements)
        .select();

    if (insertMovementsError) throw insertMovementsError

    for (const session of athleteTraining.sessions) {
        const {
            data: insertSessionData,
            error: insertSessionError
        } = await supabaseClient
            .from('sessions')
            .insert({
                id_training: athleteTraining.id_training,
                day_week: session.day_week,
                day_period: session.day_period
            })
            .select()
            .single();

        if (insertSessionError) throw insertSessionError

        const idSession = insertSessionData.id_session;

        for (const exercise of session.exercises) {
            const {
                error: insertExerciseSessionError
            } = await supabaseClient
                .from('exercise_session')
                .insert({
                    id_session: idSession,
                    id_exercise: exercise.id_exercise
                })
                .select()
                .single();

            if (insertExerciseSessionError) throw insertExerciseSessionError;

            for (const intensity of exercise.intensities) {
                const {
                    data: insertIntensityData,
                    error: insertIntensityError
                } = await supabaseClient
                    .from('intensity')
                    .insert({ zone: intensity.zone })
                    .select()
                    .single();

                if (insertIntensityError) throw insertIntensityError;

                const idIntensity = insertIntensityData.id_intensity;

                const { error: insertIntensityExerciseError } = await supabaseClient
                    .from("intensity_exercise")
                    .insert({
                        id_intensity: idIntensity,
                        id_exercise: exercise.id_exercise,
                        series: intensity.series,
                        repetitions: intensity.repetitions
                    });

                if (insertIntensityExerciseError) throw insertIntensityExerciseError;

                if (intensity.sets && intensity.sets.length > 0) {
                    const setsToInsert = intensity.sets.map(set => ({
                        id_intensity: idIntensity,
                        percentage: set.percentage
                    }));

                    const { error: insertSetError } = await supabaseClient
                        .from("set")
                        .insert(setsToInsert);

                    if (insertSetError) throw insertSetError;
                }
            }
        }
    }

    return {
        success: true,
        id_training: insertTrainingData.id_training
    }
}

export const updateAthleteTraining = async (trainingId: number, athleteId: number, data: Partial<FullTrainingPlan>) => {

}