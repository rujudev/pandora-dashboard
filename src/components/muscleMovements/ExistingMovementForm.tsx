import { FC } from "react";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { MuscleMovement } from "../../interfaces/movement/muscle-movement.interface";
import { FieldsetSelect, FieldsetText } from "../fieldset";

interface Props {
    availableMovements: MuscleMovement[],
    selectedMovements: MuscleMovementWithWeightRef[],
    selectedMovement: MuscleMovementWithWeightRef,
    onUpdateMovement: (updateMovement: MuscleMovementWithWeightRef) => void,
}
export const ExistingMovementForm: FC<Props> = ({
    availableMovements,
    selectedMovements,
    selectedMovement,
    onUpdateMovement,
}) => {
    const isMovementSelected = (movementId: number) =>
        selectedMovements.some(savedMovement => savedMovement.id_movement === movementId)

    return (
        <>
            <div className="grid grid-cols-2 bg-base-100 gap-5 p-6 rounded-xl">
                <FieldsetSelect
                    legend="Movimientos musculares existentes"
                    placeholder="Selecciona un movimiento"
                    value={selectedMovement.id_movement || 'null'}
                    onChange={(e) => {
                        const movementId: number = Number(e.target.value)
                        const movement = availableMovements.find(movement => movement.id_movement === movementId);

                        movement && onUpdateMovement({ ...selectedMovement, ...movement })
                    }}
                    options={availableMovements.map(movement => ({
                        id: movement.id_movement,
                        option: movement.movement_name,
                        disabled: isMovementSelected(movement.id_movement)
                    }))}
                />
                <FieldsetText
                    id="weight_ref"
                    legend="Peso (Kg)"
                    placeholder="Peso"
                    value={selectedMovement.weight_ref || ''}
                    onChange={(e) => {
                        const weightRef: number = Number(e.target.value)

                        !isNaN(weightRef) && onUpdateMovement({ ...selectedMovement, weight_ref: weightRef })
                    }}
                    readOnly={!selectedMovement.id_movement}
                />
            </div>
        </>
    )
}

export default ExistingMovementForm