import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { UserLoginForm } from "@/types/index";
import { ErrorMessage } from "@/components/ErrorMessage";
import { AuthenticateUser } from "@/api/AuthApi";
import { toast } from "react-toastify";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginView() {

    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    };

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: AuthenticateUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            navigate('/');
        },
    });

    const handleLogin = (formData: UserLoginForm) => { mutate(formData); };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Bienvenido de nuevo</h2>
                <p className="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("email", {
                                required: "El email es obligatorio",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Email no válido",
                                },
                            })}
                        />
                    </div>
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700" htmlFor="password">
                            Contraseña
                        </label>
                        <Link to="/auth/forgot-password" className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-medium">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                            })}
                        />
                    </div>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer shadow-sm mt-2"
                >
                    {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    ¿No tienes cuenta?{' '}
                    <Link to="/auth/register" className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
                        Crea una aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}
