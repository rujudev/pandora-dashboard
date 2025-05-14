import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom";
import { FC, useEffect, useState } from "react";
import { Check, ChevronDown } from "../Icon";

type Props = {
    legend?: string;
    options?: string[];
    label?: string;
    placeholder?: string;
    full?: boolean;
}

export const FieldsetDropdown: FC<Props> = ({ legend, options, label, placeholder }) => {
    const [open, setOpen] = useState(false);
    const { refs: { reference, setReference, setFloating }, floatingStyles } = useFloating({
        placement: 'bottom-start',
        strategy: 'absolute',
        open,
        whileElementsMounted: autoUpdate,
        middleware: [offset(5), flip()]
    });

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

    return (
        <fieldset className="fieldset relative w-full">
            <legend className="fieldset-legend">{legend}</legend>
            <div className="relative dropdown" ref={setReference}>
                <button tabIndex={0} type="button" className="flex justify-between input input-border text-base-content opacity-[0.5] w-full transform-none transition-none cursor-pointer">
                    {placeholder}
                    <ChevronDown />
                </button>
                <ul tabIndex={0} className="list bg-base-100 border rounded-sm shadow-xl rounded-box dropdown-content menu z-1 w-full p-0" ref={setFloating} style={{ ...floatingStyles }}>
                    {options?.map((option, index) => (
                        <li key={index} className="flex list-row p-0">
                            <div className="flex">
                                <Check /> <span>{option}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </fieldset>
    )
}
