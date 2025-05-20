import { FC } from "react"

type Props = {
    children: React.ReactNode,
    classes?: string
}

const List: FC<Props> = ({ children, classes }) => {
    return (
        <ul className={`list rounded-box w-full${classes ? ` ${classes}` : ''}`}>
            {children}
        </ul>
    )
}

export default List