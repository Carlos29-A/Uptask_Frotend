import { Outlet } from "react-router-dom";

export default function Applayout() {
    return (
        <>
            <header
                className="bg-gray-800 py-5"
            >
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    
                </div>

            </header>
            <main>
                <Outlet />
            </main>

        </>
    )
}
