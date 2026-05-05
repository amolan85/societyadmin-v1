import { useState, useEffect, useLayoutEffect } from "react";
import Overview from "../Overview/Overview";
import CreateBroadcast from "../Broadcast/CreateBroadcast";
import NoticeBoard from "../NoticeBoard/NoticeBoard";
import Polls from "../Polls/Polls";
import AddMember from "../AddMember/AddMember";
import Documents from "../Documents&Noc/Documents";
import FlatTransfer from "../FlatTransfer/FlatTransfer";
import Rules from "../Rules/Rules";
import StaffAttendance from "../StaffAttendance/StaffAttendance";
import Register from "../Register/Register";
import { APP_CSS } from "../../components/Common/GlobalCss";
import Complaints from "../Complaints/Complaints";
import Broadcast from "../Broadcast/Broadcast";
import { GetSessionData } from "../../utils/SessionManagement";
import CreatePoll from "../Polls/CreatePoll";

/* ══ OVERVIEW ══════════════════════════════════ */

function PlaceholderPage({ label }) {
  return (
    <div className="pg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300, color: "var(--muted)" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏗</div>
      <h5 style={{ fontWeight: 700 }}>{label}</h5>
      <p style={{ fontSize: 13 }}>This page is coming soon.</p>
    </div>
  );
}

/* ══ NAV DATA ══════════════════════════════════ */
const NAV = [
  { sec: "Dashboards", items: [{ id: "overview", icon: "⊞", lbl: "Overview" }] },
  {
    sec: "Communication", items: [
      { id: "broadcasting", icon: "📢", lbl: "Broadcasting" },
      { id: "noticeboard", icon: "📋", lbl: "Notice Board" },
      { id: "polls", icon: "📊", lbl: "Polls & Voting" },
    ]
  },
  {
    sec: "Member Masters", items: [
      { id: "addmember", icon: "👤", lbl: "Members" },
      { id: "transfer", icon: "🔄", lbl: "Transfer Member" },
    ]
  },
  {
    sec: "Administration", items: [
      { id: "documents", icon: "📄", lbl: "Documents & NOC" },
      { id: "flattransfer", icon: "🏠", lbl: "Flat Transfer" },
      { id: "registers", icon: "📔", lbl: "Registers" },
      { id: "rules", icon: "⚖️", lbl: "Rules & By-laws" },
    ]
  },
  {
    sec: "Operations", items: [
      { id: "complaints", icon: "🚨", lbl: "Complaints" },
      { id: "parking", icon: "🚗", lbl: "Parking" },
      { id: "rentals", icon: "🏢", lbl: "Rentals & Tenants" },
      { id: "staff", icon: "👥", lbl: "Staff Attendance" },
    ]
  },
];

const TITLES = {
  overview: ["Dashboards", "Overview"],
  broadcasting: ["Communication", "Broadcasting"],
  createbroadcast: ["Communication", "Create Broadcast"],
  noticeboard: ["Communication", "Notice Board"],
  createPoll: ["Communication", "Create Poll"],
  polls: ["Communication", "Polls & Voting"],
  addmember: ["Member Masters", "Members"],
  transfer: ["Member Masters", "Transfer Member"],
  documents: ["Administration", "Documents & NOC"],
  flattransfer: ["Administration", "Flat Transfer"],
  registers: ["Administration", "Registers"],
  rules: ["Administration", "Rules & By-laws"],
  complaints: ["Operations", "Complaints"],
  parking: ["Operations", "Parking"],
  rentals: ["Operations", "Rentals & Tenants"],
  staff: ["Operations", "Staff Attendance"],
};

/* ══ ROOT APP ══════════════════════════════════ */
export default function App() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [societyName, setSocietyName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")


  useLayoutEffect(() => {
    if (!document.getElementById("bs-css")) {
      const l = document.createElement("link");
      l.id = "bs-css";
      l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.appendChild(l);
    }

    if (!document.getElementById("sv-css")) {
      const s = document.createElement("style");
      s.id = "sv-css";
      s.textContent = APP_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const PAGES = {
    overview: <Overview />,
    broadcasting: <Broadcast setActive={setActive} />,
    createbroadcast: <CreateBroadcast setActive={setActive} />,
    noticeboard: <NoticeBoard />,
    polls: <Polls setActive={setActive} />,
    createPoll: <CreatePoll setActive={setActive} />,
    addmember: <AddMember />,
    transfer: <PlaceholderPage label="Transfer Member" />,
    documents: <Documents />,
    flattransfer: <FlatTransfer />,
    registers: <Register />,
    rules: <Rules />,
    complaints: <Complaints />,
    parking: <PlaceholderPage label="Parking" />,
    rentals: <PlaceholderPage label="Rentals & Tenants" />,
    staff: <StaffAttendance />,
  };

  const [sec, pg] = TITLES[active] || ["", ""];

  useEffect(() => {
    SessionData()
  }, [])

  const SessionData = async () => {
    const data = await GetSessionData()
    console.log(data.data)
    const flats = data.data.flats[0]
    setSocietyName(flats.society_name)
    setFirstName(data.data.first_name)
    setLastName(data.data.last_name)
  }

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <nav className={`sidebar ${collapsed ? "collapsed" : ""} `}>
        <div className="sidebar-logo">
          <div className="logo-box">GV</div>
          <div>
            <div className="logo-name">{societyName}</div>
            <div className="logo-sub text-start">Society Admin</div>
          </div>
        </div>
        <div className="sidebar-nav ">
          {NAV.map(({ sec: section, items }) => (
            <div className="text-start" key={section}>
              <div className="nav-section text-start">{section}</div>
              {items.map(item => (
                <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
                  <span className="ni">{item.icon}</span>
                  <span className="nl">{item.lbl}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <div className="main-area">
        <header className="topbar">
          <button className="tb-toggle" onClick={() => setCollapsed(c => !c)}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>{sec}</span>
            <span style={{ color: "var(--muted)" }}>/</span>
            <span className="tx-blue" style={{ fontWeight: 600, color: "blue" }}>{pg}</span>
          </div>
          <div className="tb-right">
            <span className="tb-date"> {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</span>
            <button className="tb-avatar">🔔</button>
            <button className="tb-avatar" style={{ background: "#e2e8f0", color: "var(--text)" }}>👤</button>
            <span className="tb-name">{firstName} {lastName}</span>
          </div>
        </header>

        <main className="page-wrap" key={active}>
          {PAGES[active] ?? <PlaceholderPage label={pg} />}
        </main>
      </div>
    </div>
  );
}