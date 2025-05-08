import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import Button from "../components/Button";
import HeaderPage from "../components/HeaderPage";
import { AddTraining, EditUser, Plus, Remove } from "../components/Icon";
import Table from "../components/Table";
import { getAthletes } from "../services/athletes";
import { Athlete } from "../types/athlete.types";

const Athletes = () => {
    const { pathname } = useLocation();
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

    /**
        { width: 200 }           → 'w-[200px]'     // Números → px + []
        { width: '200' }         → 'w-[200px]'     // Strings numéricos → px + []
        { width: '200px' }       → 'w-[200px]'     // Strings con unidad → []
        { width: '50%' }         → 'w-[50%]'       // Porcentajes → []
        { width: '1/2' }         → 'w-1/2'         // Fracciones sin []
        { width: 'auto' }        → 'w-auto'        // Valores especiales sin []
        { width: 'w-[100px]' }   → 'w-[100px]'     // Ya formateado → no cambia
        { width: 'w-auto' }      → 'w-auto'        // Ya formateado → no cambia 
    */

    const columns = [
        { field: 'name', headerName: 'Nombre' },
        { field: 'last_name', headerName: 'Apellidos' },
        { field: 'birth_date', headerName: 'Fecha de nacimiento' },
        { field: 'age', headerName: 'Edad' },
        { field: 'sport', headerName: 'Deporte' },
        { field: 'category', headerName: 'Categoría (Kg)' },
        { field: 'team', headerName: 'Equipo' },
        {
            field: 'actions', headerName: 'Acciones', render: (athlete: Athlete) => (
                <div className="flex gap-5">
                    <Link className="transition-colors duration-200 hover:text-info cursor-pointer" to={`/athletes/${athlete.id}/edit`}>
                        <EditUser />
                    </Link>
                    <Link className="transition-colors duration-200 hover:text-success cursor-pointer" to={''}>
                        <AddTraining />
                    </Link>
                    <Link className="transition-colors duration-200 hover:text-error cursor-pointer" to={''}>
                        <Remove />
                    </Link>
                </div>
            )
        },
    ];

    const [rows, setRows] = useState<Athlete[]>([])
    const header = {
        title: pathname === '/athletes' ? 'Atletas' : 'Gestionar atleta',
        description: pathname === '/athletes'
            ? "Gestiona los perfiles y datos de los atletas de tu equipo."
            : (
                <>
                    Editar perfil de <strong>{selectedAthlete?.name} {selectedAthlete?.last_name}</strong>
                </>
            )
    }

    useEffect(() => {
        getAthletes().then(setRows)
    }, [])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage
                title={header.title}
                description={header.description}
            >
                <Button text="Nuevo atleta">
                    <Plus />
                </Button>
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
                    ) : <Outlet context={{ setSelectedAthlete }} />
                }
            </main>
        </section>
    );
};

export default Athletes;
