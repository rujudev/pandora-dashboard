import {
    addDays,
    addWeeks,
    endOfMonth,
    endOfWeek,
    format,
    getMonth,
    getYear,
    isAfter,
    isBefore,
    isSameDay,
    parseISO,
    startOfMonth,
    startOfWeek
} from "date-fns";
import { supabaseClient } from "../db/config";
import { ExerciseWithIntensity } from "../interfaces/exercise/exercise-with-intensity.interface";
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface";
import { Set } from "../interfaces/intensity/set.interface";
import { SessionWithExercisesAndIntensities } from "../interfaces/session/session-with-exercises-and-intensities.interface";
import { WeeklyBlock } from "../interfaces/session/weekly-blocks.interface";

/**
 * Cómo definimos una "semana" en la aplicación:
 *
 * - startDay: día en el que empieza la semana (0 = domingo, 1 = lunes, etc.).
 * - includeWeekends: si conceptualmente la semana incluye fines de semana (informativo).
 * - daysInWeek: número de días que abarca una semana lógica (normalmente 7).
 */
interface WeekDefinition {
    startDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    includeWeekends: boolean;
    daysInWeek: number;
}

/**
 * Configuración centralizada de la semana:
 *
 * - La semana empieza en lunes.
 * - Incluimos todos los días de la semana (7).
 */
const WEEK_CONFIG: WeekDefinition = {
    startDay: 1,          // Lunes
    includeWeekends: true,
    daysInWeek: 7
};

/**
 * Dada una fecha, devuelve el rango completo de la semana lógica que la contiene.
 *
 * - start: inicio de la semana (según WEEK_CONFIG.startDay).
 * - end: fin de la semana (start + daysInWeek - 1).
 */
const createWeekRange = (date: Date): { start: Date; end: Date } => {
    const start = startOfWeek(date, { weekStartsOn: WEEK_CONFIG.startDay });
    const end = addDays(start, WEEK_CONFIG.daysInWeek - 1);

    return { start, end };
};

