import { CSSProperties, FC, ReactNode, RefObject } from "react"

interface Props {
    children: ReactNode,
    ref?: RefObject<HTMLDivElement | null> | ((node: HTMLElement | null) => void),
    style?: CSSProperties,
    classes?: string
}

const Card: FC<Props> = ({ ref, children, classes, style }) => {
    return (
        <div ref={ref} className={`card card-border border-base-300 bg-base-100 col-span-2 p-6${classes ? ` ${classes}` : ''}`} {...style ? { style } : null}>
            {children}
        </div>
    )
}

export default Card