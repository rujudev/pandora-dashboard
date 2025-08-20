import { format } from "date-fns";
import { use } from "react";
import { AthleteTrainingContext } from "../context/athlete-training.context";
import { ExerciseWithIntensity } from "../interfaces/exercise/exercise-with-intensity.interface";
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface";
import { MuscleMovementWithWeightRef } from "../interfaces/movement/muscle-movement-weight.interface";
import { SessionWithExercisesAndIntensities } from "../interfaces/session/session-with-exercises-and-intensities.interface";
import { WeeklyBlock } from "../interfaces/session/weekly-blocks.interface";
import { FullTrainingPlan } from "../interfaces/training/full-training-plan.interface";
import { DayPeriod, DayWeek } from "../types/day.types";
import { ATHLETE_TRAINING_ACTION_TYPE, AthleteTrainingActionType, ExtractPayload } from "../types/reducer/athlete-training-reducer-action";

export const useAthleteTraining = () => {
    const { state, dispatch } = use(AthleteTrainingContext);

    const createAction = <T extends AthleteTrainingActionType>(type: T, payload: ExtractPayload<T>) => ({
        type, payload
    })

    const initTraining = (training: FullTrainingPlan) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INIT, { training }))
    }

    /* -------------------------------------------------------------- */
    /* Date                                                           */
    /* -------------------------------------------------------------- */
    const setTrainingDate = (date: Date, key: 'start_date' | 'end_date') => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.DATE.SET, { date: format(date, 'yyyy-MM-dd'), key }))
    }

    /* -------------------------------------------------------------- */
    /* MOVEMENT                                                       */
    /* -------------------------------------------------------------- */
    const addMovement = (movement: MuscleMovementWithWeightRef) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.ADD, { ...movement }));
    }

    const setMovementWeight = (movementId: number, weight: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.SET.WEIGHT, { movementId, weight: Number(weight) }))
    }

    const removeMovement = (movementId: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.MOVEMENT.REMOVE, { movementId }))
    }

    /* -------------------------------------------------------------- */
    /* Weekly Block                                                   */
    /* -------------------------------------------------------------- */
    const updateWeeklyBlocksInitialEndDate = (initialEndDate: string) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.INITIAL_END_DATE, { initialEndDate }))
    }

    const updateWeeklyBlocks = (weekly_blocks: WeeklyBlock[]) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.UPDATE.BLOCKS, { weekly_blocks }))
    }

    const setWeeklyBlockIsActive = (blockId: number, isActive: boolean) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.WEEKLY_BLOCK.SET.ACTIVE, { blockId, isActive }))
    }

    const addSession = (block: WeeklyBlock, session: SessionWithExercisesAndIntensities) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.SESSION.ADD, { block, session }))
    }

    const setSessionDayWeek = (blockId: number, sessionId: number, dayWeek: DayWeek) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_WEEK, { blockId, sessionId, dayWeek }))
    }

    const setSessionDayPeriod = (blockId: number, sessionId: number, dayPeriod: DayPeriod) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.SESSION.SET.DAY_PERIOD, { blockId, sessionId, dayPeriod }))
    }

    const addExercise = (blockId: number, sessionId: number, exercise: ExerciseWithIntensity) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.ADD, { blockId, sessionId, exercise }))
    }

    const removeExercise = (blockId: number, sessionId: number, exerciseId: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.REMOVE, { blockId, sessionId, exerciseId }))
    }

    const setExerciseName = (blockId: number, sessionId: number, exerciseId: number, name: string) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.NAME, { blockId, sessionId, exerciseId, name }))
    }

    const setExerciseAbbr = (blockId: number, sessionId: number, exerciseId: number, abbreviation: string) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.ABBR, { blockId, sessionId, exerciseId, abbreviation }))
    }

    const setExerciseMovement = (blockId: number, sessionId: number, exerciseId: number, movementId: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.EXERCISE.SET.MOVEMENT, { blockId, sessionId, exerciseId, movementId }))
    }

    const addIntensity = (blockId: number, sessionId: number, exerciseId: number, intensity: IntensityWithSeriesRepetitionsZoneAndSets) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.ADD, { blockId, sessionId, exerciseId, intensity }))
    }

    const removeIntensity = (blockId: number, sessionId: number, exerciseId: number, intensityId: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.REMOVE, { blockId, sessionId, exerciseId, intensityId }))
    }

    const setIntensitySeries = (blockId: number, sessionId: number, exerciseId: number, intensityId: number, series: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.SERIES, { blockId, sessionId, exerciseId, intensityId, series }))
    }

    const setIntensityReps = (blockId: number, sessionId: number, exerciseId: number, intensityId: number, repetitions: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.REPS, { blockId, sessionId, exerciseId, intensityId, repetitions }))
    }

    const setSetPercent = (blockId: number, sessionId: number, exerciseId: number, intensityId: number, setId: number, percentage: number) => {
        dispatch(createAction(ATHLETE_TRAINING_ACTION_TYPE.INTENSITY.SET.PERCENT, { blockId, sessionId, exerciseId, intensityId, setId, percentage }))
    }

    return {
        state,
        initTraining,
        setTrainingDate,
        addMovement,
        setMovementWeight,
        removeMovement,
        updateWeeklyBlocksInitialEndDate,
        updateWeeklyBlocks,
        setWeeklyBlockIsActive,
        addSession,
        setSessionDayWeek,
        setSessionDayPeriod,
        addExercise,
        removeExercise,
        setExerciseName,
        setExerciseAbbr,
        setExerciseMovement,
        addIntensity,
        removeIntensity,
        setIntensitySeries,
        setIntensityReps,
        setSetPercent
    }
};