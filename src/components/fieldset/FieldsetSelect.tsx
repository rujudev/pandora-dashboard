
/** TODO: HAY QUE TERMINAR DE DEJARLO FINO PARA IMPLEMENTARLO POR LOS DROPDOWN */
const FieldsetSelect = ({ options, legend, value, placeholder }) => {
    return (
        <fieldset className="fieldset relative w-full">
            <legend className="fieldset-legend">{legend}</legend>
            <select defaultValue="Pick a browser" className="select">
                <option disabled={true}>{placeholder}</option>
                {options.map(option => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        </fieldset>
    )
}

export default FieldsetSelect