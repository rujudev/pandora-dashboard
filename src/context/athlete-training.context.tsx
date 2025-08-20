import { ActionDispatch, createContext, ReactElement, useReducer } from "react";
import AthleteTraining from "../components/athlete/AthleteTraining";
import { Athlete } from "../interfaces/athlete/athlete.interface";
import { FullTrainingPlan } from "../interfaces/training/full-training-plan.interface";
import { athleteTrainingReducer, initialAthleteTrainingState } from "../reducer/athlete-training.reducer";
import { AthleteTrainingAction } from "../types/reducer/athlete-training-reducer-action";

interface AthleteTrainingContextProps {
    state: FullTrainingPlan & Partial<Athlete> | null,
    dispatch: ActionDispatch<[action: AthleteTrainingAction]>
}

export const AthleteTrainingContext = createContext<AthleteTrainingContextProps>({ state: initialAthleteTrainingState, dispatch: () => null })

export const AthleteTrainingProvider = ({ initialTraining, children }: {
    initialTraining: FullTrainingPlan & Partial<Athlete> | null,
    children: ReactElement
}) => {
    const [state, dispatch] = useReducer(athleteTrainingReducer, initialTraining)

    return (
        <AthleteTrainingContext value={{ state, dispatch }}>
            {children}
        </AthleteTrainingContext>
    )
}

export const AthleteTrainingContextWrapper = ({ mode }: { mode: 'edit' | 'create' }) => {
    return (
        <AthleteTrainingProvider initialTraining={null}>
            <AthleteTraining mode={mode} />
        </AthleteTrainingProvider>
    )
}