import { FC, PropsWithChildren } from 'react'

interface Props {
    classes?: string,
}
export const Tabs: FC<PropsWithChildren<Props>> = ({ classes, children }) => {
    return <div className={`tabs${classes ? ` ${classes}` : ''}`}>{children}</div>
}