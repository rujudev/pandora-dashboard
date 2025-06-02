import { useEffect } from "react";
import { Link, Outlet, useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { AthleteOutletContext } from "../../interfaces/athlete/athlete-route-outlet.interface";
import { LoaderData } from "../../interfaces/loader-data.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
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

const Sessions = ({ count }: { count: number }) => {
    console.log(count)
    return (
        <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">{count}</span>
            <span>{count <= 1 ? 'sesión' : 'sesiones'}</span>
        </div>
    )
}

const MuscleMovements = ({ movements }: { movements: MuscleMovementWithWeightRef[] }) => {
    return (
        <div className="flex items-center gap-2">
            {movements.map(movement => (
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
    const { athlete, trainings } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();

    useEffect(() => {
        if (isAthleteTrainingsPage && athlete) {
            setHeaderConfig({
                hasBackButton: true,
                title: 'Historial de entrenamientos',
                description: (
                    <>
                        Entrenamientos de <strong>{athlete?.first_name} {athlete?.last_name}</strong>
                    </>
                ),
            })
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
                                trainings.map((training, index) => {
                                    const {
                                        start_date,
                                        end_date,
                                        session_count,
                                        muscle_movements,
                                        id_training
                                    } = training;
                                    const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    const startDate = formatter.format(new Date(start_date));
                                    const endDate = formatter.format(new Date(end_date));

                                    return (
                                        <ListItem classes="border border-neutral rounded-xl gap-5">
                                            <Info startDate={startDate} endDate={endDate} trainingNumber={index + 1} />
                                            <Sessions count={session_count} />
                                            <MuscleMovements movements={muscle_movements} />
                                            <div className="flex items-center">
                                                <Link className="btn btn-primary" to={`${id_training}/edit`}>
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