import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { CheckPasswordForm } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { checkPassword } from '@/api/AuthApi';
import { deleteProject } from '@/api/ProjectApi';
import { XMarkIcon, TrashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function DeleteProjectModal() {
    const initialValues: CheckPasswordForm = { password: '' };

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const deleteProjectId = queryParams.get('deleteProject')!;
    const show = !!deleteProjectId;

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const queryClient = useQueryClient();

    const checkUserPasswordMutation = useMutation({
        mutationFn: checkPassword,
        onError: (error) => { toast.error(error.message); },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: deleteProject,
        onError: (error) => { toast.error(error.message); },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            navigate(location.pathname, { replace: true });
        },
    });

    const handleForm = async (formData: CheckPasswordForm) => {
        await checkUserPasswordMutation.mutateAsync(formData);
        await deleteProjectMutation.mutateAsync(deleteProjectId);
    };

    const isPending = checkUserPasswordMutation.isPending || deleteProjectMutation.isPending;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-lg font-bold text-slate-900">
                                                Eliminar Proyecto
                                            </Dialog.Title>
                                            <p className="text-xs text-slate-500">Esta acción no se puede deshacer</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(location.pathname, { replace: true })}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="px-7 py-6">
                                    <p className="text-sm text-slate-600 mb-5">
                                        Confirma tu contraseña para eliminar el proyecto de forma permanente.
                                    </p>
                                    <form onSubmit={handleSubmit(handleForm)} className="space-y-4" noValidate>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-700" htmlFor="password">
                                                Contraseña
                                            </label>
                                            <div className="relative">
                                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                                />
                                            </div>
                                            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
                                        >
                                            {isPending ? 'Eliminando...' : 'Eliminar Proyecto'}
                                        </button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
