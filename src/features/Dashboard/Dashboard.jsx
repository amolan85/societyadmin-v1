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
import { GetSessionData, } from "../../utils/SessionManagement";
import CreatePoll from "../Polls/CreatePoll";
import CreateComplaints from "../Complaints/CreateComplaints";
import CreateStaffAttendance from "../StaffAttendance/CreateStaffAttendance";
import { useNavigate } from "react-router-dom";
import CreateNoticeBoard from "../NoticeBoard/CreateNoticeBoard";
import { FiLogOut } from "react-icons/fi";
import RegisterHistory from "../Register/MemberRegister/RegisterHistory";
import UnitRegister from "../Register/UnitRegister/UnitRegister";
import ParkingRegister from "../Register/ParkingRegister/ParkingRegister";
import { LogoutApi } from "../auth/authService";
import MemberDetails from "../Register/MemberRegister/MemberDetails";
import ViewUnit from "../Register/UnitRegister/ViewUnit";
import ParkingDetails from "../Register/ParkingRegister/ParkingDetails";
import ParkingHistory from "../Register/ParkingRegister/ParkingHistory";
import RentalAndTenants from "../RentalAndTenants/RentalAndTenants";
import TenantsReviewApplication from "../RentalAndTenants/TenantsReviewApplication";
import Parking from "../Parking/Parking";
import ParkingRules from "../Parking/ParkingRules";
import ViewParkingDetails from "../Parking/ViewParkingDetails";


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
  createNoticeBoard: ["Communication", "Create Notice Board"],
  createPoll: ["Communication", "Create Poll"],
  polls: ["Communication", "Polls & Voting"],
  addmember: ["Member Masters", "Members"],
  memberDetails: ["Member Masters", "Member Details"],
  viewUnit: ["Administration", "Registers", "View Register", "View Unit"],
  transfer: ["Member Masters", "Transfer Member"],
  documents: ["Administration", "Documents & NOC"],
  flattransfer: ["Administration", "Flat Transfer"],
  registers: ["Administration", "Registers"],
  registerHistory: ["Administration", "Registers", "Member Register", "History"],
  unitRegister: ["Administration", "Registers", "Unit Register"],
  parkingRegister: ["Administration", "Registers", "Parking Register"],
  parkingDetails: ["Administration", "Registers", "Parking Register", "Parking Details"],
  parkingHistory: ["Administration", "Registers", "Parking Register", "Parking Details", "Parking History"],
  rules: ["Administration", "Rules & By-laws"],
  complaints: ["Operations", "Complaints"],
  createComplaints: ["Operations", "Create Complaints"],
  parking: ["Operations", "Parking"],
  parkingRules: ["Operations", "Parking", "Parking Rules"],
  viewParkingDetails: ["Operations", "Parking", "Parking Details"],
  rentals: ["Operations", "Rentals & Tenants"],
  rentalsApplication: ["Operations", "Rentals & Tenants", "Review Application"],
  staff: ["Operations", "Staff Attendance"],
  createStaff: ["Operations", "Create Staff Attendance"],
};

