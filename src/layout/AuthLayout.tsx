import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo — decorativo */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-950 flex-col justify-between px-16 py-14 relative overflow-hidden">
                {/* Círculos decorativos de fondo */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

                {/* Logo */}
                <div>
                    <img src="/logo.svg" alt="UpTask" className="h-10 w-auto" />
                </div>

                {/* Copy central */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-8 h-0.5 bg-fuchsia-500" />
                        <span className="text-fuchsia-400 text-sm font-semibold uppercase tracking-widest">Gestión de proyectos</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Organiza tu equipo,<br />
                        <span className="text-fuchsia-400">entrega resultados.</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                        Centraliza tus proyectos, asigna tareas y colabora con tu equipo en tiempo real.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: "✓", text: "Tablero Kanban" },
                        { icon: "✓", text: "Gestión de equipo" },
                        { icon: "✓", text: "Seguimiento de tareas" },
                        { icon: "✓", text: "Notas colaborativas" },
                    ].map((f) => (
                        <div key={f.text} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-fuchsia-600/20 flex items-center justify-center text-fuchsia-400 text-xs font-bold flex-shrink-0">{f.icon}</span>
                            <span className="text-slate-400 text-sm">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div className="flex-1 bg-slate-50 flex flex-col justify-center items-center px-6 py-12">
                {/* Logo visible solo en móvil */}
                <div className="lg:hidden mb-10 bg-slate-900 rounded-2xl px-6 py-4">
                    <img src="/logo.svg" alt="UpTask" className="h-8 w-auto" />
                </div>
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>

            <ToastContainer
                position="bottom-right"
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </div>
    );
}
