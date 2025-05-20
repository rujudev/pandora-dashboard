import { DayPeriod, DayWeek } from "../types/day.types";
import { Athlete } from "./athlete.interface";
import { Exercise } from "./exercise.interface";
import { IntensityExercise } from "./intensity-exercise.interface";
import { Intensity } from "./intensity.interface";
import { MuscleMovement } from "./muscle-movement.interface";
import { Session } from "./session.interface";
import { Training } from "./training.interface";

// Interfaces compuestas
export interface TrainingWithAthletes extends Training {
  athletes: Athlete[];
}

export interface SessionWithExercises extends Session {
  exercises: Exercise[];
}

export interface ExerciseWithIntensity extends Exercise {
  intensities: {
    id_intensity: number;
    percentage_min: number;
    percentage_max: number;
    series: number;
    repetitions: number;
    zone: string;
  }[];
}

export interface TrainingWithSessions extends Training {
  sessions: Session[];
}

export interface AthleteWithTrainings extends Athlete {
  trainings: TrainingWithSessions[];
}

export interface TrainingPlan extends Training {
  id_athlete: number;
  sessions: (SessionWithExercises & {
    exercises: ExerciseWithIntensity[];
  })[];
}

// Nuevas interfaces compuestas propuestas
export interface ExerciseWithMovement extends Exercise {
  movement: MuscleMovement;
}

export interface SessionWithExercisesAndIntensities extends Session {
  exercises: ExerciseWithIntensity[];
}

export interface TrainingWithMovements extends Training {
  movements: {
    movement: MuscleMovement;
    weight_ref: number;
  }[];
}

export interface AthleteWithFullTrainings extends Athlete {
  trainings: (TrainingWithSessions & {
    sessions: SessionWithExercisesAndIntensities[];
  })[];
}

export interface IntensityWithExercises extends Intensity {
  exercises: {
    exercise: Exercise;
    series: number;
    repetitions: number;
  }[];
}

export interface MovementsWithWeightRef extends MuscleMovement {
  weight_ref: number;
}

export interface FullTrainingPlan extends Training {
  id_athlete: number;
  muscle_movements: MovementsWithWeightRef[];
  sessions: SessionWithExercisesAndIntensities[];
}

export interface AthleteTrainingSummary {
  athlete: Athlete;
  upcoming_sessions: {
    session: SessionWithExercisesAndIntensities;
    training: Training;
  }[];
  recent_performance: {
    exercise: Exercise;
    last_intensity: IntensityExercise;
    progress: number;
  }[];
}

// Utilidades adicionales
export interface DaySession {
  day: DayWeek;
  period: DayPeriod;
  sessions: SessionWithExercisesAndIntensities[];
}

export interface TrainingWeek {
  weekNumber: number;
  days: DaySession[];
}

// Tipo para filtros
export interface TrainingFilter {
  period?: string;
  week_type?: string;
  id_athlete?: number;
  start_date?: Date;
  end_date?: Date;
}