export const colStartClass = (day: number) => {
    return {
        0: 'col-start-7', // Domingo (si no lo usas, puedes omitir)
        1: 'col-start-1',
        2: 'col-start-2',
        3: 'col-start-3',
        4: 'col-start-4',
        5: 'col-start-5',
        6: 'col-start-6',
    }[day] || '';
};