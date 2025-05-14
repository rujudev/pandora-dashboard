import { FC } from "react"

type Props = {
    children: React.ReactNode,
    classes?: string
}

const ListContent: FC<Props> = ({ children, classes }) => {
    return (
        <div className={`${classes ? classes : 'grid grid-cols-1 sm:grid-cols-2 gap-5'}`}>
            {children}
        </div>
    )
}

export default ListContent