import { Session } from '../interfaces/session.interface';
import sessions from '../mocks/sessions.json';
import type { DayPeriod, DayWeek } from '../types/day.types';

export const getSession = async (trainingId: number | string): Promise<Session | null> => {
    const session = await sessions.find(session => session.id_training === trainingId);

    if (!session) return null;

    return {
        ...session,
        day_week: session.day_week as DayWeek,
        day_period: session.day_period as DayPeriod
    };
}

export const getSessions = async (trainingId: number | string): Promise<Session[]> => {
    return await sessions.filter(session => session.id_training === trainingId).map(session => ({
        ...session,
        day_week: session.day_week as DayWeek,
        day_period: session.day_period as DayPeriod
    }));
}

