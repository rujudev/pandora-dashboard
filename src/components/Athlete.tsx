import { useEffect } from "react"
import { useLoaderData, useOutletContext } from "react-router"
import { Athlete } from "../types/athlete.types"
import FieldsetDate from "./FieldsetDate"
import FieldsetText from "./FieldsetText"

const AthleteComponent = () => {
    const athlete = useLoaderData() as Athlete;
    const { setSelectedAthlete } = useOutletContext<{ setSelectedAthlete: (a: Athlete) => void }>();

    useEffect(() => {
        setSelectedAthlete(athlete);
    }, [athlete])

    return (
        <form className="max-sm:flex sm:grid grid-cols-2 w-full p-5 gap-5">
            <FieldsetText legend="Nombre" placeholder="Nombre" />
            <FieldsetText legend="Apellidos" placeholder="Apellidos" />
            <FieldsetDate legend="Fecha de nacimiento" placeholder="Selecciona una fecha" />
            <FieldsetText legend="Edad" placeholder="Edad" value="23" label="Calculada automáticamente" readOnly />
            <FieldsetText legend="Deporte" placeholder="Deporte" value="Atletismo" readOnly />
            <FieldsetText legend="Categoría" placeholder="Categoría" value="79 Kg" readOnly />
            <FieldsetText legend="Equipo" placeholder="Equipo" value="Pandora Box Team" readOnly />
        </form>
    )
}

export default AthleteComponent