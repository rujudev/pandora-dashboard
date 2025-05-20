import { supabaseClient } from '../db/config';

export const getTrainingByAthlete = async (athleteId: number, trainingId: number) => {
    return await supabaseClient
        .from('athlete_full_training_view')
        .select('*')
        .eq('id_athlete', athleteId)
        .eq('id_training', trainingId);
}

export const getTraining = async (id: number | string) => {
    return await supabaseClient
        .from('training')
        .select('*')
        .eq('id_training', id);
}