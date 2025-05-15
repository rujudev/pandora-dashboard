import { Athlete } from "../interfaces/athlete.interface";
import { Training } from "../interfaces/training.interface";


export type CrumbData = {
    label: string;
    isLast: boolean;
    path?: string;
    athlete?: Athlete;
    training?: Training;
};

export type CrumbHandle = {
    crumb: (data: CrumbData) => CrumbData;
};