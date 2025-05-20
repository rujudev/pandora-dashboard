import { DateRange } from "react-day-picker"
import { FieldsetDate } from "../fieldset"

const StartEndDate = ({ startDate, endDate, classes, onChange }: {
    startDate: string,
    endDate: string,
    onChange: (dateKey: "start_date" | "end_date", value: string) => void
    classes?: string,
}) => {
    return (
        <div {...classes ? { className: classes } : null}>
            <FieldsetDate
                mode="single"
                legend="Fecha inicio"
                placeholder="Selecciona una fecha"
                selected={new Date(startDate)}
                onSelect={(value: Date | DateRange | undefined) => {
                    value && onChange('start_date', value.toString())
                }}
                showWeekNumber
            />
            <FieldsetDate
                mode="single"
                legend="Fecha fin"
                placeholder="Selecciona una fecha"
                selected={new Date(endDate)}
                onSelect={(value: Date | DateRange | undefined) => {
                    value && onChange('end_date', value.toString())
                }}
                showWeekNumber
            />
        </div>
    )
}

export default StartEndDate