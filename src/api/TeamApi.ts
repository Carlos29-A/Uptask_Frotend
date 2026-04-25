import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { Project, TeamMemberForm } from "@/types/index";

export async function findUserByEmail({ projectId, formData }: { projectId: Project['_id'], formData: TeamMemberForm }) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team/find`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al buscar el usuario",
            };
        }
    }
}