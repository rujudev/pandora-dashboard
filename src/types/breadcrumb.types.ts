import { Athlete, Training } from "./athlete.types";

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