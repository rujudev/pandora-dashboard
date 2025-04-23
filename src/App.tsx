import Aside from "./components/Aside"
import Header from "./components/Header"

const App = () => {
  return (
    <div className="grid grid-cols-[1fr_4fr] h-full">
      <Aside />
      <div className="flex flex-col px-4 h-full">
        <Header />
        <main className="h-full"></main>
      </div>
    </div>
  )
}

export default App
