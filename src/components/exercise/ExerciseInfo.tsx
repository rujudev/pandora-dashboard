import { ExerciseWithMeta, initExercise } from "../../pages/Exercises";
import Button from "../Button";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import CardFooter from "../card/CardFooter";
import { FieldsetText } from "../fieldset";
import FieldsetTextarea from "../fieldset/FieldsetTextarea";

const ExerciseInfo = ({ onChange, onSave, mode = 'edit', isEditing = false, exercise = initExercise }: {
    onChange?: (value: string | boolean, key: keyof ExerciseWithMeta) => void;
    onSave?: (exercise: ExerciseWithMeta) => void;
    mode?: 'edit' | 'create';
    isEditing?: boolean;
    exercise?: ExerciseWithMeta;
}) => {
    const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: keyof ExerciseWithMeta) => {
        const value = e.target.value;
        onChange && onChange(value, key);
    };

    return (
        <Card classes="border-none p-0! gap-4 w-full">
            <CardBody>
                <div className={`grid grid-cols-2 gap-5 bg-base-100 rounded-xl p-6 ${mode === 'create' ? 'border-none px-0' : 'border border-base-content/20'}`}>
                    <FieldsetText
                        legend="Nombre"
                        classes=""
                        placeholder="Nombre"
                        value={exercise?.exercise_name}
                        onChange={(e) => onHandleChange(e, 'exercise_name')}
                    />
                    <FieldsetText
                        legend="Abreviatura"
                        placeholder="Abreviatura"
                        value={exercise?.abreviation}
                        onChange={(e) => onHandleChange(e, 'abreviation')}
                    />
                    <FieldsetTextarea
                        id="remarks"
                        classes="col-span-2 w-full"
                        legend="Comentarios"
                        placeholder="Comentarios"
                        value={exercise?.remarks || ''}
                        onChange={(e) => onHandleChange(e, 'remarks')}
                    />
                </div>
            </CardBody>
            {isEditing && (
                <CardFooter
                    classes="gap-2"
                    saveButton={(
                        <Button variant="solid" purpose="save" onClick={() => onSave?.(exercise)}>
                            Guardar cambios
                        </Button>
                    )}
                    cancelButton={(
                        <Button variant="solid" purpose="cancel" onClick={() => onChange?.(false, 'isEditing')}>
                            Cancelar
                        </Button>
                    )}
                />
            )}
        </Card>
    )
}

export default ExerciseInfo;