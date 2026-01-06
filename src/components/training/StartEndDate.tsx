import { parseISO } from 'date-fns';
import 'react-day-picker/style.css';
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { FieldsetDate } from '../fieldset';

const StartEndDateSkeleton = () => (
    <>
        <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-1/4"></div>
            <div className="skeleton h-10 w-full"></div>
        </div>
        <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-1/4"></div>
            <div className="skeleton h-10 w-full"></div>
        </div>
    </>
)
const StartEndDate = ({ classes, isTrainingCompleted = false }: { classes?: string, isTrainingCompleted: boolean }) => {
    const { state, setTrainingDate } = useAthleteTraining()

    return (
        <div {...classes ? { className: classes } : null}>
            {state ? (
                <>
                    <FieldsetDate
                        mode="single"
                        legend="Fecha inicio"
                        placeholder="Selecciona una fecha"
                        selected={parseISO(state.start_date)}
                        onSelect={date => date && setTrainingDate(date, 'start_date')}
                        disabled={[
                            parseISO(state.start_date),
                            { before: new Date(), after: parseISO(state.end_date) }
                        ]}
                        showWeekNumber
                        isFieldDisabled={isTrainingCompleted}
                        animate
                    />
                    <FieldsetDate
                        mode="single"
                        legend="Fecha fin"
                        placeholder="Selecciona una fecha"
                        selected={parseISO(state.end_date)}
                        disabled={[
                            parseISO(state.end_date),
                            { before: new Date() }
                        ]}
                        onSelect={date => date && setTrainingDate(date, 'end_date')}
                        showWeekNumber
                        isFieldDisabled={isTrainingCompleted}
                        animate
                    />
                </>
            ) : <StartEndDateSkeleton />
            }
        </div>
    )
}

export default StartEndDate