import { Plus } from "../components/Icon";

const Athletes = () => {
    return (
        <section className="flex flex-col gap-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="antialiased tracking-normal font-sans text-2xl font-semibold leading-relaxed">Atletas</h1>
                    <p className="antialiased tracking-normal font-sans text-base font-normal leading-relaxed">Gestiona los perfiles y datos de los atletas de tu equipo.</p>
                </div>
                <a className="flex items-center justify-center font-bold bg-primary text-primary-bg rounded-md px-4 py-2 gap-3" href="/athletes/new">
                    <Plus />
                    Nuevo atleta
                </a>
            </header>
            <main className="flex flex-col gap-4">
                <div>
                    Aquí los filtros
                </div>
                <table>
                    <thead>
                        <tr className="bg-primary text-primary-bg [&>th]:text-left [&>th]:p-2">
                            <th className="text-left">Nombre</th>
                            <th className="text-left">Apellidos</th>
                            <th className="text-left">Edad</th>
                            <th className="sticky text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left">Juan</td>
                            <td className="text-left">Pérez</td>
                            <td className="text-left">23</td>
                            <td className="sticky text-left">
                                <a href="/athletes/1/edit" className="text-blue-500 hover:underline">Editar</a>
                                <a href="/athletes/1/delete" className="text-red-500 hover:underline ml-4">Eliminar</a>
                            </td>
                        </tr>
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </main>
        </section>
    );
}

export default Athletes;