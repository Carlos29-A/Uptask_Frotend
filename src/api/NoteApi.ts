import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { Note, NoteFormData, Project, Task } from "../types";

type NoteApiType = {
    formData: NoteFormData;
    projectId: Project['_id'];
    taskId: Task['_id'];
    noteId: Note['_id'];
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

export async function deleteNote({ projectId, taskId, noteId }: Pick<NoteApiType, "projectId" | "taskId" | "noteId">) {
    try {

        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`;
        const { data } = await api.delete<{ message: string }>(url);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            throw error.response?.data || {
                message: "Error al eliminar la nota",
            };
        }
        throw error;
    }
}