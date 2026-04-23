import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectApi";
import { ProjectEditForm } from "@/components/projects";

export default function EditProjectView() {


    const params = useParams();
    const projectId = params.projectId as string;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false,
    })

    if (isLoading) return <p>Cargando...</p>;

    if (isError) return <Navigate to="/404" />
    if (!data) return <p>Cargando...</p>

    return <ProjectEditForm data={data} projectId={projectId} />
}
