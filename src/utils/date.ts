export const calculateAge = (date: Date | null): string => {
    if (!date) return '0';

    const today = new Date();
    const birthYear = date.getFullYear();
    const birthMonth = date.getMonth();
    const birthDay = date.getDate();

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

export const getFormattedDate = (date: Date, locale: Intl.LocalesArgument, options: Intl.DateTimeFormatOptions) => {
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
} 