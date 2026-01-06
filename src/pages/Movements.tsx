import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/card/Card";
import CardBody from "../components/card/CardBody";
import { FieldsetText } from "../components/fieldset";
import HeaderPage from "../components/headerPage/HeaderPage";
import { Check, Edit, Remove } from "../components/Icon";
import Table, { Column } from "../components/table/Table";
import { useBreadcrumbs } from "../context/Breadcrumbs.context";
import { useToast } from "../context/toast.context";
import { useHeaderPage } from "../hooks/useHeaderPage";
import { MuscleMovement } from "../interfaces/movement/muscle-movement.interface";
import { getAllMovements } from "../services/movements";

type MuscleMovementMeta = MuscleMovement & { isNew?: boolean, isEditing?: boolean, isRemoved?: boolean }

const MovementsActions = ({ movement, onEdit, onSave, onRemove }: {
    movement: MuscleMovementMeta,
    onEdit: (movement: MuscleMovementMeta) => void,
    onSave: () => void,
    onRemove: (id: number) => void
}) => {
    console.log({ movement })
    return (
        <div className="grid grid-cols-2 justify-between gap-2 w-fit">
            <Button
                variant="action"
                actionType="info"
                onClick={() =>
                    movement.isEditing
                        ? onSave()
                        : onEdit(movement)
                }
            >
                {movement.isEditing ? <Check /> : <Edit />}
            </Button>
            <Button variant="action" actionType="error" onClick={() => onRemove(movement.id_movement!)}>
                <Remove />
            </Button>
        </div>
    )
}



// TODO: Hay que añadir filtros para buscar movimientos, paginación y botón de creación y edición de los movimientos musculares.
const MovementsPage = () => {
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()
    const { showToast } = useToast()

    const [movements, setMovements] = useState<MuscleMovement[]>([]);
    const [editingMovement, setIsEditingMovement] = useState<MuscleMovementMeta | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleEditMovement = (movement: MuscleMovementMeta) => {
        setIsEditingMovement({
            ...movement,
            isEditing: true
        });
    }

    const handleChangeMovementName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setIsEditingMovement(prev => prev ? { ...prev, movement_name: value } : null);
    }

    const handleSaveChanges = () => {
        if (editingMovement) {
            setMovements(prev => prev.map(
                movement => movement.id_movement === editingMovement.id_movement ? editingMovement : movement
            ))

            setIsEditingMovement(null);
            showToast({ type: 'success', message: 'Movimiento editado correctamente' });
        }
    }

    const handleRemoveMovement = (id: number) => {
        setMovements(movements.filter(movement => movement.id_movement !== id));
        showToast({ type: 'success', message: 'Movimiento eliminado correctamente' });
    }

    const columns: Column[] = [
        {
            field: 'id_movement',
            headerName: 'ID',
        },
        {
            field: 'movement_name',
            headerName: 'Nombre',
            render: ({ id_movement, movement_name }: MuscleMovement) => (
                <>
                    {editingMovement?.id_movement !== id_movement ? (
                        <span>{movement_name}</span>
                    ) : (
                        <FieldsetText
                            placeholder={editingMovement?.movement_name}
                            value={editingMovement?.movement_name}
                            onChange={handleChangeMovementName}
                        />
                    )}
                </>
            )
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            render: (data: MuscleMovement) => (
                <MovementsActions
                    movement={data}
                    onEdit={handleEditMovement}
                    onSave={handleSaveChanges}
                    onRemove={handleRemoveMovement}
                />
            ),
        }

    ]

    useEffect(() => {
        setCrumbs([
            { label: 'Movimientos musculares', isLast: true },
        ])

        setHeaderConfig({
            title: 'Lista de movimientos musculares',
            description: 'Aquí puedes ver todos los movimientos musculares disponibles en la aplicación.',
        })

        getAllMovements().then(({ movements }) => setMovements(movements))
    }, [])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage />
            <main>
                <Card classes="p-0!">
                    <CardBody>
                        <Table columns={columns} rows={movements} rowHover />
                    </CardBody>
                </Card>
            </main>
        </section>
    );
}

export default MovementsPage