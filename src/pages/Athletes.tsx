import { differenceInYears } from "date-fns";
import { useEffect, useState } from "react";
import { Link, Outlet, useMatch } from "react-router";
import HeaderPage from "../components/headerPage/HeaderPage";
import { Plus } from "../components/Icon";
import AthleteActions from "../components/table/AthleteActions";
import Table, { Column } from "../components/table/Table";
import { useBreadcrumbs } from "../context/Breadcrumbs.context";
import { useHeaderPage } from "../hooks/useHeaderPage";
import { Athlete } from "../interfaces/athlete/athlete.interface";
import { getAthletes } from "../services/athletes";

const Athletes = () => {
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()

    const isAthletesPage = useMatch('/athletes');
    const columns: Column[] = [
        {
            field: 'selection', render: () => (
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
            )
        },
        { field: 'first_name', headerName: 'Nombre' },
        { field: 'last_name', headerName: 'Apellidos' },
        {
            field: 'birth_day', headerName: 'Fecha de nacimiento'
        },
        {
            field: 'age', headerName: 'Edad', render: (athlete: Athlete) => (
                <span>{differenceInYears(new Date(), athlete.birth_day)}</span>
            )
        },
        { field: 'sport', headerName: 'Deporte' },
        { field: 'category_weight', headerName: 'Categoría (Kg)' },
        { field: 'team', headerName: 'Equipo' },
        {
            field: 'actions', headerName: 'Acciones', render: (athlete: Athlete) => <AthleteActions athlete={athlete} />
        },
    ];

    const [athletes, setAthletes] = useState<Athlete[]>([])

    const getAthletesData = async () => {
        const { data: athletesData, error: athletesError } = await getAthletes()

        if (athletesError) throw new Error(athletesError.message)

        let rows = athletesData.map(athlete => ({
            ...athlete,
            birth_day: athlete.birth_day
        }))

        setAthletes(rows)
    }

    useEffect(() => {
        setCrumbs([
            { label: 'Atletas', path: '/athletes' },
        ])

        getAthletesData()

        isAthletesPage &&
            setHeaderConfig({
                title: 'Atletas',
                description: "Gestiona los perfiles y datos de los atletas de tu equipo.",
                rightContent: (
                    <Link className="btn btn-primary" to="/athletes/new">
                        <Plus />
                        Añadir atleta
                    </Link>
                )
            })
    }, [isAthletesPage])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage />
            <main className="flex flex-col gap-4">
                {
                    isAthletesPage && athletes.length > 0 ? (
                        <Table
                            classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                            rows={athletes}
                            columns={columns}
                        />
                    ) : <Outlet />
                }
            </main>
        </section>
    );
};

export default Athletes;
