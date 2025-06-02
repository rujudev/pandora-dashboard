import { ReactNode } from "react"

const CardBody = ({ classes, children }: {
    classes?: string,
    children: ReactNode
}) => {
    return (
        <div className={`card-body${classes ? ` ${classes}` : ''}`}>
            {children}
        </div>
    )
}

export default CardBody