/**
 * Función principal para generar bloques semanales (WeeklyBlock) que cubren
 * el rango [startDate, endDate].
 *
 * - Genera todas las semanas necesarias.
 * - Opcionalmente mezcla bloques existentes (existingBlocks) respetando sus sesiones.
 * - Opcionalmente asigna IDs secuenciales a los bloques que no tengan id_block.
 *
 * options:
 *  - preserveExisting: si es true, los bloques existentes sobrescriben a los generados.
 *  - assignIds: si es true, se asignan IDs secuenciales a los bloques sin id_block.
 */
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

    // Mapa clave → bloque semanal. La clave representa el rango de la semana dentro del entrenamiento.
    const allBlocks: Map<string, WeeklyBlock> = new Map();
    let blockId = 1;

    // Punto de partida: inicio de la semana que contiene startDate.
    let currentStart = startOfWeek(startDate, { weekStartsOn: WEEK_CONFIG.startDay });

    /**
     * 1) GENERAR TODAS LAS SEMANAS NECESARIAS PARA EL RANGO [startDate, endDate]
     */
    while (isBefore(currentStart, endDate) || isSameDay(currentStart, endDate)) {
        const { start, end } = createWeekRange(currentStart);

        // Ajustar la semana al rango [startDate, endDate] para no salirnos del entrenamiento.
        const adjustedStart = isBefore(start, startDate) ? startDate : start;
        const adjustedEnd = isAfter(end, endDate) ? endDate : end;

        // Clave única para esta semana dentro del rango.
        const key = `${format(adjustedStart, 'yyyy-MM-dd')}_${format(adjustedEnd, 'yyyy-MM-dd')}`;

        // Si no existe aún un bloque para esta clave, lo creamos.
        if (!allBlocks.has(key)) {
            // Claves de los bloques existentes (para saber si esta semana ya existía).
            const existingBlocksKeys = existingBlocks.map(block =>
                `${format(block.week_start_date, 'yyyy-MM-dd')}_${format(block.week_end_date, 'yyyy-MM-dd')}`
            );
            const isNewBlock = !existingBlocksKeys.some(blockKey => blockKey.includes(key));

            allBlocks.set(key, {
                id_block: assignIds ? blockId++ : undefined,
                is_active: false,
                sessions: [],
                week_start_date: format(adjustedStart, 'yyyy-MM-dd'),
                week_end_date: format(adjustedEnd, 'yyyy-MM-dd'),
                // Marcamos como nuevo si no se ha encontrado ninguna coincidencia en existingBlocks
                ...(isNewBlock && { is_new: true })
            });
        }

        // Avanzamos a la siguiente semana lógica.
        currentStart = addWeeks(currentStart, 1);
    }

    /**
     * 2) MEZCLAR BLOQUES EXISTENTES (SI preserveExisting ES TRUE)
     *
     * Si existen bloques previos (p.ej. desde la BD), queremos:
     * - Mantener sus sesiones y metadatos.
     * - Ajustar su rango de semana al rango [startDate, endDate].
     * - Encajarlos dentro de la estructura generada.
     */
    if (preserveExisting) {
        existingBlocks.forEach(block => {
            const originalStart = parseISO(block.week_start_date);

            // const blockStart = parseISO(block.week_start_date);
            // const blockEnd = parseISO(block.week_end_date);

            const { start: blockStart, end: blockEnd } = createWeekRange(originalStart);

            // 2) Recortar el bloque al nuevo rango por seguridad
            const adjustedStart = isBefore(blockStart, startDate) ? startDate : blockStart;
            const adjustedEnd = isAfter(blockEnd, endDate) ? endDate : blockEnd;

            // 3) Si después de recortar start > end (caso 19–16 que ves en la tabla), también lo ignoramos.
            if (isAfter(adjustedStart, adjustedEnd)) return;

            // Semana lógica completa del bloque original (por configuración).
            // const monday = startOfWeek(blockStart, { weekStartsOn: WEEK_CONFIG.startDay });
            // const sunday = addDays(monday, WEEK_CONFIG.daysInWeek - 1);

            // Ajustamos esta semana al rango del entrenamiento.
            // const newStart = isBefore(monday, startDate) ? startDate : monday;
            // const newEnd = isAfter(sunday, endDate) ? endDate : sunday;

            const key = `${format(adjustedStart, "yyyy-MM-dd")}_${format(adjustedEnd, "yyyy-MM-dd")}`;

            const existing = allBlocks.get(key);

            allBlocks.set(key, {
                ...(existing ?? {}),
                ...block,
                week_start_date: format(adjustedStart, "yyyy-MM-dd"),
                week_end_date: format(adjustedEnd, "yyyy-MM-dd"),
            });

            // const key = `${format(newStart, 'yyyy-MM-dd')}_${format(newEnd, 'yyyy-MM-dd')}`;
            // allBlocks.set(key, {
            //     ...block,
            //     week_start_date: format(newStart, 'yyyy-MM-dd'),
            //     week_end_date: format(newEnd, 'yyyy-MM-dd'),
            // });
        });
    }

    /**
     * 3) DEVOLVER LOS BLOQUES ORDENADOS Y CON id_block CONSISTENTE
     *
     * - Ordenamos por fecha de inicio.
     * - Si assignIds es true y el bloque no tiene id_block, le asignamos uno secuencial.
     */
    return Array.from(allBlocks.values())
        .sort((a, b) => a.week_start_date.localeCompare(b.week_start_date))
        .map((block, index) => ({
            ...block,
            id_block: !block.id_block ? index + 1 : block.id_block
        }));
};

/**
 * Versión simplificada para frontend:
 * - No recibe bloques existentes.
 * - Siempre asigna IDs.
 * - preserveExisting se deja true por consistencia/futuras ampliaciones.
 */
export const generateWeeklyBlocksForFrontend = (
    startDate: Date,
    endDate: Date
): WeeklyBlock[] => {
    return generateWeeklyBlocks(startDate, endDate, [], {
        assignIds: true,
        preserveExisting: true
    });
};

