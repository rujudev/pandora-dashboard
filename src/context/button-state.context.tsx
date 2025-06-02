import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface ButtonStateType {
    isDirty: boolean;
    setIsDirty: Dispatch<SetStateAction<boolean | false>>
}

export const ButtonStateContext = createContext<ButtonStateType>({
    isDirty: false,
    setIsDirty: () => null
})

const ButtonStateProvider = ({ children }: { children: ReactNode }) => {
    const [isDirty, setIsDirty] = useState<boolean>(false)

    return (
        <ButtonStateContext.Provider value={{ isDirty, setIsDirty }}>
            {children}
        </ButtonStateContext.Provider>
    )
}

export default ButtonStateProvider