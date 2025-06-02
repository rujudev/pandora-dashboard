import { ChangeEvent, FC, ReactNode, RefObject } from 'react'
import { TabContent } from './TabContent'

interface Props {
    tabRef?: RefObject<HTMLInputElement | null>,
    classes?: string,
    name?: string,
    label?: string,
    defaultSelected?: boolean,
    content?: ReactNode,
    onTabSelected?: (e: ChangeEvent<HTMLInputElement>) => void
}
export const Tab: FC<Props> = ({ tabRef, name, label, content, defaultSelected = false, onTabSelected }) => {
    return (
        <>
            <input ref={tabRef} type="radio" name={name} className="tab" aria-label={label} onChange={onTabSelected} defaultChecked={defaultSelected} />
            <TabContent classes="pl-4 pr-4 pb-4 gap-5">{content}</TabContent>
        </>
    )
}
