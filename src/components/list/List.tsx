import { FC } from "react"

type Props = {
    children: React.ReactNode
}

const List: FC<Props> = ({ children }) => {
    return (
        <ul className="list bg-base-100 rounded-box w-full">
            {children}
        </ul>
    )
}

export default List