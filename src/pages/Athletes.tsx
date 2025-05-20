import { ReactElement, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Button from "../components/Button";
import HeaderPage from "../components/HeaderPage";
import { Plus } from "../components/Icon";
import AthleteActions from "../components/table/AthleteActions";
import Table, { Column } from "../components/table/Table";
import { Athlete } from "../interfaces/athlete.interface";
import { getAthletes } from "../services/athletes";
import { calculateAge } from "../utils/date";

export type HeaderConfig = {
    hasBackButton: boolean,
    hasActionButton: boolean,
    title: string,
    description: string | ReactElement,
}

const Athletes = () => {
    const { pathname } = useLocation();
    const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
        hasBackButton: false,
        hasActionButton: false,
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
                hasActionButton: true,
                title: 'Atletas',
                description: "Gestiona los perfiles y datos de los atletas de tu equipo."
            })
    }, [pathname])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage
                title={headerConfig.title}
                description={headerConfig.description}
                hasBackButton={headerConfig.hasBackButton}
            >
                {headerConfig.hasActionButton && (
                    <Button text="Nuevo atleta">
                        <Plus />
                    </Button>
                )}
            </HeaderPage>
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
