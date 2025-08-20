import { FC, useState } from "react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { IntensityWithSeriesRepetitionsZoneAndSets } from "../../interfaces/intensity/intensity-with-series-repetitions-zone-and-sets.interface";
import { FieldsetText } from "../fieldset";
import { Check, Edit, Trash } from "../Icon";

export const zoneColor: Record<string, { colorId: string, text: string; bg: string; contrastText: string }> = {
    Z1: {
        colorId: 'info',
        text: 'text-info',
        bg: 'bg-info',
        contrastText: 'text-base-content',
    },
    Z2: {
        colorId: 'success',
        text: 'text-success',
        bg: 'bg-success',
        contrastText: 'text-base-content',
    },
    Z3: {
        colorId: 'tertiary',
        text: 'text-tertiary',
        bg: 'bg-tertiary',
        contrastText: 'text-black',
    },
    Z4: {
        colorId: 'warning',
        text: 'text-warning',
        bg: 'bg-warning',
        contrastText: 'text-base-content',
    },
    Z5: {
        colorId: 'error',
        text: 'text-error',
        bg: 'bg-error',
        contrastText: 'text-base-content',
    }
};

const Set = ({ id, blockId, sessionId, exerciseId, intensityId, percentage, weight }: {
    id: number,
    blockId: number,
    sessionId: number,
    exerciseId: number,
    intensityId: number,
    percentage: number,
    weight: number
}) => {
    const { setSetPercent } = useAthleteTraining();
    const [isEditing, setIsEditing] = useState(false);
    const [newPercentage, setNewPercentage] = useState<number>(percentage);
    const calculatedWeight = (weight * percentage) / 100;

    const toggleIsEditing = () => setIsEditing(prevIsEditing => !prevIsEditing)

    return (
        <div className="flex justify-between gap-3 px-3 [&>div]:p-2 [&>div]:w-full [&>div]:justify-between [&>div]:border-1 [&>div]:rounded-md [&>div]:bg-neutral">
            <div className="flex items-center gap-4">
                {!isEditing ? (
                    <span>{percentage} %</span>
                ) : (
                    <FieldsetText
                        inputClasses="max-w-[8ch] bg-transparent"
                        placeholder="%"
                        value={newPercentage}
                        full={false}
                        onChange={(e) => {
                            const percentage = Number(e.target.value);

                            !isNaN(percentage) && setNewPercentage(percentage);
                        }}
                        readOnly={!isEditing}
                    />
                )}
                <span>{calculatedWeight} Kg</span>
            </div>
            <button className={`duration:100 transition-colors cursor-pointer${isEditing ? ' hover:text-success' : ' hover:text-info'}`} onClick={() => {
                if (isEditing) {
                    setIsEditing(false);

                    if (newPercentage !== 0 && newPercentage !== percentage)
                        setSetPercent(blockId, sessionId, exerciseId, intensityId, id, newPercentage);

                } else {
                    toggleIsEditing()
                }
            }}>
                {isEditing ? <Check /> : <Edit />}
            </button>
        </div>
    )
}

interface Props {
    blockId: number,
    sessionId: number,
    exerciseId: number,
    intensity: IntensityWithSeriesRepetitionsZoneAndSets,
    weightRef: number
}
const Intensity: FC<Props> = ({
    blockId,
    sessionId,
    exerciseId,
    intensity,
    weightRef
}) => {
    const { id_intensity: intensityId, repetitions: initRepetitions, series: initSeries, zone, sets } = intensity;
    const {
        removeIntensity,
        setIntensitySeries,
        setIntensityReps
    } = useAthleteTraining();

    const [repetitions, setRepetitions] = useState<number>(initRepetitions);
    const [series, setSeries] = useState<number>(initSeries);

    const percentages = sets.map(set => set.percentage);
    const minPercentage = Math.min(...percentages);
    const maxPercentage = Math.max(...percentages);

    const [isEditing, setIsEditing] = useState(false)

    const toggleIsEditing = () => {
        setIsEditing(prevIsEditing => !prevIsEditing);
    }

    return (
        <div className="list-col-grow flex flex-col gap-3 rounded-lg border-1 border-neutral pb-3">
            <header className={`flex items-center justify-between gap-4 py-4 ${zoneColor[zone].bg} ${zoneColor[zone].contrastText} font-semibold rounded-tl-lg rounded-tr-lg px-3`}>
                <h2>{zone.toUpperCase()}</h2>
                <span>{`${minPercentage}%${maxPercentage ? ` - ${maxPercentage}%` : ''}`}</span>
                <button
                    onClick={() => removeIntensity(blockId, sessionId, exerciseId, intensityId)}
                    className="duration:100 transition-colors hover:text-error cursor-pointer"
                >
                    <Trash />
                </button>

            </header>
            <div className="flex justify-around px-3">
                <FieldsetText
                    inputClasses="max-w-[8ch]"
                    legend="Series"
                    placeholder="Series"
                    value={series}
                    full={false}
                    onChange={(e) => {
                        const value = Number(e.target.value);

                        !isNaN(value) && setSeries(value);
                    }}
                    readOnly={!isEditing}
                />
                <FieldsetText
                    inputClasses="max-w-[8ch]"
                    legend="Reps"
                    placeholder="Reps"
                    value={repetitions}
                    full={false}
                    onChange={(e) => {
                        const value = Number(e.target.value);

                        !isNaN(value) && setRepetitions(value)
                    }}
                    readOnly={!isEditing}
                />
                <div className="flex">
                    <button className={`duration:100 transition-colors cursor-pointer${isEditing ? ' hover:text-success' : ' hover:text-info'}`} onClick={() => {
                        if (isEditing) {
                            setIsEditing(false)

                            initSeries !== series && setIntensitySeries(blockId, sessionId, exerciseId, intensityId, series);
                            initRepetitions !== repetitions && setIntensityReps(blockId, sessionId, exerciseId, intensityId, repetitions);
                        } else {
                            toggleIsEditing()
                        }
                    }}>
                        {isEditing ? <Check /> : <Edit />}
                    </button>
                </div>
            </div>
            {sets.map(({ id_set, percentage }, idx) => (
                <Set
                    key={`set-${id_set}-${idx}`}
                    id={id_set!}
                    blockId={blockId}
                    sessionId={sessionId}
                    exerciseId={exerciseId}
                    intensityId={intensityId!}
                    percentage={percentage}
                    weight={weightRef}
                />
            ))}
        </div>
    )
}

export default Intensity