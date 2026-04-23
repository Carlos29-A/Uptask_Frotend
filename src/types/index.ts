import { z } from "zod";


/** Tasks */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "completed", "underReview"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "El nombre de la tarea es obligatorio"),
    description: z.string().min(1, "La descripción de la tarea es obligatoria"),
    project: z.string().min(1, "El proyecto de la tarea es obligatorio"),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;


/** Projects */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    tasks: z.array(taskSchema),
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
    })
)
export type DashboardProject = z.infer<typeof dashboardProjectSchema>[number];
export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;