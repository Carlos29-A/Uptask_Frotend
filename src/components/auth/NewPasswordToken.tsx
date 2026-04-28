import { type Dispatch, type SetStateAction } from 'react';
import type { ConfirmAccountForm } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { Link } from 'react-router-dom';
import { validateToken } from '@/api/AuthApi';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

type NewPasswordTokenProps = {
    token?: ConfirmAccountForm['token'];
    setToken?: Dispatch<SetStateAction<ConfirmAccountForm['token']>>;
    setIsValidToken?: Dispatch<SetStateAction<boolean>>;
};

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });

    const handleChange = (value: string) => { setToken?.(value); };
    const handleComplete = (value: string) => {
        setToken?.(value);
        mutate({ token: value });
        setIsValidToken?.(true);
    };

    return (
        <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <label className="text-sm font-medium text-slate-700 block mb-5 text-center">
                    Código de verificación
                </label>
                <div className="flex justify-center gap-3">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                        <PinInputField className="!w-12 !h-12 !text-lg !font-bold !text-center !rounded-xl !border !border-slate-200 !outline-none text-slate-800" />
                    </PinInput>
                </div>
                <p className="text-xs text-slate-400 text-center mt-4">Se valida automáticamente al completar los 6 dígitos</p>
            </div>
            <div className="mt-5 text-center">
                <Link to='/auth/forgot-password' className="text-sm text-slate-500 hover:text-fuchsia-600 transition-colors">
                    ¿No recibiste el código? <span className="font-semibold text-fuchsia-600">Solicitar nuevo</span>
                </Link>
            </div>
        </div>
    );
}
