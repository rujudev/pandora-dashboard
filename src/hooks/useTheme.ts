import { useEffect, useState } from "react";

const THEME = {
    LIGHT: 'winter',
    DARK: 'dim',
}

const useTheme = () => {
    const [theme, setTheme] = useState(THEME.LIGHT);

    const toggleTheme = () => {
        const newTheme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

        setTheme(newTheme);

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || THEME.LIGHT;

        setTheme(savedTheme);

        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    return { toggleTheme, theme };
}

export default useTheme;