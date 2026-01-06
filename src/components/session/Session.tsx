import { FC } from "react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { SessionWithExercisesAndIntensities } from "../../interfaces/session/session-with-exercises-and-intensities.interface";
import ExerciseModalForm from "../exercise/ExerciseModalForm";
import Exercises from "../exercise/Exercises";
import { Plus } from "../Icon";
import OpenModalButton from "../modal/OpenModalButton";

interface Props {
    session: SessionWithExercisesAndIntensities,
}
const Session: FC<Props> = ({ session }) => {
    const { state, setSessionDayWeek, setSessionDayPeriod, addExerciseToSession } = useAthleteTraining();
    const muscleMovements = state?.muscle_movements || [];
    const { id_session: sessionId, day_week: dayWeek, day_period: dayPeriod, exercises } = session;
    console.log("Session data:", session);

    return (
        <div className="flex flex-col w-full gap-3 p-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Ejercicios</h2>
                <OpenModalButton
                    buttonIcon={<Plus />}
                    buttonText="Nuevo ejercicio"
                    modalContent={
                        <ExerciseModalForm
                            muscleMovements={muscleMovements}
                            onSave={(exercise) => console.log("Exercise saved:", exercise)}
                        />
                    }
                    modalId="add-exercise"
                />
            </div>
            {exercises.length > 0
                ? <Exercises sessionId={sessionId} exercises={exercises} />
                : <p>La sesión no tiene ejercicios añadidos</p>}
        </div>
    )
}

export default Session;