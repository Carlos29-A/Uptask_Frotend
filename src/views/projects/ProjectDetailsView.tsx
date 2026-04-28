import { getFullProjectById } from "@/api/ProjectApi";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policites";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function ProjectDetailsView() {

    const { data: user, isLoading: isUserLoading } = useAuth();
    const navigate = useNavigate();

    const params = useParams();
    const projectId = params.projectId as string;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],
        queryFn: () => getFullProjectById(projectId),
        retry: false,
    });

    const canEdit = useMemo(() => {
        if (!data || !user) return false;
        return isManager(data.manager, user._id);
    }, [data, user]);

    if (isLoading || isUserLoading) return (
        <div className="flex items-center justify-center py-32">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Cargando proyecto...</span>
            </div>
        </div>
    );

    if (isError) return <Navigate to="/404" />;
    if (!data || !user) return <Navigate to="/404" />;

    return (
        <>
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{data.projectName}</h1>
                        <p className="text-slate-500 mt-1">{data.description}</p>
                    </div>
                    {isManager(data.manager, user._id) && (
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => navigate(`?newTask=true`)}
                                className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Nueva Tarea
                            </button>
                            <Link
                                to={`/projects/${projectId}/team`}
                                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
                            >
                                <UsersIcon className="w-4 h-4" />
                                Colaboradores
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <TaskList tasks={data.tasks} canEdit={canEdit} />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    );
}
