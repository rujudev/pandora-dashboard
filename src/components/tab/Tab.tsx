import { ChangeEvent, FC, ReactNode, RefObject } from 'react'

interface Props {
    tabRef?: RefObject<HTMLInputElement | null>,
    classes?: string,
    name?: string,
    label?: string,
    defaultSelected?: boolean,
    content?: ReactNode,
    onTabSelected?: (e: ChangeEvent<HTMLInputElement>) => void
}
export const Tab: FC<Props> = ({ name, label, content, defaultSelected = false }) => {
    return (
        <>
            <input
                type="radio"
                name={name}
                className="tab"
                aria-label={label}
                defaultChecked={defaultSelected}
            />

            <div className="tab-content pl-4 pr-4 pb-4 gap-5">{content}</div>
        </>
    )
}
