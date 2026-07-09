// import { useState, useEffect, useLayoutEffect } from "react";
// import Overview from "../Overview/Overview";
// import CreateBroadcast from "../Broadcast/CreateBroadcast";
// import NoticeBoard from "../NoticeBoard/NoticeBoard";
// import Polls from "../Polls/Polls";
// import AddMember from "../AddMember/AddMember";
// import Documents from "../Documents&Noc/Documents";
// import FlatTransfer from "../FlatTransfer/FlatTransfer";
// import Rules from "../Rules/Rules";
// import StaffAttendance from "../StaffAttendance/StaffAttendance";
// import Register from "../Register/Register";
// import { APP_CSS } from "../../components/Common/GlobalCss";
// import Complaints from "../Complaints/Complaints";
// import Broadcast from "../Broadcast/Broadcast";
// import { GetSessionData, } from "../../utils/SessionManagement";
// import CreatePoll from "../Polls/CreatePoll";
// import CreateComplaints from "../Complaints/CreateComplaints";
// import CreateStaffAttendance from "../StaffAttendance/CreateStaffAttendance";
// import { useNavigate } from "react-router-dom";
// import CreateNoticeBoard from "../NoticeBoard/CreateNoticeBoard";
// import { FiLogOut } from "react-icons/fi";
// import RegisterHistory from "../Register/MemberRegister/RegisterHistory";
// import UnitRegister from "../Register/UnitRegister/UnitRegister";
// import ParkingRegister from "../Register/ParkingRegister/ParkingRegister";
// import { LogoutApi } from "../auth/authService";
// import MemberDetails from "../Register/MemberRegister/MemberDetails";
// import ViewUnit from "../Register/UnitRegister/ViewUnit";
// import ParkingDetails from "../Register/ParkingRegister/ParkingDetails";
// import ParkingHistory from "../Register/ParkingRegister/ParkingHistory";
// import RentalAndTenants from "../RentalAndTenants/RentalAndTenants";
// import TenantsReviewApplication from "../RentalAndTenants/TenantsReviewApplication";
// import Parking from "../Parking/ParkingDashboard";
// import ParkingRules from "../Parking/ParkingRules";
// import ViewParkingDetails from "../Parking/ViewParkingDetails";
// import ParkingSessionDetails from "../Parking/VisitorDetails";
// import VisitorDetails from "../Parking/VisitorDetails";
// import ParkingDashboard from "../Parking/ParkingDashboard";
// import ParkingList from "../Parking/ParkingList";
// import "../../styles/dashboard.css";
// import ViolationAlertsList from "../Parking/ViolationAlertsList";
// import VisitorParkingList from "../Parking/VisitorParkingList";
// import VisitorRegister from "../Register/VisitorRegister/VisitorRegister";
// import GetVisitorDetails from "../Register/VisitorRegister/GetVisitorDetails";
// import ListVehicleRegister from "../Register/VehicleRegister/ListVehicleRegister";
// import GetVehicleDetails from "../Register/VehicleRegister/GetVehicleDetails";
// // ── STEP 1: Add import at top of Dashboard.jsx ───────────────────────────────
// import Billing from "../Billing/Billing";

// /* ══ OVERVIEW ══════════════════════════════════ */

// function PlaceholderPage({ label }) {
//   return (
//     <div className="pg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300, color: "var(--muted)" }}>
//       <div style={{ fontSize: 48, marginBottom: 12 }}>🏗</div>
//       <h5 style={{ fontWeight: 700 }}>{label}</h5>
//       <p style={{ fontSize: 13 }}>This page is coming soon.</p>
//     </div>
//   );
// }

