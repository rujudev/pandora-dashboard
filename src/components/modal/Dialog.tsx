import { useDialog } from "../../hooks/useDialog";

const Dialog = () => {
    const { dialog } = useDialog();

    if (!dialog?.id || !dialog?.content) return null

    return (
        <dialog id={dialog.id} className="modal w-dvw [scrollbar-gutter:auto]">
            <div className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" command="close" commandfor={dialog.id}>✕</button>
                {dialog.content}
            </div>
        </dialog>
    )
}

export default Dialog;