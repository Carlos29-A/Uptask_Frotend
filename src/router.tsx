import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardView from "./views/DashboardView";


export default function Router() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        {/* Página principal */}
                        <Route path="/" element={<DashboardView />} index />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}