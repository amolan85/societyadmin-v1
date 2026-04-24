
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Sidebar from "../components/Sidebar";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Sidebar />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}