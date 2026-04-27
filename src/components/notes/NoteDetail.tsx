import { useAuth } from "@/hooks/useAuth"
import type { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMemo } from "react"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {


    const { data, isLoading } = useAuth();

    if (isLoading) return <p>Cargando...</p>;

    const canDelete = useMemo(() => data._id === note.createdBy._id, [data])



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
                    >
                        Eliminar
                    </button>
                ) : null
            }
        </div>
    )
}
