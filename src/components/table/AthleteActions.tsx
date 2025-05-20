import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Athlete } from "../../interfaces/athlete.interface"
import { getAthleteTrainings } from "../../services/athletes"
import { EditUser, Remove, ViewTraining } from "../Icon"

const AthleteActions = ({ athlete }: { athlete: Athlete }) => {
    const [athleteHasTrainings, setAthleteHasTrainings] = useState(false)

    const checkIfAthleteHasTrainings = async () => {
        const athleteTrainings = await getAthleteTrainings(athlete.id_athlete);

        setAthleteHasTrainings(athleteTrainings.length > 0)
    }

    useEffect(() => {
        checkIfAthleteHasTrainings();
    }, [athlete])

    return (
        <div className="grid grid-cols-3 justify-between gap-5 w-fit">
            <Link className="col-start-1 transition-colors duration-200 hover:text-info cursor-pointer" to={`/athletes/${athlete.id_athlete}/edit`}>
                <EditUser />
            </Link>
            {athleteHasTrainings && (
                <Link
                    className="col-start-2 transition-colors duration-200 hover:text-success cursor-pointer"
                    to={`/athletes/${athlete.id_athlete}/trainings`}>
                    <ViewTraining />
                </Link>
            )}
            <Link className="col-start-3 transition-colors duration-200 hover:text-error cursor-pointer" to={''}>
                <Remove />
            </Link>
        </div>
    )
}

export default AthleteActions