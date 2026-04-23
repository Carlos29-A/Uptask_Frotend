import api from "../lib/axios";
import type { ProjectFormData } from "../types";

export async function createProject(projectData: ProjectFormData) {
    try {

        const { data } = await api.post("/projects", projectData);
        return data;
    } catch (error) {
        throw error.response.data || {
            message: "Error al crear el proyecto",
        };
    }
}