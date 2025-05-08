export interface Athlete {
    id: string
    name: string
    last_name: string
    birth_date: string
    age: number
    sport: string
    category: string
    team: string
    trainings: Training[]
}

export interface Training {
    id: number
    start_date: string
    end_date: string
    period: string
    week_type: string
    muscle_movements: MuscleMovement[]
    sessions: Session[]
}

export interface MuscleMovement {
    id: number
    name: string
    weight: number
}

export interface Session {
    id: number
    day_name: string
    day_type: string
    exercises: Exercise[]
}

export interface Exercise {
    id: number
    abbreviation: string
    name: string
    muscle_movement_weight: any
    intensities: Intensity[]
    repetitions: number
    series: number
    intensity_zone: string
}

export interface Intensity {
    minimum: Minimum
    maximum: Maximum
}

export interface Minimum {
    percentage: number
    weight: number
}

export interface Maximum {
    percentage: number
    weight: number
}
