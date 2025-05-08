import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar } from "./Icon";


const FieldsetDate = ({ legend = '', value = '', label = '', placeholder = '', full = true }) => {
    const [date, setDate] = useState<Date | undefined>();
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{legend}</legend>
            <button popoverTarget="rdp-popover" className={`flex justify-between input input-border${full ? ' w-full' : ''}`} style={{ anchorName: "--rdp" } as React.CSSProperties} type="button">
                <span className={`text-base-content${!date ? ' opacity-[0.5]' : ''}`}>{date ? date.toLocaleDateString() : placeholder}</span>
                <Calendar classes="opacity-[0.5]" />
            </button>
            <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={setDate} />
            </div>
            {label && (
                <p className="label">You can edit page title later on from settings</p>
            )}
        </fieldset>
    );
}

export default FieldsetDate