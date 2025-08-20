import { supabaseClient } from "../db/config";
import { Exercise } from "../interfaces/exercise/exercise.interface";
import { WeeklyBlock } from "../interfaces/session/weekly-blocks.interface";
import { insertRows, updateRows } from "./supabase";

const getWeeklyBlocksTable = (blocks: WeeklyBlock[], trainingId?: number) => ([
    ...new Map(
        blocks.map(b => [
            b.id_block,
            {
                id_block: b.id_block,
                id_training: trainingId,
                week_start_date: b.week_start_date,
                week_end_date: b.week_end_date,
                is_active: b.is_active,
            },
        ])
    ).values(),
])

const getSessionsTable = (blocks: WeeklyBlock[], trainingId?: number) => ([
    ...new Map(
        blocks
            .flatMap(b =>
                b.sessions
                    .map(s => [
                        s.id_session,
                        {
                            id_session: s.id_session,
                            id_training: trainingId,
                            id_block: b.id_block,
                            day_week: s.day_week,
                            day_period: s.day_period,
                        },
                    ])
            )
    ).values(),
])

const getExercisesTable = (blocks: WeeklyBlock[], isNew: boolean = false) => ([
    ...new Map(
        blocks
            .flatMap(b =>
                b.sessions.flatMap(s =>
                    s.exercises
                        .filter(e => e.is_new === isNew)
                        .map(e => [
                            e.id_exercise,
                            {
                                id_exercise: e.id_exercise,
                                exercise_name: e.exercise_name,
                                remarks: e.remarks,
                                abreviation: e.abreviation,
                            },
                        ])
                )
            )
    ).values(),
])

const getIntensitiesTable = (blocks: WeeklyBlock[], isNew: boolean = false) => ([
    ...new Map(
        blocks
            .flatMap(b =>
                b.sessions.flatMap(s =>
                    s.exercises.flatMap(e =>
                        e.intensities
                            .filter(i => i.is_new === isNew)
                            .map(i => [
                                i.id_intensity,
                                {
                                    id_intensity: i.id_intensity,
                                    zone: i.zone,
                                },
                            ])
                    )
                )
            )
    ).values(),
])

type ExerciseSessionMovement = {
    id_exercise: number;
    id_session: number;
    id_movement: number;
}

export async function addWeeklyBlocks(blocks: WeeklyBlock[], trainingId?: number): Promise<Partial<WeeklyBlock>[]> {
    if (blocks.length === 0) return [];

    /* ***************************************************** */
    /* 1. Insertar bloques y mapear IDs temporales a reales  */
    /* ***************************************************** */
    const blocksToInsert = blocks.map(({ id_block, sessions, is_new, ...rest }) => ({ ...rest, id_training: trainingId }));
    const insertedBlocks: Omit<WeeklyBlock, 'sessions'>[] = await insertRows('weekly_blocks', blocksToInsert);

    // Mapeo: week_start_date + week_end_date => id_block real
    const blockIdMap = new Map<string, number>();
    insertedBlocks.forEach(b => {
        blockIdMap.set(`${b.week_start_date}_${b.week_end_date}`, b.id_block!);
    });

    /* ***************************************************** */
    /* 2. Insertar sesiones y mapear IDs temporales a reales */
    /* ***************************************************** */
    const sessionsToInsert = blocks.flatMap(block =>
        block.sessions.map(session => ({
            ...session,
            id_block: blockIdMap.get(`${block.week_start_date}_${block.week_end_date}`),
            id_training: trainingId,
        }))
    );
    const insertedSessions = await insertRows('sessions', sessionsToInsert);

    // Mapeo: day_week + day_period + id_block real => id_session real
    const sessionIdMap = new Map<string, number>();
    insertedSessions.forEach(s => {
        sessionIdMap.set(`${s.day_week}_${s.day_period}_${s.id_block}`, s.id_session!);
    });

    /* ***************************************************** */
    /* 3. Insertar ejercicios nuevos y mapear por nombre     */
    /* ***************************************************** */
    const exercisesToInsert = blocks.flatMap(block =>
        block.sessions.flatMap(session =>
            session.exercises.filter(e => e.is_new).map(e => ({
                exercise_name: e.exercise_name,
                remarks: e.remarks,
                abreviation: e.abreviation,
            }))
        )
    );

    // Evitar duplicados por nombre
    const existingExercises = await supabaseClient.from('exercises').select('exercise_name');
    const uniqueExercises = exercisesToInsert.filter(
        e => !existingExercises.data?.some(ex => ex.exercise_name.toLowerCase() === e.exercise_name.toLowerCase())
    );

    const insertedExercises: Omit<Exercise, 'id_movement'>[] = uniqueExercises.length > 0
        ? await insertRows('exercises', uniqueExercises)
        : [];

    // Mapeo: exercise_name => id_exercise real
    const exerciseIdMap = new Map<string, number>();
    insertedExercises.forEach(e => {
        exerciseIdMap.set(e.exercise_name.toLowerCase(), e.id_exercise!);
    });

    /* ***************************************************** */
    /* 4. Insertar relaciones ejercicio-sesión-movimiento    */
    /* ***************************************************** */
    const exerciseSessionMovements: ExerciseSessionMovement[] = [];
    blocks.forEach(block => {
        const realBlockId = blockIdMap.get(`${block.week_start_date}_${block.week_end_date}`);
        block.sessions.forEach(session => {
            const realSessionId = sessionIdMap.get(`${session.day_week}_${session.day_period}_${realBlockId}`);
            session.exercises.forEach(exercise => {
                const realExerciseId = exerciseIdMap.get(exercise.exercise_name.toLowerCase());
                if (realSessionId && realExerciseId) {
                    exerciseSessionMovements.push({
                        id_exercise: realExerciseId,
                        id_session: realSessionId,
                        id_movement: exercise.id_movement,
                    });
                }
            });
        });
    });
    await insertRows('exercise_session_movement', exerciseSessionMovements);

    /* ***************************************************** */
    /* 5. Insertar intensidades nuevas                       */
    /* ***************************************************** */
    const intensitiesToInsert = blocks.flatMap(block =>
        block.sessions.flatMap(session =>
            session.exercises.flatMap(exercise =>
                exercise.intensities.filter(i => i.is_new).map(i => ({
                    zone: i.zone,
                }))
            )
        )
    );

    if (intensitiesToInsert.length > 0) {
        await insertRows('intensities', intensitiesToInsert);
    }

    // Devuelve los bloques insertados (puedes adaptar el retorno según lo que necesites)
    return insertedBlocks;
}

