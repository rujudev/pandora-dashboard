import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface DialogData {
    id: string
    content: ReactNode
}

interface DialogContextProps {
    dialog: DialogData | null
    setDialog: Dispatch<SetStateAction<DialogData | null>>
}
export const DialogContext = createContext<DialogContextProps | null>(null);

export const DialogProvider = ({ children }: {
    children: ReactNode
}) => {
    const [dialog, setDialog] = useState<DialogData | null>(null);

    return (
        <DialogContext.Provider value={{ dialog, setDialog }
        }>
            {children}
        </DialogContext.Provider>
    )
}