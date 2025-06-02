import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "../db/config";
import { MuscleMovementWithWeightRef } from "../interfaces/movement/muscle-movement-weight.interface";
import { MuscleMovement } from "../interfaces/movement/muscle-movement.interface";
import muscleMovements from "../mocks/muscle_movements.json";
import trainingMovements from "../mocks/training_movements.json";

export const getMuscleMovements = async (trainingId: number | string): Promise<MuscleMovementWithWeightRef[]> => {
    const specificTrainingMuscleMovements = trainingMovements.filter(trainingMovement => trainingMovement.id_training === trainingId);

    return await specificTrainingMuscleMovements.map(trainingMovement => {
        const movement = muscleMovements.find(movement => movement.id_movement === trainingMovement.id_movement)

        return {
            ...movement as MuscleMovement,
            weight_ref: trainingMovement.weight_ref
        }
    });
}

export const getAllMovements = async (): Promise<{ movements: MuscleMovement[], error: PostgrestError | null }> => {
    const { data: dataMovements, error: errorMovements } = await supabaseClient
        .from('muscle_movements')
        .select('*');

    return {
        movements: dataMovements as MuscleMovement[],
        error: errorMovements
    }
}

export const getMovementsMaxId = async (): Promise<{ maxId: number, error: PostgrestError | null }> => {
    const { data: maxId, error: maxIdError } = await supabaseClient
        .from('muscle_movements')
        .select('id_movement')
        .order('id_movement', { ascending: false })
        .limit(1)
        .single();

    return {
        maxId: maxId?.id_movement,
        error: maxIdError
    }
}