// /* ══ NAV DATA ══════════════════════════════════ */
// const NAV = [
//   { sec: "Dashboards", items: [{ id: "overview", icon: "⊞", lbl: "Overview" }] },
//   {
//     sec: "Communication", items: [
//       { id: "broadcasting", icon: "📢", lbl: "Broadcasting" },
//       { id: "noticeboard",  icon: "📋", lbl: "Notice Board" },
//       { id: "polls",        icon: "📊", lbl: "Polls & Voting" },
//     ]
//   },
//   {
//     sec: "Member Masters", items: [
//       { id: "addmember", icon: "👤", lbl: "Members" },
//       { id: "transfer",  icon: "🔄", lbl: "Transfer Member" },
//     ]
//   },
//   {
//     sec: "Administration", items: [
//       { id: "documents",      icon: "📄", lbl: "Documents & NOC" },
//       { id: "flattransfer",   icon: "🏠", lbl: "Flat Transfer" },
//       { id: "registers",      icon: "📔", lbl: "Registers" },
//       { id: "rules",          icon: "⚖️", lbl: "Rules & By-laws" },
//       { id: "visitorRegister",icon: "🚶", lbl: "Visitors" },
//     ]
//   },
//   {
//     sec: "Operations", items: [
//       { id: "complaints",      icon: "🚨", lbl: "Complaints" },
//       { id: "parkingDashboard",icon: "🚗", lbl: "Parking" },
//       { id: "rentals",         icon: "🏢", lbl: "Rentals & Tenants" },
//       { id: "staff",           icon: "👥", lbl: "Staff Attendance" },
//       { id: "vehicleRegister", icon: "🚘", lbl: "Vehicles" },
//       // ✅ ADD THIS LINE:
//       { id: "billing",         icon: "💰", lbl: "Billing" },
//     ]
//   },
// ];

// const PARENT_MAP = {
//   // Registers ke child pages
//   registerHistory: "registers",
//   unitRegister: "registers",
//   parkingRegister: "registers",
//   parkingDetails: "registers",
//   parkingHistory: "registers",
//   viewUnit: "registers",

//   // Visitors ke child pages  
//   visitorDetailsPage: "visitorRegister",

//   // Communication
//   createbroadcast: "broadcasting",
//   createNoticeBoard: "noticeboard",
//   createPoll: "polls",

//   // Member Masters
//   memberDetails: "addmember",

//   // Operations
//   createComplaints: "complaints",
//   createStaff: "staff",
//   rentalsApplication: "rentals",
//   parkingList: "parkingDashboard",
//   visitorParking: "parkingDashboard",
//   violationAlerts: "parkingDashboard",
//   parkingRules: "parkingDashboard",
//   viewParkingDetails: "parkingDashboard",
//   visitorDetails: "parkingDashboard",

//   // ↓ yeh do lines change karo
//   vehicleDetailsPage: "vehicleRegister",  // "registers" → "vehicleRegister"
//   // vehicleRegister line hatao — ye khud nav item hai, child nahi
// };

// const TITLES = {
//   overview: ["Dashboards", "Overview"],
//   broadcasting: ["Communication", "Broadcasting"],
//   createbroadcast: ["Communication", "Create Broadcast"],
//   noticeboard: ["Communication", "Notice Board"],
//   createNoticeBoard: ["Communication", "Create Notice Board"],
//   createPoll: ["Communication", "Create Poll"],
//   polls: ["Communication", "Polls & Voting"],
//   addmember: ["Member Masters", "Members"],
//   memberDetails: ["Member Masters", "Member Details"],
//   viewUnit: ["Administration", "Registers", "View Register", "View Unit"],
//   transfer: ["Member Masters", "Transfer Member"],
//   documents: ["Administration", "Documents & NOC"],
//   flattransfer: ["Administration", "Flat Transfer"],
//   registers: ["Administration", "Registers"],
//   registerHistory: ["Administration", "Registers", "Member Register", "History"],
//   unitRegister: ["Administration", "Registers", "Unit Register"],
//   visitorRegister: ["Administration", "Registers", "Visitor Register"],
//   parkingRegister: ["Administration", "Registers", "Parking Register"],
//   parkingDetails: ["Administration", "Registers", "Parking Register", "Parking Details"],
//   parkingHistory: ["Administration", "Registers", "Parking Register", "Parking Details", "Parking History"],
//   rules: ["Administration", "Rules & By-laws"],
//   complaints: ["Operations", "Complaints"],
//   createComplaints: ["Operations", "Create Complaints"],
//   parkingList: ["Operations", "Parking"],
//   parkingDashboard: ["Operations", "Parking"],
//   visitorParking: ["Operations", "Parking", "Visitor Parking"],
//   visitorDetailsPage: ["Administration", "Visitor Register", "Visitor Details"],
//   violationAlerts: ["Operations", "Parking", "Violation Alerts"],
//   parkingRules: ["Operations", "Parking", "Parking Rules"],
//   viewParkingDetails: ["Operations", "Parking", "Violation Details"],
//   visitorDetails: ["Operations", "Parking", "Visitor Details"],
//   rentals: ["Operations", "Rentals & Tenants"],
//   rentalsApplication: ["Operations", "Rentals & Tenants", "Review Application"],
//   staff: ["Operations", "Staff Attendance"],
//   createStaff: ["Operations", "Create Staff Attendance"],
//   vehicleRegister: ["Administration", "Registers", "Vehicle Register"],
//   vehicleDetailsPage: ["Administration", "Registers", "Vehicle Register", "Vehicle Details"],
//   billing: ["Operations", "Billing"],
// };

