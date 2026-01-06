import { FC, useEffect, useRef, useState } from "react"
import { useDialog } from "../../hooks/useDialog"
import { MuscleMovementWithWeightRef } from "../../interfaces/movement/muscle-movement-weight.interface"
import { MuscleMovement } from "../../interfaces/movement/muscle-movement.interface"
import { getAllMovements, getMovementsMaxId } from "../../services/movements"
import { FieldsetText } from "../fieldset"
import { Tab } from "../tab/Tab"
import { Tabs } from "../tab/TabsBox"
import ExistingMovementForm from "./ExistingMovementForm"

interface Props {
    movementsInTraining: MuscleMovementWithWeightRef[],
    addMovement: (movement: MuscleMovementWithWeightRef) => void,
}

const AddMovementForm: FC<Props> = ({ movementsInTraining, addMovement }) => {
    const { closeDialog } = useDialog()
    const [movementDraft, setMovementDraft] = useState<MuscleMovementWithWeightRef>({
        id_movement: 0,
        movement_name: '',
        weight_ref: 0
    });
    const [availableMovements, setAvailableMovements] = useState<MuscleMovement[]>([]);
    const [isExistingInvalid, setIsValidExisting] = useState<boolean>(false);
    const [isNewInvalid, setIsValidNew] = useState<boolean>(false);

    const existingTabRef = useRef<HTMLInputElement | null>(null);
    const newTabRef = useRef<HTMLInputElement | null>(null);

    const fetchAllMovements = async () => {
        const { movements, error } = await getAllMovements();

        if (error) return;

        const movementsAux: MuscleMovement[] = [
            ...movements,
            {
                id_movement: 33,
                movement_name: 'uno',
            },
            {
                id_movement: 34,
                movement_name: 'dos',
            }
        ]

        setAvailableMovements(movementsAux);
    }

    const handleSaveMovement = async () => {
        let movementAux = {
            ...movementDraft
        }

        if (newTabRef.current?.checked) {
            const { maxId, error } = await getMovementsMaxId();

            if (error || typeof maxId !== 'number') throw new Error(error?.message || 'No se ha podido obtener el id máximo de los movimientos');

            movementAux = {
                ...movementAux,
                id_movement: maxId + 1
            }
        }

        addMovement(movementAux)
        closeDialog('add-muscle-movement')
    }

    const handleUpdateMovement = (updateMovement: MuscleMovementWithWeightRef) => {
        setMovementDraft(updateMovement)
    }

    const resetMovementDraft = () => {
        setMovementDraft({
            id_movement: 0,
            movement_name: '',
            weight_ref: 0
        })
    }

    useEffect(() => {
        fetchAllMovements();
    }, [])

    useEffect(() => {
        const isExistingChecked = Boolean(existingTabRef.current?.checked);
        const isNewChecked = Boolean(newTabRef.current?.checked);

        const { id_movement, weight_ref, movement_name } = movementDraft;

        setIsValidExisting(isExistingChecked && (id_movement === 0 || weight_ref === 0))
        setIsValidNew(isNewChecked && (movement_name === '' || weight_ref === 0));
    }, [movementDraft])

    return (
        <div className="flex flex-col gap-5">
            <Tabs classes="tabs-box p-0 justify-center [&>input]:my-4">
                <Tab
                    label="Movimientos existentes"
                    tabRef={existingTabRef}
                    name="movements_form_tab"
                    onTabSelected={resetMovementDraft}
                    content={
                        <ExistingMovementForm
                            availableMovements={availableMovements}
                            selectedMovements={movementsInTraining}
                            selectedMovement={movementDraft}
                            onUpdateMovement={handleUpdateMovement}
                        />
                    }
                    defaultSelected
                />

                <Tab
                    label="Nuevo movimiento"
                    tabRef={newTabRef}
                    name="movements_form_tab"
                    onTabSelected={resetMovementDraft}
                    content={
                        <div className="grid grid-cols-2 bg-base-100 gap-5 p-6 rounded-xl">
                            <FieldsetText
                                id="movement_name"
                                legend="Nombre del movimiento"
                                placeholder="Nombre"
                                value={movementDraft.movement_name || ''}
                                onChange={(e) => {
                                    const movementName = e.target.value;

                                    setMovementDraft((prev: MuscleMovementWithWeightRef) => ({
                                        ...prev,
                                        movement_name: movementName,
                                        is_new: true
                                    }))
                                }}
                            />
                            <FieldsetText
                                id="weight_ref"
                                legend="Peso (Kg)"
                                placeholder="Peso"
                                value={movementDraft.weight_ref.toString() || ''}
                                onChange={(e) => {
                                    const weightRef: number = Number(e.target.value);

                                    if (isNaN(weightRef)) return;

                                    setMovementDraft((prev: MuscleMovementWithWeightRef) => ({
                                        ...prev,
                                        weight_ref: weightRef
                                    }))
                                }}
                            />
                        </div>
                    }
                />
            </Tabs>
            <div className="flex justify-end gap-5">
                <div className="flex justify-end gap-5">
                    <button
                        className="flex btn btn-secondary gap-2"
                        command="close"
                        commandfor="add-muscle-movement"
                        onClick={() => {
                            closeDialog('add-muscle-movement')
                        }}
                    >Cancelar
                    </button>
                    <button
                        command="close"
                        commandfor="add-muscle-movement"
                        className="flex btn btn-primary gap-2"
                        onClick={handleSaveMovement}
                        disabled={isExistingInvalid || isNewInvalid}
                    >
                        Guardar movimiento
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddMovementForm