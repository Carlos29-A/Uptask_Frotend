import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProjectForm } from "@/components/projects";
import type { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectApi";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateProjectView() {

    const navigate = useNavigate();
    const initialValues: ProjectFormData = {
        projectName: '',
        clientName: '',
        description: '',
    };

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate('/');
        },
    });

    const handleForm = (formData: ProjectFormData) => {
        mutate(formData);
    };

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
                <h1 className="text-3xl font-bold text-slate-900">Crear Proyecto</h1>
                <p className="text-slate-500 text-sm mt-1">Completa los campos para crear un nuevo proyecto</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit(handleForm)} noValidate className="space-y-6">
                    <ProjectForm register={register} errors={errors} />
                    <button
                        type="submit"
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer"
                    >
                        Crear Proyecto
                    </button>
                </form>
            </div>
        </div>
    );
}
