import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskApi";
import EditTaskModal from "./EditTaskModal";


export default function EditTaskData() {
    const params = useParams();
    const projectId = params.projectId as string;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editTask') ?? '';


    const { data, isError } = useQuery({
        queryKey: ["editTask", taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId,
        retry: false,
    })

    if (isError) return <Navigate to="/404" />
    if (data && taskId) return <EditTaskModal data={data} taskId={taskId} />

    return null;
}
