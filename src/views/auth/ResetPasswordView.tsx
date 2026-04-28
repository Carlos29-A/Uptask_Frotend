import { useState } from "react";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import type { ConfirmAccountForm } from "@/types/index";

export default function ResetPasswordView() {
    const [token, setToken] = useState<ConfirmAccountForm['token']>('');
    const [isValidToken, setIsValidToken] = useState(false);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Restablecer contraseña</h2>
                <p className="text-slate-500 text-sm mt-1">
                    {!isValidToken ? 'Ingresa el código que recibiste por email' : 'Crea tu nueva contraseña'}
                </p>
            </div>
            {!isValidToken
                ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
                : <NewPasswordForm token={token} />
            }
        </div>
    );
}
