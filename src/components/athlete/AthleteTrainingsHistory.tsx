import { format, isAfter, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ReactNode, useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useMatch } from "react-router";
import { useBreadcrumbs } from "../../context/breadcrumb.context";
import { initHeaderPage } from "../../context/header-page.context";
import { useHeaderPage } from "../../hooks/useHeaderPage";
import { AthleteTrainingSummary } from "../../interfaces/athlete/athlete-training-summary.interface";
import { Athlete } from "../../interfaces/athlete/athlete.interface";
import { ROUTE } from "../../routes/config";
import { getAthlete } from "../../services/athletes";
import { getAthleteTrainings } from "../../services/trainings";
import BackButton from "../headerPage/BackButton";
import { AddTraining, Calendar, CircleCheck, CircleHour4, Clock, Edit, Eye, ProgressCheck, Trash } from "../Icon";
import List from "../list/List";
import ListItem from "../list/ListItem";

const TrainingsSkeleton = () => {
    return (
        <>
            <div className="grid grid-cols-[max-content] items-center justify-between gap-5 w-full">
                <div className="grid grid-cols-[max-content_max-content] grid-rows-[max-content_max-content] items-center gap-x-5 gap-y-4">
                    <div className="col-start-1 row-start-1 w-full">
                        <div className="skeleton size-10" />
                    </div>
                    <div className="col-start-2 row-start-1 flex justify-center flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="skeleton size-6" />
                            <div className="skeleton h-4 w-40" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="skeleton size-6" />
                            <div className="skeleton h-4 w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="skeleton size-6" />
                            <div className="skeleton h-4 w-20" />
                        </div>
                    </div>
                    <div className="col-span-2 list-col-wrap">
                        <div className="skeleton h-4 w-64" />
                    </div>
                </div>
                <div className="skeleton h-5 w-24" />
            </div>
            <div className="flex items-center gap-3">
                <div className="skeleton size-6" />
                <div className="skeleton size-6" />
            </div>
        </>
    )
}

const Info = ({ startDate, endDate, weeks, updatedAt, sessions, isInProgress, isCommingSoon, isCompleted }: {
    startDate: string,
    endDate: string,
    updatedAt: string,
    weeks: number,
    sessions: number,
    isInProgress: boolean,
    isCompleted: boolean,
    isCommingSoon: boolean
}) => {
    const formatStartDate = format(parseISO(startDate), 'dd MMM yyyy', { locale: es });
    const formatEndDate = format(parseISO(endDate), 'dd MMM yyyy', { locale: es });
    const formatUpdatedAt = format(parseISO(updatedAt), 'dd MMM yyyy', { locale: es })

    const getStatus = (): { icon: ReactNode, content: ReactNode } | null => {
        if (isCompleted) {
            return {
                icon: <CircleCheck classes="stroke-success size-10" />,
                content: (
                    <div className="badge badge-success">
                        Completado
                    </div>
                )
            }
        }

        if (isInProgress) {
            return {
                icon: <ProgressCheck classes="stroke-warning size-10" />,
                content: (
                    <div className="badge badge-warning">
                        En proceso
                    </div>
                )
            }
        }

        if (isCommingSoon) {
            return {
                icon: <CircleHour4 classes="stroke-info size-10" />,
                content: (
                    <div className="badge badge-info">
                        Próximamente
                    </div>
                )
            }
        }

        return null;
    }

    return (
        <div className="grid grid-cols-[max-content] items-center justify-between gap-5 w-full">
            <div className="grid grid-cols-[max-content_max-content] grid-rows-[max-content_max-content] items-center gap-x-5 gap-y-4">
                <div className="col-start-1 row-start-1 ">{getStatus()?.icon}</div>
                <div className="col-start-2 row-start-1 flex justify-center flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Calendar />
                        <span>{formatStartDate} - {formatEndDate}</span>
                    </div>
                    <Weeks count={weeks} />
                    <Sessions count={sessions} />

                </div>
                <div className="col-span-2 list-col-wrap">Última actualización <span className="text-sm font-medium text-muted-foreground">{formatUpdatedAt}</span></div>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{getStatus()?.content}</span>
        </div>
    )
}

const Weeks = ({ count }: { count: number }) => {
    return (
        <div className="flex items-center gap-2">
            <AddTraining />
            <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">{count}</span>
                <span>{count === 0 || count > 1 ? 'semanas' : 'semana'}</span>
            </div>
        </div>
    )
}

