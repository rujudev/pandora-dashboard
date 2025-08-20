import { FC, ReactNode } from "react";

interface Props {
    title?: string | ReactNode;
    subtitle?: string;
    actionButton?: ReactNode;
    classes?: string;
}

const CardHeader: FC<Props> = ({
    title,
    subtitle,
    actionButton,
    classes,
}) => (
    <div className={`flex justify-between items-center${classes ? ` ${classes}` : ''}`}>
        {(title || subtitle) && (
            <div className="flex flex-col justify-between gap-1.5">
                {title && <h2 className="card-title text-lg font-semibold">{title}</h2>}
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
        )}
        {actionButton && (
            <div className="flex gap-2 items-center">
                {actionButton}
            </div>
        )}
    </div>
)

export default CardHeader;