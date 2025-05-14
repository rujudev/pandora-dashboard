import { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { getTrainingsByAthlete } from "../../services/trainings";
import { AthleteOutletContext } from "../../types/athlete-route-outlet.types";
import { LoaderData } from "../../types/loader-data.types";
import { Training } from "../../types/training.types";
import { ViewTraining } from "../Icon";
import List from "../list/List";
import ListItem from "../list/ListItem";

const AthleteTrainingsHistory = () => {
    const { pathname } = useLocation();
    const isAthleteTrainingsPage = useMatch('/athletes/:athleteId/trainings');
    const { athlete } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const [trainings, setTrainings] = useState<Training[]>([]);

    const getTrainings = async () => {
        const trainings = await getTrainingsByAthlete(athlete);

        trainings && trainings.length > 0 && setTrainings(trainings)
    }

    useEffect(() => {
        if (isAthleteTrainingsPage) {
            setHeaderConfig({
                hasBackButton: true,
                hasActionButton: false,
                title: 'Historial de entrenamientos',
                description: (
                    <>
                        Entrenamientos de <strong>{athlete?.name} {athlete?.last_name}</strong>
                    </>
                ),
            })

            athlete && getTrainings()
        }
    }, [pathname, athlete])

    useEffect(() => {
        console.log(trainings)
    }, [trainings])

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
                                trainings.map(athleteTraining => {
                                    const formatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    const startDate = new Date(athleteTraining?.start_date || '');
                                    const endDate = new Date(athleteTraining?.end_date || '');

                                    const formatterStartDate = formatter.format(startDate);
                                    const formatterEndDate = formatter.format(endDate);

                                    const sessionLength = athleteTraining?.sessions.length ?? 0;

                                    return (
                                        <ListItem classes="border border-neutral rounded-xl gap-5">
                                            <div className="flex justify-center flex-col gap-2 list-col-grow">
                                                <h3 className="text-base">{athleteTraining?.name}</h3>
                                                <p className="text-sm text-neutral-400">
                                                    {formatterStartDate} - {formatterEndDate}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <span className="font-medium">{sessionLength}</span>
                                                <span>{sessionLength < 1 ? 'sesión' : 'sesiones'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {athleteTraining?.muscle_movements.map(movement => (
                                                    <div className="flex gap-2 badge badge-md badge-outline badge-info">
                                                        <span>{movement.name}:</span>
                                                        <span>{movement.weight} Kg</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="btn btn-primary" to={`${athleteTraining?.id}/edit`}>
                                                    <ViewTraining /> Editar
                                                </Link>
                                            </div>
                                        </ListItem>
                                    )
                                })

                            ) : (
                                <p>El atleta todavía no tiene entrenamientos asignados</p>
                            )}
                        </List>
                    </div>
                </>
            ) : <Outlet context={{ setHeaderConfig }} />}

        </section>
    )
}

export default AthleteTrainingsHistory