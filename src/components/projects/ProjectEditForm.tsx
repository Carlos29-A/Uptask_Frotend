import { Link, useNavigate } from "react-router-dom";
import { ProjectForm } from "./ProjectForm";
import type { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectApi";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type ProjectEditFormProps = {
    data?: ProjectFormData;
    projectId: Project['_id'];
}

export const ProjectEditForm = ({ data, projectId }: ProjectEditFormProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const initialValues: ProjectFormData = {
        projectName: data?.projectName ?? '',
        clientName: data?.clientName ?? '',
        description: data?.description ?? '',
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: updateProject,
        onError: (error) => { toast.error(error.message); },
        onSuccess: (responseData) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
            toast.success(responseData);
            navigate('/');
        },
    });

    const handleForm = (formData: ProjectFormData) => {
        mutate({ projectData: formData, projectId });
    };

    if (!data) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Volver a proyectos
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Editar Proyecto</h1>
                <p className="text-slate-500 text-sm mt-1">Actualiza los datos del proyecto</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit(handleForm)} noValidate className="space-y-6">
                    <ProjectForm register={register} errors={errors} />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer"
                    >
                        {isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};
