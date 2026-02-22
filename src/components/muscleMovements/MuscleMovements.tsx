import { useEffect, useState } from "react";
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface";
import { MuscleMovement as IMuscleMovement } from "../../interfaces/movement/muscle-movement.interface";
import { getAllMovements } from "../../services/movements";
import Button from "../Button";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { FieldsetSelect, FieldsetText } from "../fieldset";
import { Cancel, Check, Movement, Plus } from "../Icon";
import List from "../list/List";
import MuscleMovement from "./MuscleMovement";

interface MuscleMovementsProps {
    movements?: MuscleMovementWithWeightRef[];
    onAddMovement?: (movement: MuscleMovementWithWeightRef) => void;
    isTrainingCompleted?: boolean;
}

const MuscleMovementsSkeleton = () => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={`muscleMovementSkeleton-${index}`} className="grid grid-cols-[4.5fr_1fr_1fr_max-content] gap-5 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-5 w-1/6"></div>
                        <div className="skeleton h-10 w-full"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-5 w-1/2"></div>
                        <div className="skeleton h-10 w-full"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="skeleton h-5 w-1/2"></div>
                        <div className="skeleton h-10 w-full"></div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="skeleton size-6 rounded-md"></div>
                    </div>
                </div>
            ))}
        </>
    )
}

type MuscleMovementMeta = MuscleMovementWithWeightRef & { isNew?: boolean, isEditing?: boolean, isRemoved?: boolean }

const MuscleMovements = ({
    movements = [],
    onAddMovement,
    isTrainingCompleted = false
}: MuscleMovementsProps) => {
    const [muscleMovements, setMuscleMovements] = useState<IMuscleMovement[]>([])
    const [editingMovement, setEditingMovement] = useState<MuscleMovementMeta | null>(null)
    const allMuscleMovementsExists = muscleMovements.every(m =>
        movements.some(sm => sm.id_movement === m.id_movement)
    )

    useEffect(() => {
        getAllMovements().then(({ movements }) => setMuscleMovements(movements))
    }, [])

    return (
        <>
            <div className="flex justify-between">
                <div className="flex items-center gap-5">
                    <Movement />
                    <h1 className="text-lg">Movimientos musculares</h1>
                </div>
                {!isTrainingCompleted && (
                    <div className="flex flex-col gap-2">
                        <Button
                            mode="create"
                            onClick={() => {
                                setEditingMovement({
                                    isEditing: true,
                                    isNew: true,
                                    movement_name: '',
                                    weight_ref: 0
                                })
                            }}
                            disabled={(muscleMovements.length > 0 && allMuscleMovementsExists) || editingMovement?.isEditing}
                        >
                            <Plus />
                            Añadir movimiento muscular
                        </Button>
                        {muscleMovements.length > 0 && allMuscleMovementsExists && (
                            <p className="text-xs text-slate-400">No hay más movimientos creados para poder asignar</p>
                        )}
                    </div>
                )}
            </div>
            {movements ? (
                <>
                    {editingMovement && editingMovement.isNew && editingMovement.isEditing && (
                        <Card classes="border-base-content/20 list-col-grow">
                            <CardBody classes="grid grid-cols-[1fr_auto_auto] gap-2">
                                <FieldsetSelect
                                    legend="Movimientos existentes"
                                    placeholder="Selecciona un movimiento muscular"
                                    value={editingMovement.id_movement || 'null'}
                                    options={muscleMovements.map(({ id_movement, movement_name }) =>
                                    ({
                                        id: id_movement ?? 1,
                                        option: movement_name,
                                        disabled: movements
                                            .some(movement => movement.id_movement === id_movement)
                                    }))}
                                    onChange={(e) => {
                                        const movementInfoId = Number(e.target.value);
                                        const movementName = muscleMovements
                                            .find(m => m.id_movement === movementInfoId)!.movement_name

                                        setEditingMovement(prev => prev
                                            ? ({ ...prev, movement_name: movementName, id_movement: movementInfoId })
                                            : prev)
                                    }}
                                    classes="w-fit!"
                                />
                                <FieldsetText
                                    legend="Peso (Kg)"
                                    placeholder="0"
                                    value={editingMovement.weight_ref || 0}
                                    onChange={e => setEditingMovement(prev => prev ? ({ ...prev, weight_ref: Number(e.target.value) }) : prev)}
                                    readOnly={!editingMovement.id_movement}
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="action"
                                        actionType="success"
                                        onClick={() => {
                                            onAddMovement && onAddMovement(editingMovement)
                                            setEditingMovement(null)
                                        }}
                                        disabled={!editingMovement.weight_ref}
                                    >
                                        <Check />
                                    </Button>
                                    <Button
                                        variant="action"
                                        actionType="error"
                                        onClick={() => setEditingMovement(prev => prev ? ({ ...prev, isEditing: false }) : prev)}>
                                        <Cancel />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                    {movements?.length > 0 && (
                        <List>
                            {
                                movements.map(({ id_movement, movement_name, weight_ref }) =>
                                    <MuscleMovement
                                        key={id_movement}
                                        id={id_movement}
                                        name={movement_name}
                                        weight={weight_ref}
                                        isTrainingCompleted={isTrainingCompleted}
                                    />
                                )}
                        </List>
                    )}
                </>
            ) : (
                <MuscleMovementsSkeleton />
            )}
        </>
    )
}

export default MuscleMovements;