import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseClient } from '../db/config';
import { AthleteTrainingSummary } from '../interfaces/athlete/athlete-training-summary.interface';
import { MuscleMovementWithWeightRef } from '../interfaces/movement/muscle-movement-weight.interface';
import { WeeklyBlock } from '../interfaces/session/weekly-blocks.interface';
import { FullTrainingPlan } from '../interfaces/training/full-training-plan.interface';
import { replaceTrainingWeeklyStructure } from '../utils/weeklyBlocks';

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

type UpdateAthleteTrainingParams = {
    idAthlete: number;
    idTraining: number;
    // datos básicos del training (fechas, period, week_type, etc.)
    training: {
        start_date: string;
        end_date: string;
        period?: string | null;
        week_type?: string | null;
    };
    // movimientos asignados al training
    movements: MuscleMovementWithWeightRef[];
    // bloques semanales con TODA la estructura (sessions, exercises, intensities, sets…)
    weeklyBlocks: WeeklyBlock[];
};

// export const updateAthleteTraining = async (
//     currentTraining: FullTrainingPlan,
//     trainingUpdatedFields: Partial<FullTrainingPlan>,
//     onUpdate?: (updatedFields: Partial<FullTrainingPlan>) => void
// ): Promise<void> => {
//     let toUpdate: Partial<FullTrainingPlan> = {};

//     if (trainingUpdatedFields['start_date']) {
//         const { error } = await supabaseClient
//             .from('training')
//             .update({ start_date: trainingUpdatedFields.start_date })
//             .eq('id_training', currentTraining.id_training)
//             .select('*')
//             .single();

//         if (error) {
//             console.error('Error updating training end date:', error);
//         }
//     }

//     if (trainingUpdatedFields['end_date']) {
//         const { error } = await supabaseClient
//             .from('training')
//             .update({ end_date: trainingUpdatedFields.end_date })
//             .eq('id_training', currentTraining.id_training)
//             .select('*')
//             .single();

//         if (error) {
//             console.error('Error updating training end date:', error);
//         }
//     }

//     if (trainingUpdatedFields['muscle_movements']) {
//         const movements = trainingUpdatedFields['muscle_movements'];
//         const hasNewMovementsAssigned = movements.some(m => m.is_new_assigned);

//         if (hasNewMovementsAssigned) {
//             const movementsAssigned = movements
//                 .filter(m => m.is_new_assigned)
//                 .map(m => ({
//                     id_training: currentTraining.id_training,
//                     id_movement: m.id_movement,
//                     weight_ref: m.weight_ref
//                 }));

//             const { error } = await supabaseClient
//                 .from('training_movements')
//                 .insert(movementsAssigned)

//             if (error) throw new Error('No se han podido guardar los cambios', error)
//         } else {
//             const movements = trainingUpdatedFields.muscle_movements.map(movement => ({
//                 id_training: currentTraining.id_training,
//                 id_movement: movement.id_movement,
//                 weight_ref: movement.weight_ref
//             }))

//             const { error } = await supabaseClient
//                 .from('training_movements')
//                 .upsert(movements, { onConflict: 'id_training,id_movement' })
//                 .select('*');

//             if (error) throw new Error(error.message)
//         }
//     }

//     if (trainingUpdatedFields['weekly_blocks']) {
//         const rangeDataUpdatedBlocks = trainingUpdatedFields['weekly_blocks']
//         const [weeklyBlocks, newWeeklyBlocks] = [
//             rangeDataUpdatedBlocks.filter(b => !b.is_new),
//             rangeDataUpdatedBlocks.filter(b => b.is_new)
//         ]

//         if (weeklyBlocks.length > 0) updateWeeklyBlocks(weeklyBlocks, currentTraining.id_training);
//         if (newWeeklyBlocks.length > 0) {
//             const inserted = await addWeeklyBlocks(newWeeklyBlocks, currentTraining.id_training);

//             if (onUpdate) {
//                 const updatedWeeklyBlocks = rangeDataUpdatedBlocks.map(b => {
//                     if (inserted.some(i => i.week_start_date === b.week_start_date && i.week_end_date === b.week_end_date)) {
//                         const insertedBlock = inserted.find(i => i.week_start_date === b.week_start_date && i.week_end_date === b.week_end_date)!;

//                         return {
//                             ...b,
//                             id_block: insertedBlock.id_block,
//                         };
//                     }

//                     return b;
//                 })

//                 toUpdate['weekly_blocks'] = updatedWeeklyBlocks;
//             }
//         }
//     }

//     if (Object.keys(toUpdate).length > 0 && onUpdate) {
//         onUpdate(toUpdate);
//     }
// }

/**
 * Actualiza un entrenamiento ya creado y asignado a un atleta a partir
 * de un FullTrainingPlan (el estado completo que tienes en el front).
 */
export const updateAthleteTraining = async (
    fullPlan: FullTrainingPlan
): Promise<void> => {
    debugger;

    const idTraining = fullPlan.id_training;
    const idAthlete = fullPlan.id_athlete;

    if (!idTraining) {
        throw new Error(
            "updateAthleteTraining: falta id_training en FullTrainingPlan"
        );
    }

    // 1) asegurar que el training está asignado a ese atleta
    const { data: at, error: atError } = await supabaseClient
        .from("athlete_training")
        .select("id_athlete, id_training")
        .eq("id_athlete", idAthlete)
        .eq("id_training", idTraining)
        .maybeSingle();

    debugger;
    if (atError) throw atError;
    if (!at) {
        throw new Error("El entrenamiento no está asignado a este atleta");
    }

    // 2) actualizar tabla training
    const { error: trainingError } = await supabaseClient
        .from("training")
        .update({
            start_date: fullPlan.start_date,
            end_date: fullPlan.end_date,
            period: fullPlan.period,
            week_type: fullPlan.week_type,
            updated_at: new Date().toISOString(),
        })
        .eq("id_training", idTraining);

    debugger;
    if (trainingError) throw trainingError;

    // 3) reemplazar movimientos (training_movements)
    const { error: delMovError } = await supabaseClient
        .from("training_movements")
        .delete()
        .eq("id_training", idTraining);

    if (delMovError) throw delMovError;

    const movementRows = (fullPlan.muscle_movements ?? [])
        .filter((m: MuscleMovementWithWeightRef) => m.id_movement)
        .map((m: MuscleMovementWithWeightRef) => ({
            id_training: idTraining,
            id_movement: m.id_movement!,
            weight_ref: m.weight_ref,
        }));

    debugger;
    if (movementRows.length > 0) {
        const { error: insMovError } = await supabaseClient
            .from("training_movements")
            .insert(movementRows);
        if (insMovError) throw insMovError;
    }

    debugger;

    // 4) reemplazar toda la estructura de semanas / sesiones / ejercicios
    await replaceTrainingWeeklyStructure({
        idTraining,
        weeklyBlocks: fullPlan.weekly_blocks as WeeklyBlock[],
    });

    debugger;
};
