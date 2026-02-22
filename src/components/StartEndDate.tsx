import { parseISO } from 'date-fns';
import 'react-day-picker/style.css';
import { FieldsetDate } from './fieldset';

interface StartEndDateProps {
    classes?: string;
    isTrainingCompleted?: boolean;
    startDate?: string;
    endDate?: string;
    onDateChange: (date: Date | null, field: 'start_date' | 'end_date') => void;
}

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

const StartEndDate = ({
    classes,
    isTrainingCompleted = false,
    onDateChange,
    startDate,
    endDate
}: StartEndDateProps) => {
    return (
        <div {...classes ? { className: classes } : null}>
            {startDate && endDate ? (
                <>
                    <FieldsetDate
                        mode="single"
                        legend="Fecha inicio"
                        placeholder="Selecciona una fecha"
                        selected={startDate ? parseISO(startDate) : parseISO(new Date().toISOString())}
                        onSelect={date => date && onDateChange(date, 'start_date')}
                        disabled={[
                            parseISO(startDate),
                            { before: new Date(), after: parseISO(endDate) }
                        ]}
                        showWeekNumber
                        isFieldDisabled={isTrainingCompleted}
                        animate
                    />
                    <FieldsetDate
                        mode="single"
                        legend="Fecha fin"
                        placeholder="Selecciona una fecha"
                        selected={endDate ? parseISO(endDate) : parseISO(new Date().toISOString())}
                        disabled={[
                            parseISO(endDate),
                            { before: new Date() }
                        ]}
                        onSelect={date => date && onDateChange(date, 'end_date')}
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