import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addUserToProject } from "@/api/TeamApi";
import type { TeamMember } from "@/types/index";
import { toast } from "react-toastify";
import { UserPlusIcon } from "@heroicons/react/24/outline";

type SearchResultProps = {
    user: TeamMember;
    resetData: () => void;
}

export default function SearchResult({ user, resetData }: SearchResultProps) {

    const params = useParams();
    const projectId = params.projectId!;
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            resetData();
            queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
        },
    });

    const handleAddUserToProject = () => {
        mutate({ projectId, userId: user._id });
    };

    return (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Usuario encontrado</p>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-fuchsia-100 flex items-center justify-center">
                        <span className="text-fuchsia-700 text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                </div>
                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleAddUserToProject}
                    className="inline-flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm cursor-pointer flex-shrink-0"
                >
                    <UserPlusIcon className="w-4 h-4" />
                    Agregar
                </button>
            </div>
        </div>
    );
}
