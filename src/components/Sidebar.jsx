import { useState } from "react";
import {
    FiGrid, FiBell, FiSettings, FiUsers, FiFileText,
    FiHome, FiMenu, FiX
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PieChart, Pie, Cell
} from "recharts";
import TheContent from "../routes/TheContent";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div style={{ display: "flex", fontFamily: "Inter, sans-serif" }}>

            {/* MOBILE MENU */}
            {mobileMenu && (
                <div className="overlayStyle" onClick={() => setMobileMenu(true)} />
            )}
            {/* {!mobileMenu && (
                <FiMenu
                // className="overlayStyle"
                    size={24}
                    style={{ cursor: "pointer", margin: 10 }}
                    onClick={() => setMobileMenu(true)}
                />
            )} */}
            {/* SIDEBAR */}
            <div className="sidebarStyle"
                // style={{left: mobileMenu ? 0 : (window.innerWidth < 768 ? -260 : 0)}}
                style={{
                    position: "fixed",
                    top: 0,
                    // left: mobileMenu ? 0 : -260,
                    width: 260,
                    height: "100%",
                    // background: "#fff",
                    transition: "0.3s",
                    zIndex: 1000,
                    padding: 15
                }}
            >
                {/* <h3 style={{ marginBottom: 20, fontWeight: 700 }}>
                    SocietyHub
                </h3> */}
                <FiMenu size={22} /* onClick={() => setMobileMenu(true)} */ className="text-start" />
                <MenuSection title="Dashboards">
                    <MenuItem icon={<FiGrid />} label="Overview" active={location.pathname === "/dashboard"} onClick={() => navigate("/dashboard")} />
                </MenuSection>

                <MenuSection title="Communication">
                    <MenuItem icon={<FiBell />} label="Broadcasting" />
                    <MenuItem icon={<FiFileText />} label="Notice Board" active={location.pathname === "/noticeBoard"} onClick={() => navigate("/noticeBoard")} />
                    <MenuItem icon={<FiFileText />} label="Polls & Voting" active={location.pathname === "/polls"} onClick={() => navigate("/polls")} />
                </MenuSection>

                <MenuSection title="Member Masters">
                    <MenuItem
                        icon={<FiUsers />}
                        label="Add Member"
                        active={location.pathname === "/members"}
                        onClick={() => {
                            navigate("/members"); // 👈 correct path
                        }}
                    />
                    <MenuItem icon={<FiUsers />} label="Transfer Member" />
                </MenuSection>

                <MenuSection title="Administration">
                    <MenuItem icon={<FiFileText />} label="Documents & NOC" />
                    <MenuItem icon={<FiHome />} label="Registers" />
                </MenuSection>

                <MenuSection title="Operations">
                    <MenuItem icon={<FiUsers />} label="Complaints" />
                    <MenuItem icon={<FiHome />} label="Parking" />
                </MenuSection>

                <MenuSection title="Settings">
                    <MenuItem icon={<FiSettings />} label="Settings" />
                </MenuSection>
            </div>

            {/* MAIN */}
            <div style={{
                marginLeft: window.innerWidth < 768 ? 0 : 260,
                width: "100%",
                background: "#f4f6f9",
                minHeight: "100vh"
            }}>

                {/* HEADER */}
                <div className="headerStyle">
                    {/* <FiMenu size={22} onClick={() => setMobileMenu(true)} /> */}

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                        <FiSettings size={20} />

                        <div style={{ position: "relative", marginLeft: 20 }}>
                            <FiBell size={20} onClick={() => setNotifOpen(!notifOpen)} />
                            <span className="badgeStyle">3</span>

                            {notifOpen && (
                                <div className="dropdownStyle">
                                    <p>New complaint</p>
                                    <p>Approval pending</p>
                                    <p>New member</p>
                                </div>
                            )}
                        </div>

                        <img
                            src="https://i.pravatar.cc/40"
                            className="ml-4 rounded-circle"
                        />
                    </div>
                </div>

                {/* CONTENT */}
                <TheContent style={{ background: "#f1f5f9" }} />
            </div>
        </div>
    );
}

/* COMPONENTS */

const MenuSection = ({ title, children }) => (
    <div>
        <div className="sectionTitle">{title}</div>
        {children}
    </div>
);

const MenuItem = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} >
        {active && <div className="activeBar" />}

        {active && <div className="activeBar" />}

        <div className={`menuItemStyle ${active ? "active" : ""}`}>
            {icon}
            <span>{label}</span>
        </div>
    </div>
);

function Stat({ title, value }) {
    return (
        <div className="cardStyle">
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    );
}

function Card({ children }) {
    return <div className="cardStyle">{children}</div>;
}

/* STYLES */

// const sidebarStyle = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: 260,
//     height: "100vh",
//     background: "#f8f9fb",
//     padding: "20px 15px",
//     boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
//     transition: "0.3s",
//     zIndex: 1000,
//     overflowY: "auto"
// };
// const sectionTitle = {
//     fontSize: 12,
//     color: "#9aa0a6",
//     margin: "20px 10px 8px",
//     textTransform: "uppercase",
//     fontWeight: 600,
//     textAlign: "left"
// };
// const menuItemStyle = (active) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "10px 12px",
//     margin: "4px 0",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 14,
//     fontWeight: active ? 600 : 500,
//     color: active ? "#2563eb" : "#333",
//     background: active ? "#e8f0fe" : "transparent",
//     transition: "0.2s"
// });

// const headerStyle = {
//     height: 60,
//     background: "#fff",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 20px",
//     borderBottom: "1px solid #eee"
// };

// const cardStyle = {
//     background: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginTop: 15
// };

// const statsGrid = {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
//     gap: 20
// };

// const chartGrid = {
//     display: "grid",
//     gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "2fr 1fr",
//     gap: 20,
//     marginTop: 20
// };

// const badgeStyle = {
//     position: "absolute",
//     top: -5,
//     right: -8,
//     background: "red",
//     color: "#fff",
//     fontSize: 10,
//     padding: "2px 6px",
//     borderRadius: "50%"
// };

// const dropdownStyle = {
//     position: "absolute",
//     right: 0,
//     top: 30,
//     background: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     width: 200,
//     boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
// };

// const overlayStyle = {
//     position: "fixed",
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.3)",
//     zIndex: 999
// };
// const activeBar = {
//     width: 4,
//     height: "100%",
//     background: "#2563eb",
//     borderRadius: 4,
//     marginRight: 8
// };
