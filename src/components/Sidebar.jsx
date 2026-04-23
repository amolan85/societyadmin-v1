// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  FiGrid, FiBell, FiFileText, FiUsers, FiSettings
} from "react-icons/fi";
import "../styles/dashboard.css";

const menu = [
  { name: "Overview", path: "/dashboard", icon: <FiGrid /> },
  { name: "Broadcasting", path: "/broadcast", icon: <FiBell /> },
  { name: "Notice Board", path: "/notice", icon: <FiFileText /> },
  { name: "Members", path: "/members", icon: <FiUsers /> },
  { name: "Settings", path: "/settings", icon: <FiSettings /> },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>SocietyHub</h3>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">{item.icon}</span>
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}