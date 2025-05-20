import { Athlete } from "./athlete.interface"
import { FullTrainingPlan } from "./interfaces_compuestas.interface"

export type LoaderData = {
    label?: string
    path?: string
    isLast?: boolean
    athlete?: Athlete,
    training?: FullTrainingPlan
}