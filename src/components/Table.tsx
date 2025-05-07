import { FC } from "react";
import { AddTraining, EditUser, Remove } from "./Icon";

type ColType = 'string' | 'number' | 'date' | 'boolean' | 'actions';

type Row = {
    id: string | number,
    [key: string]: any
}

type Column = {
    field: string,
    width?: string | number,
    headerName?: string,
    sortable?: boolean,
    sortingOrder?: 'asc' | 'desc',
    type?: ColType
}

type Props = {
    rows: Row[],
    columns: Column[],
    classes: string,
    checkboxSelection?: boolean
}
const Table: FC<Props> = ({ rows, columns, classes, checkboxSelection = false }) => {
    const mappedColumns = columns.map(column => {
        let mappedColumn = { ...column };
        const width = column?.width;

        if (width) {
            // Caso 1: Ya está en formato Tailwind válido
            if (typeof width === 'string' && /^w-(\[.*\]|.*)/.test(width)) {
                return column;
            }

            // Caso 2: Es número o string numérico sin unidades → w-[{valor}px]
            if (typeof width === 'number' || /^\d+$/.test(width)) {
                return { ...column, width: `w-[${width}px]` };
            }

            // Caso 3: Tiene unidades pero no prefijo w- → w-[{valor}]
            if (/(px|%|em|rem|vw|vh)$/.test(width)) {
                return { ...column, width: `w-[${width}]` };
            }

            // Resto de casos (fracciones, valores especiales)
            return { ...column, width: `w-${width}` };
        } else {
            return mappedColumn;
        }
    })

    return (
        <div className={classes}>
            <table className="table w-full table-auto">
                <thead>
                    <tr>
                        {checkboxSelection && (
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                        )}
                        {mappedColumns.map(({ width, headerName = '' }) => (
                            <th {...width ? { className: `width:${width}` } : null}>{headerName}</th>
                        )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((athlete, rowIndex) => (
                            <tr key={athlete.id || rowIndex}>
                                {checkboxSelection && (
                                    <td>
                                        <label>
                                            <input type="checkbox" className="checkbox" />
                                        </label>
                                    </td>
                                )}
                                {
                                    columns.map((col, colIndex) => {
                                        const isActionCol = col.field === 'actions';

                                        return (
                                            <td key={col.field || colIndex}>
                                                {isActionCol ? (
                                                    <div className="flex gap-5">
                                                        <a className="transition-colors duration-200 hover:text-info cursor-pointer" href={`/athlete/${athlete.id}`}>
                                                            <EditUser />
                                                        </a>
                                                        <a className="transition-colors duration-200 hover:text-success cursor-pointer">
                                                            <AddTraining />
                                                        </a>
                                                        <a className="transition-colors duration-200 hover:text-error cursor-pointer">
                                                            <Remove />
                                                        </a>
                                                    </div>
                                                ) : athlete[col.field] ?? null}
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