// /* ══ ROOT APP ══════════════════════════════════ */
// export default function App() {
//   const navigation = useNavigate();
//   const [active, setActive] = useState("overview");
//   const [previousTab, setPreviousTab] = useState(null);
//   const [collapsed, setCollapsed] = useState(false);
//   const [societyName, setSocietyName] = useState("")
//   const [firstName, setFirstName] = useState("")
//   const [lastName, setLastName] = useState("")
//   const [profileUrl, setProfileUrl] = useState("")
//   const [visitorParkingId, setVisitorParkingId] = useState(null)
//   const [broadcastId, setBroadcastId] = useState(null);
//   const [memberId, setMemberId] = useState(null);
//   const [tenantId, setTenantId] = useState(null);
//   const [flatId, setFlatId] = useState(null)
//   const [selectedNoticeData, setSelectedNoticeData] = useState()
//   const [pollId, setPollId] = useState(null)
//   const [staffId, setStaffId] = useState(null)
//   const [violationId, setViolationId] = useState(null)
//   const [visitorId, setVisitorId] = useState(null);
//   const [selectedSlotId, setSelectedSlotId] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedSocietyId, setSelectedSocietyId] = useState(null);
//   const [selectedSlotData, setSelectedSlotData] = useState(null);
//   const [vehicleId, setVehicleId] = useState(null);
//   useLayoutEffect(() => {
//     if (!document.getElementById("bs-css")) {
//       const l = document.createElement("link");
//       l.id = "bs-css";
//       l.rel = "stylesheet";
//       l.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
//       document.head.appendChild(l);
//     }

//     if (!document.getElementById("sv-css")) {
//       const s = document.createElement("style");
//       s.id = "sv-css";
//       s.textContent = APP_CSS;
//       document.head.appendChild(s);
//     }
//   }, []);

