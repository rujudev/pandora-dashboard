import { FC, useState } from "react"
import { useDialog } from "../../hooks/useDialog"
import { ExerciseWithIntensity, MovementsWithWeightRef, SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface"
import { DayPeriod, DayWeek } from "../../types/day.types"
import { Plus, Remove, TrainingPageIcon, ViewTraining } from "../Icon"
import Card from "../card/Card"
import CardBody from "../card/CardBody"
import ExerciseModalForm from '../exercise/ExerciseModalForm'
import { FieldsetSelect } from "../fieldset"
import FieldsetTextarea from "../fieldset/FieldsetTextarea"
import OpenModalButton from "../modal/OpenModalButton"
import { Tab } from "../tab/Tab"
import { Tabs } from "../tab/Tabs"
import Table, { Column } from "../table/Table"

interface SessionExerciseTableProps {
    exercises: ExerciseWithIntensity[],
    muscleMovements: MovementsWithWeightRef[],
    onUpdate: (exercise: ExerciseWithIntensity) => void
}
const SessionExercisesTable: FC<SessionExerciseTableProps> = ({ exercises, muscleMovements, onUpdate }) => {
    const exercisesWithMovementInfo = exercises.map(exercise => {
        const movement = muscleMovements.find(movement => movement.id_movement === exercise.id_movement)

        return {
            ...exercise,
            movementName: movement?.movement_name,
            weightRef: movement?.weight_ref
        }
    });

    const sessionExerciseTableColumns: Column[] = [
        {
            field: 'exercise_name',
            headerName: 'Ejercicio'
        },
        {
            field: 'abreviation',
            headerName: 'Abreviatura'
        },
        {
            field: 'movementName',
            headerName: 'Movimiento',
        },
        {
            field: 'weightRef',
            headerName: 'Peso de referencia (Kg)',
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            render: (exercise: ExerciseWithIntensity) => (
                <div className="grid grid-cols-2 gap-5 w-fit">
                    <OpenModalButton
                        buttonIcon={<ViewTraining />}
                        classes="transition-colors duration-200 hover:text-info cursor-pointer"
                        modalContent={
                            <ExerciseModalForm
                                modalId='edit-session-exercise'
                                initialExercise={exercise}
                                muscleMovements={muscleMovements}
                                onSave={onUpdate}
                            />
                        }
                        modalId="edit-session-exercise"
                    />
                    <button className="transition-colors duration-200 hover:text-error cursor-pointer">
                        <Remove />
                    </button>
                </div>
            )
        }
    ];

    return (
        <Table
            classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
            columns={sessionExerciseTableColumns}
            rows={exercisesWithMovementInfo}
            thClasses="text-center"
            tdClasses="text-center"
        />
    )
}

type SessionMetadata = {
    selectedDay: DayWeek | string,
    selectedPeriod: DayPeriod | string,
    note: string
}
interface SessionMetadataProps {
    metadata: SessionMetadata,
    onChange: (key: keyof SessionMetadata, value: string | DayWeek | DayPeriod) => void
}
const SessionMetadataForm: FC<SessionMetadataProps> = ({ metadata, onChange }) => {
    const { selectedDay, selectedPeriod, note } = metadata;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex bg-base-100 gap-5 p-6 rounded-xl">
                <FieldsetSelect
                    legend="Día"
                    placeholder="Selecciona un día de la semana"
                    value={selectedDay}
                    options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(option => ({ id: option, option }))}
                    onChange={(e) => {
                        const newSelectedDay = e.target.value as DayWeek;
                        onChange('selectedDay', newSelectedDay)
                    }}
                    required
                />
                <FieldsetSelect
                    legend="Tipo día"
                    placeholder="Selecciona una modalidad de día"
                    value={selectedPeriod}
                    options={['Mañana', 'Tarde'].map(option => ({ id: option, option }))}
                    onChange={(e) => {
                        const newSelectedPeriod = e.target.value as DayPeriod;
                        onChange('selectedPeriod', newSelectedPeriod);
                    }}
                    required
                />
            </div>
            <div className="bg-base-100 gap-5 p-6 rounded-xl">
                <FieldsetTextarea
                    value={note}
                    onChange={(e) => {
                        const newNote = e.target.value;
                        onChange('note', newNote)
                    }}
                    isOptional
                />
            </div>
        </div>
    )
}

