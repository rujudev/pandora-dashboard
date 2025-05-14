import { FC } from "react"
import { Trash } from "../Icon"

type Props = {
    title: string,
    onDelete?: () => void
}

const ListHeader: FC<Props> = ({ title, onDelete }) => {
    return (
        <header className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button className="duration:100 transition-colors hover:text-error cursor-pointer" onClick={onDelete}>
                <Trash />
            </button>
        </header>
    )
}

export default ListHeader