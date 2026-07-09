// import { useState, useEffect } from 'react'
// import { Badge } from '../../components/Common/ReusableFunction';
// import "../../styles/Overview.css"
// import {
//     BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//     ResponsiveContainer, RadarChart, Radar,
//     PolarGrid, PolarAngleAxis, 
// } from "recharts";
// import { OverviewApi } from '../../services/OverviewApi';

// import { GetSessionData } from '../../utils/SessionManagement';
// import { FiSearch } from 'react-icons/fi';

// const Overview = () => {
//     //const { setLoading } = useLoader();
//     const [barData, setBarData] = useState([])
//     const [totalVisits, setTotalVisits] = useState("")
//     const [pendingApproval, setPendingApproval] = useState("")
//     const [activeComplaints, setActiveComplaints] = useState("")
//     const [staffAttendance, setStaffAttendance] = useState({})

//     useEffect(() => {
//         SessionData()
//     }, [])

//     const SessionData = async () => {
//         const data = await GetSessionData()
//         console.log(data.data)
//         const flats = data.data.flats[0]
//         GetDashboard(data.data.society_id)

//     }

//     const GetDashboard = async (societyId) => {
//         try {
//             const data = await OverviewApi(societyId)
//             //            const data = await OverviewApi()
//             // console.log(data)
//             setBarData(data.monthly_data || "")
//             setTotalVisits(data.total_visits || "")
//             setPendingApproval(data.pending_visits || "")
//             setActiveComplaints(data.active_complaints_count || "")
//             setStaffAttendance(data.staff_attendance || "")
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <>
//             {/* {loading && (
//                 <div className="fullscreen-loader">
//                     Loading...
//                 </div>
//             )} */}
//             <div className="pg">
//                 <h2 className="ov-title text-start fw-bold">Welcome Back!</h2>
//                 <p className="ov-sub tx-muted mb-4 text-start">
//                     Your Overview Statistics
//                 </p>
//                 {/* <div className="search-bar db-search position-relative">

//                     <span
//                         style={{
//                             position: "absolute",
//                             left: "15px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             color: "#aaa"
//                         }}
//                     >
//                         🔍
//                     </span>

//                     <input
//                         type="text"
//                         className="form-control rounded-pill"
//                         placeholder="Search..."
//                         style={{ paddingLeft: "35px" }}
//                     />

//                 </div> */}
//                 {/* <div className="row g-3 mb-4 mt-2">

//                     {[
//                         ["Active Complaints", activeComplaints],
//                         ["Visits",  totalVisits],
//                         ["Pending Approvals", pendingApproval],
//                         ["Staff Present", `${staffAttendance.present || 0} / ${staffAttendance.total || ""}`]
//                     ].map(([l, v]) => (
//                         <div className="col-6 col-md-4 col-lg" key={l}>
//                             <div className="stat-card h-100 text-center">
//                                 <div className="s-label">{l}</div>
//                                 <div className="s-val">{v}</div>
//                             </div>
//                         </div>
//                     ))}

//                 </div> */}
//                 <div className="row g-3 mb-4 align-items-center">


//                     <div className="col-12 col-md-4 col-lg-3 position-relative">
//                         <span
//                             style={{
//                                 position: "absolute",
//                                 left: "25px",
//                                 top: "50%",
//                                 transform: "translateY(-50%)",
//                                 color: "#aaa"
//                             }}
//                         >
//                             <FiSearch/>
//                         </span>

//                         <input
//                             type="text"
//                             className="form-control rounded-pill"
//                             placeholder="Start searching here"
//                             style={{ paddingLeft: "35px" }}
//                         />
//                     </div>

//                     {[
//                         ["Active Complaints", activeComplaints],
//                         ["Visits", totalVisits],
//                         ["Pending Approvals", pendingApproval],
//                         ["Staff Present", `${staffAttendance.present || 0} / ${staffAttendance.total || ""}`]
//                     ].map(([l, v]) => (
//                         <div className="col-6 col-md-4 col-lg " key={l}>
//                             <div className="h-100 text-start ms-4">
//                                 <div className="s-label">{l}</div>
//                                 <div className="s-val">{v}</div>
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//                 <div className="row g-3 mb-4">
//                     <div className="col-12 col-lg-8">
//                         <div className="sv-card">
//                             <ResponsiveContainer width="100%" height={400} >
//                                 {/* <BarChart data={barData} >
//                                 <XAxis
//                                     dataKey="name"
//                                     tick={{ fontSize: 12 }}
//                                 />
//                                 <YAxis
//                                     domain={[0, 100]}
//                                     ticks={[0, 20, 40, 60, 80, 100]}

