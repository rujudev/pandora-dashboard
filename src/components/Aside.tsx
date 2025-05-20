import { Link } from "react-router";
import { routes } from "../routes/config";
import { ArrowLeft, Close } from "./Icon";

const Aside = ({ handleToggleMenu, isMenuOpen }: {
    handleToggleMenu: () => void,
    isMenuOpen: boolean,
}) => {
    const isOpen = isMenuOpen ? "max-sm:left-0" : "max-sm:-left-full";

    const navItems = routes.map(({ name, path, icon }) => {
        return {
            name: name,
            link: path === '/' ? '/' : `/${path}`,
            icon: icon
        }
    })

    return (
        <aside className={`max-sm:absolute ${isOpen} max-sm:w-2/3 max-sm:transition-[left] flex flex-col gap-8 h-screen p-4 overflow-hidden z-40 bg-base-100 sm:relative duration-100 transition-[padding,width] ${isMenuOpen
            ? 'sm:w-[230px]'
            : 'sm:w-[80px]'}`}>
            <div className="flex flex-col gap-8 h-full">
                <header className={`flex max-sm:justify-center items-center gap-1 py-1 h-fit`}>
                    <img className="size-10 min-w-10 min-h-10" src="/src/assets/LogoSinFondoAzul.webp" />
                    <h2 className={`h-fit text-nowrap overflow-hidden transition-[width,display] transition-discrete duration-100 ${isMenuOpen ? 'sm:block sm:w-full' : 'sm:starting:w-full sm:w-0 sm:hidden'}`}>
                        Pandora Box
                    </h2>
                    <button className="flex justify-center items-center w-10 h-10 rounded-md bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer sm:hidden" onClick={handleToggleMenu}>
                        <Close />
                    </button>
                </header>
                <nav className="grid gap-1 w-full">
                    <ul className={`menu w-full flex flex-col gap-2${isOpen ? ' p-0' : ''}`}>
                        {navItems.map((item, index) => (
                            <Link className={`col-span-2 flex`} to={item.link}>
                                <li key={index} className="w-full">
                                    <span className={`gap-3${!isMenuOpen ? ` [&>svg]:w-[20px] w-[45px]` : ''}`}>
                                        {item.icon}
                                        <span className={`overflow-hidden transition-[width,display] duration-100 transition-discrete ${isMenuOpen ? 'sm:block sm:w-full' : 'sm:starting:w-full sm:w-0 sm:hidden'}`}>{item.name}</span>
                                    </span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="flex justify-end">
                <button className={`flex justify-center items-center w-10 h-10 rounded-md text-primary hover:text-secondary duration-100 ease-linear cursor-pointer max-sm:hidden  rotate-y-${!isMenuOpen ? '180' : ''}`} onClick={handleToggleMenu}>
                    <ArrowLeft />
                </button>
            </div>
        </aside >
    )
}

export default Aside