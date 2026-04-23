// src/components/Header.jsx
import { useState } from "react";
import { FiBell, FiSettings } from "react-icons/fi";
import "../styles/dashboard.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">
      <FiSettings size={20} />

      <div className="notif">
        <FiBell size={20} onClick={() => setOpen(!open)} />
        <span className="badge">3</span>

        {open && (
          <div className="dropdown">
            <p>New complaint received</p>
            <p>Approval pending</p>
            <p>New member added</p>
          </div>
        )}
      </div>

      <img
        src="https://i.pravatar.cc/40"
        className="avatar"
      />
    </div>
  );
}