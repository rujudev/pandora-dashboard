import { useEffect, useState } from "react";
import { useMatch } from "react-router";
import Button from "../components/Button";
import Card from "../components/card/Card";
import CardBody from "../components/card/CardBody";
import CardHeader from "../components/card/CardHeader";
import ExerciseInfo from "../components/exercise/ExerciseInfo";
import HeaderPage from "../components/headerPage/HeaderPage";
import { Edit, Plus, Save, Trash } from "../components/Icon";
import { useBreadcrumbs } from "../context/breadcrumb.context";
import { initHeaderPage } from "../context/header-page.context";
import { useToast } from "../context/toast.context";
import { useHeaderPage } from "../hooks/useHeaderPage";
import { Exercise } from "../interfaces/exercise/exercise.interface";
import { ROUTE } from "../routes/config";
import { getExercises, saveExercises } from "../services/exercises";

export type ExerciseWithMeta = Exercise & { isEditing?: boolean, isNew?: boolean, isRemoved?: boolean }

export const initExercise: Exercise = {
    exercise_name: '',
    abreviation: '',
    remarks: ''
};

const ExercisesPage = () => {
    const { setHeaderConfig } = useHeaderPage()
    const { setCrumbs } = useBreadcrumbs()
    const { showToast } = useToast()

    const isExercisesPage = useMatch(ROUTE.EXERCISES);
    const [editingExercise, setEditingExercise] = useState<ExerciseWithMeta | null>(null);
    const [exercises, setExercises] = useState<ExerciseWithMeta[]>([])
    const [isAddingNewExercise, setIsAddingNewExercise] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getExercisesDB = async () => {
        const { data: exercisesData, error: exercisesError } = await getExercises();

        if (exercisesError) throw new Error(exercisesError.message);

        setExercises(exercisesData.map(e => ({ ...e, isEditing: false })));
    }

    const handleAddNewExercise = () => {
        setEditingExercise({ ...initExercise, id_exercise: exercises.length + 1, isNew: true, isEditing: true });
        setIsAddingNewExercise(true);
    }

    const handleSaveExercise = (exercise: ExerciseWithMeta) => {
        setExercises(prev =>
            exercise.isNew
                ? [...prev, { ...exercise, isEditing: false }]
                : prev.map(ex => ex.id_exercise === exercise.id_exercise ? exercise : ex)
        )
        setEditingExercise(null);
        setIsAddingNewExercise(false);
    }

    const handleSaveExercises = async (exercises: ExerciseWithMeta[]) => {
        setIsLoading(true);

        try {
            await saveExercises(exercises);
            showToast({ type: 'success', message: '¡Cambios guardados correctamente!' });
        } catch (error) {
            showToast({ type: 'error', message: `Error al guardar los cambios: ${error}` })
        } finally {
            setEditingExercise(null);
            setIsAddingNewExercise(false);

            const visibleExercises = exercises
                .filter(ex => !ex.isRemoved)
                .map(ex => ({ ...ex, isNew: false, isEditing: false, isRemoved: false }))
            setExercises(visibleExercises)

            setIsLoading(false);
        }
    }

    const handleEditExercise = (exercise: ExerciseWithMeta) => {
        setEditingExercise({ ...exercise, isEditing: true });
        setIsAddingNewExercise(false);
    }

    const handleRemoveExercise = (id: number | string) => {
        setExercises((prev) => prev.map((ex) => ex.id_exercise === id ? { ...ex, isRemoved: true } : ex));
    }

    useEffect(() => {
        !isExercisesPage && setHeaderConfig(initHeaderPage)
        getExercisesDB()
    }, [isExercisesPage])

    useEffect(() => {
        setCrumbs([
            { label: 'Ejercicios', path: ROUTE.EXERCISES, isLast: true },
        ])

        isExercisesPage &&
            setHeaderConfig({
                title: 'Lista de ejercicios',
                description: "Gestiona los ejercicios disponibles para los entrenamientos de tus atletas.",
                rightContent: (
                    <Button
                        className="btn btn-primary flex gap-2 w-fit"
                        onClick={() => handleSaveExercises(exercises)}
                        disabled={isLoading || !exercises.some(ex => ex.isEditing || ex.isNew || ex.isRemoved)}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                <span>Guardando...</span>
                            </>
                        ) : <><Save /> Guardar cambios</>}
                    </Button>
                )
            })
    }, [isExercisesPage, exercises])

    return (
        <section className="flex flex-col gap-20">
            <HeaderPage />
            <main className="flex flex-col gap-4">
                <Card>
                    <CardHeader
                        title="Añadir nuevo ejercicio"
                        subtitle="Aquí puedes añadir un nuevo ejercicio para tu base de datos."
                        actionButton={(
                            <Button
                                className="btn btn-primary"
                                onClick={handleAddNewExercise}
                                disabled={isAddingNewExercise && (!!editingExercise && editingExercise.isEditing!)}
                            >
                                <Plus /> 'Añadir ejercicio'
                            </Button>
                        )}
                    />
                    {isAddingNewExercise && editingExercise?.isEditing && (
                        <CardBody>
                            <ExerciseInfo
                                exercise={editingExercise!}
                                onChange={(value, key) => setEditingExercise((prev) => prev ? { ...prev, [key]: value } : prev)}
                                onSave={handleSaveExercise}
                                mode="create"
                                isEditing={true}
                            />
                        </CardBody>
                    )}
                </Card>
                <Card classes="gap-5">
                    <CardHeader
                        title={`Ejercicios creados (${exercises.filter(ex => !ex.isRemoved).length})`}
                        subtitle="Gestiona tus ejercicios existentes - edita o elimina según necesites"
                    />
                    <CardBody>
                        <div className="flex flex-wrap gap-4">
                            {exercises
                                .filter(exercise => !exercise.isRemoved)
                                .map((exercise) =>
                                    editingExercise && editingExercise?.id_exercise === exercise.id_exercise && editingExercise.isEditing
                                        ? (
                                            <ExerciseInfo
                                                key={exercise.id_exercise}
                                                exercise={editingExercise}
                                                onChange={(value, key) => {
                                                    setEditingExercise((prev) => prev ? { ...prev, [key]: value } : prev)
                                                    console.log(value, key);
                                                }}
                                                onSave={handleSaveExercise}
                                                isEditing={true}
                                            />
                                        ) : (
                                            <Card key={exercise.id_exercise} classes="w-full border-base-content/20">
                                                <CardHeader
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-semibold">{exercise.exercise_name}</span>
                                                            <span className="badge">{exercise.abreviation}</span>
                                                        </div>
                                                    }
                                                    subtitle={exercise.remarks || 'Sin comentarios'}
                                                    actionButton={
                                                        <>
                                                            <Button variant="action" actionType="info" onClick={() => handleEditExercise(exercise)}>
                                                                <Edit />
                                                            </Button>
                                                            <Button variant="action" actionType="error" onClick={() => handleRemoveExercise(exercise.id_exercise!)}>
                                                                <Trash />
                                                            </Button>
                                                        </>
                                                    }
                                                />
                                            </Card>
                                        )
                                )
                            }
                        </div>
                    </CardBody>
                </Card>
            </main>
        </section>
    );
}

export default ExercisesPage