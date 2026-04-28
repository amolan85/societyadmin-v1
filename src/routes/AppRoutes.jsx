
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";

//import Sidebar from "../components/Sidebar";
import Dashboard from "../features/dashboard/Dashboard";
//import Broadcast from "../pages/Broadcast";
import PrivateRoute from "./PrivateRoute";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}