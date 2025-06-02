import { FC } from "react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface";
import { DayPeriod, DayWeek } from "../../types/day.types";
import Collapse from "../Collapse";
import ExerciseForm from "../exercise/ExerciseModalForm";
import Exercises from "../exercise/Exercises";
import { FieldsetSelect } from "../fieldset";
import { Plus } from "../Icon";
import OpenModalButton from "../modal/OpenModalButton";

interface Props {
    session: SessionWithExercisesAndIntensities,
}
const Session: FC<Props> = ({ session }) => {
    const { state, setSessionDayWeek, setSessionDayPeriod, SessionModalFormExercise } = useAthleteTraining();
    const muscleMovements = state?.muscle_movements;
    const { id_session: sessionId, day_week: dayWeek, day_period: dayPeriod, exercises } = session;

    return (
        <Collapse title={`${dayWeek} - ${dayPeriod}`} name="session-1">
            <div className="flex flex-col collapse-content text-sm gap-10">
                <div className="flex gap-5">
                    <FieldsetSelect
                        legend="Día"
                        placeholder="Selecciona un día de la semana"
                        value={dayWeek}
                        options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(option => ({ id: option, option }))}
                        onChange={(e) => {
                            const dayWeek = e.target.value as DayWeek;
                            setSessionDayWeek(sessionId, dayWeek);
                        }}
                    />
                    <FieldsetSelect
                        legend="Tipo día"
                        placeholder="Selecciona una modalidad de día"
                        value={dayPeriod}
                        options={['Mañana', 'Tarde'].map(option => ({ id: option, option }))}
                        onChange={(e) => {
                            const dayPeriod = e.target.value as DayPeriod;
                            setSessionDayPeriod(sessionId, dayPeriod);
                        }}
                    />
                </div>
                <div className="flex flex-col w-full gap-5">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Ejercicios</h2>
                        <OpenModalButton
                            buttonIcon={<Plus />}
                            buttonText="Nuevo ejercicio"
                            modalContent={
                                <ExerciseForm
                                    muscleMovements={muscleMovements}
                                    onSave={(exercise) =>
                                        SessionModalFormExercise(sessionId, exercise)}
                                />
                            }
                            modalId="add-exercise"
                        />
                    </div>
                    {exercises.length > 0
                        ? <Exercises sessionId={sessionId} exercises={exercises} />
                        : <p>La sesión no tiene ejercicios añadidos</p>}
                </div>
            </div>
        </Collapse>
    )
}

export default Session;