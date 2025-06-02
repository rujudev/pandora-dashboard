import { ActionDispatch, createContext, ReactElement, useReducer } from "react";
import { useLoaderData } from "react-router";
import AthleteTraining from "../components/athlete/AthleteTraining";
import { FullTrainingPlan } from "../interfaces/interfaces_compuestas.interface";
import { LoaderData } from "../interfaces/loader-data.interface";
import { athleteTrainingReducer, initialAthleteTrainingState } from "../reducer/athlete-training.reducer";
import { AthleteTrainingAction } from "../types/reducer/athlete-training-reducer-action";

interface AthleteTrainingContextProps {
    state: FullTrainingPlan,
    dispatch: ActionDispatch<[action: AthleteTrainingAction]>
}

export const AthleteTrainingContext = createContext<AthleteTrainingContextProps>({ state: initialAthleteTrainingState, dispatch: () => null })

export const AthleteTrainingProvider = ({ initialTraining = initialAthleteTrainingState, children }: {
    initialTraining: FullTrainingPlan | undefined,
    children: ReactElement
}) => {
    const [state, dispatch] = useReducer(athleteTrainingReducer, initialTraining)

    return (
        <AthleteTrainingContext.Provider value={{ state, dispatch }}>
            {children}
        </AthleteTrainingContext.Provider>
    )
}

export const AthleteTrainingContextWrapper = () => {
    const { training } = useLoaderData() as LoaderData;

    return (
        <AthleteTrainingProvider initialTraining={training}>
            <AthleteTraining />
        </AthleteTrainingProvider>
    )
}