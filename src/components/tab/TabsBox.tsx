import { FC, PropsWithChildren } from 'react'

interface Props {
    classes?: string,
}
export const Tabs: FC<PropsWithChildren<Props>> = ({ classes, children }) => {
    return <div role="tablist" className={`tabs tabs-box${classes ? ` ${classes}` : ''}`}>{children}</div>
}