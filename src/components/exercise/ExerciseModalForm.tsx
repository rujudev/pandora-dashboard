import { isEqual } from 'lodash';
import { FC, useEffect, useState } from "react";
import { useDialog } from "../../hooks/useDialog";
import { ExerciseWithIntensity, IntensityWithSeriesRepetitionsZoneAndSets, MovementsWithWeightRef } from "../../interfaces/interfaces_compuestas.interface";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { FieldsetSelect, FieldsetText } from "../fieldset";
import { Bolt, EditBolt, Plus, Remove } from "../Icon";
import { zoneColor } from "../intensity/Intensity";
import IntensityModalForm from "../intensity/IntensityModalForm";
import OpenModalButton from "../modal/OpenModalButton";
import Table, { Column } from "../table/Table";

const initialExerciseState: ExerciseWithIntensity = {
    abreviation: '',
    exercise_name: '',
    id_exercise: 0,
    id_movement: 0,
    intensities: [],
    remarks: ''
}

const initialSelectedMovement: MovementsWithWeightRef = {
    id_movement: 0,
    movement_name: '',
    weight_ref: 0
}

interface Props {
    muscleMovements: MovementsWithWeightRef[];
    modalId?: string;
    initialExercise?: ExerciseWithIntensity;
    onSave: (exercise: ExerciseWithIntensity) => void;
}
const ExerciseModalForm: FC<Props> = ({ muscleMovements, modalId, initialExercise, onSave }) => {
    const { closeDialog } = useDialog()
    const [exerciseDraft, setExerciseDraft] = useState<ExerciseWithIntensity>(initialExercise ?? initialExerciseState)
    const [movementInfo, setMovementInfo] = useState<MovementsWithWeightRef>(initialSelectedMovement)
    const isEditing = Boolean(initialExercise);

    useEffect(() => {
        if (initialExercise) {
            const movement = muscleMovements.find(movement => movement.id_movement === initialExercise.id_movement)

            movement && setMovementInfo(movement)
        }
    }, [initialExercise])

    const intensitiesTableColumns: Column[] = [
        {
            field: 'zone',
            headerName: 'Zona',
            render: (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => (
                <div className="flex justify-center items-center gap-3">
                    <div aria-label="status" className={`status size-4${intensity.zone ? ` status-${zoneColor[intensity.zone]?.colorId}` : ''}`}></div>
                    <span>{intensity.zone}</span>
                </div>
            )
        },
        {
            field: 'series',
            headerName: 'Series'
        },
        {
            field: 'repetitions',
            headerName: 'Repeticiones'
        },
        {
            field: 'sets',
            headerName: 'Rango de porcentajes',
            render: (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => {
                const percentages = intensity.sets.map(set => set.percentage);
                const minPercentage = Math.min(...percentages);
                const minWeight = (movementInfo.weight_ref * minPercentage) / 100;

                const maxPercentage = Math.max(...percentages);
                const maxWeight = (movementInfo.weight_ref * maxPercentage) / 100

                return (
                    <div className="flex items-center justify-around">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <span>{minPercentage} %</span>
                            <span>{minWeight} Kg</span>
                        </div>
                        <span>-</span>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <span>{maxPercentage} %</span>
                            <span>{maxWeight} Kg</span>
                        </div>
                    </div>
                )
            }
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            render: (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => (
                <div className="grid grid-cols-2 gap-5 w-fit">
                    <OpenModalButton
                        buttonIcon={<EditBolt />}
                        classes="transition-colors duration-200 hover:text-info cursor-pointer"
                        modalContent={
                            <IntensityModalForm
                                mode="edit"
                                modalId="edit-intensity"
                                intensity={intensity}
                                weight={movementInfo.weight_ref}
                                onSubmit={handleUpdateIntensity}
                            />
                        }
                        modalId="edit-intensity"
                    />
                    <button className="transition-colors duration-200 hover:text-error cursor-pointer">
                        <Remove />
                    </button>

                </div>
            )
        }
    ]

    const handleMovementChange = (movementId: number) => {
        const movement = muscleMovements.find(movement => movement.id_movement === movementId)

        if (movement) {
            setMovementInfo(movement)
            setExerciseDraft((pE: ExerciseWithIntensity) => ({ ...pE, id_movement: movementId }));
        }
    }

    const handleIntensityModalForm = (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => {
        setExerciseDraft(prevExercise => ({
            ...prevExercise,
            intensities: [
                ...prevExercise.intensities,
                intensity
            ]
        }))
    }

    const handleUpdateIntensity = (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => {
        setExerciseDraft(prevExercise => ({
            ...prevExercise,
            intensities: prevExercise.intensities.map(prevIntensity => {
                if (prevIntensity.id_intensity !== intensity.id_intensity) return prevIntensity;

                return {
                    ...prevIntensity,
                    ...intensity
                }
            })
        }))
    }

    const resetForm = () => {
        setExerciseDraft(initialExerciseState)
        setMovementInfo(initialSelectedMovement)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col text-sm bg-base-200 rounded-xl">
                <h2 className="text-xl font-semibold text-center my-4">
                    {isEditing ? `Editar "${exerciseDraft?.exercise_name}"` : 'Nuevo ejercicio'}
                </h2>
                <div className="flex flex-col pl-4 pr-4 pb-4 gap-5">
                    <div className="grid grid-cols-2 gap-5 bg-base-100 rounded-xl p-6">
                        <FieldsetText
                            legend="Nombre"
                            placeholder="Nombre"
                            value={exerciseDraft.exercise_name}
                            onChange={(e) => {
                                const exercise_name = e.target.value;
                                setExerciseDraft((pE: ExerciseWithIntensity) => ({ ...pE, exercise_name }));
                            }}
                        />
                        <FieldsetText
                            legend="Abreviatura"
                            placeholder="Abreviatura"
                            value={exerciseDraft.abreviation}
                            onChange={(e) => {
                                const abreviation = e.target.value;
                                setExerciseDraft((pE: ExerciseWithIntensity) => ({ ...pE, abreviation }));
                            }}
                        />
                        <FieldsetSelect
                            legend="Movimiento muscular"
                            placeholder="Selecciona un movimiento muscular"
                            value={exerciseDraft.id_movement || 'null'}
                            options={muscleMovements.map(({ id_movement, movement_name }) =>
                                ({ id: id_movement, option: movement_name }))}
                            onChange={(e) => {
                                const movementInfoId = Number(e.target.value);
                                handleMovementChange(movementInfoId)
                            }}
                        />
                        <FieldsetText
                            legend="Peso de referencia"
                            value={movementInfo.weight_ref}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col gap-5 col-span-2">
                        <div className="flex justify-between items-center bg-base-100 rounded-xl p-6">
                            <h2 className="text-xl font-semibold">Intensidades</h2>
                            <OpenModalButton
                                buttonIcon={<Plus />}
                                buttonText="Nueva intensidad"
                                modalContent={
                                    <IntensityModalForm
                                        mode='create'
                                        modalId="add-intensity"
                                        weight={movementInfo.weight_ref}
                                        onSubmit={handleIntensityModalForm}
                                    />
                                }
                                modalId="add-intensity"
                            />
                        </div>
                        {exerciseDraft.intensities.length > 0 ? (
                            <Table
                                classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                                columns={intensitiesTableColumns}
                                rows={exerciseDraft.intensities}
                                thClasses="text-center"
                                tdClasses="align-middle text-center"
                            />
                        ) : (
                            <Card>
                                <CardBody classes="flex flex-col items-center gap-3">
                                    <Bolt classes="size-8 text-base-content opacity-55" />
                                    <h2 className="text-base-content opacity-55">No hay intensidades creadas</h2>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-5">
                <button
                    className="flex btn btn-secondary gap-2"
                    command="close"
                    commandfor={modalId}
                    onClick={() => {
                        closeDialog(modalId || '')
                    }}
                >
                    Cancelar
                </button>
                <button
                    command="close"
                    commandfor={modalId}
                    className={`"flex btn btn-${isEditing ? 'warning' : 'primary'} gap-2"`}
                    onClick={() => {
                        onSave(exerciseDraft)

                        if (!isEditing) resetForm()

                        closeDialog(modalId || '')
                    }}
                    disabled={isEditing && isEqual(initialExercise, exerciseDraft)}
                >
                    {isEditing ? 'Actualizar ejercicio' : 'Guardar ejercicio'}
                </button>
            </div>
        </div>
    )
}

export default ExerciseModalForm;