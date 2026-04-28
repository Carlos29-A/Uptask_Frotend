import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import type { ConfirmAccountForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { confirmAccount } from "@/api/AuthApi";
import { EnvelopeOpenIcon } from "@heroicons/react/24/outline";

export default function ConfirmAccountView() {

    const [code, setCode] = useState<ConfirmAccountForm['token']>("");

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });

    const handleCodeChange = (token: ConfirmAccountForm['token']) => {
        setCode(token);
    };

    const handleCodeComplete = (token: ConfirmAccountForm['token']) => {
        mutate({ token });
    };

    return (
        <div>
            <div className="mb-8 text-center">
                <div className="w-14 h-14 bg-fuchsia-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <EnvelopeOpenIcon className="w-7 h-7 text-fuchsia-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Confirma tu cuenta</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Ingresa el código de 6 dígitos que enviamos a tu correo
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <label className="text-sm font-medium text-slate-700 block mb-5 text-center">
                    Código de verificación
                </label>
                <div className="flex justify-center gap-3">
                    <PinInput value={code} onChange={handleCodeChange} onComplete={handleCodeComplete}>
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !focus:ring-2 !focus:ring-fuchsia-500 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                    </PinInput>
                </div>
                <p className="text-xs text-slate-400 text-center mt-4">El código se completa automáticamente al ingresar los 6 dígitos</p>
            </div>

            <div className="mt-6 text-center">
                <Link to='/auth/request-code' className="text-sm text-slate-500 hover:text-fuchsia-600 transition-colors">
                    ¿No recibiste el código? <span className="font-semibold text-fuchsia-600">Solicitar nuevo</span>
                </Link>
            </div>
        </div>
    );
}
