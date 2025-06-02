import { FC, PropsWithChildren } from 'react'

interface Props {
    classes?: string,
}
export const TabContent: FC<PropsWithChildren<Props>> = ({ classes, children }) => {
    return <div className={`tab-content${classes ? ` ${classes}` : ''}`}>{children}</div>
}
