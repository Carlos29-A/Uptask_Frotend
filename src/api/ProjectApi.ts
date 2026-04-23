import api from "../lib/axios";
import { dashboardProjectSchema, type DashboardProject, type Project, type ProjectFormData } from "../types";

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

export async function getProjects(): Promise<DashboardProject[]> {
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

// Obtener un proyecto por su id
export async function getProjectById(projectId: Project['_id']): Promise<Project> {
    try {
        const { data } = await api.get(`/projects/${projectId}`);
        return data;
    } catch (error) {
        throw error.response.data || {
            message: "Error al obtener el proyecto",
        };
    }
}

type UpdateProjectData = {
    projectData: ProjectFormData;
    projectId: Project['_id'];
}


// Actualizar un proyecto
export async function updateProject({ projectData, projectId }: UpdateProjectData) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, projectData);
        return data;
    } catch (error) {
        throw error.response.data || {
            message: "Error al actualizar el proyecto",
        };
    }
}

// Eliminar un proyecto
export async function deleteProject(projectId: Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}`);
        return data;
    } catch (error) {
        throw error.response.data || {
            message: "Error al eliminar el proyecto",
        };
    }
}