import { CSSProperties, FC, ReactNode, RefObject } from "react"

interface Props {
    ref: RefObject<HTMLDivElement | null> | ((node: HTMLElement | null) => void),
    children: ReactNode,
    style?: CSSProperties,
    classes?: string
}

const Card: FC<Props> = ({ ref, children, classes, style }) => {
    return (
        <div ref={ref} className={`card card-border border-base-300 bg-base-100 col-span-2${classes ? ` ${classes}` : ''}`} {...style ? { style } : null}>
            {children}
        </div>
    )
}

export default Card