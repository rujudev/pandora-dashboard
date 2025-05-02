import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";

        setTheme(newTheme);

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";

        setTheme(savedTheme);

        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    return { toggleTheme, theme };
}

export default useTheme;