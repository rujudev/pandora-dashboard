import { FC } from "react"
import { useAthleteTraining } from "../../hooks/useAthleteTraining"
import { ExerciseWithIntensity } from "../../interfaces/interfaces_compuestas.interface"
import Collapse from "../Collapse"
import { FieldsetSelect, FieldsetText } from "../fieldset"
import { Plus } from "../Icon"
import Intensities from "../intensity/Intensities"
import IntensityModalForm from "../intensity/IntensityModalForm"
import OpenModalButton from "../modal/OpenModalButton"

interface Props {
    sessionId: number;
    exercises: ExerciseWithIntensity[];
}
const Exercises: FC<Props> = ({
    sessionId,
    exercises,
}) => {
    const {
        state,
        setSessionExerciseName,
        setSessionExerciseAbbreviation,
        setSessionExerciseMovement
    } = useAthleteTraining()

    return (
        <>
            {exercises.map(({ id_exercise, exercise_name, abreviation, intensities, id_movement }) => {
                const movement = state.muscle_movements.find(movement => movement.id_movement === id_movement) ?? {
                    id_movement: 0,
                    movement_name: '',
                    weight_ref: 0
                };

                return (
                    <Collapse key={id_exercise} title={exercise_name} name={exercise_name}>
                        <div className="flex flex-col gap-5 collapse-content text-sm">
                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <FieldsetText
                                    legend="Nombre"
                                    placeholder="Nombre"
                                    value={exercise_name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setSessionExerciseName(sessionId, id_exercise, name);
                                    }}
                                />
                                <FieldsetText
                                    legend="Abreviatura"
                                    placeholder="Abreviatura"
                                    value={abreviation}
                                    onChange={(e) => {
                                        const abbreviation = e.target.value;
                                        setSessionExerciseAbbreviation(sessionId, id_exercise, abbreviation);
                                    }}
                                />
                                <FieldsetSelect
                                    legend="Movimiento muscular"
                                    placeholder="Selecciona un movimiento muscular"
                                    value={id_movement}
                                    options={state.muscle_movements.map(({ id_movement, movement_name }) =>
                                        ({ id: id_movement, option: movement_name }))}
                                    onChange={(e) => {
                                        const selectedMovementId = Number(e.target.value);
                                        setSessionExerciseMovement(sessionId, id_exercise, selectedMovementId);
                                    }}
                                />
                                <FieldsetText
                                    legend="Peso de referencia"
                                    value={movement.weight_ref}
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col gap-5 col-span-2">
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-semibold">Intensidades</h2>
                                    <OpenModalButton
                                        buttonIcon={<Plus />}
                                        buttonText="Nueva intensidad"
                                        modalContent={<IntensityModalForm />}
                                        modalId="add-intensity"
                                    />
                                </div>
                                <Intensities
                                    intensities={intensities}
                                    sessionId={sessionId}
                                    exerciseId={id_exercise}
                                    weightRef={movement.weight_ref}
                                />
                            </div>
                        </div>
                    </Collapse>
                )
            })}
        </>
    )
}

export default Exercises