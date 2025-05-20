import { FC } from "react"

type Props = {
    children: React.ReactNode,
    classes?: string
}

const List: FC<Props> = ({ children, classes }) => {
    return (
        <ul className={`list bg-base-100 rounded-box w-full${classes ? ` ${classes}` : ''}`}>
            {children}
        </ul>
    )
}

export default List