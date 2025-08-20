import Button from "../Button";
import { Edit, Trash } from "../Icon";

interface ExercisesActionsProps {
    id: number | string;
    onEdit: () => void;
    onRemove: () => void;
}

const ExercisesActions = ({ onEdit, onRemove }: ExercisesActionsProps) => (
    <div className="grid grid-cols-2 gap-5 w-fit">
        <Button variant="action" actionType="success" onClick={onEdit}>
            <Edit />
        </Button>
        <Button variant="action" actionType="error" onClick={onRemove}>
            <Trash />
        </Button>
    </div>
)

export default ExercisesActions;