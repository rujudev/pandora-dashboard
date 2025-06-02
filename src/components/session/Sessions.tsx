import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface";
import { DayPeriod, DayWeek } from "../../types/day.types";
import { CalendarWeek, Plus } from "../Icon";
import OpenModalButton from "../modal/OpenModalButton";
import Session from "./Session";
import SessionModalForm from "./SessionModalForm";

const dayWeekOrder: DayWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const dayPeriodOrder: DayPeriod[] = ['Mañana', 'Tarde', 'Noche'];

const Sessions = () => {
    const { state, addSession } = useAthleteTraining();
    const { sessions } = state;

    const sortDescByDayWeekAndDayPeriod = (a: SessionWithExercisesAndIntensities, b: SessionWithExercisesAndIntensities) => {
        const dayA = dayWeekOrder.indexOf(a.day_week);
        const dayB = dayWeekOrder.indexOf(b.day_week);

        if (dayA !== dayB) return dayA - dayB;

        const periodA = dayPeriodOrder.indexOf(a.day_period);
        const periodB = dayPeriodOrder.indexOf(b.day_period);

        return periodA - periodB
    }

    return (
        <>
            <div className="flex justify-between">
                <div className="flex gap-5 items-center">
                    <CalendarWeek />
                    <h1 className="text-lg">Sesiones</h1>
                </div>
                <OpenModalButton
                    buttonIcon={<Plus />}
                    buttonText="Nueva sesión"
                    modalContent={
                        <SessionModalForm
                            muscleMovements={state.muscle_movements}
                            onAddSession={(session) => addSession(session)}
                        />
                    }
                    modalId={`add-session`}
                />
            </div>
            {sessions && sessions.length > 0 && (
                <div className="flex flex-col gap-3">
                    {sessions
                        .sort(sortDescByDayWeekAndDayPeriod)
                        .map((session) =>
                            <Session key={session.id_session} session={session} />
                        )}
                </div>
            )}
        </>
    )
}

export default Sessions;