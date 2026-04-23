import { BrowserRouter, Routes, Route } from "react-router-dom";
import Applayout from "./layout/Applayout";
import DashboardView from "./views/DashboardView";


export default function Router() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Applayout />}>
                        {/* Página principal */}
                        <Route path="/" element={<DashboardView />} index />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}