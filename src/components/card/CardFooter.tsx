import { FC, ReactNode } from "react";

interface Props {
    saveButton?: ReactNode;
    cancelButton?: ReactNode;
    classes?: string;
}

const CardFooter: FC<Props> = ({
    saveButton,
    cancelButton,
    classes,
}) => (
    <div className={`flex justify-end items-center${classes ? ` ${classes}` : ''}`}>
        {saveButton && (
            <div>
                {saveButton}
            </div>
        )}
        {cancelButton && (
            <div className="mr-2">
                {cancelButton}
            </div>
        )}
    </div>
)

export default CardFooter;