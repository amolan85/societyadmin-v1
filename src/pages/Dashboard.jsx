import { useState } from "react";
import {
  FiGrid, FiBell, FiSettings, FiUsers, FiFileText,
  FiHome, FiMenu, FiX
} from "react-icons/fi";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PieChart, Pie, Cell
} from "recharts";

export default function App() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const barData = [
    { name: "Jan", approved: 54, pending: 23, rejected: 48 },
    { name: "Feb", approved: 28, pending: 25, rejected: 10 },
    { name: "Mar", approved: 55, pending: 56, rejected: 38 },
    { name: "Apr", approved: 59, pending: 98, rejected: 52 },
    { name: "May", approved: 98, pending: 52, rejected: 93 },
  ];

  const radarData = [
    { subject: "Jan", A: 80, B: 50, C: 20 },
    { subject: "Feb", A: 60, B: 70, C: 30 },
    { subject: "Mar", A: 40, B: 20, C: 60 },
    { subject: "Apr", A: 70, B: 40, C: 50 },
  ];

  const pieData = [
    { name: "Approved", value: 35 },
    { name: "In Progress", value: 20 },
    { name: "Pending", value: 20 },
    { name: "Rejected", value: 15 },
    { name: "Review", value: 10 },
  ];

  const COLORS = ["#6C63FF", "#42A5F5", "#F4A62A", "#EF5350", "#9C27B0"];

  return (
    <div style={{ display: "flex", fontFamily: "Inter, sans-serif" }}>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div style={overlayStyle} onClick={() => setMobileMenu(false)} />
      )}

      {/* SIDEBAR */}
      <div style={{
        ...sidebarStyle,
        left: mobileMenu ? 0 : (window.innerWidth < 768 ? -260 : 0)
      }}>
        <h3>SocietyHub</h3>

        <MenuSection title="Dashboards">
          <MenuItem icon={<FiGrid />} label="Overview" active />
        </MenuSection>

        <MenuSection title="Communication">
          <MenuItem icon={<FiBell />} label="Broadcasting" />
          <MenuItem icon={<FiFileText />} label="Notice Board" />
        </MenuSection>

        <MenuSection title="Member Masters">
          <MenuItem icon={<FiUsers />} label="Add Member" />
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
        <div style={headerStyle}>
          <FiMenu size={22} onClick={() => setMobileMenu(true)} />

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <FiSettings size={20} />

            <div style={{ position: "relative", marginLeft: 20 }}>
              <FiBell size={20} onClick={() => setNotifOpen(!notifOpen)} />
              <span style={badgeStyle}>3</span>

              {notifOpen && (
                <div style={dropdownStyle}>
                  <p>New complaint</p>
                  <p>Approval pending</p>
                  <p>New member</p>
                </div>
              )}
            </div>

            <img
              src="https://i.pravatar.cc/40"
              style={{ marginLeft: 20, borderRadius: "50%" }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: 20 }}>
          <h1>Welcome Back!</h1>
          <p>Your Overview Statistics</p>

          {/* SEARCH */}
          <div style={cardStyle}>🔍 Start searching here</div>

          {/* STATS */}
          <div style={statsGrid}>
            <Stat title="Active Complaints" value="14" />
            <Stat title="Visits" value="3,671" />
            <Stat title="Pending Approvals" value="156" />
            <Stat title="Staff Present" value="48/50" />
          </div>

          {/* CHARTS */}
          <div style={chartGrid}>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="approved" fill="#6C63FF" />
                  <Bar dataKey="pending" fill="#F4A62A" />
                  <Bar dataKey="rejected" fill="#EF5350" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
                  <Radar dataKey="B" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
                  <Radar dataKey="C" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* BOTTOM */}
          <div style={chartGrid}>
            <Card>Tenant Agreement Verification</Card>

            <Card>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
function MenuSection({ title, children }) {
  return (
    <div style={{ marginTop: 15 }}>
      <p style={{ fontSize: 12, color: "#888" }}>{title}</p>
      {children}
    </div>
  );
}

function MenuItem({ icon, label, active }) {
  return (
    <div style={{
      display: "flex",
      gap: 10,
      padding: 10,
      borderRadius: 10,
      background: active ? "#1e88e5" : "transparent",
      color: active ? "#fff" : "#444",
      cursor: "pointer",
      marginTop: 5
    }}>
      {icon} {label}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={cardStyle}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Card({ children }) {
  return <div style={cardStyle}>{children}</div>;
}

/* STYLES */
const sidebarStyle = {
  width: 260,
  height: "100vh",
  position: "fixed",
  background: "#f8f9fb",
  padding: 20,
  borderRight: "1px solid #eee",
  transition: "0.3s",
  zIndex: 1000
};

const headerStyle = {
  height: 60,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  borderBottom: "1px solid #eee"
};

const cardStyle = {
  background: "#fff",
  padding: 15,
  borderRadius: 12,
  marginTop: 15
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: 20
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "2fr 1fr",
  gap: 20,
  marginTop: 20
};

const badgeStyle = {
  position: "absolute",
  top: -5,
  right: -8,
  background: "red",
  color: "#fff",
  fontSize: 10,
  padding: "2px 6px",
  borderRadius: "50%"
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: 30,
  background: "#fff",
  padding: 10,
  borderRadius: 10,
  width: 200,
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
};

const overlayStyle = {
  position: "fixed",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  zIndex: 999
};