/* ══ ROOT APP ══════════════════════════════════ */
export default function App() {
  const navigation = useNavigate();
  const [active, setActive] = useState("overview");
  const [previousTab, setPreviousTab] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [societyName, setSocietyName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [profileUrl, setProfileUrl] = useState("")

  const [broadcastId, setBroadcastId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [flatId, setFlatId] = useState(null)
  const [selectedNoticeData, setSelectedNoticeData] = useState()
  const [pollId, setPollId] = useState(null)
  const [staffId, setStaffId] = useState(null)


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
    broadcasting: <Broadcast setActive={setActive} setBroadcastId={setBroadcastId} />,
    createbroadcast: <CreateBroadcast setActive={setActive} broadcastId={broadcastId} />,
    polls: <Polls setActive={setActive} setPollId={setPollId} />,
    createPoll: <CreatePoll setActive={setActive} pollId={pollId} />,
    addmember: <AddMember setActive={setActive} setMemberId={setMemberId} setFlatId={setFlatId} />,
    memberDetails: <MemberDetails active={active} setActive={setActive} previousTab={previousTab} setPreviousTab={setPreviousTab} memberId={memberId} setFlatId={setFlatId} flatId={flatId} />,
    viewUnit: <ViewUnit setActive={setActive} flatId={flatId} />,
    transfer: <PlaceholderPage label="Transfer Member" />,
    documents: <Documents />,
    flattransfer: <FlatTransfer />,
    registers: <Register setActive={setActive} />,
    registerHistory: <RegisterHistory setActive={setActive} />,
    rules: <Rules />,
    complaints: <Complaints setActive={setActive} />,
    createComplaints: <CreateComplaints setActive={setActive} />,
    parking: <Parking setActive={setActive} />,
    parkingRules: <ParkingRules setActive={setActive} />,
    viewParkingDetails: <ViewParkingDetails setActive={setActive} />,
    rentals: <RentalAndTenants setActive={setActive} />,
    rentalsApplication: <TenantsReviewApplication setActive={setActive} />,
    staff: <StaffAttendance setActive={setActive} setStaffId={setStaffId} />,
    createStaff: <CreateStaffAttendance setActive={setActive} staffId={staffId} />,
    noticeboard: <NoticeBoard setActive={setActive} setSelectedNoticeData={setSelectedNoticeData} />,
    createNoticeBoard: <CreateNoticeBoard setActive={setActive} selectedNoticeData={selectedNoticeData} />,
    unitRegister: <UnitRegister setActive={setActive} setFlatId={setFlatId} />,
    parkingRegister: <ParkingRegister setActive={setActive} />,
    parkingDetails: <ParkingDetails setActive={setActive} />,
    parkingHistory: <ParkingHistory setActive={setActive} />,

  };


  // const [sec, pg] = TITLES[active] || ["", "", "", ""];
  const breadcrumbs = TITLES[active] || [];
  const pg = breadcrumbs[breadcrumbs.length - 1] || "";

  // Load session data on component mount for get session data
  useEffect(() => {
    SessionData()
  }, [])

  //fetch get session data
  const SessionData = async () => {
    const data = await GetSessionData()
    console.log(data.data)
    const flats = data.data.flats[0]
    setSocietyName(flats.society_name)
    setFirstName(data.data.first_name)
    setLastName(data.data.last_name)
    setProfileUrl(data.data.profile_url)
  }

  //log out function
  const LogoutData = async () => {
    console.log("adbcd")
    const data = await LogoutApi()
    navigation("/")
  }
  return (
    <>
      <div className="app-shell">

        {/* SIDEBAR */}
        <nav className={`sidebar ${collapsed ? "collapsed" : ""} `} >
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
            {/* <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>{sec}</span>
              <span style={{ color: "var(--muted)" }}>/</span>
              <span className="tx-blue" style={{ fontWeight: 600, color: "blue" }}>{pg}</span>
            </div> */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              {breadcrumbs.map((crumb, i) => (
                <div key={i}>
                  <span style={{ color: i === breadcrumbs.length - 1 ? "blue" : "var(--muted)", fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>
                    {crumb}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <span style={{ color: "var(--muted)" }}>/</span>
                  )}
                </div>
              ))}
            </div>
            <div className="tb-right">
              <span className="tb-date"> {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}</span>

              <button className="tb-avatar">🔔</button>
              <button className="tb-avatar" style={{ background: "#e2e8f0", color: "var(--text)" }}><img src={profileUrl || null} alt="Profile" className="img-fluid rounded-circle" /></button>
              {/* <span className="tb-name">{firstName} {lastName}</span> */}
              <div className="dropdown">

                {/* Name */}
                <span
                  className="tb-name dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {firstName} {lastName}
                </span>

                {/* Dropdown */}
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-3 ms-2 mr-0">

                  <li>
                    <button
                      className="btn btn-sm btn-secondary dropdown-item"
                      onClick={LogoutData}
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </li>

                </ul>

              </div>
              {/* <button className="btn btn-secondary"><span className="tb-name" onClick={LogoutData}>Logout</span></button> */}
            </div>
          </header>

          <main className="page-wrap" key={active}>
            {PAGES[active] ?? <PlaceholderPage label={pg} />}
          </main>
        </div>
      </div>

    </>


  );
}