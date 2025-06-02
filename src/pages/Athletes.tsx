import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import HeaderPage, { HeaderProps } from "../components/HeaderPage";
import { Plus } from "../components/Icon";
import AthleteActions from "../components/table/AthleteActions";
import Table, { Column } from "../components/table/Table";
import { Athlete } from "../interfaces/athlete.interface";
import { getAthletes } from "../services/athletes";
import { calculateAge } from "../utils/date";

const Athletes = () => {
    const { pathname } = useLocation();
    const [headerConfig, setHeaderConfig] = useState<HeaderProps>({
        hasBackButton: false,
        title: '',
        description: '',
    })

    const isAthletesPage = pathname === '/athletes';

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
            field: 'birth_day', headerName: 'Fecha de nacimiento', render: (athlete: Athlete) => (
                <span>{athlete.birth_day?.toLocaleDateString()}</span>
            )
        },
        {
            field: 'age', headerName: 'Edad', render: (athlete: Athlete) => (
                <span>{calculateAge(athlete.birth_day)}</span>
            )
        },
        { field: 'sport', headerName: 'Deporte' },
        { field: 'category_weight', headerName: 'Categoría (Kg)' },
        { field: 'team', headerName: 'Equipo' },
        {
            field: 'actions', headerName: 'Acciones', render: (athlete: Athlete) => <AthleteActions athlete={athlete} />
        },
    ];

    const [rows, setRows] = useState<Athlete[]>([])

    useEffect(() => {
        getAthletes().then(setRows)
    }, [])

    useEffect(() => {
        isAthletesPage &&
            setHeaderConfig({
                hasBackButton: false,
                title: 'Atletas',
                description: "Gestiona los perfiles y datos de los atletas de tu equipo.",
                rightContent: (
                    <Link className="btn btn-primary" to="/athletes/new">
                        <Plus />
                        Añadir atleta
                    </Link>
                )
            })
    }, [pathname])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage
                title={headerConfig.title}
                description={headerConfig.description}
                hasBackButton={headerConfig.hasBackButton}
                rightContent={headerConfig.rightContent}
            />
            <main className="flex flex-col gap-4">
                {
                    pathname === '/athletes' ? (
                        <Table
                            classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                            rows={rows}
                            columns={columns}
                        />
                    ) : <Outlet context={{ setHeaderConfig }} />
                }
            </main>
        </section>
    );
};

export default Athletes;
