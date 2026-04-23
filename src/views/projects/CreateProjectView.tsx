import { Link } from "react-router-dom";

export default function CreateProjectView() {
    return (
        <>
            <h1 className="text-5xl font-black">Crear Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                Llena el siguiente formulario para crear un nuevo proyecto.
            </p>

            <Link
                className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-10 text-center inline-block mt-5 transition-colors"
                to="/"
            >
                Volver a proyectos
            </Link>
        </>
    )
}
