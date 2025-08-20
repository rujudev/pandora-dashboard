import useTheme from "../hooks/useTheme"
import Breadcrumbs from "./breadcrumb/Breadcrumbs"
import { Bell, Menu, Search, User } from "./Icon"

const Header = ({ handleToggleMenu }: {
    handleToggleMenu: () => void
}) => {
    const { toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 pb-12 grid max-md:grid-cols-1 max-md:grid-rows-2 max-md:gap-6 justify-between items-center w-full text-primary-text z-9">
            <div className="max-md:row-start-2 md:row-start-1">
                <Breadcrumbs />
            </div>
            <div className="max-md:row-start-1 md:row-start-1 flex justify-between gap-4 max-sm:w-full">
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
                    <label className="swap swap-rotate">
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" onChange={() => toggleTheme()} />

                        {/* sun icon */}
                        <svg
                            className="swap-on size-8 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>

                        {/* moon icon */}
                        <svg
                            className="swap-off size-8 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </label>
                    <button className="flex justify-center size-8 items-center rounded-full bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer"><Bell /></button>
                    <button className="flex justify-center size-8 items-center rounded-full bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer"><User /></button>
                    {/* <button onClick={() => toggleTheme()}>Toggle button</button> */}
                </div>
            </div>
        </header>
    )
}

export default Header