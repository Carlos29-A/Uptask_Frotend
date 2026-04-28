import type { ProjectFormData } from "@/types/index";
import { ErrorMessage } from "../ErrorMessage";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>;
    errors: FieldErrors<ProjectFormData>;
}

export const ProjectForm = ({ register, errors }: ProjectFormProps) => {
    return (
        <div className="space-y-5">
            <div className="space-y-1.5">
                <label htmlFor="projectName" className="text-sm font-medium text-slate-700">
                    Nombre del Proyecto
                </label>
                <input
                    id="projectName"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                    type="text"
                    placeholder="Ej: Sistema de pagos"
                    {...register("projectName", {
                        required: "El nombre del proyecto es obligatorio",
                    })}
                />
                {errors.projectName && <ErrorMessage>{errors.projectName.message}</ErrorMessage>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="clientName" className="text-sm font-medium text-slate-700">
                    Nombre del Cliente
                </label>
                <input
                    id="clientName"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition"
                    type="text"
                    placeholder="Ej: Empresa XYZ"
                    {...register("clientName", {
                        required: "El nombre del cliente es obligatorio",
                    })}
                />
                {errors.clientName && <ErrorMessage>{errors.clientName.message}</ErrorMessage>}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                    Descripción
                </label>
                <textarea
                    id="description"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition resize-none"
                    placeholder="Describe brevemente el proyecto..."
                    {...register("description", {
                        required: "La descripción es obligatoria",
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>
        </div>
    );
};
