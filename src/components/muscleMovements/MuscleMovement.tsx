import { ChangeEvent } from "react";
import { MuscleMovementWithWeightRef } from "../../interfaces/muscle-movement-weight.interface";
import { FieldsetText } from "../fieldset";
import { Trash } from "../Icon";
import ListItem from "../list/ListItem";

const MuscleMovement = ({ movement, onChange, onDelete }: {
    movement: MuscleMovementWithWeightRef,
    onChange: (id: number, value: number) => void,
    onDelete: (id: number) => void
}) => {
    const onHandleChange = (e: ChangeEvent<HTMLInputElement>, movementId: number) => {
        const target = e.target;
        const { value } = target;

        onChange(movementId, Number(value) || 0)
    }

    return (
        <ListItem classes="px-0">
            <FieldsetText classes="list-col-grow" legend="Nombre" placeholder="Peso" value={movement.movement_name} readOnly />
            <FieldsetText legend="Identificador" placeholder="Identificador" value={movement.id_movement} readOnly />
            <FieldsetText id="weight_ref" legend="Peso (Kg)" placeholder="Peso" value={movement.weight_ref} onChange={(e) => onHandleChange(e, movement.id_movement)} />
            <button className="duration:100 transition-colors hover:text-error cursor-pointer" onClick={() => onDelete(movement.id_movement)}>
                <Trash />
            </button>
        </ListItem>
    )
}

export default MuscleMovement;