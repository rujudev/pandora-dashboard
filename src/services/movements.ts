import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "../db/config";
import { MuscleMovement } from "../interfaces/movement/muscle-movement.interface";

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