//   const PAGES = {
//     overview: <Overview />,
//     broadcasting: <Broadcast setActive={setActive} setBroadcastId={setBroadcastId} />,
//     createbroadcast: <CreateBroadcast setActive={setActive} broadcastId={broadcastId} />,
//     polls: <Polls setActive={setActive} setPollId={setPollId} />,
//     createPoll: <CreatePoll setActive={setActive} pollId={pollId} />,
//     addmember: <AddMember setActive={setActive} setMemberId={setMemberId} setFlatId={setFlatId} />,
//     memberDetails: <MemberDetails active={active} setActive={setActive} previousTab={previousTab} setPreviousTab={setPreviousTab} memberId={memberId} setFlatId={setFlatId} flatId={flatId} />,
//     viewUnit: <ViewUnit setActive={setActive} flatId={flatId} />,
//     transfer: <PlaceholderPage label="Transfer Member" />,
//     documents: <Documents />,
//     flattransfer: <FlatTransfer />,
//     registers: <Register setActive={setActive} />,
//     registerHistory: <RegisterHistory setActive={setActive} />,
//     rules: <Rules />,
//     complaints: <Complaints setActive={setActive} />,
//     createComplaints: <CreateComplaints setActive={setActive} />,
//     parkingList: <ParkingList setActive={setActive} />,
//     parkingDashboard: <ParkingDashboard setActive={setActive} setViolationId={setViolationId} setVisitorParkingId={setVisitorParkingId} setVehicleId={setVehicleId} />,
//     visitorParking: <VisitorParkingList setActive={setActive} setVisitorParkingId={setVisitorParkingId} /* setViolationId={setViolationId} */ />,
//     violationAlerts: <ViolationAlertsList setActive={setActive} setViolationId={setViolationId} />,
//     parkingRules: <ParkingRules setActive={setActive} />,
//     viewParkingDetails: <ViewParkingDetails setActive={setActive} violationId={violationId} setVisitorParkingId={setVisitorParkingId} />,
//     visitorDetails: <VisitorDetails setActive={setActive} visitorParkingId={visitorParkingId} societyId={selectedSocietyId} />,
//     rentals: <RentalAndTenants setActive={setActive} setTenantId={setTenantId} />,
//     rentalsApplication: <TenantsReviewApplication setActive={setActive} tenantId={tenantId} />,
//     staff: <StaffAttendance setActive={setActive} setStaffId={setStaffId} />,
//     createStaff: <CreateStaffAttendance setActive={setActive} staffId={staffId} />,
//     noticeboard: <NoticeBoard setActive={setActive} setSelectedNoticeData={setSelectedNoticeData} />,
//     createNoticeBoard: <CreateNoticeBoard setActive={setActive} selectedNoticeData={selectedNoticeData} />,
//     unitRegister: <UnitRegister setActive={setActive} setFlatId={setFlatId} />,
//     parkingRegister: <ParkingRegister setActive={setActive} setSelectedSlotId={setSelectedSlotId} setSelectedSocietyId={setSelectedSocietyId} />,
//     parkingDetails: <ParkingDetails setActive={setActive} slotId={selectedSlotId} societyId={selectedSocietyId} setSelectedSlotData={setSelectedSlotData} />,
//     parkingHistory: <ParkingHistory setActive={setActive} slotId={selectedSlotId} slotData={selectedSlotData} />,
//     visitorRegister: <VisitorRegister setActive={setActive} setVisitorId={setVisitorId} />,
//     visitorDetailsPage: <GetVisitorDetails setActive={setActive} visitorId={visitorId} />,
//     vehicleRegister: <ListVehicleRegister setActive={setActive} setVehicleId={setVehicleId} />,
//     vehicleDetailsPage: <GetVehicleDetails setActive={setActive} vehicleId={vehicleId} />
//   };


//   // const [sec, pg] = TITLES[active] || ["", "", "", ""];
//   const breadcrumbs = (() => {
//     const base = TITLES[active] || [];
//     if (active === "parkingHistory" && selectedSlotData?.slot_number) {
//       return [...base.slice(0, -1), `${selectedSlotData.slot_number} >> Parking History`];
//     }
//     return base;
//   })();
//   const pg = breadcrumbs[breadcrumbs.length - 1] || "";

//   // Load session data on component mount for get session data
//   useEffect(() => {
//     SessionData()
//   }, [])

//   //fetch get session data
//   const SessionData = async () => {
//     const data = await GetSessionData()
//     console.log(data.data)
//     const flats = data.data.flats[0]
//     //setSocietyName(flats.society_name)
//     setFirstName(data.data.first_name)
//     setLastName(data.data.last_name)
//     setProfileUrl(data.data.profile_url)
//   }

//   //log out function
//   const LogoutData = async () => {
//     console.log("adbcd")
//     const data = await LogoutApi()
//     navigation("/")
//   }
//   return (
//     <>
//       <div className="app-shell">

//         {/* SIDEBAR */}
//         <nav className={`sidebar ${collapsed ? "collapsed" : ""} `} >
//           <div className="sidebar-logo">
//             <div className="logo-box">GV</div>
//             <div>
//               <div className="logo-name">{societyName}</div>
//               <div className="logo-sub text-start">Society Admin</div>
//             </div>
//           </div>
//           <div className="sidebar-nav ">
//             {NAV.map(({ sec: section, items }) => (
//               <div className="text-start" key={section}>
//                 <div className="nav-section text-start">{section}</div>
//                 {items.map(item => (
//                   <button key={item.id} className={`nav-item ${active === item.id || PARENT_MAP[active] === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
//                     <span className="ni">{item.icon}</span>
//                     <span className="nl">{item.lbl}</span>
//                   </button>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </nav>

