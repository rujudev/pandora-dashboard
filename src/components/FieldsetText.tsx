const FieldsetText = ({ legend = '', placeholder = '', value = '', label = '', full = true, readOnly = false }) => {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{legend}</legend>
            <input type="text" className={`input${full ? ' w-full' : ''}${readOnly ? ' opacity-[0.5] cursor-default focus:outline-none focus:ring-0' : ''}`} placeholder={placeholder} value={value} readOnly={readOnly} />
            {label && (
                <p className="label">{label}</p>
            )}
        </fieldset>
    )
}

export default FieldsetText