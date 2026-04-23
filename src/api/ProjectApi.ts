import api from "../lib/axios";
import { dashboardProjectSchema, type Project, type ProjectFormData } from "../types";

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

export async function getProjects(): Promise<Project[]> {
    try {
        const { data } = await api.get("/projects");

        const response = dashboardProjectSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
        return data
    } catch (error) {
        throw error.response.data || {
            message: "Error al crear el proyecto",
        };
    }
}