//                                 />

//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="approved" fill="#6C63FF" />
//                                 <Bar dataKey="pending" fill="#F4A62A" />
//                                 <Bar dataKey="rejected" fill="#EF5350" />
//                             </BarChart> */}
//                                 <BarChart data={barData} >
//                                     <XAxis
//                                         dataKey="month_name"
//                                         tick={{ fontSize: 12 }}
//                                     />
//                                     <YAxis
//                                         domain={[0, 100]}
//                                         ticks={[0, 20, 40, 60, 80, 100]}

//                                     />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="approved_visits" fill="#6C63FF" />
//                                     <Bar dataKey="pending_visits" fill="#F4A62A" />
//                                     <Bar dataKey="rejected_visits" fill="#EF5350" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>


//                     <div className="col-12 col-lg-4">
//                         <div className="sv-card h-100 d-flex flex-column">
//                             <div className="d-flex gap-3 mb-2 flex-wrap">
//                                 {[["#818cf8", "Approved"], ["#fb923c", "Pending"], ["#f87171", "Rejected"]].map(([c, l]) => (
//                                     <span key={l} className="legend-dot-item">
//                                         <span className="legend-dot" style={{ background: c }} />
//                                         {l}
//                                     </span>
//                                 ))}
//                             </div>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 {/* <RadarChart data={radarData}>
//                                 <PolarGrid />
//                                 <PolarAngleAxis dataKey="subject" />
//                                 <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
//                                 <Radar dataKey="B" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
//                                 <Radar dataKey="C" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
//                             </RadarChart> */}

//                                 <RadarChart data={barData}>
//                                     <PolarGrid />
//                                     <PolarAngleAxis dataKey="month_name" />
//                                     <Radar dataKey="approved_visits" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
//                                     <Radar dataKey="pending_visits" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
//                                     <Radar dataKey="rejected_visits" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
//                                 </RadarChart>
//                             </ResponsiveContainer>
//                             {/* <div className="radar-wrap">
//                             <svg viewBox="0 0 200 200" width="170" height="170">
//                                 {[.32, .5, .67, .84].map((s, i) => (
//                                     <polygon key={i} points="100,20 180,70 160,160 40,160 20,70"
//                                         className="radar-grid"
//                                         style={{
//                                             transform: `scale(${s}) translate(${-100 * (1 - s)}px,${-100 * (1 - s)}px)`
//                                         }} />
//                                 ))}

//                                 <polygon className="radar-a" points="100,30 165,75 150,155 50,155 35,75" />
//                                 <polygon className="radar-b" points="100,45 155,80 145,145 55,145 45,80" />
//                                 <polygon className="radar-c" points="100,60 140,90 132,138 68,138 60,90" />

//                                 {mo.map((lb, i) => {
//                                     const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
//                                     return (
//                                         <text
//                                             key={lb}
//                                             x={100 + 90 * Math.cos(a)}
//                                             y={100 + 90 * Math.sin(a)}
//                                             className="radar-text"
//                                         >
//                                             {lb}
//                                         </text>
//                                     );
//                                 })}
//                             </svg>

//                         </div> */}

//                         </div>
//                     </div>
//                 </div>

//                 <div className="sv-card p-0 overflow-hidden">
//                     {[
//                         { title: "Tenant Agreement Verification", sub: "Unit 402 • Rahul Sharma (Tenant)", badge: "Pending Verify", bc: "orange" },
//                         { title: "Interior Renovation Request", sub: "Unit 105 • Painting & Flooring", badge: "Review Docs", bc: "blue" },
//                         { title: "NOC for Bank Loan – Flat C-201", sub: "Unit C-201 • Priya Mehta (Owner)", badge: "Approved", bc: "green" },
//                     ].map((p, i, arr) => (
//                         <div key={i} className={`activity-row ${i < arr.length - 1 ? "bordered" : ""}`}>
//                             <div className="text-start">
//                                 <div className="activity-title">{p.title}</div>
//                                 <div className="activity-sub">{p.sub}</div>
//                             </div>
//                             <Badge label={p.badge} c={p.bc} />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </>
//     );
// }

