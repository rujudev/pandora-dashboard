import { Intensity } from "./intensity.interface";
import { Set } from "./set.interface";

export interface IntensityWithSeriesRepetitionsZoneAndSets extends Intensity {
    series: number;
    sets: Set[];
    repetitions: number;
    zone: string;
}