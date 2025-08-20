import {
    addDays,
    addWeeks,
    endOfMonth,
    endOfWeek,
    format,
    getMonth,
    isAfter,
    isBefore,
    isSameDay,
    parseISO,
    startOfMonth,
    startOfWeek
} from "date-fns";
import { WeeklyBlock } from "../interfaces/session/weekly-blocks.interface";

// Tipos mejorados
interface WeekDefinition {
    startDay: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo, 1 = lunes
    includeWeekends: boolean;
    daysInWeek: number;
}

// Configuración centralizada
const WEEK_CONFIG: WeekDefinition = {
    startDay: 1, // Lunes
    includeWeekends: true, // Incluir domingos
    daysInWeek: 7
};

// Función auxiliar para crear rango de semana
const createWeekRange = (date: Date): { start: Date; end: Date } => {
    const start = startOfWeek(date, { weekStartsOn: WEEK_CONFIG.startDay });
    const end = addDays(start, WEEK_CONFIG.daysInWeek - 1);

    return { start, end };
};

// Función unificada para generar bloques semanales
export const generateWeeklyBlocks = (
    startDate: Date,
    endDate: Date,
    existingBlocks: WeeklyBlock[] = [],
    options: {
        preserveExisting?: boolean;
        assignIds?: boolean;
    } = {}
): WeeklyBlock[] => {
    const {
        preserveExisting = false,
        assignIds = false,
    } = options;

    const allBlocks: Map<string, WeeklyBlock> = new Map();
    let blockId = 1;

    // Generar todos los bloques necesarios para el rango
    let currentStart = startOfWeek(startDate, { weekStartsOn: WEEK_CONFIG.startDay });

    while (isBefore(currentStart, endDate) || isSameDay(currentStart, endDate)) {
        const { start, end } = createWeekRange(currentStart);

        // Ajustar límites al rango especificado
        const adjustedStart = isBefore(start, startDate) ? startDate : start;
        const adjustedEnd = isAfter(end, endDate) ? endDate : end;

        // Crear clave única
        const key = `${format(adjustedStart, 'yyyy-MM-dd')}_${format(adjustedEnd, 'yyyy-MM-dd')}`;

        // Si no existe, crear nuevo bloque
        if (!allBlocks.has(key)) {
            const existingBlocksKeys = existingBlocks.map(block => `${format(block.week_start_date, 'yyyy-MM-dd')}_${format(block.week_end_date, 'yyyy-MM-dd')}`)
            const isNewBlock = !existingBlocksKeys.some(blockKey => blockKey.includes(key))

            allBlocks.set(key, {
                id_block: assignIds ? blockId++ : undefined,
                is_active: false,
                sessions: [],
                week_start_date: format(adjustedStart, 'yyyy-MM-dd'),
                week_end_date: format(adjustedEnd, 'yyyy-MM-dd'),
                ...(isNewBlock && { is_new: true })
            });
        }

        currentStart = addWeeks(currentStart, 1);
    }

    // Procesar, si es necesario, los bloques existentes para obtener sus sesiones
    if (preserveExisting) {
        existingBlocks.forEach(block => {
            const blockStart = parseISO(block.week_start_date);
            const blockEnd = parseISO(block.week_end_date);

            // Semana lógica del bloque original
            const monday = startOfWeek(blockStart, { weekStartsOn: WEEK_CONFIG.startDay });
            const sunday = addDays(monday, WEEK_CONFIG.daysInWeek - 1);

            // Ajustamos las fechas al nuevo rango (siempre dentro de la misma semana)
            const newStart = isBefore(monday, startDate) ? startDate : monday;
            const newEnd = isAfter(sunday, endDate) ? endDate : sunday;

            const key = `${format(newStart, 'yyyy-MM-dd')}_${format(newEnd, 'yyyy-MM-dd')}`;
            allBlocks.set(key, {
                ...block,
                week_start_date: format(newStart, 'yyyy-MM-dd'),
                week_end_date: format(newEnd, 'yyyy-MM-dd'),
            });
        });
    }


    // Convertir Map a array y ordenar
    return Array.from(allBlocks.values())
        .sort((a, b) => a.week_start_date.localeCompare(b.week_start_date))
        .map((block, index) => ({
            ...block,
            // Reasignar IDs secuenciales si assignIds es true
            id_block: !block.id_block ? index + 1 : block.id_block
        }));
};

