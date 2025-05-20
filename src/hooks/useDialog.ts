import { useContext, useEffect } from "react";
import { DialogContext } from "../context/Dialog.context";

export const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('El hook useDialog no está siendo usado dentro de un DialogProvider');
    }
    useEffect(() => { console.log(context) }, [context.dialog])

    return context
}