import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import type { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";

type NoteDetailProps = {
    note: Note;
}

export default function NoteDetail({ note }: NoteDetailProps) {

    const { data, isLoading } = useAuth();
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data, note]);

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
        },
    });

    if (isLoading) return null;

    return (
        <div className="flex items-start justify-between gap-3 py-3">
            <div className="flex gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-fuchsia-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-fuchsia-700 text-xs font-bold">
                        {note.createdBy.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{note.createdBy.name}</span>
                        <span className="text-xs text-slate-400">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{note.content}</p>
                </div>
            </div>
            {canDelete && (
                <button
                    type="button"
                    onClick={() => mutate({ projectId, taskId, noteId: note._id })}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
