import { useDialog } from "../../hooks/useDialog";
import { Close } from "../Icon";

const Dialog = () => {
    const { stack, closeDialog } = useDialog();

    if (stack.length === 0) return null;

    return (
        <>
            {stack.map(currentDialog => (
                <dialog id={currentDialog.id} className={`modal w-dvw [scrollbar-gutter:auto] z-${stack.length}`}>
                    <div className="modal-box max-w-4xl">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 size-8 p-1"
                            command="close"
                            commandfor={currentDialog.id}
                            onClick={() => {
                                setTimeout(() => {
                                    closeDialog(currentDialog.id)
                                }, 500)
                            }}
                        >
                            <Close classes="size-full" />
                        </button>
                        {currentDialog.content}
                    </div>
                </dialog>
            ))}
        </>
    )
}

export default Dialog;