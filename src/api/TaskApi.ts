import { isAxiosError } from "axios";
import api from "../lib/axios";
import { taskSchema, type Project, type Task, type TaskFormData } from "../types";


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

type GetTaskByIdParams = {
    projectId: Project['_id'];
    taskId: Task['_id'];
}

// Obtener una tarea por su id
export async function getTaskById({ projectId, taskId }: GetTaskByIdParams) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.get(url);
        const response = taskSchema.safeParse(data);
        if (response.success) {
            console.log({ response: response.data });
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al obtener la tarea",
            };
        }
        throw error;
    }
}

// Actualizar una tarea
type UpdateTaskData = {
    taskData: TaskFormData;
    projectId: Project['_id'];
    taskId: Task['_id'];
}
export async function updateTask({ taskData, projectId, taskId }: UpdateTaskData) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.put<string>(url, taskData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al actualizar la tarea",
            };
        }
        throw error;
    }
}

// Eliminar una tarea
type DeleteTaskData = {
    projectId: Project['_id'];
    taskId: Task['_id'];
}

export async function deleteTask({ projectId, taskId }: DeleteTaskData) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}`;
        const { data } = await api.delete<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al eliminar la tarea",
            };
        }
        throw error;
    }
}

// Actualizar el estado de una tarea
type UpdateTaskStatusData = {
    projectId: Project['_id'];
    taskId: Task['_id'];
    status: Task['status'];
}
export async function updateTaskStatus({ projectId, taskId, status }: UpdateTaskStatusData) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`;
        const { data } = await api.post<string>(url, { status });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al actualizar el estado de la tarea",
            };
        }
        throw error;
    }
}