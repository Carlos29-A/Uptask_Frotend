import { FingerPrintIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const tabs = [
    { name: 'Mi Cuenta', href: '/profile', icon: UserIcon },
    { name: 'Cambiar Contraseña', href: '/profile/password', icon: FingerPrintIcon },
];

export default function Tabs() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = tabs.find(tab => tab.href === location.pathname)?.href ?? tabs[0].href;

    return (
        <div className="mb-8">
            <div className="sm:hidden">
                <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
                    onChange={(e) => navigate(e.target.value)}
                    value={currentTab}
                >
                    {tabs.map(tab => (
                        <option key={tab.name} value={tab.href}>{tab.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block border-b border-slate-200">
                <nav className="flex gap-6" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'border-fuchsia-600 text-fuchsia-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                <tab.icon className={`w-4 h-4 ${isActive ? 'text-fuchsia-600' : 'text-slate-400'}`} />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
