import { ArrowLeft, Athlete, Close, Dashboard, Training } from "./Icon";

const Aside = ({ handleToggleMenu, isMenuOpen }: {
    handleToggleMenu: () => void,
    isMenuOpen: boolean,
}) => {
    const isOpen = isMenuOpen ? "max-sm:left-0" : "max-sm:-left-full";

    const navItems = [
        { name: "Inicio", icon: <Dashboard /> },
        { name: "Atletas", icon: <Athlete /> },
        { name: "Entrenamientos", icon: <Training /> },
    ];

    return (
        <aside className={`max-sm:absolute ${isOpen} max-sm:w-2/3 max-sm:transition-[left] flex flex-col gap-8 h-full p-4 overflow-hidden z-40 bg-primary-bg sm:relative duration-300 transition-[padding,width] ${isMenuOpen
            ? 'sm:w-[230px]'
            : 'sm:w-[72px]'}`}>
            <header className={`flex max-sm:justify-between items-center gap-1 py-1 h-fit`}>
                <img className="size-10 min-w-10 min-h-10" src="/src/assets/LogoSinFondoAzul.webp" />
                <h2 className={`h-fit text-primary text-nowrap overflow-hidden transition-[width,display] transition-discrete duration-300 ${isMenuOpen ? 'sm:block sm:w-full' : 'sm:starting:w-full sm:w-0 sm:hidden'}`}>
                    Pandora Box
                </h2>
                <button className="flex justify-center items-center w-10 h-10 rounded-md bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer sm:hidden" onClick={handleToggleMenu}>
                    <Close />
                </button>
            </header>
            <nav className="grid gap-1 w-full">
                <ul className="flex flex-col gap-2">
                    {navItems.map((item, index) => (
                        <li key={index} className="w-full">
                            <a className={`relative flex items-center gap-3 rounded-md p-2 text-sm font-medium text-primary-text hover:bg-secondary hover:text-primary-bg w-full cursor-pointer`}>
                                <span>{item.icon}</span>
                                <span className={`overflow-hidden transition-[width,display] duration-300 transition-discrete ${isMenuOpen ? 'sm:block sm:w-full' : 'sm:starting:w-full sm:w-0 sm:hidden'}`}>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex justify-end">
                <button className="flex justify-center items-center w-10 h-10 rounded-md bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer max-sm:hidden" onClick={handleToggleMenu}>
                    <ArrowLeft className={`duration-300 rotate-y-${isMenuOpen ? '45' : '180'}`} />
                </button>
            </div>
        </aside >
    )
}

export default Aside