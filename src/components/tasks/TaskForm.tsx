import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { TaskFormData } from "@/types/index";
import { ErrorMessage } from "../ErrorMessage";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>;
    register: UseFormRegister<TaskFormData>;
}

export default function TaskForm({ errors, register }: TaskFormProps) {
    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="name">
                    Nombre de la Tarea
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Ej: Diseñar mockup inicial"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                    {...register("name", {
                        required: "El nombre de la tarea es obligatorio",
                    })}
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="description">
                    Descripción
                </label>
                <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe lo que hay que hacer..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition resize-none"
                    {...register("description", {
                        required: "La descripción es obligatoria",
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>
        </div>
    );
}
