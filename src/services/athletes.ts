import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseClient } from '../db/config';
import { Athlete } from '../interfaces/athlete.interface';
import athletes from '../mocks/athletes.json';

export const getAthletes = async (): Promise<Athlete[]> => {
    return await athletes.map(athlete => ({
        ...athlete,
        birth_day: new Date(athlete.birth_day)
    }));
}

export const getAthlete = async (id: number | string): Promise<PostgrestSingleResponse<Athlete>> => {
    return await supabaseClient
        .from('athlete_view')
        .select('*')
        .eq('id_athlete', id)
        .single();
}