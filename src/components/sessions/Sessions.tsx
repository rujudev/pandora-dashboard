import { ChangeEvent } from "react";
import { SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/muscle-movement-weight.interface";
import { CalendarWeek, Plus } from "../Icon";
import Session from "./Session";

const Sessions = ({
    sessions,
    muscleMovements,
    onChangeDayWeek,
    onChangeDayPeriod,
    onChangeExerciseMuscleMovement,
}: {
    sessions: SessionWithExercisesAndIntensities[],
    muscleMovements: MuscleMovementWithWeightRef[],
    onChangeDayWeek: (dayWeek: string) => void,
    onChangeDayPeriod: (dayPeriod: string) => void,
    onChangeExerciseMuscleMovement: (sessionId: number, movementId: number, exerciseId: number) => void
}) => {
    const onHandleChangeDayWeek = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        onChangeDayWeek(value)
    }

    const onHandleChangeDayPeriod = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        onChangeDayPeriod(value)
    }

    return (
        <div className="col-span-2 flex flex-col justify-items-end gap-5 text-sm border border-neutral rounded-xl p-4 w-full">
            <div className="flex justify-between">
                <div className="flex gap-5 items-center">
                    <CalendarWeek />
                    <h1 className="text-lg">Sesiones</h1>
                </div>
                <button className="flex btn btn-primary gap-2 w-fit">
                    <Plus />
                    Nueva sesión
                </button>
            </div>
            {sessions && sessions.length > 0 &&
                sessions.map(({ id_session, day_week, day_period, exercises }) =>
                    <Session
                        key={id_session}
                        day_week={day_week}
                        day_period={day_period}
                        exercises={exercises}
                        muscleMovements={muscleMovements}
                        onChangeDayWeek={onHandleChangeDayWeek}
                        onChangeDayPeriod={onHandleChangeDayPeriod}
                        onChangleExerciseMuscleMovement={(movementId, exerciseId) =>
                            onChangeExerciseMuscleMovement(id_session, movementId, exerciseId)}
                    />
                )
            }
        </div>
    )
}

export default Sessions;