import { useAthleteTraining } from "../../hooks/useAthleteTraining"
import { FieldsetDate } from "../fieldset"

const StartEndDate = ({ classes }: { classes?: string }) => {
    const { state, setTrainingDate } = useAthleteTraining()

    return (
        <div {...classes ? { className: classes } : null}>
            <FieldsetDate
                mode="single"
                legend="Fecha inicio"
                placeholder="Selecciona una fecha"
                selected={new Date(state.start_date)}
                onSelect={date => date && setTrainingDate(date, 'start_date')}
                showWeekNumber
            />
            <FieldsetDate
                mode="single"
                legend="Fecha fin"
                placeholder="Selecciona una fecha"
                selected={new Date(state.end_date)}
                onSelect={date => date && setTrainingDate(date, 'end_date')}
                showWeekNumber
            />
        </div>
    )
}

export default StartEndDate