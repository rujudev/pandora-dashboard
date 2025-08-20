import { createContext, ReactNode, useState } from "react";

interface DialogData {
    id: string
    content: ReactNode
}

export interface DialogContextType {
    stack: DialogData[]
    setDialog: (dialog: DialogData) => void
    closeDialog: (dialogId: string) => void
}
export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: {
    children: ReactNode
}) => {
    const [stack, setStack] = useState<DialogData[]>([]);

    const setDialog = (newDialog: DialogData) => {
        setStack((prevDialogs: DialogData[]) =>
            prevDialogs.some(dialog => dialog.id === newDialog.id)
                ? prevDialogs
                : [...prevDialogs, newDialog]
        )
    }

    const closeDialog = (dialogId: string) => {
        setTimeout(() => {
            setStack((prevDialogs: DialogData[]) => prevDialogs.filter(dialog => dialog.id !== dialogId))
        }, 200)
    }

    return (
        <DialogContext.Provider value={{ stack, setDialog, closeDialog }
        }>
            {children}
        </DialogContext.Provider>
    )
}