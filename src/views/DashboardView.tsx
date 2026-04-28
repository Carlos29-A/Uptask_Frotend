import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/ProjectApi";
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policites";
import DeleteProjectModal from "./projects/DeleteProjectModal";
import {
    PlusIcon,
    EllipsisHorizontalIcon,
    FolderOpenIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    ShieldCheckIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function DashboardView() {

    const location = useLocation();
    const navigate = useNavigate();
    const { data: user, isLoading: isUserLoading } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });

    if (isLoading && isUserLoading) return (
        <div className="flex items-center justify-center py-32">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Cargando proyectos...</span>
            </div>
        </div>
    );

    if (!data) return null;

    return (
        <>
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mis Proyectos</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {data.length} proyecto{data.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                >
                    <PlusIcon className="w-4 h-4" />
                    Nuevo Proyecto
                </Link>
            </div>

            {data.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {data.map((project) => {
                        const manager = user ? isManager(project.manager, user._id) : false;
                        return (
                            <div
                                key={project._id}
                                className="group bg-white rounded-2xl border border-slate-200 hover:border-fuchsia-200 hover:shadow-md transition-all flex flex-col overflow-hidden"
                            >
                                {/* Barra de color superior */}
                                <div className={`h-1 w-full ${manager ? 'bg-fuchsia-500' : 'bg-slate-300'}`} />

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    {/* Fila superior: badge + menú */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 ${
                                            manager
                                                ? 'bg-fuchsia-50 text-fuchsia-700'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {manager
                                                ? <ShieldCheckIcon className="w-3 h-3" />
                                                : <UserGroupIcon className="w-3 h-3" />
                                            }
                                            {manager ? 'Manager' : 'Colaborador'}
                                        </span>

                                        <Menu as="div" className="relative">
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
                                                <Menu.Items className="absolute right-0 z-10 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 focus:outline-none">
                                                    <Menu.Item>
                                                        <Link
                                                            to={`/projects/${project._id}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                                                            Ver Proyecto
                                                        </Link>
                                                    </Menu.Item>
                                                    {manager && (
                                                        <>
                                                            <Menu.Item>
                                                                <Link
                                                                    to={`/projects/${project._id}/edit`}
                                                                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                                                                >
                                                                    <PencilSquareIcon className="w-3.5 h-3.5 text-slate-400" />
                                                                    Editar
                                                                </Link>
                                                            </Menu.Item>
                                                            <div className="border-t border-slate-100 my-0.5" />
                                                            <Menu.Item>
                                                                <button
                                                                    type='button'
                                                                    className='flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors'
                                                                    onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                                                                >
                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                    Eliminar
                                                                </button>
                                                            </Menu.Item>
                                                        </>
                                                    )}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>

                                    {/* Nombre del proyecto */}
                                    <div>
                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="font-bold text-slate-900 hover:text-fuchsia-600 transition-colors text-base leading-snug line-clamp-2"
                                        >
                                            {project.projectName}
                                        </Link>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Footer: cliente + botón */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-slate-500 text-[10px] font-bold leading-none">
                                                    {project.clientName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-500 truncate">{project.clientName}</span>
                                        </div>
                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="text-xs font-semibold text-fuchsia-600 hover:text-fuchsia-700 flex-shrink-0 ml-2"
                                        >
                                            Ver →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderOpenIcon className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-700 font-semibold text-sm">No hay proyectos todavía</p>
                    <p className="text-slate-400 text-xs mt-1 mb-5">Crea tu primer proyecto para comenzar</p>
                    <Link
                        to="/projects/create"
                        className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Crear Proyecto
                    </Link>
                </div>
            )}

            <DeleteProjectModal />
        </>
    );
}
