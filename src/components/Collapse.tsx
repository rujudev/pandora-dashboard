import { FC, ReactNode } from "react"

type Props = {
    title?: string,
    titleIcon?: ReactNode,
    isSubCollapse?: boolean,
    children?: ReactNode,
    name?: string,
    classes?: string
}

const Collapse: FC<Props> = ({ classes, title, titleIcon, isSubCollapse = false, name, children }) => {
    return (
        <div tabIndex={0} className={`collapse collapse-arrow${classes ? ` ${classes}` : ''}`}>
            <input className="pl-12" type="checkbox" name={name} />
            <div className={`border-neutral rounded-xl ${isSubCollapse ? `pl-4` : "after:left-[1.4rem] pl-12"} flex gap-5 collapse-title font-semibold`}>
                {titleIcon && titleIcon}
                <h1 className="text-lg">{title}</h1>
            </div>
            {children}
        </div >
    )
}

export default Collapse