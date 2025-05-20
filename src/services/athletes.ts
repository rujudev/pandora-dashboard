import { AthleteTraining } from '../interfaces/athlete-training.interface';
import { Athlete } from '../interfaces/athlete.interface';
import athletes from '../mocks/athletes.json';
import athleteTrainings from '../mocks/athletes_trainings.json';

export const getAthletes = async (): Promise<Athlete[]> => {
    return await athletes.map(athlete => ({
        ...athlete,
        birth_day: new Date(athlete.birth_day)
    }));
}

export const getAthlete = async (id: number | string) => {
    return await athletes.find(athlete => athlete?.id_athlete === id)
}

export const getAthleteTrainings = async (id: number | string): Promise<AthleteTraining[]> => {
    console.log(id);
    return await athleteTrainings.filter(athleteTraining => athleteTraining.id_athlete === id);
}