/**
 * Helper para el caso típico de actualizar bloques ya guardados:
 * - Completa semanas que falten entre startDate y endDate.
 * - Respeta las semanas que ya existen (sus sesiones y flags).
 * - Asigna IDs a los bloques nuevos.
 */
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
 * Genera todos los bloques necesarios para cubrir ÍNTEGRAMENTE los meses
 * comprendidos entre `startDate` y `endDate`, partiendo las semanas que
 * crucen límites de mes y preservando las sesiones de los bloques ya existentes.
 *
 * Pensado para construir una vista mensual (tipo calendario), donde:
 * - Se generan semanas completas que cubren todos los días de los meses implicados.
 * - Si una semana cruza de un mes a otro, se parte en "trozos" por mes.
 * - El resultado se agrupa por número de mes (0-11).
 *
 * El rango de entrenamiento real (startDate/endDate) se usa aquí solo para
 * determinar qué meses completos se abarcan; la lógica visual de "día dentro
 * o fuera de rango" se controla en el frontend.
 *
 * Devuelve:
 *  - Un objeto cuya clave es el número de mes (0-11) y cuyo valor es el listado
 *    de bloques que cubren ese mes.
 */
export const generateMonthBlocks = (
    startDate: Date,
    endDate: Date,
    updatedBlocks: WeeklyBlock[] = []
): Record<string, WeeklyBlock[]> => {
    // Índice de semanas completas (lunes–domingo) que cubren todos los meses deseados.
    const weekIndex = new Map<string, WeeklyBlock>();

    // Rango REAL de meses que queremos cubrir: desde el primer día del mes de startDate
    // hasta el último día del mes de endDate.
    const firstMonthDate = startOfMonth(startDate);
    const lastMonthDate = endOfMonth(endDate);

    /**
     * 1) CREAR TODAS LAS SEMANAS COMPLETAS QUE CUBRAN EL RANGO DE MESES
     *
     * Desde el inicio de la semana que contiene el primer día de firstMonthDate,
     * hasta el final de la semana que contiene el último día de lastMonthDate.
     */
    let cursor = startOfWeek(firstMonthDate, { weekStartsOn: WEEK_CONFIG.startDay });
    const limit = endOfWeek(lastMonthDate, { weekStartsOn: WEEK_CONFIG.startDay });

    while (isBefore(cursor, limit) || isSameDay(cursor, limit)) {
        const weekStart = cursor;
        const weekEnd = endOfWeek(cursor, { weekStartsOn: WEEK_CONFIG.startDay });
        const key = `${format(weekStart, 'yyyy-MM-dd')}_${format(weekEnd, 'yyyy-MM-dd')}`;

        // Inicialmente, estas semanas no tienen sesiones asociadas.
        weekIndex.set(key, {
            id_block: 0,
            is_active: false,
            sessions: [],
            week_start_date: format(weekStart, 'yyyy-MM-dd'),
            week_end_date: format(weekEnd, 'yyyy-MM-dd'),
        });

        // Avanzamos a la siguiente semana lógica.
        cursor = addWeeks(cursor, 1);
    }

    /**
     * 2) COPIAR LAS SESIONES DE LOS BLOQUES EXISTENTES EN weekIndex
     *
     * Para cada bloque de updatedBlocks:
     * - Calculamos su semana lógica completa (mismo criterio de startOfWeek/endOfWeek).
     * - Si esa semana existe en weekIndex, sustituimos el bloque vacío por el existente.
     */
    updatedBlocks.forEach(existing => {
        const originalStart = parseISO(existing.week_start_date);
        const weekStart = startOfWeek(originalStart, { weekStartsOn: WEEK_CONFIG.startDay });
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: WEEK_CONFIG.startDay });
        const key = `${format(weekStart, "yyyy-MM-dd")}_${format(weekEnd, "yyyy-MM-dd")}`;

        if (weekIndex.has(key)) {
            weekIndex.set(key, {
                ...existing,
                week_start_date: format(weekStart, "yyyy-MM-dd"),
                week_end_date: format(weekEnd, "yyyy-MM-dd"),
            });
        }
    });

    /**
     * 3) PARTIR CADA SEMANA POR LÍMITES DE MES Y AGRUPAR POR MES
     *
     * - Para cada semana de weekIndex, calculamos los "trozos" que caen en cada mes.
     * - Por ejemplo, una semana 29 jun – 5 jul se parte en:
     *   - trozo 29–30 jun (mes junio)
     *   - trozo 1–5 jul (mes julio)
     * - Cada trozo se añade al mes correspondiente en blocksByMonth.
     */
    const blocksByMonth: Record<string, WeeklyBlock[]> = {};
    let nextId = 1;

    /**
     * Añade un bloque (o trozo de semana) al mes correspondiente, siempre que
     * esté dentro del rango global de meses [firstMonthDate, lastMonthDate].
     */
    const addToMonth = (piece: WeeklyBlock) => {
        const pieceStart = parseISO(piece.week_start_date);

        // Filtro de seguridad para evitar piezas fuera de los meses que nos interesan.
        if (isBefore(pieceStart, firstMonthDate) || isAfter(parseISO(piece.week_end_date), lastMonthDate)) return;

        const year = getYear(pieceStart);
        const month = getMonth(pieceStart);
        const key = `${year}-${String(month).padStart(2, '0')}`; // clave "YYYY-MM"

        console.log(piece.id_block, nextId++);

        (blocksByMonth[key] ||= []).push({
            ...piece,
            // Si no tiene id_block (o es 0), le asignamos un id incremental local.
            id_block: piece.id_block !== 0 && piece.id_block !== nextId ? piece.id_block : nextId++
        });
    };

    // Recorremos todas las semanas completas generadas en weekIndex.
    Array.from(weekIndex.values()).forEach(week => {
        const weekStart = parseISO(week.week_start_date);
        const weekEnd = endOfWeek(parseISO(week.week_end_date), { weekStartsOn: WEEK_CONFIG.startDay });

        // monthCursor recorre los meses que toca la semana actual.
        let monthCursor = startOfMonth(weekStart);

        while (monthCursor <= weekEnd) {
            const monthEnd = endOfMonth(monthCursor);

            // sliceStart: primer día de la semana dentro de este mes.
            const sliceStart = monthCursor < weekStart ? weekStart : monthCursor;
            // sliceEnd: último día de la semana dentro de este mes.
            const sliceEnd = monthEnd > weekEnd ? weekEnd : monthEnd;

            // Solo añadimos el trozo si tiene al menos un día.
            if (isBefore(sliceStart, sliceEnd) || isSameDay(sliceStart, sliceEnd)) {
                addToMonth({
                    ...week,
                    week_start_date: format(sliceStart, 'yyyy-MM-dd'),
                    week_end_date: format(sliceEnd, 'yyyy-MM-dd'),
                });
            }

            // Saltamos al siguiente mes (día siguiente al final del mes actual).
            monthCursor = addDays(monthEnd, 1);
        }
    });

    // Resultado: objeto con clave = mes (0-11) y valor = array de bloques de ese mes.
    return blocksByMonth;
};

