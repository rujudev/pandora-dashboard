import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseClient } from '../db/config';
import { AthleteTrainingSummary } from '../interfaces/interfaces_compuestas.interface';

export const getTrainingByAthlete = async (athleteId: number, trainingId: number) => {
    return await supabaseClient
        .from('athlete_full_training_view')
        .select('*')
        .eq('id_athlete', athleteId)
        .eq('id_training', trainingId);
}

export const getAthleteTrainings = async (athleteId: number): Promise<PostgrestSingleResponse<AthleteTrainingSummary[]>> => {
    return await supabaseClient
        .from('athlete_trainings_summary_view')
        .select('*')
        .eq('id_athlete', athleteId);
}

export const getTraining = async (id: number | string) => {
    return await supabaseClient
        .from('training')
        .select('*')
        .eq('id_training', id);
}