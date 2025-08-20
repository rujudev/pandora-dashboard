import { useContext } from "react";
import { DialogContext } from "../context/dialog.context";

export const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('El hook useDialog no está siendo usado dentro de un DialogProvider');
    }

    return context
}