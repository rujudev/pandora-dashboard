import { ExerciseWithIntensity, IntensityWithSeriesRepetitionsZoneAndSets, SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { DayPeriod, DayWeek } from "../day.types";

export const ATHLETE_TRAINING_ACTION_TYPE = {
    SET_DATE: 'SET_DATE',
    ADD_MOVEMENT: 'ADD_MOVEMENT',
    SET_MOVEMENT_WEIGHT: 'SET_MOVEMENT_WEIGHT',
    REMOVE_MOVEMENT: 'REMOVE_MOVEMENT',
    ADD_SESSION: 'ADD_SESSION',
    SET_SESSION_DAY_WEEK: 'SET_SESSION_DAY_WEEK',
    SET_SESSION_DAY_PERIOD: 'SET_SESSION_DAY_PERIOD',
    ADD_SESSION_EXERCISE: 'ADD_SESSION_EXERCISE',
    SET_SESSION_EXERCISE_NAME: 'SET_SESSION_EXERCISE_NAME',
    SET_SESSION_EXERCISE_ABBREVIATION: 'SET_SESSION_EXERCISE_ABBREVIATION',
    SET_SESSION_EXERCISE_MOVEMENT: 'SET_SESSION_EXERCISE_MOVEMENT',
    ADD_SESSION_EXERCISE_INTENSITY: 'ADD_SESSION_EXERCISE_INTENSITY',
    SET_SESSION_EXERCISE_INTENSITY_SERIES: 'SET_SESSION_EXERCISE_INTENSITY_SERIES',
    SET_SESSION_EXERCISE_INTENSITY_REPETITIONS: 'SET_SESSION_EXERCISE_INTENSITY_REPETITIONS',
    SET_SESSION_EXERCISE_INTENSITY_SET_PERCENTAGE: 'SET_SESSION_EXERCISE_INTENSITY_SET_PERCENTAGE',
} as const;

export type AthleteTrainingActionType = typeof ATHLETE_TRAINING_ACTION_TYPE[keyof typeof ATHLETE_TRAINING_ACTION_TYPE];

export type ExtractPayload<TType extends AthleteTrainingActionType> = Extract<AthleteTrainingAction, { type: TType }>['payload']

export type AthleteTrainingAction =
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_DATE, payload: { key: 'start_date' | 'end_date', date: string } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.ADD_MOVEMENT, payload: MuscleMovementWithWeightRef }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_MOVEMENT_WEIGHT, payload: { movementId: number, weight: number } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.REMOVE_MOVEMENT, payload: { movementId: number } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.ADD_SESSION, payload: { session: SessionWithExercisesAndIntensities } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_DAY_WEEK, payload: { sessionId: number, dayWeek: DayWeek } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_DAY_PERIOD, payload: { sessionId: number, dayPeriod: DayPeriod } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.ADD_SESSION_EXERCISE, payload: { sessionId: number, exercise: ExerciseWithIntensity } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_NAME, payload: { sessionId: number, exerciseId: number, name: string } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_ABBREVIATION, payload: { sessionId: number, exerciseId: number, abbreviation: string } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_MOVEMENT, payload: { sessionId: number, movementId: number, exerciseId: number } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.ADD_SESSION_EXERCISE_INTENSITY, payload: { sessionId: number, exerciseId: number, intensity: IntensityWithSeriesRepetitionsZoneAndSets } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_INTENSITY_SERIES, payload: { sessionId: number, exerciseId: number, intensityId: number, series: number } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_INTENSITY_REPETITIONS, payload: { sessionId: number, exerciseId: number, intensityId: number, repetitions: number } }
    | { type: typeof ATHLETE_TRAINING_ACTION_TYPE.SET_SESSION_EXERCISE_INTENSITY_SET_PERCENTAGE, payload: { sessionId: number, exerciseId: number, intensityId: number, setId: number, percentage: number } }