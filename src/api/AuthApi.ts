import api from "../lib/axios";
import { isAxiosError } from "axios";
import { userSchema, type CheckPasswordForm, type ConfirmAccountForm, type ForgotPasswordForm, type NewPasswordForm, type RequestConfirmationCodeForm, type User, type UserLoginForm, type UserRegistrationForm } from "../types";

export async function createAccount(formData: UserRegistrationForm) {
    try {

        const { data } = await api.post<{ message: string }>("/auth/create-account", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al crear la cuenta",
            };
        }
        throw error;
    }
}
export async function confirmAccount(formData: ConfirmAccountForm) {
    try {

        const { data } = await api.post<{ message: string }>("/auth/confirm-account", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al confirmar la cuenta",
            };
        }
        throw error;
    }
}
export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try {
        const { data } = await api.post<{ message: string }>("/auth/request-code", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al solicitar el código de confirmación",
            };
        }
        throw error;
    }
}

export async function AuthenticateUser(formData: UserLoginForm) {
    try {
        const { data } = await api.post<string>("/auth/login", formData);

        // guardar el token en el localStorage
        localStorage.setItem('authToken', data);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al iniciar sesión",
            };
        }
        throw error;
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const { data } = await api.post<{ message: string }>("/auth/forgot-password", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al reestablecer la contraseña",
            };
        }
        throw error;
    }
}
export async function validateToken(formData: ConfirmAccountForm) {
    try {
        const { data } = await api.post<{ message: string }>("/auth/validate-token", formData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al validar el token",
            };
        }
        throw error;
    }
}
// restablecer contraseña
export async function resetPassword({ formData, token }: { formData: NewPasswordForm, token: string }) {
    try {

        const { data } = await api.post<{ message: string }>(`/auth/update-password/${token}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al restablecer la contraseña",
            };
        }
        throw error;
    }

}

export async function getUser() {
    try {
        const { data } = await api.get("/auth/user");
        const response = userSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al obtener el usuario",
            };
        }
        throw error;
    }
}


export async function checkPassword(formData: CheckPasswordForm) {
    try {

        const { data } = await api.post<{ message: string }>("/auth/check-password", formData);
        return data;

    } catch (error) {
        if (isAxiosError(error)) {
            throw error.response?.data || {
                message: "Error al verificar la contraseña",
            };
        }
        throw error;
    }
}
