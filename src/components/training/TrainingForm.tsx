import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { SessionWithExercisesAndIntensities } from "../../interfaces/session/session-with-exercises-and-intensities.interface";
import { WeeklyBlock } from "../../interfaces/session/weekly-blocks.interface";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import MuscleMovements from "../muscleMovements/MuscleMovements";
import Sessions from "../session/Sessions";
import StartEndDate from "../StartEndDate";

interface TrainingFormProps {
    startDate?: string;
    endDate?: string;
    onDateChange?: (date: Date | null, field: 'start_date' | 'end_date') => void;
    movements?: MuscleMovementWithWeightRef[];
    onAddMovement?: (movement: MuscleMovementWithWeightRef) => void;
    weeklyBlocks?: WeeklyBlock[];
    isTrainingCompleted?: boolean;
    onAddSession?: (block: WeeklyBlock, session: SessionWithExercisesAndIntensities) => void;
}

export const TrainingForm = ({
    startDate,
    endDate,
    onDateChange,
    movements,
    onAddMovement,
    weeklyBlocks,
    isTrainingCompleted = false,
    onAddSession
}: TrainingFormProps) => {
    console.log(movements);
    return (
        <div className="grid grid-cols-1 w-full gap-5">
            <Card>
                <CardBody>
                    <StartEndDate
                        classes="gap-5 grid grid-cols-2"
                        isTrainingCompleted={isTrainingCompleted}
                        startDate={startDate ?? new Date().toISOString()}
                        endDate={endDate ?? new Date().toISOString()}
                        onDateChange={(date, field) => {
                            onDateChange && onDateChange(date, field)
                        }}
                    />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <MuscleMovements
                        movements={movements}
                        onAddMovement={onAddMovement}
                        isTrainingCompleted={isTrainingCompleted}
                    />
                </CardBody>
            </Card>
            <Card>
                <CardBody classes="flex flex-col gap-5">
                    <Sessions
                        startDate={startDate ?? new Date().toISOString()}
                        endDate={endDate ?? new Date().toISOString()}
                        movements={movements}
                        weeklyBlocks={weeklyBlocks}
                        isTrainingCompleted={isTrainingCompleted}
                        onAddSession={onAddSession}
                    />
                </CardBody>
            </Card>
        </div>
    )
}