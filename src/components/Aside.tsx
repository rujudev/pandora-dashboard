import { useState } from "react";
import { Athlete, Dashboard, Training } from "./Icon";

const Aside = () => {
    const [navItems, setNavItems] = useState([
        { name: "Inicio", icon: <Dashboard /> },
        { name: "Atletas", icon: <Athlete /> },
        { name: "Entrenamientos", icon: <Training /> },
    ]);

    return (
        <aside className="flex flex-col h-full">
            <header className="flex justify-center items-center gap-3 p-2">
                <img className="w-1/4" src="/src/assets/LogoSinFondoAzul.webp" />
                <h2 className="h-fit text-primary">Pandora's Box</h2>
            </header>
            <nav className="grid gap-1 p-2">
                <ul className="flex flex-col gap-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-bg">
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Aside