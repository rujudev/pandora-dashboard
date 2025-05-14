import trainings from '../mocks/training.json';
import { Athlete } from '../types/athlete.types';
import { Training } from '../types/training.types';

export const getTrainingsByAthlete = async (athlete?: Athlete): Promise<Training[] | null> => {
    if (!athlete) return null;

    const trainings = await Promise.all(athlete.trainings.map(async training => await getTraining(training)));

    // Filtramos posibles valores null y hacemos type assertion
    return trainings.filter(t => t !== null) as Training[];
}

export const getTraining = async (id: number | string): Promise<Training | null> => {
    return await trainings.find(training => training?.id === id) ?? null
}