//         {/* MAIN */}
//         <div className="main-area">
//           <header className="topbar">
//             <button className="tb-toggle" onClick={() => setCollapsed(c => !c)}>☰</button>
//             {/* <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
//               <span style={{ color: "var(--muted)" }}>{sec}</span>
//               <span style={{ color: "var(--muted)" }}>/</span>
//               <span className="tx-blue" style={{ fontWeight: 600, color: "blue" }}>{pg}</span>
//             </div> */}
//             <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
//               {breadcrumbs.map((crumb, i) => (
//                 <div key={i}>
//                   <span style={{ color: i === breadcrumbs.length - 1 ? "blue" : "var(--muted)", fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>
//                     {crumb}
//                   </span>
//                   {i < breadcrumbs.length - 1 && (
//                     <span style={{ color: "var(--muted)" }}>/</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="tb-right">
//               <span className="tb-date"> {new Date().toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}</span>

//               <button className="tb-avatar">🔔</button>
//               <button className="tb-avatar" style={{ background: "#e2e8f0", color: "var(--text)" }}><img src={
//                 profileUrl ||
//                 "../src/assets/profile.png"
//               } alt="Profile" className="img-fluid rounded-circle" /></button>
//               {/* <span className="tb-name">{firstName} {lastName}</span> */}
//               <div className="dropdown">

//                 {/* Name */}
//                 <span
//                   className="tb-name dropdown-toggle"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   {firstName} {lastName}
//                 </span>

//                 {/* Dropdown */}
//                 <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-3 ms-2 mr-0">

//                   <li>
//                     <button
//                       className="btn btn-sm btn-secondary dropdown-item"
//                       onClick={LogoutData}
//                     >
//                       <FiLogOut />
//                       Logout
//                     </button>
//                   </li>

//                 </ul>

//               </div>
//               {/* <button className="btn btn-secondary"><span className="tb-name" onClick={LogoutData}>Logout</span></button> */}
//             </div>
//           </header>

//           <main className="page-wrap" key={active}>
//             {PAGES[active] ?? <PlaceholderPage label={pg} />}
//           </main>
//         </div>
//       </div>

//     </>


//   );
// }


import { useState, useEffect, useLayoutEffect } from "react";
import Overview from "../Overview/Overview";
import CreateBroadcast from "../Broadcast/CreateBroadcast";
import NoticeBoard from "../NoticeBoard/NoticeBoard";
import Polls from "../Polls/Polls";
import AddMember from "../AddMember/AddMember";
import Documents from "../Documents&Noc/Documents";
import FlatTransfer from "../FlatTransfer/FlatTransfer";
import MemberTransfer from "../MemberTransfer/MemberTransfer";
import Rules from "../Rules/Rules";
import StaffAttendance from "../StaffAttendance/StaffAttendance";
import Register from "../Register/Register";
import { APP_CSS } from "../../components/Common/GlobalCss";
import Complaints from "../Complaints/Complaints";
import Broadcast from "../Broadcast/Broadcast";
import ViewBroadcastDetails from "../Broadcast/ViewBroadcastDetails";
import ViewComplaintDetails from "../Complaints/ViewComplaintDetails";
import AssignStaffModal from "../Complaints/AssignStaffModal";
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
import Parking from "../Parking/ParkingDashboard";
import ParkingRules from "../Parking/ParkingRules";
import ViewParkingDetails from "../Parking/ViewParkingDetails";
import ParkingSessionDetails from "../Parking/VisitorDetails";
import VisitorDetails from "../Parking/VisitorDetails";
import ParkingDashboard from "../Parking/ParkingDashboard";
import ParkingList from "../Parking/ParkingList";
import "../../styles/dashboard.css";
import ViolationAlertsList from "../Parking/ViolationAlertsList";
import VisitorParkingList from "../Parking/VisitorParkingList";
import VisitorRegister from "../Register/VisitorRegister/VisitorRegister";
import GetVisitorDetails from "../Register/VisitorRegister/GetVisitorDetails";
import ListVehicleRegister from "../Register/VehicleRegister/ListVehicleRegister";
import GetVehicleDetails from "../Register/VehicleRegister/GetVehicleDetails";
import FlatApprovals from "../FlatOccupancy/FlatApprovals";
import Billing from "../Billing/Billing";
import PollAnalytics from "../Polls/PollAnalytics";
import UpcomingEvents from "../Events/UpcomingEvents";
import Accounts from "../Accounts/Accounts";



// import PollAnalytics from "../Polls/PollAnalytics";
// import UpcomingEvents from "../Events/UpcomingEvents";
// import Accounts from "../Accounts/Accounts";

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
    sec: "Visitors & Parking", items: [
      { id: "parkingRegister", icon: "🅿️", lbl: "Parking Slots" },
      { id: "visitorRegister", icon: "🚶", lbl: "Visitors" },
      { id: "vehicleRegister", icon: "🚘", lbl: "Owner Vehicles" },
      { id: "parkingDashboard", icon: "🚗", lbl: "Parking" },
    ]
  },
  {
    sec: "Operations", items: [
      { id: "complaints", icon: "🚨", lbl: "Complaints" },
      { id: "staff", icon: "👥", lbl: "Staff Attendance" },
      { id: "billing", icon: "💰", lbl: "Billing" },
      { id: "accounts", icon: "📒", lbl: "Accounts" },
    ]
  },
  {
    sec: "Residents", items: [
      { id: "addmember", icon: "👤", lbl: "Members" },
      { id: "unitRegister", icon: "🏠", lbl: "Add Unit" },
      { id: "flatApprovals", icon: "🏘️", lbl: "Flat Approvals" },
      { id: "rentals", icon: "🏢", lbl: "Rentals & Tenants" },
    ]
  },
  {
    sec: "Transfers", items: [
      { id: "membertransfer", icon: "🔄", lbl: "Member Transfer" },
      { id: "flattransfer", icon: "🏠", lbl: "Flat Transfer" },
    ]
  },
  {
    sec: "Administration", items: [
      { id: "documents", icon: "📄", lbl: "Documents & NOC" },
      { id: "registers", icon: "📔", lbl: "Registers" },
      { id: "rules", icon: "⚖️", lbl: "Rules & By-laws" },
    ]
  },
];
const PARENT_MAP = {
  // Registers ke child pages
  registerHistory: "registers",
  // unitRegister: "registers",
  // parkingRegister: "registers",
  // parkingDetails: "registers",
  // parkingHistory: "registers",
  viewUnit: "registers",

  // Visitors ke child pages
  visitorDetailsPage: "visitorRegister",

  // Communication
  createbroadcast: "broadcasting",
  viewbroadcastdetails: "broadcasting",
  createNoticeBoard: "noticeboard",
  createPoll: "polls",
  upcomingEvents: "polls",
  // Member Masters
  memberDetails: "addmember",

  // Operations
  createComplaints: "complaints",
  viewComplaintDetails: "complaints",       // ← ADDED
  AssignStaffModal: "complaints",
  createStaff: "staff",
  rentalsApplication: "rentals",
  parkingList: "parkingDashboard",
  visitorParking: "parkingDashboard",
  violationAlerts: "parkingDashboard",
  parkingRules: "parkingDashboard",
  viewParkingDetails: "parkingDashboard",
  visitorDetails: "parkingDashboard",

  vehicleDetailsPage: "vehicleRegister",
  pollAnalytics: "polls",
};

