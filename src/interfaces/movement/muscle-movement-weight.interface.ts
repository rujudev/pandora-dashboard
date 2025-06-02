import { MuscleMovement } from "./muscle-movement.interface";

export interface MuscleMovementWithWeightRef extends MuscleMovement {
    weight_ref: number;
}