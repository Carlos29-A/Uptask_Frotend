import { Link, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddMemberModal from "@/components/team/AddMemberModal";
import { deleteTeamMember, getTeamMembers } from "@/api/TeamApi";
import { toast } from "react-toastify";
import { PlusIcon, ArrowLeftIcon, TrashIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function ProjectTeamView() {

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const projectId = params.projectId as string;
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["projectTeam", projectId],
        queryFn: () => getTeamMembers({ projectId }),
        retry: false,
    });

    const { mutate } = useMutation({
        mutationFn: deleteTeamMember,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
        },
    });

    if (isLoading) return (
        <div className="flex items-center justify-center py-32">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Cargando equipo...</span>
            </div>
        </div>
    );

    if (isError) return <Navigate to="/404" />;

    if (data) return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Equipo del Proyecto</h1>
                    <p className="text-slate-500 text-sm mt-1">Gestiona los colaboradores y sus accesos</p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(location.pathname + '?addMember=true')}
                        className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Agregar Miembro
                    </button>
                    <Link
                        to={`/projects/${projectId}`}
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver
                    </Link>
                </div>
            </div>

            {data.length ? (
                <div className="grid gap-3">
                    {data.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-fuchsia-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-fuchsia-700 font-bold text-sm">
                                        {member.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{member.name}</p>
                                    <p className="text-sm text-slate-400 truncate">{member.email}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => mutate({ projectId, userId: member._id })}
                                className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No hay miembros en este equipo</p>
                    <p className="text-slate-400 text-sm mt-1">Agrega colaboradores para comenzar</p>
                </div>
            )}

            <AddMemberModal />
        </>
    );
}