type ReplaceTrainingWeeklyStructureParams = {
    idTraining: number;
    weeklyBlocks: WeeklyBlock[];
};

/**
 * Borra toda la estructura de semanas/sesiones/ejercicios de un training
 * y la vuelve a crear desde cero usando `weeklyBlocks`.
 *
 * NO toca la tabla `exercises` ni borra intensidades globales;
 * solo elimina datos ligados a las sesiones de este training.
 */
export const replaceTrainingWeeklyStructure = async ({
    idTraining,
    weeklyBlocks,
}: ReplaceTrainingWeeklyStructureParams): Promise<void> => {
    // 1) obtener bloques actuales del training
    const { data: existingBlocks, error: selBlocksError } = await supabaseClient
        .from("weekly_blocks")
        .select("id_block")
        .eq("id_training", idTraining);

    debugger;
    if (selBlocksError) throw selBlocksError;

    const blockIds = (existingBlocks ?? []).map((b) => b.id_block);

    if (blockIds.length > 0) {
        // 1.1) obtener sesiones de esos bloques
        const { data: sessions, error: selSessionsError } = await supabaseClient
            .from("sessions")
            .select("id_session")
            .in("id_block", blockIds);

        if (selSessionsError) throw selSessionsError;

        const sessionIds = (sessions ?? []).map((s) => s.id_session);

        if (sessionIds.length > 0) {
            // borrar exercise_session_movement
            const { error: delESM } = await supabaseClient
                .from("exercise_session_movement")
                .delete()
                .in("id_session", sessionIds);
            if (delESM) throw delESM;

            // borrar exercise_session
            const { error: delES } = await supabaseClient
                .from("exercise_session")
                .delete()
                .in("id_session", sessionIds);
            if (delES) throw delES;

            // borrar sessions
            const { error: delSessions } = await supabaseClient
                .from("sessions")
                .delete()
                .in("id_session", sessionIds);
            if (delSessions) throw delSessions;
        }

        // borrar weekly_blocks
        const { error: delBlocks } = await supabaseClient
            .from("weekly_blocks")
            .delete()
            .in("id_block", blockIds);

        debugger;
        if (delBlocks) throw delBlocks;
    }

    debugger;
    // 2) recrear toda la estructura con los bloques actuales
    await addWeeklyBlocksForTraining(weeklyBlocks, idTraining);
};

