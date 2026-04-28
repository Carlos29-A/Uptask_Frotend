import type { ConfirmAccountForm, NewPasswordForm } from "@/types/index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resetPassword } from "@/api/AuthApi";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LockClosedIcon } from "@heroicons/react/24/outline";

type NewPasswordFormProps = {
    token: ConfirmAccountForm['token'];
}

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
    const navigate = useNavigate();
    const initialValues: NewPasswordForm = {
        password: '',
        confirmPassword: '',
    };
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            reset();
            navigate('/auth/login');
        },
    });

    const handleNewPassword = (formData: NewPasswordForm) => {
        mutate({ formData, token });
    };

    const password = watch('password');

    return (
        <form onSubmit={handleSubmit(handleNewPassword)} className="space-y-5" noValidate>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nueva contraseña</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition shadow-sm"
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                            })}
                        />
                    </div>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Repetir contraseña</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="password_confirmation"
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
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer shadow-sm"
            >
                {isPending ? 'Guardando...' : 'Establecer Nueva Contraseña'}
            </button>
        </form>
    );
}
