import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { UserCircleIcon, FolderIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type NavMenuProps = {
    name: string;
}

export const NavMenu = ({ name }: NavMenuProps) => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        queryClient.removeQueries({ queryKey: ["user"] });
        navigate('/auth/login', { replace: true });
    };

    const initials = name.charAt(0).toUpperCase();

    return (
        <Popover className="relative">
            <Popover.Button className="flex items-center gap-2 outline-none group">
                <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                </div>
                <span className="text-slate-300 text-sm font-medium hidden sm:block">{name}</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 group-data-[open]:rotate-180 transition-transform" />
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
            >
                <Popover.Panel className="absolute right-0 z-20 mt-3 w-56">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Cuenta</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{name}</p>
                        </div>
                        <Link
                            to='/profile'
                            className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                        >
                            <UserCircleIcon className="w-4 h-4 text-slate-400" />
                            Mi Perfil
                        </Link>
                        <Link
                            to='/'
                            className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                        >
                            <FolderIcon className="w-4 h-4 text-slate-400" />
                            Mis Proyectos
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                            <button
                                className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer'
                                type='button'
                                onClick={logout}
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};
