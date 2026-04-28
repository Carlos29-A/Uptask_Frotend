import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { UpdateCurrentUserPasswordForm, UserFormData } from "../types";

export async function updateProfile(formData: UserFormData) {
    try {

        const { data } = await api.put<{ message: string }>("/auth/profile", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al actualizar el perfil",
            };
        }
        throw error;
    }
}
export async function changePassword(formData: UpdateCurrentUserPasswordForm) {
    try {

        const { data } = await api.post<{ message: string }>("/auth/update-password", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al actualizar el perfil",
            };
        }
        throw error;
    }
}
