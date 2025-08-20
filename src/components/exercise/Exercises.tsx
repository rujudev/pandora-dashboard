import { FC } from "react"
import { useAthleteTraining } from "../../hooks/useAthleteTraining"
import { ExerciseWithIntensity } from "../../interfaces/exercise/exercise-with-intensity.interface"
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface"
import Card from "../card/Card"
import CardBody from "../card/CardBody"
import Collapse from "../Collapse"
import { FieldsetSelect, FieldsetText } from "../fieldset"
import { Plus, TrainingPageIcon } from "../Icon"
import Intensities from "../intensity/Intensities"
import IntensityModalForm from "../intensity/IntensityModalForm"
import OpenModalButton from "../modal/OpenModalButton"
import ExerciseModalForm from "./ExerciseModalForm"

interface Props {
    blockId: number;
    canAddExercises: boolean;
    sessionId: number;
    exercises: ExerciseWithIntensity[];
}
const Exercises: FC<Props> = ({
    blockId,
    canAddExercises,
    sessionId,
    exercises,
}) => {
    const {
        state,
        addExercise,
        removeExercise,
        setExerciseName,
        setExerciseAbbr,
        setExerciseMovement,
        addIntensity
    } = useAthleteTraining()

    return (
        <div className="flex flex-col w-full gap-3 p-4">
            {canAddExercises && (
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">Ejercicios</h2>
                    <OpenModalButton
                        buttonIcon={<Plus />}
                        buttonText="Nuevo ejercicio"
                        modalContent={
                            <ExerciseModalForm
                                modalId="add-exercise"
                                muscleMovements={state?.muscle_movements || []}
                                onSave={(exercise) => {
                                    addExercise(blockId, sessionId, exercise)
                                }}
                            />
                        }
                        modalId="add-exercise"
                    />
                </div>
            )}
            {exercises.length > 0 ? exercises.map(({ id_exercise, exercise_name, abreviation, intensities, id_movement }) => {
                const movement = state?.muscle_movements.find(movement => movement.id_movement === id_movement) ?? {
                    id_movement: 0,
                    movement_name: '',
                    weight_ref: 0
                };

                return (
                    <Collapse
                        key={id_exercise}
                        id={id_exercise}
                        title={exercise_name}
                        name={exercise_name}
                        onRemove={exerciseId => removeExercise(blockId, sessionId, exerciseId)}
                        isSubCollapse
                    >
                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <FieldsetText
                                legend="Nombre"
                                placeholder="Nombre"
                                value={exercise_name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setExerciseName(blockId, sessionId, id_exercise, name);
                                }}
                            />
                            <FieldsetText
                                legend="Abreviatura"
                                placeholder="Abreviatura"
                                value={abreviation}
                                onChange={(e) => {
                                    const abbreviation = e.target.value;
                                    setExerciseAbbr(blockId, sessionId, id_exercise, abbreviation);
                                }}
                            />
                            <FieldsetSelect
                                legend="Movimiento muscular"
                                placeholder="Selecciona un movimiento muscular"
                                value={id_movement}
                                options={state?.muscle_movements.map(({ id_movement, movement_name }) =>
                                    ({ id: id_movement, option: movement_name })) || []}
                                onChange={(e) => {
                                    const selectedMovementId = Number(e.target.value);
                                    setExerciseMovement(blockId, sessionId, id_exercise, selectedMovementId);
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
                                    modalContent={
                                        <IntensityModalForm
                                            modalId="add-intensity"
                                            weight={movement.weight_ref}
                                            mode="create"
                                            onSubmit={intensity => {
                                                const newIntensity: IntensityWithSeriesRepetitionsZoneAndSets = {
                                                    ...intensity,
                                                    id_intensity: intensities.length > 0 ? Math.max(...intensities.map(intensity => intensity.id_intensity)) + 1 : 1
                                                }

                                                addIntensity(blockId, sessionId, id_exercise, newIntensity)
                                            }
                                            }
                                        />
                                    }
                                    modalId="add-intensity"
                                />
                            </div>
                            <Intensities
                                blockId={blockId}
                                intensities={intensities}
                                sessionId={sessionId}
                                exerciseId={id_exercise}
                                weightRef={movement.weight_ref}
                            />
                        </div>
                    </Collapse>
                )
            }) : (
                <Card>
                    <CardBody classes="flex flex-col items-center gap-3">
                        <TrainingPageIcon classes="size-8 text-base-content opacity-55" />
                        <h2 className="text-base-content opacity-55">No hay ejercicios asignados</h2>
                    </CardBody>
                </Card>
            )}
        </div>
    )
}

export default Exercises