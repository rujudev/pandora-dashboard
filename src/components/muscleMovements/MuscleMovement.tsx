import { FC } from "react";
import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { FieldsetText } from "../fieldset";
import { Trash } from "../Icon";
import ListItem from "../list/ListItem";

interface Props {
    id: number,
    name: string,
    weight: number
}

const MuscleMovement: FC<Props> = ({ id, name, weight }) => {
    const { setMovementWeight, removeMovement } = useAthleteTraining()

    return (
        <ListItem classes="px-0">
            <FieldsetText
                classes="list-col-grow"
                legend="Nombre"
                placeholder="Nombre"
                defaultValue={name}
                readOnly
            />
            <FieldsetText
                legend="Identificador"
                placeholder="Identificador"
                defaultValue={id}
                readOnly
            />
            <FieldsetText
                id="weight_ref"
                legend="Peso (Kg)"
                placeholder="Peso"
                value={weight}
                onChange={(e) => {
                    const target = e.target;
                    const weightValue = Number(target.value);

                    setMovementWeight(id, weightValue)
                }}
            />
            <button className="duration:100 transition-colors hover:text-error cursor-pointer" onClick={() => removeMovement(id)}>
                <Trash />
            </button>
        </ListItem>
    )
}

export default MuscleMovement;