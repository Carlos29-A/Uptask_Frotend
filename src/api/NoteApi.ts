import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { NoteFormData, Project, Task } from "../types";

type NoteApiType = {
    formData: NoteFormData;
    taskId: Task['_id'];
    projectId: Project['_id'];
}


export async function createNote({ formData, taskId, projectId }: Pick<NoteApiType, "formData" | "taskId" | "projectId">) {
    try {

        const url = `/projects/${projectId}/tasks/${taskId}/notes`;
        const { data } = await api.post<{ message: string }>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            throw error.response?.data || {
                message: "Error al crear la nota",
            };
        }
    }
}