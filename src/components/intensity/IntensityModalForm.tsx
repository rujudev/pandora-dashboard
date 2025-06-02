import { FC, useState } from "react";
import { useDialog } from "../../hooks/useDialog";
import { IntensityWithSeriesRepetitionsZoneAndSets, Set } from "../../interfaces/interfaces_compuestas.interface";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { FieldsetSelect, FieldsetText } from "../fieldset";
import { ChartLine } from "../Icon";
import Table, { Column } from "../table/Table";
import { zoneColor } from "./Intensity";

const initialIntensity: IntensityWithSeriesRepetitionsZoneAndSets = {
    id_intensity: 0,
    repetitions: 0,
    series: 0,
    sets: [],
    zone: ''
}

interface Props {
    mode: 'create' | 'edit',
    weight: number,
    intensity?: IntensityWithSeriesRepetitionsZoneAndSets,
    modalId?: string,
    onSubmit: (intensity: IntensityWithSeriesRepetitionsZoneAndSets) => void;
}
const IntensityModalForm: FC<Props> = ({ mode, intensity, modalId, weight, onSubmit }) => {
    const { closeDialog } = useDialog();
    const [intensityState, setIntensityState] = useState<IntensityWithSeriesRepetitionsZoneAndSets>(intensity ?? initialIntensity)
    const [lastUpdatedValues, setLastUpdatedValues] = useState<IntensityWithSeriesRepetitionsZoneAndSets>(initialIntensity)

    const hasChanges =
        intensityState.zone !== lastUpdatedValues.zone ||
        intensityState.series !== lastUpdatedValues.series ||
        intensityState.repetitions !== lastUpdatedValues.repetitions;

    const isComplete =
        intensityState.zone !== '' &&
        intensityState.series > 0 &&
        intensityState.repetitions > 0;

    const canUpdate = isComplete && hasChanges;
    const isEditing = mode === 'edit';

    console.log(intensityState.zone, zoneColor[intensityState.zone])
    const columns: Column[] = [
        {
            field: 'selection', render: () => (
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
            )
        },
        {
            field: 'percentage',
            headerName: 'Porcentage (%)',
            render: (set: Set) => (
                <FieldsetText
                    classes="justify-items-center"
                    inputClasses="max-w-[8ch]"
                    value={set.percentage}
                    onChange={(e) => {
                        const percentage = Number(e.target.value);

                        if (isNaN(percentage)) return;

                        setIntensityState(prevIntensity => ({
                            ...prevIntensity,
                            sets: prevIntensity.sets.map(prevSet => {
                                if (prevSet.id_set !== set.id_set) return prevSet;

                                return {
                                    ...prevSet,
                                    percentage
                                }
                            })
                        }))
                    }}
                    full={false}
                />
            )
        },
        {
            field: 'weight',
            headerName: 'Peso (kG)',
            render: (set: Set) => <span>{(weight * set.percentage) / 100}</span>
        },
    ];

    const onHandleUpdate = () => {
        setIntensityState(prevIntensity => {
            return {
                ...prevIntensity,
                sets: prevIntensity.series < prevIntensity.sets.length
                    ? prevIntensity.sets.slice(0, prevIntensity.series)
                    : [
                        ...prevIntensity.sets,
                        ...Array.from({ length: prevIntensity.series - prevIntensity.sets.length }).fill(null).map((_, i) => ({
                            id_set: prevIntensity.sets.length + i,
                            percentage: 0,
                            weight: 0
                        }))
                    ]
            }
        });

        setLastUpdatedValues({ ...intensityState })
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col text-sm bg-base-200 rounded-xl">
                <h2 className="text-xl font-semibold text-center my-4">
                    {isEditing ? 'Editar intensidad' : 'Nueva intensidad'}
                </h2>
                <div className="flex flex-col pl-4 pr-4 pb-4 gap-5">
                    <div className="grid grid-cols-3 gap-5 bg-base-100 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div aria-label="status" className={`size-4 status${intensityState.zone ? ` status-${zoneColor[intensityState.zone].colorId}` : ''}`}></div>
                            <FieldsetSelect
                                legend="Zona"
                                placeholder="Selecciona una zona"
                                value={intensityState.zone || 'null'}
                                options={Object.keys(zoneColor).map((value) =>
                                    ({ id: value, option: value }))}
                                onChange={(e) => {
                                    const zone = e.target.value;

                                    setIntensityState(prevIntensity => ({ ...prevIntensity, zone }))
                                }}
                            />
                        </div>
                        <FieldsetText
                            legend="Series"
                            placeholder="Series"
                            value={intensityState.series}
                            onChange={e => {
                                const series = Number(e.target.value);

                                if (isNaN(series)) return;

                                setIntensityState(prevIntensity => ({ ...prevIntensity, series }))
                            }}
                        />
                        <FieldsetText
                            legend="Repeticiones"
                            placeholder="Repeticiones"
                            value={intensityState.repetitions}
                            onChange={e => {
                                const repetitions = Number(e.target.value);

                                if (isNaN(repetitions)) return;

                                setIntensityState(prevIntensity => ({ ...prevIntensity, repetitions }))
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-5 col-span-2">
                        {intensityState.sets.length > 0 ? (
                            <Table
                                classes="max-h-95 overflow-y-auto rounded-box border border-base-content/5 bg-base-100"
                                columns={columns}
                                rows={intensityState.sets}
                                thClasses="text-center"
                                tdClasses="text-center"
                            />
                        ) : (
                            <Card>
                                <CardBody classes="flex flex-col items-center gap-3">
                                    <ChartLine classes="size-8 text-base-content opacity-55" />
                                    <h2 className="text-base-content opacity-55">No hay sets creados</h2>
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
                    className="flex btn gap-2 btn-warning"
                    onClick={onHandleUpdate}
                    disabled={!canUpdate}
                >
                    Actualizar intensidad
                </button>
                <button
                    command="close"
                    commandfor={modalId}
                    className="flex btn gap-2 btn-primary"
                    onClick={() => {
                        onSubmit(intensityState)
                        closeDialog(modalId || '')
                    }}
                    disabled={!intensityState.sets.every(set => set.percentage !== 0)}
                >
                    Guardar intensidad
                </button>
            </div>
        </div >
    )
}

export default IntensityModalForm