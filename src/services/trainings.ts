import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseClient } from '../db/config';
import { AthleteTrainingSummary } from '../interfaces/athlete/athlete-training-summary.interface';
import { FullTrainingPlan } from '../interfaces/training/full-training-plan.interface';
import { addWeeklyBlocks, updateWeeklyBlocks } from './weeklyBlocks';

export const getTrainingByAthlete = async (athleteId: number, trainingId: number): Promise<PostgrestSingleResponse<FullTrainingPlan>> => {
    return await supabaseClient
        .from('athlete_full_training_view')
        .select('*')
        .eq('id_athlete', athleteId)
        .eq('id_training', trainingId)
        .single();
}

export const getAthleteTrainings = async (athleteId: number): Promise<PostgrestSingleResponse<AthleteTrainingSummary[]>> => {
    return await supabaseClient
        .from('athlete_trainings_view')
        .select('*')
        .eq('id_athlete', athleteId);
}

export const getAthleteTraining = async (athleteId: number): Promise<PostgrestSingleResponse<AthleteTrainingSummary>> => {
    return await supabaseClient
        .from('athlete_trainings_view')
        .select('*')
        .eq('id_athlete', athleteId)
        .single()
}

export const getTraining = async (id: number | string) => {
    return await supabaseClient
        .from('training')
        .select('*')
        .eq('id_training', id);
}

export const updateAthleteTraining = async (
    currentTraining: FullTrainingPlan,
    trainingUpdatedFields: Partial<FullTrainingPlan>,
    onUpdate?: (updatedFields: Partial<FullTrainingPlan>) => void
) => {
    let toUpdate: Partial<FullTrainingPlan> = {};

    if (trainingUpdatedFields['start_date']) {
        const { error } = await supabaseClient
            .from('training')
            .update({ start_date: trainingUpdatedFields.start_date })
            .eq('id_training', currentTraining.id_training)
            .select('*')
            .single();

        if (error) {
            console.error('Error updating training end date:', error);
        }
    }

    if (trainingUpdatedFields['end_date']) {
        const { error } = await supabaseClient
            .from('training')
            .update({ end_date: trainingUpdatedFields.end_date })
            .eq('id_training', currentTraining.id_training)
            .select('*')
            .single();

        if (error) {
            console.error('Error updating training end date:', error);
        }
    }

    if (trainingUpdatedFields['muscle_movements']) {
        const movements = trainingUpdatedFields['muscle_movements'];
        const hasNewMovementsAssigned = movements.some(m => m.is_new_assigned);

        if (hasNewMovementsAssigned) {
            const movementsAssigned = movements
                .filter(m => m.is_new_assigned)
                .map(m => ({
                    id_training: currentTraining.id_training,
                    id_movement: m.id_movement,
                    weight_ref: m.weight_ref
                }));

            const { error } = await supabaseClient
                .from('training_movements')
                .insert(movementsAssigned)

            if (error) throw new Error('No se han podido guardar los cambios', error)
        } else {
            const movements = trainingUpdatedFields.muscle_movements.map(movement => ({
                id_training: currentTraining.id_training,
                id_movement: movement.id_movement,
                weight_ref: movement.weight_ref
            }))

            const { error } = await supabaseClient
                .from('training_movements')
                .upsert(movements, { onConflict: 'id_training,id_movement' })
                .select('*');

            if (error) throw new Error(error.message)
        }
    }

    if (trainingUpdatedFields['weekly_blocks']) {
        const rangeDataUpdatedBlocks = trainingUpdatedFields['weekly_blocks']
        const [weeklyBlocks, newWeeklyBlocks] = [
            rangeDataUpdatedBlocks.filter(b => !b.is_new),
            rangeDataUpdatedBlocks.filter(b => b.is_new)
        ]

        if (weeklyBlocks.length > 0) updateWeeklyBlocks(weeklyBlocks, currentTraining.id_training);
        if (newWeeklyBlocks.length > 0) {
            const inserted = await addWeeklyBlocks(newWeeklyBlocks, currentTraining.id_training);

            if (onUpdate) {
                const updatedWeeklyBlocks = rangeDataUpdatedBlocks.map(b => {
                    if (inserted.some(i => i.week_start_date === b.week_start_date && i.week_end_date === b.week_end_date)) {
                        const insertedBlock = inserted.find(i => i.week_start_date === b.week_start_date && i.week_end_date === b.week_end_date)!;

                        return {
                            ...b,
                            id_block: insertedBlock.id_block,
                        };
                    }

                    return b;
                })

                toUpdate['weekly_blocks'] = updatedWeeklyBlocks;
            }
        }
    }

    if (Object.keys(toUpdate).length > 0 && onUpdate) {
        onUpdate(toUpdate);
    }
}
