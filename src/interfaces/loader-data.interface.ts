import { Athlete } from "./athlete/athlete.interface"
import { AthleteTrainingSummary } from "./interfaces_compuestas.interface"
import { FullTrainingPlan } from "./training/full-training-plan.interface"

export type LoaderData = {
    label?: string
    path?: string
    isLast?: boolean
    athlete?: Athlete,
    training?: FullTrainingPlan,
    trainings?: AthleteTrainingSummary[]
}