import { JSX, ReactNode } from "react";
import { useDialog } from "../../hooks/useDialog";

const OpenModalButton = ({ buttonIcon, buttonText, modalId, modalContent, classes, disabled = false }: {
    buttonIcon?: ReactNode,
    buttonText?: string,
    modalId: string,
    modalContent: JSX.Element,
    disabled?: boolean,
    classes?: string
}) => {
    const { setDialog } = useDialog();

    return (
        <button
            className={`${classes ? ` ${classes}` : 'flex btn btn-primary gap-2'}`}
            command="show-modal"
            commandfor={modalId}
            onClick={() => setDialog({ id: modalId, content: modalContent })}
            {...disabled && { disabled }}
        >
            {buttonIcon}
            {buttonText}
        </button>
    )
}

export default OpenModalButton