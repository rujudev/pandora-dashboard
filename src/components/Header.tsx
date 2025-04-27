import { Menu } from "./Icon"

const Header = ({ handleToggleMenu }: {
    handleToggleMenu: () => void
}) => {

    return (
        <header className="sticky top-0 flex justify-between items-center z-30 py-1 w-full h-14 text-primary-text">
            <button className="w-10 h-10 flex sm:hidden justify-center items-center rounded-md bg-primary text-primary-bg hover:bg-secondary duration-100 ease-linear hover:text-primary-bg cursor-pointer" onClick={handleToggleMenu}>
                <Menu />
            </button>
            Header
        </header>
    )
}

export default Header