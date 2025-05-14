import { ChangeEvent, FC } from "react"

type Props = {
    id?: string,
    legend?: string,
    placeholder?: string,
    value?: string | number,
    label?: string,
    full?: boolean,
    readOnly?: boolean,
    classes?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FieldsetText: FC<Props> = ({ id = '', legend = '', placeholder = '', value = '', label = '', classes = '', full = true, readOnly = false, onChange }) => {
    return (
        <fieldset className={`fieldset${classes ? ` ${classes}` : ''}`}>
            {legend && (
                <legend className="fieldset-legend">{legend}</legend>
            )}
            <input
                id={id}
                type="text"
                className={`input${full ? ' w-full' : ''}${readOnly ? ' opacity-[0.5] cursor-default focus:outline-none focus:ring-0 pointer-events-none' : ''}`}
                placeholder={placeholder}
                value={value}
                readOnly={readOnly}
                {...onChange ? { onChange } : null}
                {...(readOnly ? { tabIndex: -1 } : null)}
            />
            {label && (
                <p className="label">{label}</p>
            )}
        </fieldset>
    )
}