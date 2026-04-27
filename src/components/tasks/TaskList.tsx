import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { Project, Task, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

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
}


const statusTranslations = {
    pending: "Pendiente",
    onHold: "En Pausa",
    inProgress: "En Progreso",
    underReview: "En Revisión",
    completed: "Completado",
}

const statusColors = {
    pending: "border-t-slate-600",
    onHold: "border-t-red-500",
    inProgress: "border-t-blue-500",
    underReview: "border-t-amber-500",
    completed: "border-t-emerald-500",
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams();
    const projectId = params.projectId as string;
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: () => {

        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] });
        }
    })



    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);


    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && over.id) {
            const taskId = active.id.toLocaleString();
            const status = over.id as TaskStatus;
            mutate({ projectId, taskId, status });


            queryClient.setQueryData(["editProject", projectId], (oldData: Project) => {
                // Actualizar los datos que estan en cache
                const updatedTasks = oldData.tasks.map((task: Task) => {
                    if (task._id === taskId) {
                        return {
                            ...task,
                            status
                        }
                    }
                    return task;
                })
                return {
                    ...oldData,
                    tasks: updatedTasks,
                }
            })
        }
    }
    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd} >
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8
                            ${statusColors[status as keyof typeof statusColors]}
                            `}>{statusTranslations[status as keyof typeof statusTranslations]}</h3>
                            <DropTask status={status} />
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>

        </>
    )
}
