import { ChangeEvent, FC } from "react";

type Option = {
    id: string | number,
    option: string
}

type Props = {
    legend?: string;
    options: Option[];
    label?: string;
    placeholder?: string;
    value?: number | string;
    full?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const FieldsetSelect: FC<Props> = ({ options, legend, value, placeholder, onChange }) => (
    <fieldset className="fieldset relative w-full">
        <legend className="fieldset-legend">{legend}</legend>
        <select
            value={value}
            className="select [::picker(select)]:appearance-[base-select] w-full"
            onChange={onChange}
        >
            <option disabled={true}>{placeholder}</option>
            {options?.map(({ id, option }) => (
                <option key={id} value={id}>{option}</option>
            ))}
        </select>
    </fieldset>
)