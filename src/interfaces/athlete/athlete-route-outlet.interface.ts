import { Dispatch, SetStateAction } from "react";
import { HeaderProps } from "../../components/headerPage/HeaderPage";

export interface AthleteOutletContext {
    setHeaderConfig: Dispatch<SetStateAction<HeaderProps>>,
}