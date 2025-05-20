import { MuscleMovementWithWeightRef } from "../../interfaces/muscle-movement-weight.interface";
import { Movement, Plus } from "../Icon";
import List from "../list/List";
import MuscleMovement from "./MuscleMovement";

const MuscleMovements = ({ muscleMovements, onChangeWeightRef, onDeleteMuscleMovement }: {
    muscleMovements: MuscleMovementWithWeightRef[],
    onChangeWeightRef: (movementId: number, value: number) => void,
    onDeleteMuscleMovement: (movementId: number) => void
}) => {
    const onHandleChange = (movementId: number, value: number) => {
        onChangeWeightRef(movementId, Number(value));
    }

    const onHandleDelete = (movementId: number) => {
        onDeleteMuscleMovement(movementId);
    }

    return (
        <div className="col-span-2 flex flex-col justify-items-end gap-5 text-sm border border-neutral rounded-xl p-4 w-full">
            <div className="flex justify-between">
                <div className="flex items-center gap-5">
                    <Movement />
                    <h1 className="text-lg">Movimientos musculares</h1>
                </div>
                <button className="flex btn btn-primary gap-2 w-fit">
                    <Plus />
                    Nuevo movimiento muscular
                </button>
            </div>
            {muscleMovements && muscleMovements?.length > 0 && (
                <List>
                    {muscleMovements.map(movement =>
                        <MuscleMovement
                            key={movement.id_movement}
                            movement={movement}
                            onChange={onHandleChange}
                            onDelete={onHandleDelete}
                        />)}
                </List>
            )}
        </div>
    )
}

export default MuscleMovements;