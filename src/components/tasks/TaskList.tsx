import { DndContext, type DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import type { Project, Task, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";

type TaskListProps = {
    tasks: TaskProject[];
    canEdit: boolean;
}

type StatusGroups = {
    [key: string]: TaskProject[];
}

const initialStatusGroups: StatusGroups = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
};

const statusTranslations: Record<string, string> = {
    pending: "Pendiente",
    onHold: "En Pausa",
    inProgress: "En Progreso",
    underReview: "En Revisión",
    completed: "Completado",
};

const statusStyles: Record<string, { dot: string; bar: string; badge: string }> = {
    pending:     { dot: "bg-slate-400",   bar: "bg-slate-400",   badge: "bg-slate-100 text-slate-500" },
    onHold:      { dot: "bg-red-400",     bar: "bg-red-400",     badge: "bg-red-50 text-red-500" },
    inProgress:  { dot: "bg-fuchsia-500", bar: "bg-fuchsia-500", badge: "bg-fuchsia-50 text-fuchsia-600" },
    underReview: { dot: "bg-amber-400",   bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-600" },
    completed:   { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600" },
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams();
    const projectId = params.projectId as string;
    const queryClient = useQueryClient();
    const isLarge = useIsLargeScreen();

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    );

    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
        },
    });

    const groupedTasks = tasks.reduce((acc, task) => {
        const currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        return { ...acc, [task.status]: [...currentGroup, task] };
    }, initialStatusGroups);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && over.id) {
            const taskId = active.id.toLocaleString();
            const status = over.id as TaskStatus;
            mutate({ projectId, taskId, status });

            queryClient.setQueryData(["editProject", projectId], (oldData: Project) => {
                const updatedTasks = oldData.tasks.map((task: Task) =>
                    task._id === taskId ? { ...task, status } : task
                );
                return { ...oldData, tasks: updatedTasks };
            });
        }
    };

    const totalCompleted = groupedTasks.completed?.length ?? 0;
    const progressPct = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

    return (
        <div>
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tablero de Tareas</h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} · {totalCompleted} completada{totalCompleted !== 1 ? 's' : ''}
                    </p>
                </div>
                {tasks.length > 0 && (
                    <div className="flex items-center gap-3 sm:min-w-[160px]">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{progressPct}%</span>
                    </div>
                )}
            </div>

            {isLarge && tasks.length > 0 && (
                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 border border-slate-300 rounded-sm" />
                    Arrastra las tarjetas entre columnas para cambiar su estado
                </p>
            )}

            {/* Tablero — 5 columnas sin scroll horizontal */}
            <DndContext
                sensors={sensors}
                modifiers={[restrictToWindowEdges]}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(groupedTasks).map(([status, statusTasks]) => {
                        const st = statusStyles[status] ?? statusStyles.pending;
                        return (
                            <div key={status} className="flex flex-col min-w-0">
                                {/* Cabecera de columna */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-3 overflow-hidden">
                                    <div className={`h-1 w-full ${st.bar}`} />
                                    <div className="px-3 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
                                            <span className="text-xs font-semibold text-slate-700 truncate">
                                                {statusTranslations[status]}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-semibold rounded-full px-2 py-0.5 flex-shrink-0 ml-1 ${st.badge}`}>
                                            {statusTasks.length}
                                        </span>
                                    </div>
                                </div>

                                <DropTask status={status} />

                                {/* Tarjetas */}
                                <ul className="space-y-2 flex-1">
                                    {statusTasks.length === 0 ? (
                                        <li className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                            Sin tareas
                                        </li>
                                    ) : (
                                        statusTasks.map(task => (
                                            <TaskCard key={task._id} task={task} canEdit={canEdit} />
                                        ))
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </DndContext>
        </div>
    );
}
