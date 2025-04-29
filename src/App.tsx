import { useEffect, useState } from "react"
import Aside from "./components/Aside"
import Header from "./components/Header"

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)")

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {

      console.log(event.matches);
      setIsMenuOpen(!event.matches)
    }

    setIsMenuOpen(!mediaQuery.matches)

    mediaQuery.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  return (
    <div className="flex sm:grid sm:grid-cols-[auto_1fr] transition-[grid-template-columns] duration-1000 ease-in-out h-full">
      <Aside handleToggleMenu={handleToggleMenu} isMenuOpen={isMenuOpen} />
      <div className={`flex flex-col gap-12 p-4 h-full transition-[width] duration-1000 w-full ${isMenuOpen ? "max-sm:bg-black max-sm:opacity-50" : ""}`}>
        <Header handleToggleMenu={handleToggleMenu} />
        <main className="h-full w-full text-primary-text">Contenido</main>
      </div>
    </div>
  )
}

export default App