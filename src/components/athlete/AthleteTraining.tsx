import { ChangeEvent, useEffect, useState } from "react";
import { useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { AthleteOutletContext } from "../../interfaces/athlete-route-outlet.interface";
import { FullTrainingPlan } from "../../interfaces/interfaces_compuestas.interface";
import { LoaderData } from "../../interfaces/loader-data.interface";
import MuscleMovements from "../muscleMovements/MuscleMovements";
import Sessions from "../sessions/Sessions";
import StartEndDate from "../training/StartEndDate";

const AthleteTraining = () => {
    const { pathname } = useLocation();
    const { training } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const isAthleteTrainingEditPage = useMatch('/athletes/:athleteId/trainings/:trainingId/edit');

    const defaultAthleteTraining = {
        id_athlete: 0,
        first_name: "",
        last_name: "",
        category_weight: 0,
        birth_day: "",
        sport: "",
        team: "",
        thumbnail: "",
        id_training: 0,
        start_date: "01-08-1993",
        end_date: "01-08-1993",
        period: "",
        week_type: "",
        sessions: [],
        muscle_movements: []

    }

    const [athleteTraining, setAthleteTraining] = useState<FullTrainingPlan>(defaultAthleteTraining)

    const onHandleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const { id, value } = target;

        if (!Object.keys(athleteTraining).includes(id)) return;

        setAthleteTraining((prev: FullTrainingPlan) => {
            return {
                ...prev,
                [id]: value
            };
        })
    }

    const onHandleChangeDate = (dateKey: "start_date" | "end_date", value: string) => {
        setAthleteTraining((prevAthlete: FullTrainingPlan) => {
            return {
                ...prevAthlete,
                [dateKey]: value
            }
        })
    }

    const onHandleChangeMovementWeightRef = (movementId: number, value: number) => {
        setAthleteTraining((prev: FullTrainingPlan) => ({
            ...prev,
            muscle_movements: prev.muscle_movements.map(prevMovement =>
                prevMovement.id_movement === movementId
                    ? {
                        ...prevMovement,
                        weight_ref: value
                    } : prevMovement
            )
        }))
    }

    const onHandleDeleteMovement = (movementId: number) => {
        setAthleteTraining((prev: FullTrainingPlan) => ({
            ...prev,
            muscle_movements: prev.muscle_movements.filter(prevMovement => prevMovement.id_movement !== movementId)
        }))
    }

    const onHandleChangeDayWeek = (dayWeek: string) => {
        // console.log(dayWeek);
    }

    const onHandleChangeSessionDayPeriod = (dayPeriod: string) => {
        // console.log(dayPeriod)
    }

    const onHandleChangeSessionMuscleMovement = (sessionId: number, movementId: number, exerciseId: number) => {
        setAthleteTraining((prev: FullTrainingPlan) => ({
            ...prev,
            sessions: prev.sessions.map(session => {
                if (session.id_session !== sessionId) return session;

                return {
                    ...session,
                    exercises: session.exercises.map(exercise => {
                        if (exercise.id_exercise !== exerciseId) return exercise;

                        return {
                            ...exercise,
                            id_movement: movementId
                        }
                    })
                }
            })
        }))
    }

    useEffect(() => {
        training &&
            setAthleteTraining(training);

        console.log(training);
    }, [training])

    useEffect(() => {
        if (isAthleteTrainingEditPage && athleteTraining) {
            const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
            const formatterStartDate = formatter.format(new Date(athleteTraining.start_date));
            const formatterEndDate = formatter.format(new Date(athleteTraining.end_date));

            setHeaderConfig({
                hasBackButton: true,
                hasActionButton: false,
                title: (
                    <>
                        Entrenamiento <strong>{formatterStartDate} - {formatterEndDate}</strong>
                    </>
                ),
            })
        }
    }, [pathname, athleteTraining])

    return (
        <div className="grid grid-cols-2 w-full gap-5">
            <StartEndDate
                startDate={athleteTraining.start_date}
                endDate={athleteTraining.end_date}
                onChange={onHandleChangeDate}
            />
            <MuscleMovements
                muscleMovements={athleteTraining.muscle_movements}
                onChangeWeightRef={onHandleChangeMovementWeightRef}
                onDeleteMuscleMovement={onHandleDeleteMovement}
            />
            <Sessions
                sessions={athleteTraining.sessions}
                muscleMovements={athleteTraining.muscle_movements}
                onChangeDayWeek={onHandleChangeDayWeek}
                onChangeDayPeriod={onHandleChangeSessionDayPeriod}
                onChangeExerciseMuscleMovement={onHandleChangeSessionMuscleMovement}
            />
        </div>
    )
}

export default AthleteTraining