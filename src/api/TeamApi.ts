import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { teamMembersSchema, type Project, type TeamMember, type TeamMemberForm } from "@/types/index";

// Buscar usuario por email
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
// Agregar usuario al proyecto
export async function addUserToProject({ projectId, userId }: { projectId: Project['_id'], userId: TeamMember['_id'] }) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team`, { id: userId });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al buscar el usuario",
            };
        }
    }
}

// Listar usuarios del proyecto
export async function getTeamMembers({ projectId }: { projectId: Project['_id'] }) {
    try {
        const { data } = await api.get(`/projects/${projectId}/team`);
        const response = teamMembersSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al listar los usuarios",
            };
        }
    }
}

// Eliminar usuario del proyecto
export async function deleteTeamMember({ projectId, userId }: { projectId: Project['_id'], userId: TeamMember['_id'] }) {
    try {
        const { data } = await api.delete<{ message: string }>(`/projects/${projectId}/team/${userId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al eliminar el usuario",
            };
        }
    }
}