interface SessionModalFormProps {
    muscleMovements: MovementsWithWeightRef[],
    onAddSession: (session: SessionWithExercisesAndIntensities) => void
}
const SessionModalForm: FC<SessionModalFormProps> = ({ muscleMovements, onAddSession }) => {
    const { closeDialog } = useDialog();
    const [sessionExercises, setSessionExercises] = useState<ExerciseWithIntensity[]>([])
    const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata>({
        selectedDay: 'null',
        selectedPeriod: 'null',
        note: ''
    });

    const handleAddExercise = (newExercise: ExerciseWithIntensity) => {
        setSessionExercises((prevExercises: ExerciseWithIntensity[]) => [...prevExercises, newExercise])
    }

    const handleUpdateExercise = (exercise: ExerciseWithIntensity) => {
        setSessionExercises(prevExercises => prevExercises.map(prevExercise => {
            if (prevExercise.id_exercise !== exercise.id_exercise) return prevExercise

            return {
                ...prevExercise,
                ...exercise
            }
        }))
    }

    const handleChangeMetadata = (key: keyof SessionMetadata, value: string | DayWeek | DayPeriod) => {
        setSessionMetadata(prevSessionMetadata => ({
            ...prevSessionMetadata,
            [key]: value
        }))
    }

    return (
        <div className="flex flex-col gap-5">
            <Tabs classes="tabs-box p-0 justify-center [&>input]:my-4">
                <Tab
                    label="Sesión"
                    name="session_tab"
                    content={
                        <SessionMetadataForm
                            metadata={sessionMetadata}
                            onChange={handleChangeMetadata}
                        />
                    }
                    defaultSelected
                />
                <Tab
                    label={`Ejercicios (${sessionExercises.length})`}
                    name="session_tab"
                    content={
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex items-center justify-between bg-base-100 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold">Ejercicios</h2>
                                <OpenModalButton
                                    buttonIcon={<Plus />}
                                    buttonText="Nuevo ejercicio"
                                    modalContent={
                                        <ExerciseModalForm
                                            modalId="add-session-exercise"
                                            muscleMovements={muscleMovements}
                                            onSave={handleAddExercise}
                                        />
                                    }
                                    modalId="add-session-exercise"
                                />
                            </div>
                            {sessionExercises.length > 0
                                ? <SessionExercisesTable exercises={sessionExercises} muscleMovements={muscleMovements} onUpdate={handleUpdateExercise} />
                                : (
                                    <Card>
                                        <CardBody classes="flex flex-col items-center gap-3">
                                            <TrainingPageIcon classes="size-8 text-base-content opacity-55" />
                                            <h2 className="text-base-content opacity-55">No hay entrenamientos asignados</h2>
                                        </CardBody>
                                    </Card>
                                )
                            }
                        </div>
                    }
                />
            </Tabs>
            <div className="flex justify-end gap-5">
                <button
                    className="flex btn btn-secondary gap-2"
                    command="close"
                    commandfor="add-session"
                    onClick={() => {
                        closeDialog('add-session')
                    }}
                >
                    Cancelar
                </button>
                <button
                    command="close"
                    commandfor="add-session"
                    className="flex btn btn-primary gap-2"
                    onClick={() => {
                        const { selectedDay, selectedPeriod, note } = sessionMetadata;

                        onAddSession({
                            day_week: selectedDay as DayWeek,
                            exercises: sessionExercises,
                            day_period: selectedPeriod as DayPeriod,
                            id_session: 33,
                            id_training: 1
                        })
                        closeDialog('add-session')
                    }}
                >
                    Guardar sesión
                </button>
            </div>
        </div>
    )
}

export default SessionModalForm