// export default Overview

import { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import { useNavigate } from "react-router-dom";
import "../../styles/Overview.css"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { getComplaintsApi } from "../../services/ComplaintsApi";
import { OverviewApi } from '../../services/OverviewApi';
import { ListVisitorsApi } from "../../services/VisitorApi";
import { GetSessionData } from '../../utils/SessionManagement';
import {
    FiSearch, FiUsers, FiUserCheck, FiAlertTriangle, FiDollarSign,
    FiClock, FiPhone, FiShield, FiBarChart2, FiPieChart, FiHome,
    FiActivity, FiCalendar, FiCheckSquare, FiBell, FiTool,
} from 'react-icons/fi';
import { FaCar, FaFireExtinguisher, FaBolt, FaWrench, FaBullhorn } from 'react-icons/fa';

const COMPLAINT_COLORS = { open: "#f12727", in_progress: "#fbbf24", resolved: "#34d399" };
const OCC_COLORS = ["#34d399", "#e5e7eb"];
const ATT_COLORS = { present: "#34d399", absent: "#f87171", on_leave: "#fbbf24" };

const Overview = ({ setActive }) => {
    const [barData, setBarData] = useState([])
    const [totalVisits, setTotalVisits] = useState("")
    const [pendingApproval, setPendingApproval] = useState("")
    const [activeComplaints, setActiveComplaints] = useState("")
    const [staffAttendance, setStaffAttendance] = useState({})
    const [todayVisitorCount, setTodayVisitorCount] = useState(0);
    const [recentVisitors, setRecentVisitors] = useState([]);
    // New sections - wire these to real API responses when endpoints are available.
    const [totalMembers, setTotalMembers] = useState({ count: 1245, delta: "+15 this month" })
    const [maintenance, setMaintenance] = useState({ collected: 425000, pending: 75000, total: 500000, percent: 92 })
    const [parkingAvailable, setParkingAvailable] = useState(18)
    const navigate = useNavigate();
    const [societyId, setSocietyId] = useState(null);
    const [complaintStatus, setComplaintStatus] = useState([]);
    const [complaintsTotal, setComplaintsTotal] = useState(0);
    // const [complaintStatus, setComplaintStatus] = useState([
    //     { name: "Open", key: "open", value: 12 },
    //     { name: "In Progress", key: "in_progress", value: 6 },
    //     { name: "Resolved", key: "resolved", value: 45 },
    // ])

    const [occupancy, setOccupancy] = useState({ occupied: 420, total: 450 })

    const [staffSplit, setStaffSplit] = useState([
        { name: "Present", key: "present", value: 8 },
        { name: "Absent", key: "absent", value: 2 },
        { name: "On Leave", key: "on_leave", value: 1 },
    ])

    const [todaysActivity, setTodaysActivity] = useState([
        { time: "09:30 AM", title: "Visitor Entry Approved", sub: "John Doe - Flat B-204" },
        { time: "10:15 AM", title: "Complaint #C-125 Closed", sub: "Lift not working - A Wing" },
        { time: "11:00 AM", title: "Maintenance Collected", sub: "₹12,500 from Flat A-101" },
        { time: "12:30 PM", title: "Staff Check-in", sub: "Security - Ramesh" },
        { time: "01:45 PM", title: "New Member Added", sub: "Rahul Sharma - Flat C-201" },
    ])

    const [upcomingEvents, setUpcomingEvents] = useState([
        { day: "02", month: "JUL", title: "Society Meeting", sub: "Monthly general body meeting at Community Hall", time: "06:00 PM" },
        { day: "05", month: "JUL", title: "Fire Safety Drill", sub: "Fire safety training for all residents", time: "10:00 AM" },
        { day: "08", month: "JUL", title: "Ganesh Festival Planning", sub: "Committee meeting for fest preparations", time: "07:00 PM" },
        { day: "15", month: "JUL", title: "Maintenance Due", sub: "Monthly maintenance charges due date", time: "All Day" },
    ])

    const [pendingApprovals, setPendingApprovals] = useState([
        { icon: <FiUsers />, label: "Flat Transfer Requests", count: 3 },
        { icon: <FiUserCheck />, label: "Tenant Verifications", count: 8 },
        { icon: <FiUserCheck />, label: "Visitor Registrations", count: 4 },
        { icon: <FiAlertTriangle />, label: "NOC Requests", count: 2 },
    ])
    const GetComplaints = async (societyId) => {
        try {
            const response = await getComplaintsApi(societyId);

            console.log("Complaint Response:", response);

            const counts = response.status_counts || {};

            setComplaintStatus([
                {
                    name: "Open",
                    key: "open",
                    value: counts.open || 0,
                },
                {
                    name: "In Progress",
                    key: "in_progress",
                    value: counts.in_progress || 0,
                },
                {
                    name: "Resolved",
                    key: "resolved",
                    value: counts.resolved || 0,
                },
                {
                    name: "Closed",
                    key: "closed",
                    value: counts.closed || 0,
                },
            ]);

            setComplaintsTotal(counts.total || 0);

            // Top Card
            setActiveComplaints(counts.open || 0);

        } catch (error) {
            console.log(error);
        }
    };

    // const [recentVisitors, setRecentVisitors] = useState([
    //     { name: "Amit Kumar", purpose: "Personal Visit", flat: "A-101", time: "10:30 AM", status: "Checked In" },
    //     { name: "Delivery Boy", purpose: "Delivery", flat: "B-204", time: "11:15 AM", status: "Checked In" },
    //     { name: "Rahul Singh", purpose: "Personal Visit", flat: "C-302", time: "11:45 AM", status: "Checked Out" },
    //     { name: "Sneha Patel", purpose: "Personal Visit", flat: "A-501", time: "12:20 PM", status: "Checked In" },
    //     { name: "Vikram Joshi", purpose: "Service", flat: "B-103", time: "01:10 PM", status: "Checked In" },
    // ])

    const [announcements, setAnnouncements] = useState([
        { title: "Water Supply Maintenance on 2nd July", date: "30 Jun 2026" },
        { title: "Lift Service Scheduled on 5th July", date: "29 Jun 2026" },
        { title: "Electricity Shutdown on 3rd July", date: "28 Jun 2026" },
        { title: "Society AGM on 15th July", date: "27 Jun 2026" },
    ])

    const emergencyContacts = [
        { icon: <FiShield />, label: "Police", value: "100", tone: "blue" },
        { icon: <FaCar />, label: "Ambulance", value: "108", tone: "orange" },
        { icon: <FaFireExtinguisher />, label: "Fire Brigade", value: "101", tone: "red" },
        { icon: <FaBolt />, label: "Electrician", value: "9876543210", tone: "yellow" },
        { icon: <FaWrench />, label: "Plumber", value: "9123456780", tone: "indigo" },
        { icon: <FiShield />, label: "Security Office", value: "020-1234567", tone: "green" },
    ]

    const SectionTitle = ({ icon, text, tone = "indigo" }) => (
        <h6 className="card-title">
            <span className={`title-icon tone-${tone}`}>{icon}</span>
            {text}
        </h6>
    )
    const formatTime = (value, type = "time") => {
        if (!value) return "-";

        const date = new Date(
            value + (value.includes("Z") || value.includes("+") ? "" : "Z")
        );

        if (type === "time") {
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const GetVisitors = async (id) => {
        try {
            const response = await ListVisitorsApi({
                societyId: id,
                search: "",
                visitor_type: "",
                entry_status: "",
                approval_status: "",
                flat_id: null,
                date_from: "",
                date_to: "",
                schedule_date: "",
                page: 1,
                page_size: 10,
            });

            console.log("API Response:", response);

            // Response contains visitors directly
            const visitors = response?.visitors || [];

            console.log("Visitors Array:", visitors);

            const today = new Date().toISOString().split("T")[0];
            console.log("Today's Date:", today);

            const todayVisitors = visitors.filter((visitor) => {
                const date = visitor.check_in_time || visitor.created_at;

                if (!date) return false;

                const visitorDate = date.split(" ")[0];

                console.log(
                    visitor.visitor_name,
                    "Visitor Date:",
                    visitorDate,
                    "Today:",
                    today
                );

                return visitorDate === today;
            });

            console.log("Today's Visitors:", todayVisitors);
            console.log("Today's Visitor Count:", todayVisitors.length);

            setTodayVisitorCount(todayVisitors.length);

            const sortedVisitors = [...visitors].sort((a, b) => {
                const dateA = new Date(
                    (a.check_in_time || a.created_at).replace(" ", "T")
                );

                const dateB = new Date(
                    (b.check_in_time || b.created_at).replace(" ", "T")
                );

                return dateB - dateA;
            });

            setRecentVisitors(sortedVisitors.slice(0, 5));

        } catch (error) {
            console.error("Visitor API Error:", error);
        }
    };
    useEffect(() => {
        SessionData();
    }, []);
    useEffect(() => {
        if (societyId) {
            GetVisitors(societyId);
        }
    }, [societyId]);
    const SessionData = async () => {
        try {
            const session = await GetSessionData();

            const id = session?.data?.society_id;

            setSocietyId(id);

            GetDashboard(id);
             GetComplaints(id);
        } catch (error) {
            console.log(error);
        }
    };

    const GetDashboard = async (societyId) => {
        try {
            const data = await OverviewApi(societyId)
            setBarData(data.monthly_data || [])
            setTotalVisits(data.total_visits || "")
            setPendingApproval(data.pending_visits || "")
            setActiveComplaints(data.active_complaints_count || "")
            setStaffAttendance(data.staff_attendance || {})
            // When backend supports them, also map:
            // setComplaintStatus(...), setOccupancy(...), setStaffSplit(...),
            // setTodaysActivity(...), setUpcomingEvents(...), setPendingApprovals(...),
            // setRecentVisitors(...), setAnnouncements(...), setMaintenance(...)
        } catch (error) {
            console.log(error);
        }
    }

    const occupancyData = [
        { name: "Occupied", value: occupancy.occupied },
        { name: "Vacant", value: Math.max(occupancy.total - occupancy.occupied, 0) },
    ]
    const occupancyPct = occupancy.total ? Math.round((occupancy.occupied / occupancy.total) * 100) : 0

    // const complaintsTotal = complaintStatus.reduce((a, c) => a + c.value, 0)
    const staffTotal = staffSplit.reduce((a, c) => a + c.value, 0)

    return (
        <div className="pg">
            <h2 className="ov-title text-start fw-bold">Welcome Back! 👋</h2>
            <p className="ov-sub text-muted mb-4 text-start">
                Here's what's happening in your society today.
            </p>

            {/* Top stat cards */}
            <div className="stat-row mb-4">
                <div className="stat-col">
                    <div className="stat-card h-100">
                        <div className="stat-top">
                            <span className="stat-label">Total Members</span>
                            <span className="stat-icon icon-blue"><FiUsers /></span>
                        </div>
                        <div className="stat-val">{totalMembers.count}</div>
                        <div className="stat-delta up">↑ {totalMembers.delta}</div>
                    </div>
                </div>
                <div className="stat-col">
                    <div className="stat-card h-100">
                        <div className="stat-top">
                            <span className="stat-label">Today's Visitors</span>
                            <span className="stat-icon icon-purple"><FiUserCheck /></span>
                        </div>
                        <div className="stat-val">{todayVisitorCount}</div>
                        <div className="stat-delta up">↑ 12 vs yesterday</div>
                    </div>
                </div>
                <div className="stat-col">
                    <div className="stat-card h-100">
                        <div className="stat-top">
                            <span className="stat-label">Open Complaints</span>
                            <span className="stat-icon icon-red"><FiAlertTriangle /></span>
                        </div>
                        <div className="stat-val danger-text">{activeComplaints || 12}</div>
                        <div className="stat-delta down">4 High Priority</div>
                    </div>
                </div>
                <div className="stat-col">
                    <div className="stat-card h-100">
                        <div className="stat-top">
                            <span className="stat-label">Maintenance Collection</span>
                            <span className="stat-icon icon-green"><FiDollarSign /></span>
                        </div>
                        <div className="stat-val success-text">₹{maintenance.collected.toLocaleString("en-IN")}</div>
                        <div className="stat-delta">{maintenance.percent}% Collected</div>
                    </div>
                </div>
                <div className="stat-col">
                    <div className="stat-card h-100">
                        <div className="stat-top">
                            <span className="stat-label">Parking Availability</span>
                            <span className="stat-icon icon-orange"><FaCar /></span>
                        </div>
                        <div className="stat-val warning-text">{parkingAvailable}</div>
                        <div className="stat-delta">Slots Available</div>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            {/* <div className="row g-3 mb-4">
                <div className="col-12 col-md-4 position-relative">
                    <span className="search-icon"><FiSearch /></span>
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Start searching here"
                        style={{ paddingLeft: "35px" }}
                    />
                </div>
            </div> */}

            {/* Charts row: bar + complaint donut + occupancy donut */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <div className="card-head">
                            <SectionTitle icon={<FiBarChart2 />} text="Visitor Analytics (This Week)" tone="indigo" />
                            <select className="month-select">
                                <option>This Week</option>
                                <option>Last Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <XAxis dataKey="month_name" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="approved_visits" fill="#6C63FF" />
                                <Bar dataKey="pending_visits" fill="#F4A62A" />
                                <Bar dataKey="rejected_visits" fill="#EF5350" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-12 col-lg-3">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiPieChart />} text="Complaint Status" tone="red" />
                        <div className="donut-wrap">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={complaintStatus}
                                        dataKey="value"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {complaintStatus.map((entry) => (
                                            <Cell key={entry.key} fill={COMPLAINT_COLORS[entry.key]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center">
                                <div className="donut-val">{complaintsTotal}</div>
                                <div className="donut-label">Total</div>
                            </div>
                        </div>
                        <div className="legend-list">
                            {complaintStatus.map((c) => (
                                <div className="legend-row" key={c.key}>
                                    <span className="legend-dot" style={{ background: COMPLAINT_COLORS[c.key] }} />
                                    <span className="legend-name">{c.name}</span>
                                    <span className="legend-val">{c.value} ({Math.round((c.value / complaintsTotal) * 100)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-3">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiHome />} text="Occupancy Overview" tone="green" />
                        <div className="donut-wrap">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={occupancyData}
                                        dataKey="value"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {occupancyData.map((_, i) => (
                                            <Cell key={i} fill={OCC_COLORS[i]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center">
                                <div className="donut-val">{occupancyPct}%</div>
                                <div className="donut-label">Occupied</div>
                            </div>
                        </div>
                        <div className="legend-list">
                            <div className="legend-row">
                                <span className="legend-dot" style={{ background: OCC_COLORS[0] }} />
                                <span className="legend-name">Occupied</span>
                                <span className="legend-val">{occupancy.occupied} ({occupancyPct}%)</span>
                            </div>
                            <div className="legend-row">
                                <span className="legend-dot" style={{ background: OCC_COLORS[1] }} />
                                <span className="legend-name">Vacant</span>
                                <span className="legend-val">{occupancy.total - occupancy.occupied} ({100 - occupancyPct}%)</span>
                            </div>
                        </div>
                        <div className="card-foot-note">Total Flats: {occupancy.total}</div>
                    </div>
                </div>
            </div>

            {/* Today's Activity + Upcoming Events */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiActivity />} text="Today's Activity" tone="indigo" />
                        <div className="timeline">
                            {todaysActivity.map((a, i) => (
                                <div className="timeline-row" key={i}>
                                    <div className="timeline-time">{a.time}</div>
                                    <div className="timeline-dot-wrap">
                                        <span className="timeline-dot" />
                                        {i < todaysActivity.length - 1 && <span className="timeline-line" />}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">{a.title}</div>
                                        <div className="timeline-sub">{a.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn outline">View All Activity</button>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiCalendar />} text="Upcoming Events" tone="orange" />
                        <div className="event-list">
                            {upcomingEvents.map((e, i) => (
                                <div className="event-row" key={i}>
                                    <div className="event-date-badge">
                                        <span className="event-day">{e.day}</span>
                                        <span className="event-month">{e.month}</span>
                                    </div>
                                    <div className="event-content">
                                        <div className="event-title">{e.title}</div>
                                        <div className="event-sub">{e.sub}</div>
                                    </div>
                                    <div className="event-time"><FiClock /> {e.time}</div>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn outline">View Calendar</button>
                    </div>
                </div>
            </div>

            {/* Pending Approvals + Recent Visitors */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiCheckSquare />} text="Pending Approvals" tone="purple" />
                        <div className="approval-list">
                            {pendingApprovals.map((p, i) => (
                                <div className="approval-row" key={i}>
                                    <span className="approval-icon">{p.icon}</span>
                                    <span className="approval-label">{p.label}</span>
                                    <span className="approval-count">{p.count}</span>
                                    <button className="review-btn">Review</button>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn outline">View All Approvals</button>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiUserCheck />} text="Recent Visitors" tone="blue" />
                        <div className="table-responsive">
                            <table className="ov-table">
                                <thead>
                                    <tr>
                                        <th>Visitor</th>
                                        <th>Purpose</th>
                                        <th>Flat No.</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVisitors.map((v) => (
                                        <tr key={v.id}>
                                            <td>{v.visitor_name}</td>

                                            <td>{v.purpose || "-"}</td>

                                            <td>
                                                {v.block}-{v.flat_number}
                                            </td>

                                            <td>{formatTime(v.check_in_time)}</td>
                                            <td>{formatTime(v.check_out_time)}</td>
                                            <td>
                                                <Badge
                                                    label={v.entry_status}
                                                    c={
                                                        v.entry_status === "completed"
                                                            ? "green"
                                                            : v.entry_status === "waiting"
                                                                ? "orange"
                                                                : "red"
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="view-all-btn outline"
                            onClick={() => setActive("visitorRegister")}
                        >
                            View All Visitors
                        </button>
                    </div>
                </div>
            </div>

            {/* Maintenance Collection + Staff Attendance */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <div className="card-head">
                            <SectionTitle icon={<FiTool />} text="Maintenance Collection" tone="green" />
                            <select className="month-select">
                                <option>June 2026</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="gauge-wrap">
                                <ResponsiveContainer width={170} height={110}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: "Collected", value: maintenance.percent },
                                                { name: "Pending", value: 100 - maintenance.percent },
                                            ]}
                                            dataKey="value"
                                            cx="50%"
                                            cy="100%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={60}
                                            outerRadius={85}
                                            cornerRadius={20}
                                            paddingAngle={2}
                                            stroke="none"
                                        >
                                            <Cell fill="#34d399" />
                                            <Cell fill="#e5e7eb" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="gauge-center">
                                    <div className="gauge-val">{maintenance.percent}%</div>
                                    <div className="gauge-label">Collected</div>
                                </div>
                            </div>
                            <div className="maintenance-stats">
                                <div className="m-stat-row">
                                    <span className="m-stat-label">Collected</span>
                                    <span className="m-stat-val success-text">₹{maintenance.collected.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="m-stat-row">
                                    <span className="m-stat-label">Pending</span>
                                    <span className="m-stat-val danger-text">₹{maintenance.pending.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="m-stat-row">
                                    <span className="m-stat-label">Total</span>
                                    <span className="m-stat-val">₹{maintenance.total.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>
                        <button className="view-all-btn outline">View Details</button>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiUsers />} text="Staff Attendance (Today)" tone="blue" />
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="donut-wrap small">
                                <ResponsiveContainer width="100%" height={170}>
                                    <PieChart>
                                        <Pie
                                            data={staffSplit}
                                            dataKey="value"
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={2}
                                        >
                                            {staffSplit.map((s) => (
                                                <Cell key={s.key} fill={ATT_COLORS[s.key]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="donut-center">
                                    <div className="donut-val">{staffAttendance.total ?? staffTotal}</div>
                                    <div className="donut-label">Total Staff</div>
                                </div>
                            </div>
                            <div className="legend-list grow">
                                {staffSplit.map((s) => (
                                    <div className="legend-row" key={s.key}>
                                        <span className="legend-dot" style={{ background: ATT_COLORS[s.key] }} />
                                        <span className="legend-name">{s.name}</span>
                                        <span className="legend-val">{s.value} ({Math.round((s.value / staffTotal) * 100)}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="view-all-btn outline">View Attendance</button>
                    </div>
                </div>
            </div>

            {/* Announcements + Emergency Contacts */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiBell />} text="Announcements" tone="orange" />
                        <div className="announce-list">
                            {announcements.map((a, i) => (
                                <div className="announce-row" key={i}>
                                    <span className="announce-icon"><FaBullhorn /></span>
                                    <span className="announce-title">{a.title}</span>
                                    <span className="announce-date">{a.date}</span>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn outline">View All Announcements</button>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="sv-card h-100">
                        <SectionTitle icon={<FiPhone />} text="Emergency Contacts" tone="red" />
                        <div className="row g-2">
                            {emergencyContacts.map((c, i) => (
                                <div className="col-6 col-md-4" key={i}>
                                    <div className="contact-card">
                                        <span className={`contact-icon tone-${c.tone}`}>{c.icon}</span>
                                        <div>
                                            <div className="contact-label">{c.label}</div>
                                            <div className="contact-value">{c.value}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn outline">View All Contacts</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview



