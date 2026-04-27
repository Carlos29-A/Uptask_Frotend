import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskStatus } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import type { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';


const statusTranslations = {
    pending: "Pendiente",
    onHold: "En Pausa",
    inProgress: "En Progreso",
    underReview: "En Revisión",
    completed: "Completado",
}

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
    })

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: () => {

        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        }
    })

    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const data = { projectId, taskId, status: e.target.value as TaskStatus };
        mutate(data);
    }

    if (isError) {
        toast.error('No se pudo cargar la tarea');
        return <Navigate to={`/projects/${projectId}`} />
    }


    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate('', { replace: true })}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    {data ? (
                                        <>
                                            <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt)} </p>
                                            <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt)} </p>
                                            <DialogTitle
                                                as="h3"
                                                className="font-black text-4xl text-slate-600 my-5"
                                            >{data.name}
                                            </DialogTitle>
                                            <p className='text-lg text-slate-500 mb-2'>{data.description}</p>
                                            {
                                                data.completeBy.length ? (
                                                    <>
                                                        <p className='font-bold text-2xl text-slate-600 my-5'>Historial de cambios:</p>
                                                        <ul className='list-decimal'>
                                                            {
                                                                data.completeBy.map((activityLog) => (
                                                                    <li key={activityLog._id}>
                                                                        <span className='font-bold text-slate-500'>{statusTranslations[activityLog.status]} por:</span>
                                                                        {' '}
                                                                        {activityLog.user.name}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </>
                                                ) : null
                                            }
                                            <div className='my-5 space-y-3 flex flex-col gap-2'>
                                                <label className='font-bold'>Estado Actual:</label>
                                                <select
                                                    className="w-full p-3 bg-white border border-gray-300 "
                                                    defaultValue={data?.status}
                                                    onChange={handleChangeStatus}
                                                >
                                                    {Object.entries(statusTranslations).map(([key, value]) => (
                                                        <option key={key} value={key}>{value}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <NotesPanel
                                                notes={data.notes}
                                            />
                                        </>
                                    ) : (
                                        <p className='text-lg text-slate-500'>Cargando tarea...</p>
                                    )}
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}