// Función simplificada para frontend
export const generateWeeklyBlocksForFrontend = (
    startDate: Date,
    endDate: Date
): WeeklyBlock[] => {
    return generateWeeklyBlocks(startDate, endDate, [], {
        assignIds: true,
        preserveExisting: true
    });
};

// Función mejorada para actualizar bloques existentes
export const updateWeeklyBlocksPreservingExisting = (
    startDate: Date,
    endDate: Date,
    existingBlocks: WeeklyBlock[]
): WeeklyBlock[] => {
    return generateWeeklyBlocks(startDate, endDate, existingBlocks, {
        preserveExisting: true,
        assignIds: true,
    });
};

/**
 * Genera todos los bloques necesarios para cubrir íntegramente los meses
 * comprendidos entre `startDate` y `endDate`, partiendo las semanas que
 * crucen límites de mes y preservando las sesiones de los bloques ya existentes.
 *
 * El resultado es un objeto cuya clave es el **número de mes (0-11)** y cuyo
 * valor es el listado de bloques que cubren ese mes.
 */
export const generateMonthBlocks = (
    startDate: Date,
    endDate: Date,
    updatedBlocks: WeeklyBlock[] = []
): Record<number, WeeklyBlock[]> => {

    /* ------------------------------------------------------------------ */
    /* 1. Crear un índice de semanas completas (lunes-domingo)            */
    /* ------------------------------------------------------------------ */
    const weekIndex = new Map<string, WeeklyBlock>();

    const startDateMonth = getMonth(startDate);
    const firstMonth = startOfMonth(startDate);
    const lastMonth = endOfMonth(endDate);

    let cursor = startOfWeek(firstMonth, { weekStartsOn: WEEK_CONFIG.startDay });
    const limit = endOfWeek(lastMonth, { weekStartsOn: WEEK_CONFIG.startDay });

    while (isBefore(cursor, limit) || isSameDay(cursor, limit)) {
        const weekStart = cursor;
        const weekEnd = endOfWeek(cursor, { weekStartsOn: WEEK_CONFIG.startDay });
        const key = `${format(weekStart, 'yyyy-MM-dd')}_${format(weekEnd, 'yyyy-MM-dd')}`;

        weekIndex.set(key, {
            id_block: 0,
            is_active: false,
            sessions: [],
            week_start_date: format(weekStart, 'yyyy-MM-dd'),
            week_end_date: format(weekEnd, 'yyyy-MM-dd'),
        });

        cursor = addWeeks(cursor, 1);
    }

    /* ------------------------------------------------------------------ */
    /* 2. Copiar sesiones de los bloques ya existentes                    */
    /* ------------------------------------------------------------------ */
    updatedBlocks.forEach(existing => {
        const weekEnd = endOfWeek(existing.week_end_date, { weekStartsOn: WEEK_CONFIG.startDay });
        const key = `${existing.week_start_date}_${format(weekEnd, 'yyyy-MM-dd')}`;
        if (weekIndex.has(key)) {
            weekIndex.set(key, { ...existing });
        }
    });

    /* ------------------------------------------------------------------ */
    /* 3. Partir semanas por mes y agrupar                                */
    /* ------------------------------------------------------------------ */
    const blocksByMonth: Record<number, WeeklyBlock[]> = {};
    let nextId = 1;

    const addToMonth = (piece: WeeklyBlock) => {
        const month = getMonth(parseISO(piece.week_start_date));

        if (month >= startDateMonth) {
            (blocksByMonth[month] ||= []).push({ ...piece, id_block: piece.id_block !== 0 ? piece.id_block : nextId++ });
        }
    };

    Array.from(weekIndex.values()).forEach(week => {
        const weekStart = parseISO(week.week_start_date);
        const weekEnd = endOfWeek(parseISO(week.week_end_date), { weekStartsOn: WEEK_CONFIG.startDay });

        // Recorrer cada mes que toca la semana
        let monthCursor = startOfMonth(weekStart);

        while (monthCursor <= weekEnd) {
            const monthEnd = endOfMonth(monthCursor);

            const sliceStart = monthCursor < weekStart ? weekStart : monthCursor;
            const sliceEnd = monthEnd > weekEnd ? weekEnd : monthEnd;

            if (isBefore(sliceStart, sliceEnd) || isSameDay(sliceStart, sliceEnd)) {
                addToMonth({
                    ...week,
                    week_start_date: format(sliceStart, 'yyyy-MM-dd'),
                    week_end_date: format(sliceEnd, 'yyyy-MM-dd'),
                });
            }

            monthCursor = addDays(monthEnd, 1);
        }
    });

    return blocksByMonth;
};