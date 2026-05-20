
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";

import Dashboard from "../features/dashboard/Dashboard";
//import data from "../features/dashboard/data";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AppRoutes() {
  return (
    <BrowserRouter >
        <ToastContainer/>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/data" element={<data />} /> */}
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