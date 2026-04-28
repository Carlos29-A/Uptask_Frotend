import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamApi";
import SearchResult from "./SearchResult";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AddMemberForm() {

    const initialValues: TeamMemberForm = { email: '' };
    const params = useParams();
    const projectId = params.projectId!;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const mutation = useMutation({
        mutationFn: findUserByEmail,
    });

    const handleSearchUser = (formData: TeamMemberForm) => {
        mutation.mutate({ projectId, formData });
    };

    const resetData = () => {
        reset();
        mutation.reset();
    };

    return (
        <div className="space-y-5 mt-6">
            <form onSubmit={handleSubmit(handleSearchUser)} className="space-y-3" noValidate>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">
                        Buscar por correo electrónico
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                            {...register("email", {
                                required: "El email es obligatorio",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Email no válido",
                                },
                            })}
                        />
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="inline-flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm cursor-pointer flex-shrink-0"
                        >
                            <MagnifyingGlassIcon className="w-4 h-4" />
                            Buscar
                        </button>
                    </div>
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
            </form>

            {mutation.isPending && (
                <div className="flex items-center justify-center py-6 text-slate-400">
                    <div className="w-4 h-4 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-sm">Buscando usuario...</span>
                </div>
            )}

            {mutation.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {mutation.error.message}
                </div>
            )}

            {mutation.data && <SearchResult user={mutation.data} resetData={resetData} />}
        </div>
    );
}
