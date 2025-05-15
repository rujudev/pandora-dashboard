import { Athlete } from "./athlete.interface"
import { Training } from "./training.interface"

export type LoaderData = {
    label?: string
    path?: string
    isLast?: boolean
    athlete?: Athlete,
    training?: Training
}