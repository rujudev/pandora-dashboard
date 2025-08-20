export const DAYS_OF_WEEK = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
] as const;
export const DAY_PERIODS = ['Mañana', 'Tarde', 'Noche'] as const;
export type DayWeek = typeof DAYS_OF_WEEK[number];
export type DayPeriod = typeof DAY_PERIODS[number];
