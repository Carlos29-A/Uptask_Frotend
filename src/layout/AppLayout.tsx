import { Link, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { NavMenu } from "@/components";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth();

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Cargando...</span>
            </div>
        </div>
    );

    if (isError) return <Navigate to="/auth/login" />;

    if (data) return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
                    <Link to="/">
                        <img src="/logo.svg" alt="UpTask" className="h-8 w-auto" />
                    </Link>
                    <NavMenu name={data.name} />
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-10">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 py-5 bg-white">
                <p className="text-center text-sm text-slate-400">
                    © {new Date().getFullYear()} UpTask · Todos los derechos reservados
                </p>
            </footer>

            <ToastContainer
                position="bottom-right"
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </div>
    );
}
