import { ExerciseWithIntensity } from "../../interfaces/exercise/exercise-with-intensity.interface";
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { SessionWithExercisesAndIntensities } from "../../interfaces/session/session-with-exercises-and-intensities.interface";
import { WeeklyBlock } from "../../interfaces/session/weekly-blocks.interface";
import { FullTrainingPlan } from "../../interfaces/training/full-training-plan.interface";
import { DayPeriod, DayWeek } from "../day.types";

type LeafValues<T> = T extends string
    ? T
    : T extends Record<string, infer U>
    ? LeafValues<U>
    : never;

export const ATHLETE_TRAINING_ACTION_TYPE = {
    INIT: 'INIT_TRAINING',

    DATE: {
        SET: 'SET_DATE'
    },

    MOVEMENT: {
        ADD: 'ADD_MOVEMENT',
        REMOVE: 'REMOVE_MOVEMENT',
        SET: {
            WEIGHT: 'SET_MOVEMENT_WEIGHT',
        }
    },

    WEEKLY_BLOCK: {
        UPDATE: {
            INITIAL_END_DATE: 'UPDATE_WEEKLY_BLOCK_INITIAL_END_DATE',
            BLOCKS: 'UPDATE_WEEKLY_BLOCKS',
        },
        SET: {
            ACTIVE: 'SET_WEEKLY_BLOCK_IS_ACTIVE',
        }
    },

    SESSION: {
        ADD: 'ADD_SESSION',
        SET: {
            DAY_WEEK: 'SET_SESSION_DAY',
            DAY_PERIOD: 'SET_SESSION_PERIOD',
        }
    },

    EXERCISE: {
        ADD: 'EXERCISE.ADD',
        REMOVE: 'EXERCISE.REMOVE',
        UPDATE: 'EXERCISE.UPDATE',
        SET: {
            NAME: 'SET_EXERCISE_NAME',
            ABBR: 'SET_EXERCISE_ABBR',
            MOVEMENT: 'SET_EXERCISE_MOVEMENT',
        }
    },

    INTENSITY: {
        ADD: 'INTENSITY.ADD',
        REMOVE: 'INTENSITY.REMOVE',
        SET: {
            SERIES: 'SET_INTENSITY_SERIES',
            REPS: 'SET_INTENSITY_REPS',
            PERCENT: 'SET_INTENSITY_PERCENT',
        }
    }
} as const;

export type AthleteTrainingActionType = LeafValues<typeof ATHLETE_TRAINING_ACTION_TYPE>;

export type ExtractPayload<TType extends AthleteTrainingActionType> = Extract<AthleteTrainingAction, { type: TType }>['payload']

export type AthleteTrainingAction =
    {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INIT,
        payload: { training: FullTrainingPlan }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.DATE.SET,
        payload: { key: 'start_date' | 'end_date', date: string }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.ADD,
        payload: MuscleMovementWithWeightRef
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.SET.WEIGHT,
        payload: { movementId: number, weight: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.REMOVE,
        payload: { movementId: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.INITIAL_END_DATE,
        payload: { initialEndDate: string }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.BLOCKS,
        payload: { weekly_blocks: WeeklyBlock[] }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.SET.ACTIVE,
        payload: { blockId: number, isActive: boolean }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.SESSION.ADD,
        payload: { block: WeeklyBlock, session: SessionWithExercisesAndIntensities }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_WEEK,
        payload: { blockId: number, sessionId: number, dayWeek: DayWeek }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_PERIOD,
        payload: { blockId: number, sessionId: number, dayPeriod: DayPeriod }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.ADD,
        payload: { blockId: number, sessionId: number, exercise: ExerciseWithIntensity }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.REMOVE,
        payload: { blockId: number, sessionId: number, exerciseId: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.UPDATE,
        payload: { blockId: number, sessionId: number, exercise: ExerciseWithIntensity }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.NAME,
        payload: { blockId: number, sessionId: number, exerciseId: number, name: string }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.ABBR,
        payload: { blockId: number, sessionId: number, exerciseId: number, abbreviation: string }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.MOVEMENT,
        payload: { blockId: number, sessionId: number, movementId: number, exerciseId: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.ADD,
        payload: { blockId: number, sessionId: number, exerciseId: number, intensity: IntensityWithSeriesRepetitionsZoneAndSets }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.REMOVE,
        payload: { blockId: number, sessionId: number, exerciseId: number, intensityId: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.SERIES,
        payload: { blockId: number, sessionId: number, exerciseId: number, intensityId: number, series: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.REPS,
        payload: { blockId: number, sessionId: number, exerciseId: number, intensityId: number, repetitions: number }
    } | {
        type: typeof ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.PERCENT,
        payload: { blockId: number, sessionId: number, exerciseId: number, intensityId: number, setId: number, percentage: number }
    };