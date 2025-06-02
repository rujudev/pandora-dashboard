import { useContext } from "react";
import { DateRange } from "react-day-picker";
import { AthleteTrainingContext } from "../context/athlete-training.context";
import { MuscleMovementWithWeightRef } from "../interfaces/movement/muscle-movement-weight.interface";
import { SessionWithExercisesAndIntensities } from "../interfaces/session/session-with-exercises-and-intensities.interface";
import { DayPeriod, DayWeek } from "../types/day.types";
import { AthleteTrainingActionType, ExtractPayload } from "../types/reducer/athlete-training-reducer-action";

export const useAthleteTraining = () => {
    const { state, dispatch } = useContext(AthleteTrainingContext);

    const createAction = <T extends AthleteTrainingActionType>(type: T, payload: ExtractPayload<T>) => ({
        type, payload
    })

    const setTrainingDate = (date: Date | DateRange, key: 'start_date' | 'end_date') => {
        dispatch(createAction('SET_DATE', { date: date.toString(), key }))
    }

    const addMovement = (movement: MuscleMovementWithWeightRef) => {
        dispatch(createAction('ADD_MOVEMENT', { ...movement }));
    }

    const setMovementWeight = (movementId: number, weight: number) => {
        dispatch(createAction('SET_MOVEMENT_WEIGHT', { movementId, weight: Number(weight) }))
    }

    const removeMovement = (movementId: number) => {
        dispatch(createAction('REMOVE_MOVEMENT', { movementId }))
    }

    const addSession = (session: SessionWithExercisesAndIntensities) => {
        dispatch(createAction('ADD_SESSION', { session }))
    }

    const setSessionDayWeek = (sessionId: number, dayWeek: DayWeek) => {
        dispatch(createAction('SET_SESSION_DAY_WEEK', { sessionId, dayWeek }))
    }

    const setSessionDayPeriod = (sessionId: number, dayPeriod: DayPeriod) => {
        dispatch(createAction('SET_SESSION_DAY_PERIOD', { sessionId, dayPeriod }))
    }

    const setSessionExerciseName = (sessionId: number, exerciseId: number, name: string) => {
        dispatch(createAction('SET_SESSION_EXERCISE_NAME', { sessionId, exerciseId, name }))
    }

    const setSessionExerciseAbbreviation = (sessionId: number, exerciseId: number, abbreviation: string) => {
        dispatch(createAction('SET_SESSION_EXERCISE_ABBREVIATION', { sessionId, exerciseId, abbreviation }))
    }

    const setSessionExerciseMovement = (sessionId: number, exerciseId: number, movementId: number) => {
        dispatch(createAction('SET_SESSION_EXERCISE_MOVEMENT', { sessionId, exerciseId, movementId }))
    }


    const setSessionExerciseIntensitySeries = (sessionId: number, exerciseId: number, intensityId: number, series: number) => {
        dispatch(createAction('SET_SESSION_EXERCISE_INTENSITY_SERIES', { sessionId, exerciseId, intensityId, series }))
    }

    const setSessionExerciseIntensityRepetitions = (sessionId: number, exerciseId: number, intensityId: number, repetitions: number) => {
        dispatch(createAction('SET_SESSION_EXERCISE_INTENSITY_REPETITIONS', { sessionId, exerciseId, intensityId, repetitions }))
    }

    const setSessionExerciseIntensitySetPercentage = (sessionId: number, exerciseId: number, intensityId: number, setId: number, percentage: number) => {
        dispatch(createAction('SET_SESSION_EXERCISE_INTENSITY_SET_PERCENTAGE', { sessionId, exerciseId, intensityId, setId, percentage }))
    }

    return {
        state,
        setTrainingDate,
        addMovement,
        setMovementWeight,
        removeMovement,
        addSession,
        setSessionDayWeek,
        setSessionDayPeriod,
        setSessionExerciseName,
        setSessionExerciseAbbreviation,
        setSessionExerciseMovement,
        setSessionExerciseIntensitySeries,
        setSessionExerciseIntensityRepetitions,
        setSessionExerciseIntensitySetPercentage
    }
};