import { ReactElement, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import Button from "../components/Button";
import HeaderPage from "../components/HeaderPage";
import { EditUser, Plus, Remove, ViewTraining } from "../components/Icon";
import Table, { Column } from "../components/Table";
import { getAthletes } from "../services/athletes";
import { Athlete } from "../types/athlete.types";

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
        { field: 'name', headerName: 'Nombre' },
        { field: 'last_name', headerName: 'Apellidos' },
        { field: 'birth_date', headerName: 'Fecha de nacimiento' },
        { field: 'age', headerName: 'Edad' },
        { field: 'sport', headerName: 'Deporte' },
        { field: 'category', headerName: 'Categoría (Kg)' },
        { field: 'team', headerName: 'Equipo' },
        {
            field: 'actions', headerName: 'Acciones', render: (athlete: Athlete) => (
                <div className="flex justify-between gap-5">
                    <Link className="transition-colors duration-200 hover:text-info cursor-pointer" to={`/athletes/${athlete.id}/edit`}>
                        <EditUser />
                    </Link>
                    {athlete.trainings.length > 0 && (
                        <Link
                            className="transition-colors duration-200 hover:text-success cursor-pointer"
                            to={`/athletes/${athlete.id}/trainings`}>
                            <ViewTraining />
                        </Link>
                    )}
                    <Link className="transition-colors duration-200 hover:text-error cursor-pointer" to={''}>
                        <Remove />
                    </Link>
                </div>
            )
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
                            checkboxSelection={true}
                        />
                    ) : <Outlet context={{ setHeaderConfig }} />
                }
            </main>
        </section>
    );
};

export default Athletes;
