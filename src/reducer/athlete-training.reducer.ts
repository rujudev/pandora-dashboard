import { FullTrainingPlan } from "../interfaces/interfaces_compuestas.interface";
import { AthleteTrainingAction } from "../types/reducer/athlete-training-reducer-action";

export const initialAthleteTrainingState = {
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
    sessions: [],
    muscle_movements: []
}

export const athleteTrainingReducer = (state: FullTrainingPlan, action: AthleteTrainingAction) => {
    const { type, payload } = action;

    if (type === 'SET_DATE') {
        const { key, date } = payload
        return {
            ...state,
            [key]: date
        }
    }

    if (type === 'ADD_MOVEMENT') {
        const { id_movement, movement_name, weight_ref } = payload;
        const { muscle_movements: stateMuscleMovements } = state;

        return {
            ...state,
            muscle_movements: [
                ...stateMuscleMovements,
                { id_movement, movement_name, weight_ref }
            ]
        }
    }

    if (type === 'SET_MOVEMENT_WEIGHT') {
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

    if (type === 'REMOVE_MOVEMENT') {
        const { muscle_movements } = state;
        const { movementId } = payload;

        return {
            ...state,
            muscle_movements: muscle_movements.filter(movement => movement.id_movement !== movementId)
        }
    }

    if (type === 'ADD_SESSION') {
        const { sessions: trainingSessions } = state;
        const { session: newSession } = payload;

        return {
            ...state,
            sessions: [...trainingSessions, newSession]
        }
    }

    if (type === 'SET_SESSION_DAY_WEEK') {
        const { sessions } = state;
        const { sessionId, dayWeek } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
                if (session.id_session !== sessionId) return session;

                return {
                    ...session,
                    day_week: dayWeek
                }
            })
        }
    }

    if (type === 'SET_SESSION_DAY_PERIOD') {
        const { sessions } = state;
        const { sessionId, dayPeriod } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
                if (session.id_session !== sessionId) return session;

                return {
                    ...session,
                    day_period: dayPeriod
                }
            })
        }
    }

    if (type === 'ADD_SESSION_EXERCISE') { }

    if (type === 'SET_SESSION_EXERCISE_NAME') {
        const { sessions } = state;
        const { exerciseId, name, sessionId } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
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
            })
        }
    }

    if (type === 'SET_SESSION_EXERCISE_ABBREVIATION') {
        const { sessions } = state;
        const { exerciseId, abbreviation, sessionId } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
                if (session.id_session !== sessionId) return session;

                return {
                    ...session,
                    exercises: session.exercises.map(exercise => {
                        if (exercise.id_exercise !== exerciseId) return exercise;

                        return {
                            ...exercise,
                            abreviation: abbreviation
                        }
                    })
                }
            })
        }
    }

    if (type === 'SET_SESSION_EXERCISE_MOVEMENT') {
        const { sessions, muscle_movements } = state;
        const { sessionId, movementId, exerciseId } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
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
    }

    if (type === 'ADD_SESSION_EXERCISE_INTENSITY') { }

    if (type === 'SET_SESSION_EXERCISE_INTENSITY_SERIES') {
        const { sessions } = state;
        const { sessionId, exerciseId, intensityId, series } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
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
    }

    if (type === 'SET_SESSION_EXERCISE_INTENSITY_REPETITIONS') {
        const { sessions } = state;
        const { sessionId, exerciseId, intensityId, repetitions } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
                if (session.id_session !== sessionId) return session;

                return {
                    ...session,
                    exercises: session.exercises.map(exercise => {
                        if (exercise.id_exercise !== exerciseId) return exercise;

                        return {
                            ...exercise,
                            intensities: exercise.intensities.map(intensity => {
                                if (intensity.id_intensity === intensityId) return intensity;

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
    }

    if (type === 'SET_SESSION_EXERCISE_INTENSITY_SET_PERCENTAGE') {
        const { sessions } = state;
        const { sessionId, exerciseId, intensityId, setId, percentage } = payload;

        return {
            ...state,
            sessions: sessions.map(session => {
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
    }

    return state;
}