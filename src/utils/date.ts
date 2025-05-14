export const calculateAge = (date: string | undefined): string => {
    if (!date) return '0';

    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    let age = today.getFullYear() - birthYear;

    // Ajustar si el cumpleaños aún no ha ocurrido este año
    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age.toString();
};