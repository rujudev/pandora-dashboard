import { Dispatch, SetStateAction } from "react";
import { HeaderProps } from "../../components/HeaderPage";

export interface AthleteOutletContext {
    setHeaderConfig: Dispatch<SetStateAction<HeaderProps>>,
}