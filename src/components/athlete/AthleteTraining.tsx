import { ChangeEvent, useEffect, useState } from "react";
import { useLoaderData, useLocation, useMatch, useOutletContext } from "react-router";
import { AthleteOutletContext } from "../../types/athlete-route-outlet.types";
import { LoaderData } from "../../types/loader-data.types";
import { Training } from "../../types/training.types";
import Collapse from "../Collapse";
import { FieldsetDate, FieldsetDropdown, FieldsetText } from "../fieldset";
import { CalendarWeek, Movement, Plus, Trash } from "../Icon";
import List from "../list/List";
import ListItem from "../list/ListItem";

const AthleteTraining = () => {
    const { pathname } = useLocation();
    const { training } = useLoaderData() as LoaderData;
    const { setHeaderConfig } = useOutletContext<AthleteOutletContext>();
    const isAthleteTrainingEditPage = useMatch('/athletes/:athleteId/trainings/:trainingId/edit');
    const [selectedTraining, setSelectedTraining] = useState<Training>({
        id: "min-1",
        name: "Entrenamiento mínimo",
        start_date: "2023-01-01",
        end_date: "2023-01-08",
        period: "Básico",
        week_type: "Carga",
        muscle_movements: [],
        sessions: []
    });

    const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const { id, value } = target;

        setSelectedTraining((prev: Training) => {
            if (!prev) return selectedTraining;

            return {
                ...prev,
                [id]: value
            };
        })
    }

    const onHandleChangeMovement = (e: ChangeEvent<HTMLInputElement>, movementId: string) => {
        const target = e.target;
        const { id, value } = target;

        setSelectedTraining((prev: Training) => {
            if (!prev) return selectedTraining;

            return {
                ...prev,
                muscle_movements: prev.muscle_movements.map(prevMuscleMovement => {
                    if (prevMuscleMovement.id !== movementId) return prevMuscleMovement;

                    return {
                        ...prevMuscleMovement,
                        [id]: value
                    }
                })
            }
        })
    }

    const onHandleDeleteMovement = (movementId: string) => {
        setSelectedTraining((prev: Training) => {
            if (!prev) return selectedTraining;

            return {
                ...prev,
                muscle_movements: prev.muscle_movements.filter(prevMuscleMovement => String(prevMuscleMovement.id) !== movementId)
            }
        })
    }

    useEffect(() => {
        training && setSelectedTraining(training)
    }, [training])

    useEffect(() => {
        isAthleteTrainingEditPage &&
            setHeaderConfig({
                hasBackButton: true,
                hasActionButton: false,
                title: training?.name,
            })
    }, [pathname, selectedTraining])

    return (
        <div className="grid grid-cols-2 w-full gap-5">
            <FieldsetDate
                legend="Fecha inicio"
                placeholder="Selecciona una fecha"
                selected={new Date(training?.start_date || '')}
                showWeekNumber
            />
            <FieldsetDate
                legend="Fecha fin"
                placeholder="Selecciona una fecha"
                selected={new Date(training?.end_date || '')}
                showWeekNumber
            />
            <FieldsetDropdown placeholder="Selecciona un período" legend="Periodo" options={[]} />
            <FieldsetDropdown placeholder="Selecciona el tipo de semana" legend="Tipo de semana" options={[]} />
            <div className="col-span-2 flex flex-col justify-items-end gap-5 text-sm border border-neutral rounded-xl p-4 w-full">
                <div className="flex justify-between">
                    <div className="flex gap-5">
                        <Movement />
                        <h1 className="text-lg">Movimientos musculares</h1>
                    </div>
                    <button className="flex btn btn-primary gap-2 w-fit">
                        <Plus />
                        Nuevo movimiento muscular
                    </button>
                </div>
                {training?.muscle_movements && training?.muscle_movements?.length > 0 && (
                    <List>
                        {
                            training?.muscle_movements.map(movement => (
                                <ListItem classes="px-0">
                                    <FieldsetText classes="list-col-grow" id="name" legend="Nombre" placeholder="Peso" value={movement.name} onChange={(e) => onHandleChangeMovement(e, movement.id)} />
                                    <FieldsetText id="identifier" legend="Identificador" placeholder="Identificador" value={movement.id} onChange={(e) => onHandleChangeMovement(e, movement.id)} />
                                    <FieldsetText id="weight" legend="Peso (Kg)" placeholder="Peso" value={movement.weight} onChange={(e) => onHandleChangeMovement(e, movement.id)} />
                                    <button className="duration:100 transition-colors hover:text-error cursor-pointer" onClick={() => onHandleDeleteMovement(movement.id)}>
                                        <Trash />
                                    </button>
                                </ListItem>
                            ))
                        }
                    </List>
                )}
            </div>
            <div className="col-span-2 flex flex-col justify-items-end gap-5 text-sm border border-neutral rounded-xl p-4 w-full">
                <div className="flex justify-between">
                    <div className="flex gap-5">
                        <CalendarWeek />
                        <h1 className="text-lg">Sesiones</h1>
                    </div>
                    <button className="flex btn btn-primary gap-2 w-fit">
                        <Plus />
                        Nueva sesión
                    </button>
                </div>
                {training?.sessions.map(session => {
                    return (
                        <Collapse title={`${session.day_name} - ${session.day_type}`} name="session-1">
                            <div className="flex flex-col collapse-content text-sm gap-10">
                                <div className="flex gap-5">
                                    <FieldsetDropdown legend="Día" placeholder="Selecciona un día de la semana" options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']} />
                                    <FieldsetDropdown legend="Tipo día" placeholder="Selecciona una modalidad de día" options={['Mañana', 'Tarde']} />
                                </div>
                                <div className="flex flex-col w-full gap-5">
                                    <div className="flex justify-between">
                                        <h2 className="text-xl font-semibold">Ejercicios</h2>
                                        <button className="flex btn btn-primary gap-2">
                                            <Plus />
                                            Nuevo ejercicio
                                        </button>
                                    </div>
                                    {session.exercises.map(exercise => (
                                        <Collapse title={exercise.name} name="exercise-1">
                                            <div className="flex flex-col gap-5 collapse-content text-sm">
                                                <div className="grid grid-cols-2 gap-5 mb-5">
                                                    <FieldsetText legend="Nombre" placeholder="Nombre" value={exercise.name} onChange={onHandleChange} />
                                                    <FieldsetText legend="Abreviatura" placeholder="Abreviatura" value={exercise.abbreviation} onChange={onHandleChange} />
                                                    <FieldsetDropdown legend="Movimiento muscular" placeholder="Selecciona un movimiento muscular" options={['Movimiento 1', 'Movimiento 2', 'Movimiento 3']} />
                                                    <FieldsetDropdown legend="Zona de intensidad" placeholder="Selecciona una zona de intensidad" options={['Z1', 'Z2', 'Z3']} />
                                                    <FieldsetText legend="Repeticiones" placeholder="Introduce un número de repeticiones" value={exercise.repetitions} onChange={onHandleChange} />
                                                    <FieldsetText legend="Series" placeholder="Introduce un número de series" value={exercise.series} onChange={onHandleChange} />
                                                </div>

                                                <div className="flex flex-col gap-5 col-span-2">
                                                    <div className="flex justify-between">
                                                        <h2 className="text-xl font-semibold">Intensidades</h2>
                                                        <button className="flex btn btn-primary gap-2">
                                                            <Plus />
                                                            Añadir intensidad
                                                        </button>
                                                    </div>
                                                    <List>
                                                        <ListItem classes="flex flex-col">
                                                            <div className="flex justify-between items-center">
                                                                <h3 className="text-xl font-semibold">Intensidad 1</h3>
                                                                <button className="duration:100 transition-colors hover:text-error cursor-pointer">
                                                                    <Trash />
                                                                </button>
                                                            </div>
                                                            <div className="flex justify-between gap-5">
                                                                <div className="flex flex-col gap-5 w-full">
                                                                    <h4>Mínimo</h4>
                                                                    <div className="grid grid-cols-2 gap-5">
                                                                        <FieldsetText legend="Porcentaje (%)" placeholder="Porcentaje" onChange={onHandleChange} />
                                                                        <FieldsetText legend="Carga (Kg)" placeholder="Carga" onChange={onHandleChange} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-5 w-full">
                                                                    <h4>Máximo</h4>
                                                                    <div className="grid grid-cols-2 gap-5">
                                                                        <FieldsetText legend="Porcentaje (%)" placeholder="Porcentaje" onChange={onHandleChange} />
                                                                        <FieldsetText legend="Carga (Kg)" placeholder="Carga" onChange={onHandleChange} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ListItem>
                                                    </List>
                                                </div>
                                            </div>
                                        </Collapse>
                                    ))}
                                </div>
                            </div>
                        </Collapse>
                    )
                })}
            </div>
            {/* <Collapse classes="col-span-2 border-[1px] border-neutral rounded-xl" titleIcon={<Movement />} title="Movimientos musculares" name="muscular-movements" isSubCollapse>
                                <div className="grid grid-cols-1 justify-items-end gap-5 collapse-content text-sm">
                                    <button className="flex btn btn-primary gap-2 w-fit">
                                        <Plus />
                                        Nuevo movimiento muscular
                                    </button>
                                    {training?.muscle_movements.length > 0 && (
                                        <List>
                                            {
                                                training?.muscle_movements.map(movement => (
                                                    <ListItem classes="px-0">
                                                        <FieldsetText classes="list-col-grow" id="name" legend="Nombre" placeholder="Peso" value={movement.name} onChange={(e) => onHandleChangeMovement(e, training, movement)} />
                                                        <FieldsetText id="weight" legend="Peso (Kg)" placeholder="Peso" value={movement.weight} onChange={(e) => onHandleChangeMovement(e, training, movement)} />
                                                        <button className="duration:100 transition-colors hover:text-error cursor-pointer" onClick={() => onHandleDeleteMovement(training, String(movement.id))}>
                                                            <Trash />
                                                        </button>
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    )}
                                </div>
                            </Collapse> */}
            {/* <Collapse classes="col-span-2 border-[1px] border-neutral rounded-xl" titleIcon={<CalendarWeek />} title="Sesiones" name="sessions" isSubCollapse>
                                <div className="grid grid-cols-1 justify-items-end gap-5 collapse-content text-sm">
                                    <button className="flex btn btn-primary gap-2 w-fit">
                                        <Plus />
                                        Nueva sesión
                                    </button>
                                    <Collapse title="Sesion 1" name="session-1">
                                        <div className="flex flex-col collapse-content text-sm gap-10">
                                            <div className="flex gap-5">
                                                <FieldsetDropdown legend="Día" placeholder="Selecciona un día de la semana" options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']} />
                                                <FieldsetDropdown legend="Tipo día" placeholder="Selecciona una modalidad de día" options={['Mañana', 'Tarde']} />
                                            </div>
                                            <div className="flex flex-col w-full gap-5">
                                                <div className="flex justify-between">
                                                    <h2 className="text-xl font-semibold">Ejercicios</h2>
                                                    <button className="flex btn btn-primary gap-2">
                                                        <Plus />
                                                        Nuevo ejercicio
                                                    </button>
                                                </div>
                                                <Collapse title="Ejercicio 1" name="exercise-1">
                                                    <div className="grid grid-cols-1 gap-5 collapse-content text-sm">
                                                        <div className="grid grid-cols-2 gap-5 mb-5">
                                                            <FieldsetText legend="Nombre" placeholder="Nombre" onChange={onHandleChange} />
                                                            <FieldsetText legend="Abreviatura" placeholder="Abreviatura" onChange={onHandleChange} />
                                                            <FieldsetDropdown legend="Movimiento muscular" placeholder="Selecciona un movimiento muscular" options={['Movimiento 1', 'Movimiento 2', 'Movimiento 3']} />
                                                            <FieldsetDropdown legend="Zona de intensidad" placeholder="Selecciona una zona de intensidad" options={['Z1', 'Z2', 'Z3']} />
                                                            <FieldsetText legend="Repeticiones" placeholder="Introduce un número de repeticiones" onChange={onHandleChange} />
                                                            <FieldsetText legend="Series" placeholder="Introduce un número de series" onChange={onHandleChange} />
                                                        </div>
    
                                                        <div className="flex flex-col gap-5 col-span-2">
                                                            <div className="flex justify-between">
                                                                <h2 className="text-xl font-semibold">Intensidades</h2>
                                                                <button className="flex btn btn-primary gap-2">
                                                                    <Plus />
                                                                    Añadir intensidad
                                                                </button>
                                                            </div>
                                                            <List>
                                                                <ListItem classes="flex flex-col">
                                                                    <div className="flex justify-between items-center">
                                                                        <h3 className="text-xl font-semibold">Intensidad 1</h3>
                                                                        <button className="duration:100 transition-colors hover:text-error cursor-pointer">
                                                                            <Trash />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex justify-between gap-5">
                                                                        <div className="flex flex-col gap-5 w-full">
                                                                            <h4>Mínimo</h4>
                                                                            <div className="grid grid-cols-2 gap-5">
                                                                                <FieldsetText legend="Porcentaje (%)" placeholder="Porcentaje" onChange={onHandleChange} />
                                                                                <FieldsetText legend="Carga (Kg)" placeholder="Carga" onChange={onHandleChange} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col gap-5 w-full">
                                                                            <h4>Máximo</h4>
                                                                            <div className="grid grid-cols-2 gap-5">
                                                                                <FieldsetText legend="Porcentaje (%)" placeholder="Porcentaje" onChange={onHandleChange} />
                                                                                <FieldsetText legend="Carga (Kg)" placeholder="Carga" onChange={onHandleChange} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </ListItem>
                                                            </List>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            </Collapse> */}
        </div>
    )
}

export default AthleteTraining