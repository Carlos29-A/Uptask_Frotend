import ProfileForm from '@/components/profile/ProfileForm';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileView() {
    const { data, isLoading } = useAuth();

    if (isLoading) return (
        <div className="flex items-center gap-3 text-slate-400 py-10">
            <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Cargando perfil...</span>
        </div>
    );

    if (data) return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
                <p className="text-slate-500 text-sm mt-1">Actualiza tu información personal</p>
            </div>
            <ProfileForm data={data} />
        </div>
    );
}
