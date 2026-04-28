import type { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

type NotesPanelProps = {
    notes: Task['notes'];
}

export default function NotesPanel({ notes }: NotesPanelProps) {
    return (
        <div className="space-y-5">
            <AddNoteForm />

            <div>
                {notes.length ? (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <ChatBubbleLeftIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                {notes.length} nota{notes.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {notes.map(note => (
                                <NoteDetail key={note._id} note={note} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <ChatBubbleLeftIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Sin notas todavía</p>
                    </div>
                )}
            </div>
        </div>
    );
}
