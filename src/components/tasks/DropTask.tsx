import { useDroppable } from "@dnd-kit/core";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";

type DropTaskProps = {
    status: string;
}

export default function DropTask({ status }: DropTaskProps) {

    const isLarge = useIsLargeScreen();

    const { isOver, setNodeRef } = useDroppable({
        id: status,
        disabled: !isLarge,
    });

    if (!isLarge) return null;

    return (
        <div
            ref={setNodeRef}
            className={`text-xs font-medium px-3 py-2.5 border border-dashed rounded-xl my-2 flex items-center justify-center gap-1.5 transition-all ${
                isOver
                    ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-600'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400'
            }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isOver ? 'bg-fuchsia-400' : 'bg-slate-300'}`} />
            Soltar aquí
        </div>
    );
}
