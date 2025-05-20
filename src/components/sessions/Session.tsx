import { ChangeEvent, useState } from "react";
import { MovementsWithWeightRef, SessionWithExercisesAndIntensities } from "../../interfaces/interfaces_compuestas.interface";
import Collapse from "../Collapse";
import { FieldsetSelect, FieldsetText } from "../fieldset";
import { Edit, Plus } from "../Icon";
import List from "../list/List";
import ListItem from "../list/ListItem";
import OpenModalButton from "../modal/OpenModalButton";

const ZONE_COLOR: Record<string, { text: string; bg: string; contrastText: string }> = {
    Z1: {
        text: 'text-info',
        bg: 'bg-info',
        contrastText: 'text-base-content',
    },
    Z2: {
        text: 'text-success',
        bg: 'bg-success',
        contrastText: 'text-base-content',
    },
    Z3: {
        text: 'text-[#DDDDDD]',
        bg: 'bg-[#DDDDDD]',
        contrastText: 'text-black',
    },
    Z4: {
        text: 'text-warning',
        bg: 'bg-warning',
        contrastText: 'text-base-content',
    },
    Z5: {
        text: 'text-error',
        bg: 'bg-error',
        contrastText: 'text-base-content',
    }
};

const AddExerciseModalContent = () => {
    return (
        <span>Modal Add Exercise Content</span>
    )
}

const AddIntensityModalContent = () => {
    return (
        <span>Modal Add Intensity Content</span>
    )
}

const Intensity = ({ perMin, perMax, minWeight, maxWeight, repetitions, series, zone }: {
    perMin: number,
    perMax: number,
    minWeight: number,
    maxWeight: number,
    repetitions: number,
    series: number,
    zone: string
}) => {
    const [isEditing, setIsEditing] = useState(false)

    const toggleIsEditing = () => {
        setIsEditing(prevIsEditing => !prevIsEditing);
    }

    return (
        <div className="list-col-grow flex flex-col gap-3 rounded-lg border-1 border-neutral pb-3">
            <header className={`flex justify-between gap-4 py-4 ${ZONE_COLOR[zone].bg} ${ZONE_COLOR[zone].contrastText} font-semibold rounded-tl-lg rounded-tr-lg px-3`}>
                <h2>{zone.toUpperCase()}</h2>
                <span>{perMin}% - {perMax}%</span>
            </header>
            <div className="flex justify-around px-3">
                <FieldsetText inputClasses="max-w-[8ch]" legend="Series" value={series} full={false} readOnly={!isEditing} />
                <FieldsetText inputClasses="max-w-[8ch]" legend="Reps" value={repetitions} full={false} readOnly={!isEditing} />
                <div className="flex">
                    <button className="duration:100 transition-colors hover:text-info cursor-pointer" onClick={toggleIsEditing}>
                        <Edit />
                    </button>
                </div>
            </div>
            <div className={`flex flex-col gap-3 px-3 [&>div]:p-2 [&>div]:w-full [&>div]:justify-between [&>div]:border-1 [&>div]:rounded-md [&>div]:bg-neutral`}>
                <div className="flex gap-4">
                    <span>{perMin} %</span>
                    <span>{minWeight} Kg</span>
                </div>
                <div className="flex gap-4">
                    <span>{perMax}  %</span>
                    <span>{maxWeight} Kg</span>
                </div>
            </div>
        </div>
    )
}

