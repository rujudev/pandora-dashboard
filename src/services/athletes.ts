import athletes from '../mocks/athletes.json';

export const getAthletes = async () => {
    return await athletes;
}

export const getAthlete = async (id: number | string) => {
    return await athletes.find(athlete => athlete?.id === id)
}