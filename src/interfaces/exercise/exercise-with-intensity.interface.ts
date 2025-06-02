import { IntensityWithSeriesRepetitionsZoneAndSets } from "../intensity/intensity-with-series-repetitions-zone-and-sets.interface";
import { Exercise } from "./exercise.interface";

export interface ExerciseWithIntensity extends Exercise {
    intensities: IntensityWithSeriesRepetitionsZoneAndSets[];
}