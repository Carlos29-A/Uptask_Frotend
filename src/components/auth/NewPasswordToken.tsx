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

export default function NewPasswordToken({
    token,
    setToken,
    setIsValidToken,
}: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        }
    })


    const handleChange = (value: string) => {
        setToken(value);
    };
    const handleComplete = (value: string) => {
        setToken(value);
        mutate({ token: value });
        setIsValidToken(true);
    };

    return (
        <>
            <form
                className="space-y-8 p-10 rounded-lg bg-white mt-10"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-5">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                    </PinInput>
                </div>
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/forgot-password'
                    className="text-center text-gray-300 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}