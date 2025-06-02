import { ChangeEvent, FC } from "react"

interface Props {
    value: string,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    isOptional: boolean
}

const FieldsetTextarea: FC<Props> = ({ value, onChange, isOptional }) => {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Notas</legend>
            <textarea className="textarea w-full" placeholder="Introduce una nota para la sesión" value={value} onChange={onChange}></textarea>
            {isOptional && (
                <div className="label">Opcional</div>
            )}
        </fieldset>
    )
}

export default FieldsetTextarea