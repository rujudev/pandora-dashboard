import athletes from '../mocks/athletes.json';
import { Athlete } from '../types/athlete.types';

export const getAthletes = async (): Promise<Athlete[]> => {
    return await athletes;
}

export const getAthlete = async (id: number | string) => {
    return await athletes.find(athlete => athlete?.id === id)
}