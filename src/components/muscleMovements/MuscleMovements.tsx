import { useAthleteTraining } from "../../hooks/useAthleteTraining";
import { Movement, Plus } from "../Icon";
import List from "../list/List";
import OpenModalButton from "../modal/OpenModalButton";
import AddMovementForm from "./AddMovementForm";
import MuscleMovement from "./MuscleMovement";

const MuscleMovements = () => {
    const { state, addMovement } = useAthleteTraining();

    return (
        <>
            <div className="flex justify-between">
                <div className="flex items-center gap-5">
                    <Movement />
                    <h1 className="text-lg">Movimientos musculares</h1>
                </div>
                <OpenModalButton
                    buttonIcon={<Plus />}
                    buttonText="Nuevo movimiento muscular"
                    modalContent={
                        <AddMovementForm movementsInTraining={state.muscle_movements} addMovement={addMovement} />
                    }
                    modalId="add-muscle-movement"
                />
            </div>
            {state.muscle_movements && state.muscle_movements?.length > 0 && (
                <List>
                    {state.muscle_movements.map(({ id_movement, movement_name, weight_ref }) =>
                        <MuscleMovement
                            key={id_movement}
                            id={id_movement}
                            name={movement_name}
                            weight={weight_ref}
                        />)}
                </List>
            )}
        </>
    )
}

export default MuscleMovements;