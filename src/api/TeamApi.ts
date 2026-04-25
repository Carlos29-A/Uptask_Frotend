import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { Project, TeamMember, TeamMemberForm } from "@/types/index";

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

export async function addUserToProject({ projectId, userId }: { projectId: Project['_id'], userId: TeamMember['_id'] }) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team`, { userId });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al buscar el usuario",
            };
        }
    }
}