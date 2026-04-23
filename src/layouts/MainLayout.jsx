// src/layouts/MainLayout.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/dashboard.css";

export default function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header />
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}