import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <ExclamationTriangleIcon className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-2">404</h1>
            <p className="text-xl font-semibold text-slate-300 mb-2">Página no encontrada</p>
            <p className="text-slate-500 text-sm mb-8">
                La página que buscas no existe o fue movida.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
