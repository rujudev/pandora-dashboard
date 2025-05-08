import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Button from "../components/Button";
import HeaderPage from "../components/HeaderPage";
import { Plus } from "../components/Icon";
import Table from "../components/Table";
import { getAthletes } from "../services/athletes";

const Athletes = () => {
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
        { field: 'actions', headerName: 'Acciones' },
    ];

    const [rows, setRows] = useState([])

    useEffect(() => {
        getAthletes().then(athletes => {
            console.log(athletes);

            setRows(athletes)
        })
    }, [])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage
                title="Atletas"
                description="Gestiona los perfiles y datos de los atletas de tu equipo."
            >
                <Button text="Nuevo atleta">
                    <Plus />
                </Button>
            </HeaderPage>
            <main className="flex flex-col gap-4">
                <Table
                    classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                    rows={rows}
                    columns={columns}
                    checkboxSelection={true}
                />
                <Outlet />
            </main>
        </section>
    );
};

export default Athletes;
