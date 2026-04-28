import { useForm } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage";
import type { User, UserFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileApi";
import { toast } from "react-toastify";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

type ProfileFormProps = {
    data: User;
}

export default function ProfileForm({ data }: ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({ defaultValues: data });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });

    const handleEditProfile = (formData: UserFormData) => {
        mutate(formData);
    };

    return (
        <div className="max-w-xl">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit(handleEditProfile)} className="space-y-5" noValidate>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="name">Nombre</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                                {...register("name", { required: "El nombre es obligatorio" })}
                            />
                        </div>
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="email">Correo electrónico</label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                                {...register("email", {
                                    required: "El email es obligatorio",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" },
                                })}
                            />
                        </div>
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
                    >
                        {isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
}
