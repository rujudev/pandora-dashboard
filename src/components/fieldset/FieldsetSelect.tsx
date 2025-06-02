import { ChangeEvent, FC } from "react";

type Option = {
    id: string | number,
    option: any,
    disabled?: boolean
}

type Props = {
    legend?: string;
    options: Option[];
    label?: string;
    placeholder?: string;
    value?: number | string | undefined;
    full?: boolean;
    required?: boolean;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const FieldsetSelect: FC<Props> = ({ options, legend, value, placeholder, onChange, required = false }) => {
    return (
        <fieldset className="fieldset relative w-full">
            <legend className="fieldset-legend">{`${legend}${required ? ' *' : ''}`}</legend>
            <select
                value={value}
                className="select [::picker(select)]:appearance-[base-select] w-full"
                onChange={onChange}
                required={required}
            >
                <option value="null" disabled={true}>{placeholder}</option>
                {options?.map(({ id, option, disabled }) => (
                    <option key={id} value={id} {...disabled && { disabled }}>{option}</option>
                ))}
            </select>
        </fieldset>
    )
}