import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskStatus } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import type { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';
import { XMarkIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const statusTranslations: Record<string, string> = {
    pending: "Pendiente",
    onHold: "En Pausa",
    inProgress: "En Progreso",
    underReview: "En Revisión",
    completed: "Completado",
};

const statusDotColors: Record<string, string> = {
    pending: "bg-slate-400",
    onHold: "bg-red-400",
    inProgress: "bg-fuchsia-500",
    underReview: "bg-amber-400",
    completed: "bg-emerald-500",
};

export default function TaskModalDetails() {

    const params = useParams();
    const projectId = params.projectId as string;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('viewTask') ?? '';
    const show = !!taskId;

    const navigate = useNavigate();

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: show,
        retry: false,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: () => {},
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        },
    });

    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        mutate({ projectId, taskId, status: e.target.value as TaskStatus });
    };

    if (isError) {
        toast.error('No se pudo cargar la tarea');
        navigate(`/projects/${projectId}`, { replace: true });
        return null;
    }

    return (
        <Transition appear show={show} as={Fragment}>
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
                            <DialogPanel className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                                {data ? (
                                    <>
                                        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-slate-100">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-3 flex-wrap mb-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${statusDotColors[data.status] ?? 'bg-slate-400'}`} />
                                                        <span className="text-xs font-semibold text-slate-500">
                                                            {statusTranslations[data.status]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <DialogTitle as="h3" className="text-2xl font-bold text-slate-900 leading-snug">
                                                    {data.name}
                                                </DialogTitle>
                                                <p className="text-slate-500 mt-2 text-sm">{data.description}</p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="w-3.5 h-3.5" />
                                                        Creada {formatDate(data.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ArrowPathIcon className="w-3.5 h-3.5" />
                                                        Actualizada {formatDate(data.updatedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate('', { replace: true })}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="px-8 py-6">
                                            {data.completeBy.length > 0 && (
                                                <div className="mb-6">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Historial de cambios</p>
                                                    <ul className="space-y-2">
                                                        {data.completeBy.map((log) => (
                                                            <li key={log._id} className="flex items-center gap-2 text-sm text-slate-600">
                                                                <div className={`w-2 h-2 rounded-full ${statusDotColors[log.status] ?? 'bg-slate-400'}`} />
                                                                <span className="font-medium">{statusTranslations[log.status]}</span>
                                                                <span className="text-slate-400">por</span>
                                                                <span className="font-semibold text-slate-700">{log.user.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Cambiar Estado
                                                </label>
                                                <select
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition bg-white cursor-pointer"
                                                    defaultValue={data.status}
                                                    onChange={handleChangeStatus}
                                                >
                                                    {Object.entries(statusTranslations).map(([key, value]) => (
                                                        <option key={key} value={key}>{value}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="border-t border-slate-100 pt-6">
                                                <NotesPanel notes={data.notes} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm">Cargando tarea...</span>
                                        </div>
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
