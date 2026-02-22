import { useEffect, useState } from "react"
import { Link, Outlet, useMatch } from "react-router"
import HeaderPage from "../components/headerPage/HeaderPage"
import { Plus } from "../components/Icon"
import Table, { Column } from "../components/table/Table"
import { useBreadcrumbs } from "../context/Breadcrumbs.context"
import { useHeaderPage } from "../hooks/useHeaderPage"
import { ROUTE } from "../routes/config"
import { getTrainings } from "../services/trainings"

const TrainingsPage = () => {
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()

    const isTrainingsPage = useMatch('/trainings')
    const [trainings, setTrainings] = useState([])

    const columns: Column[] = [
        { field: 'name', headerName: 'Nombre' },
        { field: 'period', headerName: 'Periodo' },
        { field: 'week_type', headerName: 'Tipo de semana' },
        { field: 'duration', headerName: 'Duración' },
        { field: 'total_sessions', headerName: 'Sesiones totales' },
        { field: 'assigned_athletes', headerName: 'Atletas asignados' },
        { field: 'last_update', headerName: 'Última actualización' },
        { field: 'actions', headerName: 'Acciones' },
    ]

    const getTrainingsData = async () => {
        const { data: trainingsData, error: trainingsError } = await getTrainings()

        if (trainingsError) throw new Error(trainingsError.message)

        console.log('trainingsData', trainingsData)
        setTrainings(trainingsData)
    }

    useEffect(() => {
        if (isTrainingsPage) {
            setCrumbs([
                { label: 'Entrenamientos', path: ROUTE.TRAININGS },
            ])

            getTrainingsData()

            setHeaderConfig({
                title: 'Entrenamientos',
                description: "Gestiona los planes de entrenamiento de tus atletas",
                rightContent: (
                    <Link className="btn btn-primary" to={ROUTE.CREATE_TRAINING}>
                        <Plus /> Crear entrenamiento
                    </Link>
                )
            })
        }
    }, [isTrainingsPage])


    return (
        <section className="flex flex-col gap-20">
            <HeaderPage />
            <main className="flex flex-col gap-4">
                {isTrainingsPage ? (
                    <Table
                        classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                        columns={columns}
                        rows={trainings}
                    />
                ) : <Outlet />}
            </main>
        </section>
    )
}

export default TrainingsPage