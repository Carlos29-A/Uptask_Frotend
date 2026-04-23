import { Link, useNavigate } from "react-router-dom"
import { ProjectForm } from "./ProjectForm"
import type { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectApi";
import { toast } from "react-toastify";


type ProjectEditFormProps = {
    data?: ProjectFormData;
    projectId: Project['_id'];
}


export const ProjectEditForm = ({ data, projectId }: ProjectEditFormProps) => {
    if (!data) return null

    const navigate = useNavigate();
    const initialValues: ProjectFormData = {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description,
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });


    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate('/');
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            projectData: formData,
            projectId
        }
        mutate(data);

    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Editar Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                Llena el siguiente formulario para editar el proyecto.
            </p>

            <Link
                className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-10 text-center inline-block mt-5 transition-colors"
                to="/"
            >
                Volver a proyectos
            </Link>


            <form
                className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm
                    register={register}
                    errors={errors}
                />
                <input type="submit" className="bg-fuchsia-800 hover:bg-fuchsia-950 text-white font-bold py-3 px-10  text-center inline-block mt-5 transition-colors w-full cursor-pointer" value={"Guardar Cambios"} />
            </form>
        </div>
    )
}