const Sessions = ({ count }: { count: number }) => {
    return (
        <div className="flex items-center gap-2">
            <Clock />
            <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">{count}</span>
                <span>{count === 0 || count > 1 ? 'sesiones' : 'sesión'}</span>
            </div>
        </div>
    )
}

const AthleteTrainingsHistory = () => {
    const { athleteId } = useLoaderData();
    const [athlete, setAthlete] = useState<Athlete>()
    const [trainings, setTrainings] = useState<AthleteTrainingSummary[]>()
    const isAthleteTrainingsPage = useMatch('/athletes/:athleteId/trainings');
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()

    async function fetchAthleteAndTrainings() {
        const [athleteResult, trainingsResult] = await Promise.all([
            getAthlete(athleteId),
            getAthleteTrainings(athleteId)
        ])

        if (athleteResult.error) throw new Error(athleteResult.error.message)
        if (trainingsResult.error) throw new Error(trainingsResult.error.message)

        setAthlete(athleteResult.data);
        setTrainings(trainingsResult.data);
    }

    useEffect(() => {
        !isAthleteTrainingsPage && setHeaderConfig(initHeaderPage)
        fetchAthleteAndTrainings();
    }, [athleteId, isAthleteTrainingsPage])

    useEffect(() => {
        setCrumbs([
            { label: 'Atletas', path: '/athletes' },
            { label: `${athlete?.first_name} ${athlete?.last_name}`, isLast: false },
            { label: `Entrenamientos`, path: `/athletes/${athlete?.id_athlete}/trainings`, isLast: true },
        ])

        athlete && isAthleteTrainingsPage &&
            setHeaderConfig({
                isLoadingPage: false,
                backButton: <BackButton path={ROUTE.ATHLETES} />,
                title: 'Historial de entrenamientos',
                description: (
                    <>
                        Entrenamientos de <strong>{athlete?.first_name} {athlete?.last_name}</strong>
                    </>
                ),
            })
    }, [athlete, isAthleteTrainingsPage])

    return (
        <section className="flex flex-col gap-5">
            {isAthleteTrainingsPage ? (
                <>
                    <div className="flex justify-end">
                        Filtro Fechas
                    </div>
                    <div className="flex w-full">
                        <List>
                            {athlete && trainings ?
                                trainings.length > 0 ? (
                                    <>
                                        {trainings.map((training) => {
                                            const {
                                                start_date,
                                                end_date,
                                                sessions_count,
                                                updated_at,
                                                blocks,
                                                blocks_count,
                                                id_training
                                            } = training;

                                            const isCompleted = isBefore(parseISO(end_date), new Date());
                                            const isInProgress = blocks.some(block => block.is_active)
                                            const isCommingSoon = isAfter(parseISO(start_date), new Date());

                                            console.log({ isCompleted, isInProgress, isCommingSoon })

                                            return (
                                                <ListItem key={id_training} classes="border border-neutral rounded-xl gap-6 grid-cols-[1fr_max-content] justify-between">
                                                    <Info
                                                        startDate={start_date}
                                                        endDate={end_date}
                                                        isInProgress={isInProgress}
                                                        isCompleted={isCompleted}
                                                        isCommingSoon={isCommingSoon}
                                                        weeks={blocks_count}
                                                        sessions={sessions_count}
                                                        updatedAt={updated_at}
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        {isCompleted ? (
                                                            <Link className="transition-colors duration-200 hover:text-success cursor-pointer" to={`${id_training}/edit`}>
                                                                <Eye />
                                                            </Link>
                                                        ) : (
                                                            <Link className="transition-colors duration-200 hover:text-info cursor-pointer" to={`${id_training}/edit`}>
                                                                <Edit />
                                                            </Link>
                                                        )}
                                                        <button className="transition-colors duration-200 hover:text-error cursor-pointer">
                                                            <Trash />
                                                        </button>
                                                    </div>
                                                </ListItem>
                                            )
                                        })}
                                    </>
                                ) : (
                                    <p>{athlete?.first_name} {athlete?.last_name} no tiene entrenamientos asignados</p>
                                ) : (
                                    <>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <ListItem key={`trainingSkeleton-${index}`} classes="border border-neutral rounded-xl gap-6 grid-cols-[1fr_max-content] justify-between">
                                                <TrainingsSkeleton />
                                            </ListItem>
                                        ))}
                                    </>
                                )
                            }
                        </List>
                    </div>
                </>
            ) : <Outlet />}
        </section>
    )
}

export default AthleteTrainingsHistory