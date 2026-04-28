import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { updateTask } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

type EditTaskModalProps = {
    data: Task;
    taskId: Task['_id'];
}

export default function EditTaskModal({ data, taskId }: EditTaskModalProps) {

    const params = useParams();
    const projectId = params.projectId as string;

    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: {
            name: data.name,
            description: data.description,
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateTask,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            reset();
            navigate('', { replace: true });
            queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
        },
    });

    const handleEditTask = (formData: TaskFormData) => {
        mutate({ projectId, taskId, taskData: formData });
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate('', { replace: true })}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100">
                                    <div>
                                        <DialogTitle as="h3" className="text-xl font-bold text-slate-900">
                                            Editar Tarea
                                        </DialogTitle>
                                        <p className="text-sm text-slate-500 mt-0.5">Modifica los datos de la tarea</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('', { replace: true })}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <form className="px-7 py-6 space-y-5" noValidate onSubmit={handleSubmit(handleEditTask)}>
                                    <TaskForm errors={errors} register={register} />
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
                                    >
                                        {isPending ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