const Session = ({
    day_week,
    day_period,
    exercises,
    muscleMovements,
    onChangeDayWeek,
    onChangeDayPeriod,
    onChangleExerciseMuscleMovement,
}: Pick<SessionWithExercisesAndIntensities, 'day_week' | 'day_period' | 'exercises'> & {
    muscleMovements: MovementsWithWeightRef[],
    onChangeDayWeek: (e: ChangeEvent<HTMLSelectElement>) => void,
    onChangeDayPeriod: (e: ChangeEvent<HTMLSelectElement>) => void,
    onChangleExerciseMuscleMovement: (movementId: number, exerciseId: number) => void
}) => {
    return (
        <Collapse title={`${day_week} - ${day_period}`} name="session-1">
            <div className="flex flex-col collapse-content text-sm gap-10">
                <div className="flex gap-5">
                    <FieldsetSelect
                        legend="Día"
                        placeholder="Selecciona un día de la semana"
                        value={day_week}
                        options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(option => ({ id: option, option }))}
                        onChange={onChangeDayWeek}
                    />
                    <FieldsetSelect
                        legend="Tipo día"
                        placeholder="Selecciona una modalidad de día"
                        value={day_period}
                        options={['Mañana', 'Tarde'].map(option => ({ id: option, option }))}
                        onChange={onChangeDayPeriod}
                    />
                </div>
                <div className="flex flex-col w-full gap-5">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Ejercicios</h2>
                        <OpenModalButton
                            buttonIcon={<Plus />}
                            buttonText="Nuevo ejercicio"
                            modalContent={<AddExerciseModalContent />}
                            modalId="add-exercise"
                        />
                    </div>
                    {exercises.map(({ id_exercise, exercise_name, abreviation, intensities, id_movement }) => {
                        const movement = muscleMovements.find(movement => movement.id_movement === id_movement) ?? {
                            id_movement: 0,
                            movement_name: '',
                            weight_ref: 0
                        };

                        return (
                            <Collapse key={id_exercise} title={exercise_name} name={exercise_name}>
                                <div className="flex flex-col gap-5 collapse-content text-sm">
                                    <div className="grid grid-cols-2 gap-5 mb-5">
                                        <FieldsetText legend="Nombre" placeholder="Nombre" value={exercise_name} />
                                        <FieldsetText legend="Abreviatura" placeholder="Abreviatura" value={abreviation} />
                                        <FieldsetSelect
                                            legend="Movimiento muscular"
                                            placeholder="Selecciona un movimiento muscular"
                                            value={id_movement}
                                            options={muscleMovements.map(({ id_movement, movement_name }) =>
                                                ({ id: id_movement, option: movement_name }))}
                                            onChange={(e) => {
                                                const selectedMovementId = Number(e.target.value);

                                                onChangleExerciseMuscleMovement(selectedMovementId, id_exercise)
                                            }}
                                        />
                                        <FieldsetText legend="Peso de referencia" value={movement.weight_ref} readOnly />
                                    </div>

                                    <div className="flex flex-col gap-5 col-span-2">
                                        <div className="flex justify-between">
                                            <h2 className="text-xl font-semibold">Intensidades</h2>
                                            <OpenModalButton
                                                buttonIcon={<Plus />}
                                                buttonText="Nueva intensidad"
                                                modalContent={<AddIntensityModalContent />}
                                                modalId="add-intensity"
                                            />
                                        </div>
                                        <List classes="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] [&>.list-row:not(:last-child)]:after:border-0">
                                            {intensities.map(({ id_intensity, percentage_min, percentage_max, repetitions, series, zone }) => {
                                                const minWeight = (percentage_min / 100) * movement.weight_ref;
                                                const resultMinWeight = parseFloat(minWeight.toFixed(2));

                                                const maxWeight = (percentage_max / 100) * movement.weight_ref;
                                                const resultMaxWeigth = parseFloat(maxWeight.toFixed(2));

                                                return (
                                                    <ListItem key={id_intensity}>
                                                        <Intensity
                                                            perMin={percentage_min}
                                                            perMax={percentage_max}
                                                            minWeight={resultMinWeight}
                                                            maxWeight={resultMaxWeigth}
                                                            repetitions={repetitions}
                                                            series={series}
                                                            zone={zone}
                                                        />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </div>
                                </div>
                            </Collapse>
                        )
                    })}
                </div>
            </div>
        </Collapse>
    )
}

export default Session;