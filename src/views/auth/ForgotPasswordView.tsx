import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ForgotPasswordForm } from "@/types/index";
import { ErrorMessage } from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthApi";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = { email: '' };
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            reset();
        },
    });

    const handleForgotPassword = (formData: ForgotPasswordForm) => { mutate(formData); };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Restablecer contraseña</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Ingresa tu email y te enviaremos las instrucciones
                </p>
            </div>

            <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-5" noValidate>
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

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer shadow-sm"
                >
                    {isPending ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center">
                <Link to='/auth/login' className="text-sm text-slate-500 hover:text-fuchsia-600 transition-colors">
                    ¿Ya tienes cuenta? <span className="font-semibold text-fuchsia-600">Inicia sesión</span>
                </Link>
                <Link to='/auth/register' className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    ¿No tienes cuenta? Crea una
                </Link>
            </div>
        </div>
    );
}
