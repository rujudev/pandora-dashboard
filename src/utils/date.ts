import { DayPeriod, DayWeek } from "../types/day.types";

export const calculateAge = (date: Date | null): string => {
    if (!date) return '0';

    const today = new Date();
    const birthYear = date.getFullYear();
    const birthMonth = date.getMonth();
    const birthDay = date.getDate();

    let age = today.getFullYear() - birthYear;

    // Ajustar si el cumpleaños aún no ha ocurrido este año
    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age.toString();
};

export const getFormattedDate = (date: string, locale: Intl.LocalesArgument, options: Intl.DateTimeFormatOptions) => {
    const newDate = new Date(date)
    const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', year: 'numeric', ...options, });
    return formatter.format(newDate);
}

export const dayWeekToNumber = (day: DayWeek): number => {
    const map: Record<DayWeek, number> = {
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6,
        'Domingo': 0
    };

    return map[day] || 0;
}

export const numberToDayWeek = (number: number): DayWeek => {
    const map: Record<number, DayWeek> = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        0: 'Domingo'
    };

    return map[number] || 'Lunes';
}

export const dayPeriodToNumber = (period: DayPeriod): number => {
    const map: Record<DayPeriod, number> = {
        'Mañana': 1,
        'Tarde': 2,
        'Noche': 3
    };

    return map[period] || 1; // Por defecto: Mañana
};

export const numberToDayPeriod = (number: number): DayPeriod => {
    const map: Record<number, DayPeriod> = {
        1: 'Mañana',
        2: 'Tarde',
        3: 'Noche'
    };

    return map[number] || 'Mañana'; // Por defecto
};