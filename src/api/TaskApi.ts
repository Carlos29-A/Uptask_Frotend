import { isAxiosError } from "axios";
import api from "../lib/axios";
import { type Project, type TaskFormData } from "../types";


// Crear una tarea
export async function createTask({ taskData, projectId }: { taskData: TaskFormData, projectId: Project['_id'] }) {
    try {

        const url = `/projects/${projectId}/tasks`;
        const { data } = await api.post<string>(url, taskData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al crear la tarea",
            };
        }
        throw error;
    }
}
