import { parseISO } from "date-fns";
import { Athlete } from "../interfaces/athlete/athlete.interface";
import { WeeklyBlock } from "../interfaces/session/weekly-blocks.interface";
import { FullTrainingPlan } from "../interfaces/training/full-training-plan.interface";
import { ATHLETE_TRAINING_ACTION_TYPE, AthleteTrainingAction } from "../types/reducer/athlete-training-reducer-action";
import { updateWeeklyBlocksPreservingExisting } from "../utils/weeklyBlocks";

export const initialAthleteTrainingState: FullTrainingPlan & Partial<Athlete> = {
    id_athlete: 0,
    first_name: "",
    last_name: "",
    category_weight: 0,
    birth_day: "",
    sport: "",
    team: "",
    thumbnail: "",
    id_training: 0,
    start_date: "",
    end_date: "",
    period: "",
    week_type: "",
    weekly_blocks: [],
    muscle_movements: []
}

export const athleteTrainingReducer = (state: FullTrainingPlan & Partial<Athlete> | null, action: AthleteTrainingAction) => {
    const { type, payload } = action;

    if (!state && type === ATHLETE_TRAINING_ACTION_TYPE.INIT) {
        const { training: initialTraining } = payload;

        return initialTraining;
    }


    if (state) {
        /* -------------------------------------------------------------- */
        /* Date                                                           */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.DATE.SET) {
            const { key, date } = payload
            return {
                ...state,
                [key]: date
            }
        }

        /* -------------------------------------------------------------- */
        /* MOVEMENT                                                       */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.ADD) {
            const { id_movement, movement_name, weight_ref } = payload;
            const { muscle_movements: stateMuscleMovements } = state;

            return {
                ...state,
                muscle_movements: [
                    ...stateMuscleMovements,
                    { id_movement, movement_name, weight_ref, is_new_assigned: true }
                ]
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.SET.WEIGHT) {
            const { muscle_movements } = state;
            const { movementId, weight } = payload;

            return {
                ...state,
                muscle_movements: muscle_movements.map(movement =>
                    movement.id_movement === movementId
                        ? { ...movement, weight_ref: weight }
                        : movement
                )
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.REMOVE) {
            const { muscle_movements } = state;
            const { movementId } = payload;

            return {
                ...state,
                muscle_movements: muscle_movements.filter(movement => movement.id_movement !== movementId)
            }
        }

        /* -------------------------------------------------------------- */
        /* Weekly Block                                                   */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.INITIAL_END_DATE) {
            const { weekly_blocks: stateWeeklyBlocks, start_date, end_date } = state;
            const weeklyBlocksData: WeeklyBlock[] = updateWeeklyBlocksPreservingExisting(
                parseISO(start_date),
                parseISO(end_date),
                stateWeeklyBlocks
            );

            return {
                ...state,
                weekly_blocks: weeklyBlocksData
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.BLOCKS) {
            const { weekly_blocks: updatedWeeklyBlocks } = payload;

            return {
                ...state,
                weekly_blocks: updatedWeeklyBlocks
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.SET.ACTIVE) {
            const { weekly_blocks } = state;
            const { blockId, isActive } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        is_active: isActive
                    }
                })
            }
        }

        /* -------------------------------------------------------------- */
        /* Session                                                        */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.SESSION.ADD) {
            const { weekly_blocks: trainingWeeklyBlocks } = state;
            const { block, session: newSession } = payload;

            return {
                ...state,
                weekly_blocks: !block.is_new
                    ? trainingWeeklyBlocks.map(trainingBlock => {
                        if (trainingBlock.id_block !== block.id_block) return trainingBlock;

                        return {
                            ...block,
                            id_block: trainingBlock.id_block,
                            sessions: [
                                ...block.sessions,
                                newSession
                            ]
                        }
                    }) : trainingWeeklyBlocks.map(trainingBlock => {
                        if (trainingBlock.id_block !== block.id_block) return trainingBlock;

                        return {
                            ...trainingBlock,
                            sessions: [
                                ...block.sessions,
                                newSession
                            ]
                        }
                    })
            }
        }

        // if (type === ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_WEEK) {
        //     const { weekly_blocks } = state;
        //     const { blockId, sessionId, dayWeek } = payload;

        // }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_PERIOD) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, dayPeriod } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                day_period: dayPeriod
                            }
                        })
                    }
                })
            }
        }

        /* -------------------------------------------------------------- */
        /* Exercise                                                       */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.ADD) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exercise } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: [
                                    ...session.exercises,
                                    // { ...exercise, id_exercise: session.exercises.length + 1, is_new: true }
                                    exercise
                                ]
                            }
                        }),
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.UPDATE) {
            const { blockId, sessionId, exercise } = payload;

            return {
                ...state,
                weekly_blocks: state.weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;
                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;
                            return {
                                ...session,
                                exercises: session.exercises.map(prev =>
                                    prev.id_exercise === exercise.id_exercise ? exercise : prev
                                ),
                            };
                        }),
                    };
                }),
            };
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.REMOVE) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises
                                    .filter(exercise => exercise.id_exercise !== exerciseId)
                            }
                        })
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.NAME) {
            const { weekly_blocks } = state;
            const { blockId, exerciseId, name, sessionId } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        exercise_name: name
                                    }
                                })
                            }
                        }),
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.ABBR) {
            const { weekly_blocks } = state;
            const { blockId, exerciseId, abbreviation, sessionId } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        abreviation: abbreviation,
                                    }
                                })
                            }
                        }),
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.MOVEMENT) {
            const { weekly_blocks, muscle_movements } = state;
            const { blockId, sessionId, movementId, exerciseId } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: exercise.intensities.map(intensity => {
                                            const movementWeightRef = muscle_movements.find(movement => movement.id_movement === movementId)?.weight_ref || 0;

                                            return {
                                                ...intensity,
                                                sets: intensity.sets.map(set => ({
                                                    ...set,
                                                    weight: (set?.percentage / 100) * movementWeightRef
                                                }))
                                            }
                                        }),
                                        id_movement: movementId
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        /* -------------------------------------------------------------- */
        /* Intensity                                                      */
        /* -------------------------------------------------------------- */

        if (type === ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.ADD) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId, intensity } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: [
                                            ...exercise.intensities,
                                            intensity
                                        ]
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.REMOVE) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId, intensityId } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: exercise.intensities.filter(intensity => intensity.id_intensity !== intensityId)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.SERIES) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId, intensityId, series } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: exercise.intensities.map(intensity => {
                                            if (intensity.id_intensity !== intensityId) return intensity;

                                            // En este punto se pretende ajustar los sets dependiendo de las series introducidas
                                            const sets = series < intensity.sets.length
                                                ? intensity.sets.slice(0, series)
                                                : [
                                                    ...intensity.sets,
                                                    ...Array.from({ length: series - intensity.sets.length }).fill(null).map(() => ({
                                                        id_set: intensity.sets.length + 1,
                                                        percentage: 0,
                                                        weight: 0
                                                    }))
                                                ]

                                            return {
                                                ...intensity,
                                                sets,
                                                series
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.REPS) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId, intensityId, repetitions } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: exercise.intensities.map(intensity => {
                                            if (intensity.id_intensity !== intensityId) return intensity;

                                            return {
                                                ...intensity,
                                                repetitions
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        if (type === ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.PERCENT) {
            const { weekly_blocks } = state;
            const { blockId, sessionId, exerciseId, intensityId, setId, percentage } = payload;

            return {
                ...state,
                weekly_blocks: weekly_blocks.map(block => {
                    if (block.id_block !== blockId) return block;

                    return {
                        ...block,
                        sessions: block.sessions.map(session => {
                            if (session.id_session !== sessionId) return session;

                            return {
                                ...session,
                                exercises: session.exercises.map(exercise => {
                                    if (exercise.id_exercise !== exerciseId) return exercise;

                                    return {
                                        ...exercise,
                                        intensities: exercise.intensities.map(intensity => {
                                            if (intensity.id_intensity !== intensityId) return intensity;

                                            return {
                                                ...intensity,
                                                sets: intensity.sets.map(set => {
                                                    if (set.id_set !== setId) return set;

                                                    return {
                                                        ...set,
                                                        percentage
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    }

    return state;
}