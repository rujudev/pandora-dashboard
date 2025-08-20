import { useDialog } from "../../hooks/useDialog";
import Button from "../Button";
import { Close } from "../Icon";

const Dialog = () => {
    const { stack, closeDialog } = useDialog();

    if (stack.length === 0) return null;

    return stack.map(currentDialog => (
        <dialog
            key={currentDialog.id}
            id={currentDialog.id}
            className={`modal w-dvw [scrollbar-gutter:auto] z-${stack.length + 999}`}>
            <div className="modal-box max-w-4xl">
                <Button
                    variant="ghost"
                    command="close"
                    commandfor={currentDialog.id}
                    onClick={() => {
                        setTimeout(() => {
                            closeDialog(currentDialog.id)
                        }, 500)
                    }}
                    isCloseModal
                >
                    <Close classes="size-full" />
                </Button>
                {currentDialog.content}
            </div>
        </dialog>
    ))
}

export default Dialog;