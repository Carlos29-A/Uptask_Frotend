import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="font-black text-4xl text-center text-white">Página no encontrada</div>
            <p className="mt-10 text-center text-gray-300 text-lg">
                Tal vez quieras volver a {' '}
                <Link
                    to="/"
                    className="text-fuchsia-600 hover:text-fuchsia-700"
                >
                    Proyectos
                </Link>
            </p>

        </>
    )
}
