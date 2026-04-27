import { z } from "zod";


/**Auth, Users */

export const authSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email(),
    currentPassword: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    token: z.string(),
})

export type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<Auth, "name" | "email" | "password" | "confirmPassword">;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type ConfirmAccountForm = Pick<Auth, "token">;
export type NewPasswordForm = Pick<Auth, "password" | "confirmPassword">;
export type UpdateCurrentUserPasswordForm = Pick<Auth, "currentPassword" | "password" | "confirmPassword">;

/** User */
export const userSchema = authSchema.pick({
    name: true,
    email: true,
}).extend({
    _id: z.string(),
})
export type User = z.infer<typeof userSchema>;
export type UserFormData = Pick<User, "name" | "email">;

/** Notes */
export const noteSchema = z.object({
    _id: z.string(),
    content: z.string().min(1, "El contenido de la nota es obligatorio"),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string(),
})
export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = Pick<Note, "content">;


/** Tasks */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "completed", "underReview"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "El nombre de la tarea es obligatorio"),
    description: z.string().min(1, "La descripción de la tarea es obligatoria"),
    project: z.string().min(1, "El proyecto de la tarea es obligatorio"),
    status: taskStatusSchema,
    completeBy: z.array(
        z.object({
            _id: z.string(),
            user: userSchema,
            status: taskStatusSchema
        })),
    notes: z.array(noteSchema.extend({
        createdBy: userSchema,
    })),
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
    manager: z.string()
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true,
    })
)
export type DashboardProject = z.infer<typeof dashboardProjectSchema>[number];
export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;


/** Team */

const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true,
})
export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, "email">;