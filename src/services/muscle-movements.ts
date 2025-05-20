import { MuscleMovementWithWeightRef } from "../interfaces/muscle-movement-weight.interface";
import { MuscleMovement } from "../interfaces/muscle-movement.interface";
import muscleMovements from "../mocks/muscle_movements.json";
import trainingMovements from "../mocks/training_movements.json";

export const getMuscleMovements = async (trainingId: number | string): Promise<MuscleMovementWithWeightRef[]> => {
    const specificTrainingMuscleMovements = trainingMovements.filter(trainingMovement => trainingMovement.id_training === trainingId);

    return await specificTrainingMuscleMovements.map(trainingMovement => {
        const movement = muscleMovements.find(movement => movement.id_movement === trainingMovement.id_movement)

        return {
            ...movement as MuscleMovement,
            weight_ref: trainingMovement.weight_ref
        }
    });
}