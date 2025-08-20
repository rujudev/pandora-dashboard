import { getDay } from "date-fns"
import { ChangeEvent, FC, useEffect, useState } from "react"
import { useAthleteTraining } from "../../hooks/useAthleteTraining"
import { useDialog } from "../../hooks/useDialog"
import { ExerciseWithIntensity } from "../../interfaces/exercise/exercise-with-intensity.interface"
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface"
import { SessionWithExercisesAndIntensities } from "../../interfaces/session/session-with-exercises-and-intensities.interface"
import { DAY_PERIODS, DayPeriod, DAYS_OF_WEEK, DayWeek } from "../../types/day.types"
import { dayPeriodToNumber, dayWeekToNumber, numberToDayPeriod, numberToDayWeek } from "../../utils/date"
import Button from "../Button"
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
import { selectedBlockDayType } from "./Sessions"

// TODO: hay que refactorizar el componente para que esté sincronizado con el reducer y que no se use el estado local para los ejercicios

interface SessionExerciseTableProps {
    exercises: ExerciseWithIntensity[],
    muscleMovements: MuscleMovementWithWeightRef[],
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
    periods: DayPeriod[],
    selectedDay: DayWeek,
    selectedPeriod: DayPeriod | null,
    note: string
}

interface SessionMetadataProps {
    metadata: SessionMetadata,
    onChangeNote: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    onSelectPeriod: (e: ChangeEvent<HTMLSelectElement>) => void,
}
const SessionMetadataForm: FC<SessionMetadataProps> = ({ metadata, onChangeNote, onSelectPeriod }) => {
    const { selectedDay, selectedPeriod, periods, note } = metadata;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 bg-base-100 gap-5 p-6 rounded-xl">
                <FieldsetSelect
                    legend="Día"
                    placeholder="Selecciona un día de la semana"
                    value={dayWeekToNumber(selectedDay) ?? 'null'}
                    options={DAYS_OF_WEEK.map(option => {
                        return { id: dayWeekToNumber(option), option }
                    })}
                    required
                    disabled
                />
                <FieldsetSelect
                    legend="Tipo día"
                    placeholder="Selecciona un periodo"
                    value={selectedPeriod ? dayPeriodToNumber(selectedPeriod) : 'null'}
                    options={DAY_PERIODS.map(option => ({
                        id: dayPeriodToNumber(option),
                        option,
                        disabled: periods.some(period => dayPeriodToNumber(period) === dayPeriodToNumber(option))
                    }))}
                    onChange={onSelectPeriod}
                    required
                />
            </div>
            <div className="bg-base-100 gap-5 p-6 rounded-xl">
                <FieldsetTextarea
                    value={note}
                    onChange={onChangeNote}
                    isOptional
                />
            </div>
        </div>
    )
}

interface SessionModalFormProps {
    block: selectedBlockDayType,
    trainingId: number,
    muscleMovements: MuscleMovementWithWeightRef[],
    onAddSession: (session: SessionWithExercisesAndIntensities) => void,
}
const SessionModalForm: FC<SessionModalFormProps> = ({ block, trainingId, muscleMovements, onAddSession }) => {
    const { closeDialog } = useDialog();
    const { addExercise } = useAthleteTraining();
    const [exercises, setExercises] = useState<ExerciseWithIntensity[]>([])
    const [sessionMetadata, setSessionMetadata] = useState<SessionMetadata>({
        periods: [],
        selectedDay: 'Lunes',
        selectedPeriod: null,
        note: ''
    });

    const isSameWeekDay = (day: DayWeek, weekDay: Date) => getDay(weekDay) === dayWeekToNumber(day);

    useEffect(() => {
        setSessionMetadata({
            ...sessionMetadata,
            selectedDay: numberToDayWeek(getDay(block.date)),
            periods: block.sessions
                .filter(session => isSameWeekDay(session.day_week, block.date))
                .map(session => session.day_period),
            selectedPeriod: null
        })
    }, [block])

    const handleAddExercise = (newExercise: ExerciseWithIntensity) => {
        setExercises((prevExercises: ExerciseWithIntensity[]) => [...prevExercises, { ...newExercise, id_exercise: prevExercises.length + 1, is_new: true }])
    }

    const handleUpdateExercise = (exercise: ExerciseWithIntensity) => {
        setExercises(prevExercises => prevExercises.map(prevExercise => {
            if (prevExercise.id_exercise !== exercise.id_exercise) return prevExercise

            return {
                ...prevExercise,
                ...exercise
            }
        }))
    }

    const handleChangeNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        setSessionMetadata(prevSessionMetadata => ({
            ...prevSessionMetadata,
            note: value
        }))
    }

    const handleChangePeriod = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);

        setSessionMetadata(prevSessionMetadata => ({
            ...prevSessionMetadata,
            selectedPeriod: numberToDayPeriod(value)
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
                            onSelectPeriod={handleChangePeriod}
                            onChangeNote={handleChangeNote}
                        />
                    }
                    defaultSelected
                />
                <Tab
                    label={`Ejercicios (${exercises.length})`}
                    name="session_tab"
                    content={
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex items-center justify-between bg-base-100 p-6 rounded-xl">
                                <h2 className="text-xl font-semibold">Ejercicios</h2>
                                <OpenModalButton
                                    buttonIcon={<Plus />}
                                    buttonText="Añadir ejercicio"
                                    modalContent={
                                        <ExerciseModalForm
                                            modalId="add-session-exercise"
                                            existingSessionExercises={exercises}
                                            muscleMovements={muscleMovements}
                                            onSave={handleAddExercise}
                                        />
                                    }
                                    modalId="add-session-exercise"
                                />
                            </div>
                            {exercises.length > 0
                                ? <SessionExercisesTable exercises={exercises} muscleMovements={muscleMovements} onUpdate={handleUpdateExercise} />
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
                <Button
                    className="flex btn btn-secondary gap-2"
                    command="close"
                    commandfor="add-session"
                    onClick={() => {
                        closeDialog('add-session')
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    command="close"
                    commandfor="add-session"
                    className="flex btn btn-primary gap-2"
                    onClick={() => {
                        const { selectedDay, selectedPeriod } = sessionMetadata;

                        selectedPeriod &&
                            onAddSession({
                                day_period: selectedPeriod,
                                day_week: selectedDay,
                                exercises: exercises,
                                is_new: true
                            })

                        closeDialog('add-session')
                    }}
                    disabled={!sessionMetadata.selectedPeriod}
                >
                    Guardar sesión
                </Button>
            </div>
        </div >
    )
}

export default SessionModalForm