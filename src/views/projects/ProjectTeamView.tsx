import AddMemberModal from "@/components/team/AddMemberModal";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ProjectTeamView() {

    const navigate = useNavigate();
    const params = useParams();
    const projectId = params.projectId as string;

    return (
        <>
            <h1 className="text-4xl font-black">Administrar Equipos</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Gestiona los colaboradores del proyecto y asigna sus roles.</p>
            <nav className="my-5 flex gap-3">
                <button
                    type="button"
                    className="text-white text-sm uppercase font-bold bg-purple-500 p-3 hover:bg-purple-600 transition-colors cursor-pointer"
                    onClick={() => navigate(location.pathname + '?addMember=true')}
                >
                    Nuevo Colaborador
                </button>

                <Link
                    to={`/projects/${projectId}`}
                    className="bg-fuchsia-400 hover:bg-fuchsia-700 px-10 py-3 text-white uppercase font-bold cursor-pointer transition-colors"
                >
                    Volver a Proyecto
                </Link>
            </nav>

            <AddMemberModal />
        </>
    )
}
