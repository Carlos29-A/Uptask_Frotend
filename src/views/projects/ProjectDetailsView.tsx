import { getProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policites";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProjectDetailsView() {


    const { data: user, isLoading: isUserLoading } = useAuth();
    const navigate = useNavigate();

    const params = useParams();
    const projectId = params.projectId as string;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false,
    })
    if (isLoading && isUserLoading) return <p>Cargando...</p>;
    if (isError) return <Navigate to="/404" />
    if (data && user) return (
        <>
            <h1 className="text-4xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>
            {isManager(data.manager, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="text-white text-sm uppercase font-bold bg-purple-500 p-3 hover:bg-purple-600 transition-colors cursor-pointer"
                        onClick={() => navigate(`?newTask=true`)}
                    >
                        Agregar Tarea
                    </button>

                    <Link
                        to={`/projects/${projectId}/team`}
                        className="bg-fuchsia-400 hover:bg-fuchsia-700 px-10 py-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    >
                        Colaboradores
                    </Link>
                </nav>
            )}

            <TaskList
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