const TITLES = {
  overview: ["Dashboards", "Overview"],
  broadcasting: ["Communication", "Broadcasting"],
  createbroadcast: ["Communication", "Create Broadcast"],
  viewbroadcastdetails: ["Communication", "Broadcasting", "Broadcast Details"],
  noticeboard: ["Communication", "Notice Board"],
  createNoticeBoard: ["Communication", "Create Notice Board"],
  createPoll: ["Communication", "Create Poll"],
  polls: ["Communication", "Polls & Voting"],
  upcomingEvents: ["Communication", "Polls & Voting", "Upcoming Events"],
  addmember: ["Member Masters", "Members"],
  memberDetails: ["Member Masters", "Member Details"],
  viewUnit: ["Administration", "Registers", "View Register", "View Unit"],
  transfer: ["Member Masters", "Transfer Member"],
  documents: ["Administration", "Documents & NOC"],
  flattransfer: ["Transfers", "Flat Transfer"],
  membertransfer: ["Transfers", "Member Transfer"],
  registers: ["Administration", "Registers"],
  registerHistory: ["Administration", "Registers", "Member Register", "History"],
  unitRegister: ["Administration", "Registers", "Unit Register"],
  visitorRegister: ["Administration", "Registers", "Visitor Register"],
  parkingRegister: ["Visitors & Parking", "Parking Slots"],
  parkingDetails: ["Visitors & Parking", "Parking Slots", "Parking Details"],
  parkingHistory: ["Visitors & Parking", "Parking Slots", "Parking History"],
  rules: ["Administration", "Rules & By-laws"],
  complaints: ["Operations", "Complaints"],
  createComplaints: ["Operations", "Create Complaints"],
  viewComplaintDetails: ["Operations", "Complaints", "View Complaint"],  // ← ADDED
  AssignStaffModal: ["Operations", "Complaints", "Assign Staff"],  // ← ADDED
  parkingList: ["Operations", "Parking"],
  parkingDashboard: ["Operations", "Parking"],
  visitorParking: ["Operations", "Parking", "Visitor Parking"],
  visitorDetailsPage: ["Administration", "Visitor Register", "Visitor Details"],
  violationAlerts: ["Operations", "Parking", "Violation Alerts"],
  parkingRules: ["Operations", "Parking", "Parking Rules"],
  viewParkingDetails: ["Operations", "Parking", "Violation Details"],
  visitorDetails: ["Operations", "Parking", "Visitor Details"],
  rentals: ["Operations", "Rentals & Tenants"],
  rentalsApplication: ["Operations", "Rentals & Tenants", "Review Application"],
  staff: ["Operations", "Staff Attendance"],
  createStaff: ["Operations", "Create Staff Attendance"],
  vehicleRegister: ["Administration", "Registers", "Vehicle Register"],
  vehicleDetailsPage: ["Administration", "Registers", "Vehicle Register", "Vehicle Details"],
  billing: ["Operations", "Billing"],
  accounts: ["Operations", "Accounts"],
  flatApprovals: ["Operations", "Flat Approvals"],
  pollAnalytics: ["Communication", "Polls & Voting", "Analytics"],
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
  const [visitorParkingId, setVisitorParkingId] = useState(null)
  const [broadcastId, setBroadcastId] = useState(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [flatId, setFlatId] = useState(null)
  const [selectedNoticeData, setSelectedNoticeData] = useState()
  const [pollId, setPollId] = useState(null)
  const [staffId, setStaffId] = useState(null)
  const [violationId, setViolationId] = useState(null)
  const [visitorId, setVisitorId] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSocietyId, setSelectedSocietyId] = useState(null);
  const [selectedSlotData, setSelectedSlotData] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [societyId, setSocietyId] = useState("");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);  // ← ADDED
  const [selectedStaffId, setSelectedStaffId] = useState(null);

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
    overview: <Overview setActive={setActive} />,
    broadcasting: <Broadcast setActive={setActive} setBroadcastId={setBroadcastId} setSelectedBroadcast={setSelectedBroadcast} />,
    createbroadcast: <CreateBroadcast setActive={setActive} broadcastId={broadcastId} />,
    viewbroadcastdetails: <ViewBroadcastDetails setActive={setActive} setBroadcastId={setBroadcastId} broadcastId={broadcastId} preloadedBroadcast={selectedBroadcast} />,
    polls: <Polls setActive={setActive} setPollId={setPollId} />,
    createPoll: <CreatePoll setActive={setActive} pollId={pollId} />,
    addmember: <AddMember setActive={setActive} setMemberId={setMemberId} setFlatId={setFlatId} />,
    memberDetails: <MemberDetails active={active} setActive={setActive} previousTab={previousTab} setPreviousTab={setPreviousTab} memberId={memberId} setFlatId={setFlatId} flatId={flatId} />,
    viewUnit: <ViewUnit setActive={setActive} flatId={flatId} setMemberId={setMemberId} />,
    transfer: <PlaceholderPage label="Transfer Member" />,
    documents: <Documents />,
    flattransfer: <FlatTransfer />,
    membertransfer: <MemberTransfer />,
    registers: <Register setActive={setActive} />,
    registerHistory: <RegisterHistory setActive={setActive} />,
    rules: <Rules />,
    complaints: <Complaints setActive={setActive} setSelectedComplaintId={setSelectedComplaintId} />,  // ← UPDATED
    createComplaints: <CreateComplaints setActive={setActive} />,
    viewComplaintDetails: <ViewComplaintDetails setActive={setActive} complaintId={selectedComplaintId} />,  // ← ADDED
    AssignStaffModal: <AssignStaffModal setActive={setActive} selectedStaffId={setSelectedStaffId} />,
    parkingList: <ParkingList setActive={setActive} />,
    parkingDashboard: <ParkingDashboard setActive={setActive} setViolationId={setViolationId} setVisitorParkingId={setVisitorParkingId} setVehicleId={setVehicleId} />,
    visitorParking: <VisitorParkingList setActive={setActive} setVisitorParkingId={setVisitorParkingId} />,
    violationAlerts: <ViolationAlertsList setActive={setActive} setViolationId={setViolationId} />,
    parkingRules: <ParkingRules setActive={setActive} />,
    viewParkingDetails: <ViewParkingDetails setActive={setActive} violationId={violationId} setVisitorParkingId={setVisitorParkingId} />,
    visitorDetails: <VisitorDetails setActive={setActive} visitorParkingId={visitorParkingId} societyId={selectedSocietyId} />,
    rentals: <RentalAndTenants setActive={setActive} setTenantId={setTenantId} />,
    rentalsApplication: <TenantsReviewApplication setActive={setActive} tenantId={tenantId} />,
    staff: <StaffAttendance setActive={setActive} setStaffId={setStaffId} />,
    createStaff: <CreateStaffAttendance setActive={setActive} staffId={staffId} />,
    noticeboard: <NoticeBoard setActive={setActive} setSelectedNoticeData={setSelectedNoticeData} />,
    createNoticeBoard: <CreateNoticeBoard setActive={setActive} selectedNoticeData={selectedNoticeData} />,
    unitRegister: <UnitRegister setActive={setActive} setFlatId={setFlatId} />,
    parkingRegister: <ParkingRegister setActive={setActive} setSelectedSlotId={setSelectedSlotId} setSelectedSocietyId={setSelectedSocietyId} />,
    parkingDetails: <ParkingDetails setActive={setActive} slotId={selectedSlotId} societyId={selectedSocietyId} setSelectedSlotData={setSelectedSlotData} />,
    parkingHistory: <ParkingHistory setActive={setActive} slotId={selectedSlotId} slotData={selectedSlotData} />,
    visitorRegister: <VisitorRegister setActive={setActive} setVisitorId={setVisitorId} />,
    visitorDetailsPage: <GetVisitorDetails setActive={setActive} visitorId={visitorId} />,
    vehicleRegister: <ListVehicleRegister setActive={setActive} setVehicleId={setVehicleId} />,
    vehicleDetailsPage: <GetVehicleDetails setActive={setActive} vehicleId={vehicleId} />,
    billing: <Billing setActive={setActive} />,
    accounts: <Accounts setActive={setActive} />,
    flatApprovals: <FlatApprovals setActive={setActive} />,
    pollAnalytics: <PollAnalytics setActive={setActive} pollId={pollId} />,
    upcomingEvents: <UpcomingEvents setActive={setActive} />,
  };

  const breadcrumbs = (() => {
    const base = TITLES[active] || [];
    if (active === "parkingHistory" && selectedSlotData?.slot_number) {
      return [...base.slice(0, -1), `${selectedSlotData.slot_number} >> Parking History`];
    }
    return base;
  })();
  const pg = breadcrumbs[breadcrumbs.length - 1] || "";

  useEffect(() => {
    SessionData()
  }, [])

  const SessionData = async () => {
    const data = await GetSessionData()
    console.log(data.data)
    const flats = data.data.flats[0]
    setSocietyId(flats.society_id)
    setFirstName(data.data.first_name)
    setLastName(data.data.last_name)
    setProfileUrl(data.data.profile_url)
  }

  const LogoutData = async () => {
    try {
      await LogoutApi(societyId);
      navigation("/");
    } catch (error) {
      console.log(error);
    }
  };

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
                  <button key={item.id} className={`nav-item ${active === item.id || PARENT_MAP[active] === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
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
              <button className="tb-avatar" style={{ background: "#e2e8f0", color: "var(--text)" }}>
                <img src={profileUrl || "../src/assets/profile.png"} alt="Profile" className="img-fluid rounded-circle" />
              </button>
              <div className="dropdown">
                <span
                  className="tb-name dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {firstName} {lastName}
                </span>
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