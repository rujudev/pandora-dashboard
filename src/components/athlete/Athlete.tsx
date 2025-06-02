import { ChangeEvent, useEffect, useState } from "react";
import { useLoaderData, useLocation, useOutletContext } from "react-router";
import { AthleteOutletContext } from "../../interfaces/athlete/athlete-route-outlet.interface";
import { LoaderData } from "../../interfaces/loader-data.interface";

import { Athlete } from "../../interfaces/athlete.interface";
import { calculateAge } from "../../utils/date";
import { FieldsetDate, FieldsetText } from "../fieldset";
import { Save } from "../Icon";

const AthleteComponent = () => {
    const { pathname } = useLocation();
    const { athlete } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const isAthleteEditPage = pathname.includes('/athlete') && pathname.includes('/edit')
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete>({
        id: '',
        name: '',
        last_name: '',
        birth_date: '',
        age: 0,
        sport: '',
        category: '',
        team: '',
        trainings: []
    });

    const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const { id, value } = target;

        setSelectedAthlete((prev: Athlete) => {
            return {
                ...prev,
                [id]: value
            };
        })
    }

    useEffect(() => {
        if (!athlete) return;

        setSelectedAthlete(athlete);
    }, [athlete])

    useEffect(() => {
        isAthleteEditPage &&
            setHeaderConfig({
                hasBackButton: true,
                hasActionButton: false,
                title: 'Gestionar atleta',
                description: (
                    <>
                        Editar perfil de <strong>{selectedAthlete?.name} {selectedAthlete?.last_name}</strong>
                    </>
                ),
            })
    }, [pathname, selectedAthlete])

    return (
        <form className="flex flex-col gap-10 w-full" onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
        }}>
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold uppercase">Datos personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 border-[1px] border-neutral rounded-xl w-full gap-5 p-5">
                    <FieldsetText id="name" legend="Nombre" placeholder="Nombre" value={selectedAthlete?.name} onChange={onHandleChange} />
                    <FieldsetText id="last_name" legend="Apellidos" placeholder="Apellidos" value={selectedAthlete?.last_name} onChange={onHandleChange} />
                    <FieldsetDate mode="single" id="birth_date" legend="Fecha de nacimiento" placeholder="Selecciona una fecha" selected={new Date(selectedAthlete?.birth_day || '')} />
                    <FieldsetText id="age" legend="Edad" placeholder="Edad" value={calculateAge(selectedAthlete?.birth_day)} label="Calculada automáticamente" onChange={onHandleChange} readOnly />
                    <FieldsetText id="sport" legend="Deporte" placeholder="Deporte" value={selectedAthlete?.sport} onChange={onHandleChange} readOnly />
                    <FieldsetText id="category" legend="Categoría" placeholder="Categoría" value={selectedAthlete?.category_weight} onChange={onHandleChange} readOnly />
                    <FieldsetText id="team" legend="Equipo" placeholder="Equipo" value={selectedAthlete?.team} onChange={onHandleChange} readOnly />
                </div>
            </div>
            <div className="flex justify-end w-full">
                <button type="submit" className="flex gap-2 btn btn-primary">
                    <Save /> Guardar cambios
                </button>
            </div>
        </form>
    )
}

export default AthleteComponent