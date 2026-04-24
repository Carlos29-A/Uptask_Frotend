import { z } from "zod";


/**Auth, Users */

export const authSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    token: z.string(),
})

export type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<Auth, "name" | "email" | "password" | "confirmPassword">;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;

export type ConfirmAccountForm = Pick<Auth, "token">;


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