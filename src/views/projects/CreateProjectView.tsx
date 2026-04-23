import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ProjectForm } from "@/components/projects";
import type { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectApi";


export default function CreateProjectView() {

    const navigate = useNavigate();
    const initialValues: ProjectFormData = {
        projectName: '',
        clientName: '',
        description: '',
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });


    const handleForm = async (formData: ProjectFormData) => {
        const data = await createProject(formData);
        toast.success(data)
        navigate('/');
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">
                    Llena el siguiente formulario para crear un nuevo proyecto.
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
                    <input type="submit" className="bg-fuchsia-800 hover:bg-fuchsia-950 text-white font-bold py-3 px-10  text-center inline-block mt-5 transition-colors w-full cursor-pointer" value={"Crear Proyecto"} />
                </form>
            </div>

        </>
    )
}