/**
 * Inserta bloques y TODA la cascada para un training:
 * - weekly_blocks
 * - sessions
 * - exercise_session
 * - exercise_session_movement
 * - intensity / intensity_exercise / set
 *
 * Asume que `ExerciseWithIntensity.id_exercise` ya existe en `exercises`
 * (no crea ejercicios nuevos).
 */
export const addWeeklyBlocksForTraining = async (
    blocks: WeeklyBlock[],
    idTraining: number
): Promise<void> => {
    debugger;
    if (!blocks.length) return;

    // 1) weekly_blocks
    const weeklyRows = blocks.map((b) => ({
        id_training: idTraining,
        week_start_date: b.week_start_date,
        week_end_date: b.week_end_date,
        is_active: b.is_active,
    }));

    const { data: insertedBlocks, error: blocksError } = await supabaseClient
        .from("weekly_blocks")
        .insert(weeklyRows)
        .select("id_block, week_start_date, week_end_date");

    debugger;
    if (blocksError) throw blocksError;

    const blockIdMap = new Map<string, number>(); // "start_end" → id_block
    insertedBlocks.forEach((b) => {
        const key = `${b.week_start_date}_${b.week_end_date}`;
        blockIdMap.set(key, b.id_block);
    });

    // 2) sessions
    type LocalSession = {
        localKey: string;
        day_week: SessionWithExercisesAndIntensities["day_week"];
        day_period: SessionWithExercisesAndIntensities["day_period"];
        id_block: number;
    };

    const sessionsToInsert: LocalSession[] = [];

    blocks.forEach((block) => {
        const blockKey = `${block.week_start_date}_${block.week_end_date}`;
        const realBlockId = blockIdMap.get(blockKey);
        if (!realBlockId) return;

        block.sessions.forEach((session) => {
            const localKey = `${session.day_week}_${session.day_period}_${blockKey}`;
            sessionsToInsert.push({
                localKey,
                day_week: session.day_week,
                day_period: session.day_period,
                id_block: realBlockId,
            });
        });
    });

    const { data: insertedSessions, error: sessionsError } = await supabaseClient
        .from("sessions")
        .insert(
            sessionsToInsert.map((s) => ({
                id_training: idTraining,
                id_block: s.id_block,
                day_week: s.day_week,
                day_period: s.day_period,
            }))
        )
        .select("id_session, day_week, day_period, id_block");

    debugger;
    if (sessionsError) throw sessionsError;

    const sessionIdMap = new Map<string, number>(); // localKey → id_session
    insertedSessions.forEach((s) => {
        const block = insertedBlocks.find((b) => b.id_block === s.id_block);
        if (!block) return;
        const blockKey = `${block.week_start_date}_${block.week_end_date}`;
        const localKey = `${s.day_week}_${s.day_period}_${blockKey}`;
        sessionIdMap.set(localKey, s.id_session);
    });

    // 3) exercise_session, exercise_session_movement, intensidades
    const exerciseSessionRows: { id_session: number; id_exercise: number }[] = [];
    const exerciseSessionMovements: {
        id_session: number;
        id_exercise: number;
        id_movement: number;
    }[] = [];

    const intensitiesToInsert: { zone: string }[] = [];
    type LocalIntensityKey = string; // `${sessionKey}_${id_exercise}_${idx}`
    const intensityExerciseRows: {
        localKey: LocalIntensityKey;
        id_exercise: number;
        series: number;
        repetitions: number;
    }[] = [];
    const setsToInsert: {
        localKey: LocalIntensityKey;
        percentage: number;
    }[] = [];

    blocks.forEach((block) => {
        const blockKey = `${block.week_start_date}_${block.week_end_date}`;

        block.sessions.forEach((session) => {
            const sessionKey = `${session.day_week}_${session.day_period}_${blockKey}`;
            const realSessionId = sessionIdMap.get(sessionKey);
            if (!realSessionId) return;

            session.exercises.forEach(
                (ex: ExerciseWithIntensity, exIdx: number) => {
                    debugger;
                    if (!ex.id_exercise) return;

                    // exercise_session
                    exerciseSessionRows.push({
                        id_session: realSessionId,
                        id_exercise: ex.id_exercise,
                    });

                    // exercise_session_movement
                    if (ex.id_movement) {
                        exerciseSessionMovements.push({
                            id_session: realSessionId,
                            id_exercise: ex.id_exercise,
                            id_movement: ex.id_movement,
                        });
                    }

                    // intensidades
                    ex.intensities.forEach(
                        (
                            intensity: IntensityWithSeriesRepetitionsZoneAndSets,
                            iIdx: number
                        ) => {
                            const localKey: LocalIntensityKey =
                                `${sessionKey}_${ex.id_exercise}_${exIdx}_${iIdx}`;

                            intensitiesToInsert.push({ zone: intensity.zone });

                            intensityExerciseRows.push({
                                localKey,
                                id_exercise: ex.id_exercise!,
                                series: intensity.series,
                                repetitions: intensity.repetitions,
                            });

                            intensity.sets.forEach((s: Set) => {
                                setsToInsert.push({
                                    localKey,
                                    percentage: s.percentage,
                                });
                            });
                        }
                    );
                }
            );
        });
    });

    if (exerciseSessionRows.length > 0) {
        const { error: esError } = await supabaseClient
            .from("exercise_session")
            .insert(exerciseSessionRows);
        if (esError) throw esError;
    }

    if (exerciseSessionMovements.length > 0) {
        const { error: esmError } = await supabaseClient
            .from("exercise_session_movement")
            .insert(exerciseSessionMovements);
        if (esmError) throw esmError;
    }

    // 4) intensity, intensity_exercise, set
    if (intensitiesToInsert.length > 0) {
        const { data: insertedIntensities, error: iError } = await supabaseClient
            .from("intensity") // según tu esquema
            .insert(intensitiesToInsert)
            .select("id_intensity");

        if (iError) throw iError;

        const intensityIdMap = new Map<LocalIntensityKey, number>();
        intensityExerciseRows.forEach((row, idx) => {
            const intensity = insertedIntensities[idx];
            intensityIdMap.set(row.localKey, intensity.id_intensity);
        });

        const intensityExerciseToInsert = intensityExerciseRows.map((row) => ({
            id_intensity: intensityIdMap.get(row.localKey)!,
            id_exercise: row.id_exercise,
            series: row.series,
            repetitions: row.repetitions,
        }));

        const { error: ieError } = await supabaseClient
            .from("intensity_exercise")
            .insert(intensityExerciseToInsert);

        debugger;
        if (ieError) throw ieError;

        const setsRows = setsToInsert.map((s) => ({
            id_intensity: intensityIdMap.get(s.localKey)!,
            percentage: s.percentage,
        }));

        if (setsRows.length > 0) {
            const { error: setError } = await supabaseClient.from("set").insert(setsRows);
            if (setError) throw setError;
        }
    }
};