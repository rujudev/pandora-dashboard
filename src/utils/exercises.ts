export const mapToDBTableExercise = (exercise: any) => ({
    id_exercise: exercise.id_exercise,
    exercise_name: exercise.exercise_name,
    remarks: exercise.remarks,
    abreviation: exercise.abreviation,
})