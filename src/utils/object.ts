import _ from 'lodash';


export const getChangedFields = <T extends Record<string, any>>(initial: T, current: T): Partial<T> => {
    const updated: Partial<T> = {};

    for (const key in current) {
        const initialValue = initial[key];
        const currentValue = current[key];

        if (_.isArray(initialValue) && _.isArray(currentValue)) {
            // Comparación de arrays (por valor profundo)
            if (!_.isEqual(initialValue, currentValue)) {
                updated[key] = currentValue;
            }
        } else if (_.isObject(initialValue) && _.isObject(currentValue)) {
            // Comparación de objetos anidados
            const nestedChanges = getChangedFields(
                initialValue as Record<string, any>,
                currentValue as Record<string, any>);

            if (!_.isEmpty(nestedChanges)) {
                updated[key] = nestedChanges as any;
            }
        } else {
            // Comparación de valores primitivos
            if (!_.isEqual(initialValue, currentValue)) {
                updated[key] = currentValue;
            }
        }
    }

    return updated;
}