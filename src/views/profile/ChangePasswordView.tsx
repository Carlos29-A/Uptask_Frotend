import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { UpdateCurrentUserPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileApi";
import { toast } from "react-toastify";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function ChangePasswordView() {
    const initialValues: UpdateCurrentUserPasswordForm = {
        currentPassword: '',
        password: '',
        confirmPassword: '',
    };

    const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: changePassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });

    const password = watch('password');

    const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) => {
        mutate(formData);
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Cambiar Contraseña</h1>
                <p className="text-slate-500 text-sm mt-1">Actualiza tu contraseña de acceso</p>
            </div>
            <div className="max-w-xl bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-5" noValidate>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="current_password">
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                id="current_password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                                {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
                            />
                        </div>
                        {errors.currentPassword && <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="password">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                id="password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                                {...register("password", {
                                    required: "La nueva contraseña es obligatoria",
                                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                                })}
                            />
                        </div>
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="password_confirmation">
                            Repetir contraseña
                        </label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                id="password_confirmation"
                                type="password"
                                placeholder="Repite la nueva contraseña"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                                {...register("confirmPassword", {
                                    required: "Este campo es obligatorio",
                                    validate: value => value === password || 'Las contraseñas no coinciden',
                                })}
                            />
                        </div>
                        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
                    >
                        {isPending ? 'Guardando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}
