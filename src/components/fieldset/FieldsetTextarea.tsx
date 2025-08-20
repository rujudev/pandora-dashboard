import { ChangeEvent, FC } from "react"

type Props = {
    id?: string,
    legend?: string,
    placeholder?: string,
    defaultValue?: string | number | undefined,
    value?: string | number | undefined,
    label?: string,
    full?: boolean,
    readOnly?: boolean,
    classes?: string,
    inputClasses?: string,
    isFieldDisabled?: boolean,
    isOptional?: boolean,
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void | undefined
}

const FieldsetTextarea: FC<Props> = ({ value, onChange, isOptional, classes, ...props }) => {
    return (
        <fieldset className={`fieldset${classes ? ` ${classes}` : ''}`}>
            <legend className="fieldset-legend">Notas</legend>
            <textarea className="textarea w-full" placeholder="Introduce una nota para la sesión" value={value} onChange={onChange} {...props}></textarea>
            {isOptional && (
                <div className="label">Opcional</div>
            )}
        </fieldset>
    )
}

export default FieldsetTextarea