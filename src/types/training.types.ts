export interface Training {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    period: string;
    week_type: string;
    muscle_movements: MuscleMovement[];
    sessions: Session[];
}

export interface MuscleMovement {
    id: string;
    name: string;
    weight: number;
}

export interface Session {
    id: string;
    day_name: string;
    day_type: string;
    assigned_athletes: string[];
    intensities: Intensity[];
    exercises: Exercise[];
}

export interface Exercise {
    id: string;
    name: string;
    abbreviation: string;
    muscle_movement_weight: string | MuscleMovementWithWeight;
    intensities: ExerciseIntensity[];
    repetitions: number;
    series: number;
    intensity_zone: string;
}

export interface MuscleMovementWithWeight {
    id: string;
    name: string;
    weight: number;
}

export interface Intensity {
    intensity_zone: string | null;
    minimum: PercentageRange;
    maximum: PercentageRange;
    repetitions: number;
    series: number;
    weight: number;
}

export interface ExerciseIntensity {
    minimum: PercentageRange;
    maximum: PercentageRange;
    intensity_zone?: string | null;
    repetitions?: number;
    series?: number;
    weight?: number;
}

export interface PercentageRange {
    percentage: number;
    weight: number;
}