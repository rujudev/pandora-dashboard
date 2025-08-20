import { FC, ReactNode } from "react"
import { Trash } from "./Icon"

type Props = {
    title?: string,
    titleIcon?: ReactNode,
    isSubCollapse?: boolean,
    children?: ReactNode,
    name?: string,
    classes?: string,
    id?: number,
    onRemove?: (exerciseId: number) => void
}

const Collapse: FC<Props> = ({ id, classes, title, titleIcon, isSubCollapse = false, name, children, onRemove = null }) => {
    return (
        <>
            <div tabIndex={0} className={`collapse grid-cols-12 collapse-arrow${classes ? ` ${classes}` : ''}`}>
                <input className={`pl-12 ${onRemove ? ' !col-start-2 col-span-12' : ''}`} type="checkbox" name={name} />
                {onRemove && (
                    <div className="flex justify-center items-center">
                        <button
                            className="col-start-1 row-start-1 duration:100 transition-colors hover:text-error cursor-pointer"
                            onClick={() => onRemove(id || 0)}
                        >
                            <Trash />
                        </button>
                    </div>
                )}
                <div className={`${onRemove ? 'col-start-2 col-span-12 flex gap-5 ' : ''}border-neutral rounded-xl ${isSubCollapse ? `pl-4` : "after:left-[1.4rem] pl-12"} collapse-title font-semibold`}>
                    {titleIcon && titleIcon}
                    <h1 className="text-lg">{title}</h1>
                </div>
                <div className="flex flex-col gap-5 collapse-content text-sm col-span-12">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Collapse