import { FC } from "react"

type Props = {
    children: React.ReactNode,
    classes?: string
}

const ListItem: FC<Props> = ({ children, classes }) => {
    return (
        <li className={`list-row${classes ? ` ${classes}` : ''}`}>
            {children}
        </li>
    )
}

export default ListItem