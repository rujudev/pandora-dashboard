import { format, isBefore, isEqual, isSameDay, parseISO } from "date-fns";
import _ from "lodash";
import { FC, useEffect, useState } from "react";
import { useLoaderData, useMatch } from "react-router";
import { useBreadcrumbs } from "../../context/breadcrumb.context";
import { useToast } from "../../context/toast.context";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { useHeaderPage } from "../../hooks/useHeaderPage";
import { Athlete } from "../../interfaces/athlete/athlete.interface";
import { FullTrainingPlan } from "../../interfaces/training/full-training-plan.interface";
import { ROUTE } from "../../routes/config";
import { getAthlete } from "../../services/athletes";
import { getTrainingByAthlete, updateAthleteTraining } from "../../services/trainings";
import { getChangedFields } from "../../utils/object";
import Button from "../Button";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import BackButton from "../headerPage/BackButton";
import { Save } from "../Icon";
import MuscleMovements from "../muscleMovements/MuscleMovements";
import Sessions from "../session/Sessions";
import StartEndDate from "../training/StartEndDate";

type AthleteTrainingProps = {
    mode?: 'edit' | 'create',
}

// TODO: añadir el skelleton para cuando cargue la página
const AthleteTraining: FC<AthleteTrainingProps> = ({ mode = 'edit' }) => {
    const { setHeaderConfig } = useHeaderPage();
    const { setCrumbs } = useBreadcrumbs();
    const { showToast } = useToast()

    const isAthleteTrainingPage = useMatch('/athletes/:athleteId/trainings/:trainingId/edit')
    const { trainingId, athleteId } = useLoaderData()
    const { state, updateWeeklyBlocksInitialEndDate, updateWeeklyBlocks, initTraining } = useAthleteTraining();

    const [stateAux, setStateAux] = useState<FullTrainingPlan & Partial<Athlete> | null>(null)
    const [isTrainingCompleted, setIsTrainingCompleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchTrainingAndAthlete = async () => {
        const [athleteResult, trainingResult] = await Promise.all([
            getAthlete(athleteId),
            getTrainingByAthlete(athleteId, trainingId)
        ])

        if (athleteResult.error) throw new Error(athleteResult.error.message)
        if (trainingResult.error) throw new Error(trainingResult.error.message)

        const training = {
            ...athleteResult.data,
            ...trainingResult.data
        }

        setStateAux(_.cloneDeep(training))
        initTraining(training)
    }

    const handleUpdateAthleteTraining = async () => {
        if (state && stateAux) {
            const updatedTrainingFields = getChangedFields(stateAux, state);

            setIsLoading(true);

            try {
                await updateAthleteTraining(
                    stateAux,
                    updatedTrainingFields,
                    (insertedFields) => {
                        if (insertedFields.weekly_blocks) updateWeeklyBlocks(insertedFields.weekly_blocks);
                    }
                )
                showToast({ type: 'success', message: 'El entrenamiento se ha actualizado correctamente!' })
            } catch (error) {
                showToast({ type: 'error', message: `Se ha producido un error al actualizar el entrenamiento: ${error}` })
            } finally {
                setStateAux(_.cloneDeep(state))
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        setCrumbs(4)
        state && setStateAux(_.cloneDeep(state))
    }, [])

    useEffect(() => {
        fetchTrainingAndAthlete()
    }, [athleteId, trainingId])

    useEffect(() => {
        if (state && isAthleteTrainingPage) {
            const startDate = parseISO(state.start_date);
            const endDate = parseISO(state.end_date);
            const formatterStartDate = format(startDate, 'dd MMMM yyyy');
            const formatterEndDate = format(endDate, 'dd MMMM yyyy');

            setCrumbs([
                { label: 'Atletas', path: '/athletes' },
                { label: `${state?.first_name} ${state?.last_name}`, isLast: false },
                { label: `Entrenamientos`, path: `/athletes/${state.id_athlete}/trainings`, isLast: false },
                { label: `${formatterStartDate} - ${formatterEndDate}`, isLast: true }
            ])

            setHeaderConfig({
                isLoadingPage: false,
                backButton: <BackButton path={ROUTE.ATHLETE_TRAININGS(athleteId)} />,
                title: <>Entrenamiento de {state?.first_name} {state?.last_name}</>,
                description: (
                    <>
                        <small>
                            <strong>{formatterStartDate} - {formatterEndDate}</strong>
                        </small>
                    </>
                ),
                ...(!isTrainingCompleted && {
                    rightContent: (
                        <Button
                            mode={mode}
                            onClick={handleUpdateAthleteTraining}
                            disabled={_.isEqual(state, stateAux) || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Guardando...</span>
                                </>
                            ) : <><Save /> Guardar cambios</>}
                        </Button >
                    )
                })
            })
        }
    }, [state, stateAux, isLoading, isAthleteTrainingPage])

    useEffect(() => {
        if (state?.start_date && state?.end_date && stateAux?.start_date && stateAux?.end_date) {
            const stateStartDate = parseISO(state?.start_date);
            const stateEndDate = parseISO(state?.end_date);
            const stateAuxStartDate = parseISO(stateAux?.start_date);
            const stateAuxEndDate = parseISO(stateAux?.end_date);

            if (!isEqual(stateStartDate, stateAuxStartDate) || !isEqual(stateEndDate, stateAuxEndDate)) {
                updateWeeklyBlocksInitialEndDate(stateAux?.end_date)
            }

            setIsTrainingCompleted(
                isBefore(stateEndDate, new Date()) && !isSameDay(stateEndDate, new Date())
            );
        }
    }, [stateAux, state?.start_date, state?.end_date])

    return (
        <div className="grid grid-cols-1 w-full gap-5">
            <Card>
                <CardBody>
                    <StartEndDate classes="gap-5 grid grid-cols-2" isTrainingCompleted={isTrainingCompleted} />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <MuscleMovements isTrainingCompleted={isTrainingCompleted} />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <Sessions isTrainingCompleted={isTrainingCompleted} />
                </CardBody>
            </Card>
        </div>
    )
}

export default AthleteTraining