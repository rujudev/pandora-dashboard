import { Athlete } from "./athlete.types"
import { Training } from "./training.types"

export type LoaderData = {
    label?: string
    path?: string
    isLast?: boolean
    athlete?: Athlete,
    training?: Training
}