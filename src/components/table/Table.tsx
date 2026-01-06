import { ReactNode } from "react";

type ColType = 'string' | 'number' | 'date' | 'boolean' | 'actions';

type Row<T extends Record<string, any> = any> = T;

type Align = 'left' | 'center' | 'right';

export type Column<T = Record<string, any>> = {
    field: keyof T | 'actions' | 'selection',
    width?: string | number,
    headerName?: string,
    align?: Align | string,
    sortable?: boolean,
    sortingOrder?: 'asc' | 'desc',
    classes?: string,
    type?: ColType,
    render?: (data?: any, countItems?: number) => ReactNode
}

type Props<T extends Record<string, any> = Record<string, any>> = {
    rows: Row<T>[],
    rowHover?: boolean,
    columns: Column[],
    classes?: string,
    thClasses?: string,
    trClasses?: string,
    tdClasses?: string,
    checkboxSelection?: boolean,
    disableTHead?: boolean
}

const Table = <T extends Record<string, any> = Record<string, any>>({
    rows,
    rowHover,
    columns,
    classes,
    thClasses,
    trClasses,
    tdClasses,
    checkboxSelection = false,
    disableTHead
}: Props<T>) => {
    const mappedColumns = columns.map(column => {
        let mappedColumn = { ...column };
        const width = column?.width;
        const align = column?.align;

        if (width) {
            // Resto de casos (fracciones, valores especiales)
            mappedColumn = { ...mappedColumn, width: `w-${width}` };

            // Caso 2: Es número o string numérico sin unidades → w-[{valor}px]
            if (typeof width === 'number' || /^\d+$/.test(width)) {
                mappedColumn = { ...mappedColumn, width: `w-[${width}px]` };
            }

            // Caso 3: Tiene unidades pero no prefijo w- → w-[{valor}]
            if (typeof width === 'string' && /(px|%|em|rem|vw|vh)$/.test(width)) {
                mappedColumn = { ...mappedColumn, width: `w-[${width}]` };
            }
        }

        if (align) {
            mappedColumn = { ...mappedColumn, align: `text-${align}` }
        }

        return mappedColumn;
    })

    return (
        <div className={classes}>
            <table className="table table-auto">
                {!disableTHead && (
                    <thead>
                        <tr>
                            {mappedColumns.map(({ field, headerName = '' }) => {
                                const isSelectionCol = field === 'selection';
                                const isActionCol = field === 'actions';

                                if (isSelectionCol && !checkboxSelection) return null

                                if (isSelectionCol || isActionCol) {
                                    return (
                                        <th key={`th-field-${field}`} {...(isActionCol && { className: 'text-right' })}>
                                            {headerName}
                                        </th>
                                    )
                                }

                                return (
                                    <th key={`th-field-${field}`} {...(thClasses && { className: thClasses })}>{headerName}</th>
                                )
                            })}
                        </tr>
                    </thead>
                )}
                <tbody {...(rowHover && { className: '[&>tr]:hover:bg-base-200' })}>
                    {
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {
                                    mappedColumns.map(({ field, render }, colIndex) => {
                                        const isSelectionCol = field === 'selection';
                                        const isActionCol = field === 'actions';

                                        if (isSelectionCol && !checkboxSelection) return null;

                                        if ((isSelectionCol || isActionCol) && render) {
                                            return (
                                                <td key={`td-field-${field}`} className={`${isActionCol ? `align-middle text-right` : ''}`}>
                                                    {isActionCol ? (
                                                        <div className="flex justify-end">
                                                            {render(row)}
                                                        </div>
                                                    ) : render(row)}
                                                </td>
                                            )
                                        }

                                        if (!isSelectionCol || !isActionCol) {
                                            return (
                                                <td key={field || colIndex} {...(tdClasses && { className: tdClasses })}>
                                                    {render ? render(row) : row[field]}
                                                </td>
                                            )
                                        }
                                    })
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div >
    )
}

export default Table