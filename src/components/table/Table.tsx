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
    render?: (data?: any) => ReactNode
}

type Props<T extends Record<string, any> = Record<string, any>> = {
    rows: Row<T>[],
    columns: Column[],
    classes: string,
    checkboxSelection?: boolean,
    disableTHead?: boolean
}

const Table = <T extends Record<string, any> = Record<string, any>>({ rows, columns, classes, checkboxSelection, disableTHead }: Props<T>) => {
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
                            {mappedColumns.map(({ field, width, render, headerName = '' }) => {
                                const isActionCol = field === 'actions';

                                return (
                                    <th {...width || isActionCol ? { className: `${width ? width : ''}${isActionCol ? ` text-right` : ''}` } : null}>
                                        {field === 'selection' && render ? render() : headerName}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {
                                    mappedColumns.map(({ field, render, width }, colIndex) => {
                                        const isActionCol = field === 'actions';

                                        return (
                                            <td key={field || colIndex} className={`${width ? `${width}` : ''}${isActionCol ? ` flex justify-end` : ''}${classes ? classes : ''}`}>
                                                {render ? render(row) : row[field]}
                                            </td>
                                        )
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