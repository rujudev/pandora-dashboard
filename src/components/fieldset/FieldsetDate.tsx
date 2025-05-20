import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom";
import { FC, useEffect, useState } from "react";
import { DayPicker, DayPickerProps, getDefaultClassNames, PropsMulti, PropsRange, PropsSingle } from 'react-day-picker';
import { Calendar } from "../Icon";

import 'react-day-picker/dist/style.css';
import Card from "../card/Card";
import CardBody from "../card/CardBody";

type CustomProps = {
    legend?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    full?: boolean;
    anchor?: string;
    id?: string;
}

type Props = (PropsSingle | PropsRange | PropsMulti) & DayPickerProps & CustomProps;

export const FieldsetDate: FC<Props> = (props) => {
    const defaultClassNames = getDefaultClassNames();
    const { id = '', legend = '', label = '', placeholder = '', full = true, selected } = props;
    const [open, setOpen] = useState(false);
    const { refs: { reference, setReference, setFloating }, floatingStyles } = useFloating({
        placement: 'bottom-start',
        strategy: 'fixed',
        open,
        whileElementsMounted: autoUpdate,
        middleware: [offset(5), flip()]
    });
    const [selectedDate, setSelectedDate] = useState<any>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLButtonElement;

            const isInsideRoot = target.closest('.rdp-root') !== null;
            const isInsideButton = (reference.current as HTMLButtonElement)?.contains(target);

            if (!isInsideButton && !isInsideRoot) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    useEffect(() => {
        if (!selected) return;

        setSelectedDate(selected);
    }, [selected]);

    return (
        <>
            <fieldset className="fieldset relative">
                <legend className="fieldset-legend">{legend}</legend>
                <div >
                    <button
                        id={id}
                        ref={setReference}
                        popoverTarget="rdp-popover"
                        className={`flex justify-between input input-border${full ? ' w-full' : ''}`}
                        type="button"
                        onClick={() => setOpen(!open)}
                    >
                        <span className={`text-base-content${!selectedDate ? ' opacity-[0.5]' : ''}`}>{selectedDate ? new Date(selectedDate).toLocaleDateString() : placeholder}</span>
                        <Calendar classes="opacity-[0.5]" />
                    </button>
                    {open && (
                        <Card ref={setFloating} classes="z-10" style={{ ...floatingStyles }}>
                            <CardBody>
                                <DayPicker
                                    {...props}
                                    selected={selectedDate}
                                    required={false}
                                    disabled={{ before: new Date() }}
                                    classNames={{
                                        today: 'text-info',
                                        selected: `${defaultClassNames.selected} text-primary-content`,
                                        day_button: `${defaultClassNames.day_button} hover:text-secondary duration-100 ease-linear`,
                                        chevron: `fill-primary hover:fill-secondary duration-100 ease-linear cursor-pointer`
                                    }}
                                    captionLayout="dropdown"
                                    showOutsideDays
                                />
                            </CardBody>
                        </Card>
                    )}
                </div>
                {
                    label && (
                        <p className="label">{label}</p>
                    )
                }

            </fieldset>
        </>
    );
}
