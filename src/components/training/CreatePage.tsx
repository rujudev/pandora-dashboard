import { useEffect, useState } from "react";
import { useMatch } from "react-router";
import { useBreadcrumbs } from "../../context/Breadcrumbs.context";
import { useHeaderPage } from "../../hooks/useHeaderPage";
import { Athlete } from "../../interfaces/athlete/athlete.interface";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { ROUTE } from "../../routes/config";
import { getAthletes } from "../../services/athletes";
import Button from "../Button";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { FieldsetText } from "../fieldset";
import BackButton from "../headerPage/BackButton";
import { Save } from "../Icon";
import { TrainingForm } from "./TrainingForm";

export const CreatePage = () => {
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()
    const isCreateTrainingPage = useMatch(ROUTE.CREATE_TRAINING);
    const [trainingName, setTrainingName] = useState<string>("");
    const [trainingPeriod, setTrainingPeriod] = useState<string>("");
    const [weekType, setWeekType] = useState<string>("");
    const [movements, setMovements] = useState<MuscleMovementWithWeightRef[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [athletesIsFetched, setAthletesIsFetched] = useState<boolean>(false);

    const onChangeTrainingName = (value: string) => {
        setTrainingName(value);
    }

    const onChangeTrainingPeriod = (value: string) => {
        setTrainingPeriod(value);
    }
    const onChangeWeekType = (value: string) => {
        setWeekType(value);
    }

    const onAddAthletes = (value: string) => {
        setAthletes(value);
    }

    const onChangeDate = (date: Date | null, field: 'start_date' | 'end_date') => {
        console.log('date change', date, field);
    }

    const onAddMovement = (movement: MuscleMovementWithWeightRef) => {
        setMovements(prev => [...prev, movement]);
    }

    useEffect(() => {
        getAthletes().then(({ data, error }) => {
            if (error) {
                console.error('Error fetching athletes:', error);
                return;
            }

            setAthletes(data);
            setAthletesIsFetched(true);
        })

        setCrumbs([
            { label: 'Entrenamientos', path: ROUTE.TRAININGS },
            { label: 'Crear entrenamiento' }
        ])

        setHeaderConfig({
            isLoadingPage: false,
            backButton: <BackButton />,
            title: 'Crear entrenamiento',
            description: 'Crea un nuevo plan de entrenamiento para tus atletas definiendo sesiones, ejercicios y objetivos.',
            rightContent: (
                <Button mode="create">
                    <Save /> Guardar cambios
                </Button >
            )
        })
    }, [isCreateTrainingPage])

    return (
        <>
            <Card>
                <CardBody classes="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FieldsetText
                        legend="Nombre del entrenamiento"
                        placeholder="Introduce el nombre del entrenamiento"
                        value={trainingName}
                        onChange={(e) => onChangeTrainingName(e.target.value)}
                    />
                    <FieldsetText
                        legend="Periodo del entrenamiento"
                        placeholder="Introduce el periodo del entrenamiento"
                        value={trainingPeriod}
                        onChange={(e) => onChangeTrainingPeriod(e.target.value)}
                    />
                    <FieldsetText
                        legend="Tipo de semana"
                        placeholder="Introduce el tipo de semana"
                        value={weekType}
                        onChange={(e) => onChangeWeekType(e.target.value)}
                    />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    {athletesIsFetched ? (
                        <>
                            {athletes.length > 0 ? (
                                <>
                                    <fieldset className="fieldset w-fit">
                                        <legend className="fieldset-legend">Vincular atletas a entrenamiento</legend>
                                        <button className="input flex justify-between w-fit!" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }}>
                                            Selecciona las/los atletas para este entrenamiento
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <ul className="dropdown menu border-1 border-solid border-[color-mix(in_oklab,_var(--color-base-content)_20%,_#0000)] rounded-box bg-base-100 shadow-sm mt-2 !z-[5]"
                                            popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1", inset: "unset" }}>
                                            {athletes.map(athlete => {
                                                console.log(athlete)
                                                // sacar los años a partir del cumpleaños (athlete.birth_day)

                                                const birthDate = new Date(athlete.birth_day);
                                                const ageDifMs = Date.now() - birthDate.getTime();
                                                const ageDate = new Date(ageDifMs);
                                                const age = Math.abs(ageDate.getUTCFullYear() - 1970);

                                                return (
                                                    <li>
                                                        <label>
                                                            <input type="checkbox" className="checkbox" />
                                                            <span className="label-text">{athlete.first_name} {athlete.last_name} ({age} años)</span>
                                                        </label>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </fieldset>
                                </>
                            ) : (
                                <p className="text-sm text-slate-400">No hay atletas disponibles para vincular.</p>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-md"></span>
                            Cargando atletas...
                        </div>
                    )}

                </CardBody>
            </Card>
            <TrainingForm
                onDateChange={(date, field) => {
                    console.log('date change', date, field);
                }}
                movements={movements}
                onAddMovement={onAddMovement}
            />
        </>
    )
}