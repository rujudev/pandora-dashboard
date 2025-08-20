import { FC } from "react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import Button from "../Button";
import { FieldsetText } from "../fieldset";
import { Trash } from "../Icon";
import ListItem from "../list/ListItem";

interface Props {
    id: number,
    name: string,
    weight: number,
    isTrainingCompleted: boolean
}

const MuscleMovement: FC<Props> = ({ id, name, weight, isTrainingCompleted = false }) => {
    const { setMovementWeight, removeMovement } = useAthleteTraining()

    return (
        <ListItem classes="px-0 items-center">
            <FieldsetText
                classes="list-col-grow"
                legend="Nombre"
                placeholder="Nombre"
                defaultValue={name}
                readOnly
                isFieldDisabled={isTrainingCompleted}
            />
            <FieldsetText
                legend="Identificador"
                placeholder="Identificador"
                defaultValue={id}
                readOnly
                isFieldDisabled={isTrainingCompleted}
            />
            <FieldsetText
                legend="Peso (Kg)"
                placeholder="Peso"
                value={weight}
                onChange={(e) => {
                    const target = e.target;
                    const weightValue = Number(target.value);

                    setMovementWeight(id, weightValue)
                }}
                isFieldDisabled={isTrainingCompleted}
            />
            {!isTrainingCompleted && (
                <Button
                    variant="action"
                    actionType="error"
                    onClick={() => removeMovement(id)}
                >
                    <Trash />
                </Button>
            )}
        </ListItem>
    )
}

export default MuscleMovement;