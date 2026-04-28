import type { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddNoteForm() {

    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId as string;
    const taskId = queryParams.get('viewTask') ?? '';

    const initialValues: NoteFormData = { content: '' };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: initialValues });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            if (data) {
                toast.success(data.message);
            }
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        },
    });

    const handleAddNote = (formData: NoteFormData) => {
        mutate({ formData, taskId, projectId });
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleAddNote)} className="space-y-2" noValidate>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide" htmlFor="content">
                Agregar nota
            </label>
            <div className="flex gap-2">
                <input
                    id="content"
                    type="text"
                    placeholder="Escribe una nota..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                    {...register("content", {
                        required: "El contenido es obligatorio",
                    })}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm cursor-pointer flex-shrink-0"
                >
                    <PlusIcon className="w-4 h-4" />
                    Añadir
                </button>
            </div>
            {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </form>
    );
}
