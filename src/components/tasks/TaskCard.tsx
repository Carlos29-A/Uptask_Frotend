import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaskProject } from "@/types/index";
import { deleteTask } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { useDraggable } from '@dnd-kit/core';
import { useIsLargeScreen } from '@/hooks/useIsLargeScreen';
import {
    EllipsisHorizontalIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";

type TaskCardProps = {
    task: TaskProject;
    canEdit: boolean;
}

export default function TaskCard({ task, canEdit }: TaskCardProps) {

    const isLarge = useIsLargeScreen();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task._id,
        disabled: !isLarge,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const projectId = params.projectId as string;

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
        },
    });

    const dragStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: 0.92,
        boxShadow: '0 16px 32px -4px rgb(0 0 0 / 0.18)',
        zIndex: 50,
        transition: 'none',
    } : undefined;

    return (
        <li
            ref={setNodeRef}
            style={dragStyle}
            className={`bg-white rounded-xl border shadow-sm group relative ${
                isDragging
                    ? 'border-fuchsia-300 ring-2 ring-fuchsia-200'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md transition-shadow'
            }`}
        >
            <div className="flex items-start gap-2 p-4">
                {/* Drag handle — solo en pantallas grandes */}
                {isLarge && (
                    <div
                        {...listeners}
                        {...attributes}
                        className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100 touch-none"
                        title="Arrastrar tarea"
                    >
                        <Bars3Icon className="w-4 h-4" />
                    </div>
                )}

                {/* Contenido */}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{task.name}</p>
                    {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}
                </div>

                {/* Menú contextual */}
                <Menu as="div" className="relative flex-shrink-0">
                    <Menu.Button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-20 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 focus:outline-none">
                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                                    Ver Tarea
                                </button>
                            </Menu.Item>
                            {canEdit && (
                                <>
                                    <Menu.Item>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >
                                            <PencilSquareIcon className="w-3.5 h-3.5 text-slate-400" />
                                            Editar Tarea
                                        </button>
                                    </Menu.Item>
                                    <div className="border-t border-slate-100 my-0.5" />
                                    <Menu.Item>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={() => mutate({ projectId, taskId: task._id })}
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                            Eliminar Tarea
                                        </button>
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
    );
}
