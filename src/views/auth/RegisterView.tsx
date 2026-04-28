import { useForm } from "react-hook-form";
import type { UserRegistrationForm } from "@/types/index";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";

export default function RegisterView() {

    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            reset();
        },
    });

    const password = watch('password');
    const handleRegister = (formData: UserRegistrationForm) => { mutate(formData); };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Crea tu cuenta</h2>
                <p className="text-slate-500 text-sm mt-1">Completa el formulario para comenzar</p>
            </div>

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4" noValidate>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">Correo electrónico</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("email", {
                                required: "El email es obligatorio",
                                pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" },
                            })}
                        />
                    </div>
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nombre completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                    </div>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Contraseña</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                            })}
                        />
                    </div>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Repetir Contraseña</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Repite tu contraseña"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("confirmPassword", {
                                required: "Debes repetir la contraseña",
                                validate: value => value === password || 'Las contraseñas no coinciden',
                            })}
                        />
                    </div>
                    {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer shadow-sm mt-2"
                >
                    {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/auth/login" className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
