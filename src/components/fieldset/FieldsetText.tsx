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
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void | undefined
}

export const FieldsetText: FC<Props> = ({
    id = '',
    legend = '',
    placeholder = '',
    value = undefined,
    defaultValue = undefined,
    label = '',
    classes = '',
    inputClasses = '',
    full = true,
    readOnly = false,
    isFieldDisabled = false,
    onChange
}) => {
    return (
        <fieldset className={`fieldset${classes ? ` ${classes}` : ''}`} disabled={isFieldDisabled}>
            {legend && (
                <legend className="fieldset-legend">{legend}</legend>
            )}
            <input
                id={id}
                type="text"
                className={`input${full ? ' w-full' : ''}${inputClasses ? ` ${inputClasses}` : ''}${readOnly ? ' opacity-[0.5] cursor-default focus:outline-none focus:ring-0 pointer-events-none' : ''}`}
                {...placeholder && { placeholder }}
                {...(value || (!value && !defaultValue)) && { value: value ?? '', onChange: undefined }}
                {...defaultValue && { defaultValue }}
                {...onChange && { onChange }}
                {...(readOnly ? { tabIndex: -1 } : null)}
                readOnly={readOnly}
            />
            {label && (
                <p className="label">{label}</p>
            )}
        </fieldset>
    )
}