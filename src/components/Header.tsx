import { Bell, Menu, Search, User } from "./Icon"

const Header = ({ handleToggleMenu }: {
    handleToggleMenu: () => void
}) => {

    return (
        <header className="sticky top-0 max-sm:grid max-sm:grid-cols-1 max-sm:grid-rows-2 max-sm:gap-6 sm:flex justify-between items-center z-30 py-1 w-full sm:h-14 text-primary-text">
            <div className="max-sm:row-start-2">
                breadcrumbs
            </div>
            <div className="max-sm:row-start-1 flex justify-between gap-4 max-sm:w-full">
                <div className="relative flex items-center has-[input:focus]:[&>button]:text-secondary has-[input:focus]:[&>button]:hover:text-primary-text not-[has-[input:focus]]:[&>button]:hover:text-secondary">
                    <button className="absolute left-2.5 duration-300 cursor-pointer">
                        <Search />
                    </button>
                    <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-sm border text-primary-text border-primary rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-secondary hover:border-slate-300 shadow-sm focus:shadow"
                        placeholder="UI Kits, Dashboards..."
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <button className="size-10 flex sm:hidden justify-center items-center rounded-md bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer" onClick={handleToggleMenu}>
                        <Menu />
                    </button>
                    <button className="flex justify-center size-8 items-center rounded-full bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer"><Bell /></button>
                    <button className="flex justify-center size-8 items-center rounded-full bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer"><User /></button>
                </div>
            </div>
        </header>
    )
}

export default Header