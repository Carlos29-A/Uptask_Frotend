import { deleteNote } from "@/api/NoteApi"
import { useAuth } from "@/hooks/useAuth"
import type { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {



    const { data, isLoading } = useAuth();
    const canDelete = useMemo(() => data._id === note.createdBy._id, [data])
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const taskId = queryParams.get('viewTask') ?? '';
    const projectId = params.projectId as string;

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
        }
    })
    if (isLoading) return <p>Cargando...</p>;

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold text-slate-800 capitalize">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500 font-bold">
                    {formatDate(note.createdAt)}
                </p>
            </div>
            {
                canDelete ? (
                    <button
                        type="button"
                        className="bg-red-400 hover:bg-red-500 text-white px-3 py-1  text-sm cursor-pointer font-bold transition-all"
                        onClick={() => mutate({ projectId, taskId, noteId: note._id })}
                    >
                        Eliminar
                    </button>
                ) : null
            }
        </div>
    )
}