export async function updateWeeklyBlocks(blocks: WeeklyBlock[], trainingId?: number) {
    if (blocks.length === 0) return;

    // 1. weekly_blocks
    const weeklyBlocksTable = getWeeklyBlocksTable(blocks, trainingId);

    await updateRows('weekly_blocks', weeklyBlocksTable, 'id_block');

    // 2. sessions
    const sessionsTable = getSessionsTable(blocks, trainingId);
    await updateRows('sessions', sessionsTable, 'id_session');

    // 3. exercises
    const exercisesTable = [
        ...new Map(
            blocks
                .flatMap(b =>
                    b.sessions.flatMap(s =>
                        s.exercises.map(e => [
                            e.id_exercise,
                            {
                                id_exercise: e.id_exercise,
                                exercise_name: e.exercise_name,
                                remarks: e.remarks,
                                abreviation: e.abreviation,
                                id_movement: e.id_movement,
                            },
                        ])
                    )
                )
        ).values()
    ];
    await updateRows('exercises', exercisesTable, 'id_exercise');

    // exercise_session
    const exercisesSessionTable = [
        ...new Map(
            blocks
                .flatMap(b =>
                    b.sessions.flatMap(s =>
                        s.exercises.map(e => [
                            e.id_exercise,
                            {
                                id_exercise: e.id_exercise,
                                id_session: s.id_session,
                            },
                        ])
                    )
                )
        ).values()
    ];
    await updateRows('exercise_session', exercisesSessionTable, 'id_exercise');

    // intensities
    const intensitiesTable = [
        ...new Map(
            blocks
                .flatMap(b =>
                    b.sessions.flatMap(s =>
                        s.exercises.flatMap(e =>
                            e.intensities.map(i => [
                                i.id_intensity,
                                {
                                    id_intensity: i.id_intensity,
                                    zone: i.zone,
                                },
                            ])
                        )
                    )
                )
        ).values()
    ];

    await updateRows('intensities', intensitiesTable, 'id_intensity');

    // sets
    // const setsTable = [
    //     ...new Map(
    //         blocks
    //             .flatMap(b =>
    //                 b.sessions.flatMap(s =>
    //                     s.exercises.flatMap(e =>
    //                         e.intensities.map(i => 
    //                             i.sets.map(set => [
    //                                 set.id_set,
    //                                 {
    //                                     id_intensity: i.id_intensity
    //                                 }
    //                             ])
    //                         )
    //                     )
    //                 )
    //             )
    //     ).values()
    // ];
    // intensity_exercise
    // const allIntensities = allExercises.flatMap(e => e.intensities);
    // await updateRows('intensity_exercise', allIntensities, 'id_intensity');

    // sets
    // const allSets = allIntensities.flatMap(i => i.sets);
    // await updateRows('sets', allSets, 'id_set');
}