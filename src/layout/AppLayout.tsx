import { Link, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Logo, NavMenu } from "@/components";
import { useAuth } from "@/hooks/useAuth";

export default function Applayout() {


    const { data, isError, isLoading } = useAuth();

    if (isLoading) return <p>Cargando...</p>;
    if (isError) {
        return <Navigate to="/auth/login" />
    }

    return (
        <>
            <header
                className="bg-gray-800 py-5"
            >
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                    {/* Menu de hamburguesa */}
                    <NavMenu />
                </div>
            </header>
            <section className="max-w-7xl mx-auto mt-10 p-5">
                <Outlet />
            </section>
            <footer className="py-5">
                <p className="text-center">
                    UpTask - Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
