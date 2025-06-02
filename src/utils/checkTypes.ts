import { MuscleMovementWithWeightRef } from "../interfaces/movement/muscle-movement-weight.interface";

export const isMuscleMovementWithWeightRef = (value: any): value is MuscleMovementWithWeightRef => {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.id_movement === 'number' &&
        typeof value.movement_name === 'string' &&
        typeof value.weight_ref === 'number'
    )
}