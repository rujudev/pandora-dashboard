import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { AthleteOutletContext } from "../../interfaces/athlete-route-outlet.interface";
import { LoaderData } from "../../interfaces/loader-data.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/muscle-movement-weight.interface";
import { Session } from "../../interfaces/session.interface";
import { Training } from "../../interfaces/training.interface";
import { getAthleteTrainings } from "../../services/athletes";
import { getMuscleMovements } from "../../services/muscle-movements";
import { getSessions } from '../../services/sessions';
import { getTraining } from "../../services/trainings";
import { ViewTraining } from "../Icon";
import List from "../list/List";
import ListItem from "../list/ListItem";

const Info = ({ startDate, endDate, trainingNumber }: { startDate: string, endDate: string, trainingNumber: number }) => {
    return (
        <div className="flex justify-center flex-col gap-2 list-col-grow">
            <h3 className="text-base">Entrenamiento {trainingNumber}</h3>
            <p className="text-sm text-neutral-400">
                {startDate} - {endDate}
            </p>
        </div>
    )
}

const Sessions = ({ trainingId }: { trainingId: number }) => {
    const [sessions, setSessions] = useState<Session[]>([]);

    const getTrainingSessions = async () => {
        const trainingSessions = await getSessions(trainingId);

        trainingSessions.length > 0 && setSessions(trainingSessions);
    }

    useEffect(() => {
        trainingId && getTrainingSessions();
    }, [trainingId])

    return (
        <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">{sessions.length}</span>
            <span>{sessions.length <= 1 ? 'sesión' : 'sesiones'}</span>
        </div>
    )
}

const MuscleMovements = ({ trainingId }: { trainingId: number }) => {
    const [muscleMovements, setMuscleMovements] = useState<MuscleMovementWithWeightRef[]>([]);

    const getTrainingMuscleMovements = async () => {
        const trainingMuscleMovements = await getMuscleMovements(trainingId);

        trainingMuscleMovements.length > 0 && setMuscleMovements(trainingMuscleMovements);
    }

    useEffect(() => {
        trainingId && getTrainingMuscleMovements();
    }, [trainingId])

    return (
        <div className="flex items-center gap-2">
            {muscleMovements.map(movement => (
                <div className="flex gap-2 badge badge-md badge-outline badge-info">
                    <span>{movement.movement_name}:</span>
                    <span>{movement.weight_ref} Kg</span>
                </div>
            ))}
        </div>
    )
}

const AthleteTrainingsHistory = () => {
    const { pathname } = useLocation();
    const isAthleteTrainingsPage = useMatch('/athletes/:athleteId/trainings');
    const { athlete } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const [trainings, setTrainings] = useState<Training[]>([]);

    const getTrainings = async () => {
        if (athlete) {
            const athleteTrainingsRel = await getAthleteTrainings(athlete.id_athlete);

            if (athleteTrainingsRel.length > 0) {
                const trainingPromises = athleteTrainingsRel.map(async athleteTraining => await getTraining(athleteTraining.id_training))
                const athleteTrainings = (await Promise.all(trainingPromises)).filter(training => training !== null);

                athleteTrainings.length > 0 && setTrainings(athleteTrainings);
            }
        }
    }

    useEffect(() => {
        if (isAthleteTrainingsPage && athlete) {
            setHeaderConfig({
                hasBackButton: true,
                hasActionButton: false,
                title: 'Historial de entrenamientos',
                description: (
                    <>
                        Entrenamientos de <strong>{athlete?.first_name} {athlete?.last_name}</strong>
                    </>
                ),
            })

            getTrainings()
        }
    }, [pathname, athlete])

    return (
        <section className="flex flex-col gap-5">
            {isAthleteTrainingsPage ? (
                <>
                    <div className="flex justify-end">
                        Filtro Fechas
                        Filtro búsqueda
                    </div>
                    <div className="flex w-full">
                        <List>
                            {trainings && trainings.length > 0 ? (
                                trainings.map((athleteTraining, index) => {
                                    const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    const startDate = formatter.format(athleteTraining.start_date);
                                    const endDate = formatter.format(athleteTraining.end_date);

                                    return (
                                        <ListItem classes="border border-neutral rounded-xl gap-5">
                                            <Info startDate={startDate} endDate={endDate} trainingNumber={index + 1} />
                                            <Sessions trainingId={athleteTraining.id_training} />
                                            <MuscleMovements trainingId={athleteTraining.id_training} />
                                            <div className="flex items-center">
                                                <Link className="btn btn-primary" to={`${athleteTraining?.id_training}/edit`}>
                                                    <ViewTraining /> Editar
                                                </Link>
                                            </div>
                                        </ListItem>
                                    )
                                })

                            ) : (
                                <p>{athlete?.first_name} {athlete?.last_name} no tiene entrenamientos asignados</p>
                            )}
                        </List>
                    </div>
                </>
            ) : <Outlet context={{ setHeaderConfig }} />}
        </section>
    )
}

export default AthleteTrainingsHistory