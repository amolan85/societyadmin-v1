import { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Overview.css"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, 
} from "recharts";
import { OverviewApi } from '../../services/OverviewApi';

import { GetSessionData } from '../../utils/SessionManagement';
import { FiSearch } from 'react-icons/fi';

const Overview = () => {
    //const { setLoading } = useLoader();
    const [barData, setBarData] = useState([])
    const [totalVisits, setTotalVisits] = useState("")
    const [pendingApproval, setPendingApproval] = useState("")
    const [activeComplaints, setActiveComplaints] = useState("")
    const [staffAttendance, setStaffAttendance] = useState({})

    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        GetDashboard(flats.society_id)

    }

    const GetDashboard = async (societyId) => {
        try {
            const data = await OverviewApi(societyId)
            //            const data = await OverviewApi()
            // console.log(data)
            setBarData(data.monthly_data || "")
            setTotalVisits(data.total_visits || "")
            setPendingApproval(data.pending_visits || "")
            setActiveComplaints(data.active_complaints_count || "")
            setStaffAttendance(data.staff_attendance || "")
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {/* {loading && (
                <div className="fullscreen-loader">
                    Loading...
                </div>
            )} */}
            <div className="pg">
                <h2 className="ov-title text-start fw-bold">Welcome Back!</h2>
                <p className="ov-sub tx-muted mb-4 text-start">
                    Your Overview Statistics
                </p>
                {/* <div className="search-bar db-search position-relative">

                    <span
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#aaa"
                        }}
                    >
                        🔍
                    </span>

                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Search..."
                        style={{ paddingLeft: "35px" }}
                    />

                </div> */}
                {/* <div className="row g-3 mb-4 mt-2">

                    {[
                        ["Active Complaints", activeComplaints],
                        ["Visits",  totalVisits],
                        ["Pending Approvals", pendingApproval],
                        ["Staff Present", `${staffAttendance.present || 0} / ${staffAttendance.total || ""}`]
                    ].map(([l, v]) => (
                        <div className="col-6 col-md-4 col-lg" key={l}>
                            <div className="stat-card h-100 text-center">
                                <div className="s-label">{l}</div>
                                <div className="s-val">{v}</div>
                            </div>
                        </div>
                    ))}

                </div> */}
                <div className="row g-3 mb-4 align-items-center">


                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span
                            style={{
                                position: "absolute",
                                left: "25px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#aaa"
                            }}
                        >
                            <FiSearch/>
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Start searching here"
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>

                    {[
                        ["Active Complaints", activeComplaints],
                        ["Visits", totalVisits],
                        ["Pending Approvals", pendingApproval],
                        ["Staff Present", `${staffAttendance.present || 0} / ${staffAttendance.total || ""}`]
                    ].map(([l, v]) => (
                        <div className="col-6 col-md-4 col-lg " key={l}>
                            <div className="h-100 text-start ms-4">
                                <div className="s-label">{l}</div>
                                <div className="s-val">{v}</div>
                            </div>
                        </div>
                    ))}

                </div>
                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-8">
                        <div className="sv-card">
                            <ResponsiveContainer width="100%" height={400} >
                                {/* <BarChart data={barData} >
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}

                                />

                                <Tooltip />
                                <Legend />
                                <Bar dataKey="approved" fill="#6C63FF" />
                                <Bar dataKey="pending" fill="#F4A62A" />
                                <Bar dataKey="rejected" fill="#EF5350" />
                            </BarChart> */}
                                <BarChart data={barData} >
                                    <XAxis
                                        dataKey="month_name"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 20, 40, 60, 80, 100]}

                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="approved_visits" fill="#6C63FF" />
                                    <Bar dataKey="pending_visits" fill="#F4A62A" />
                                    <Bar dataKey="rejected_visits" fill="#EF5350" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    <div className="col-12 col-lg-4">
                        <div className="sv-card h-100 d-flex flex-column">
                            <div className="d-flex gap-3 mb-2 flex-wrap">
                                {[["#818cf8", "Approved"], ["#fb923c", "Pending"], ["#f87171", "Rejected"]].map(([c, l]) => (
                                    <span key={l} className="legend-dot-item">
                                        <span className="legend-dot" style={{ background: c }} />
                                        {l}
                                    </span>
                                ))}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                {/* <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
                                <Radar dataKey="B" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
                                <Radar dataKey="C" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
                            </RadarChart> */}

                                <RadarChart data={barData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="month_name" />
                                    <Radar dataKey="approved_visits" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
                                    <Radar dataKey="pending_visits" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
                                    <Radar dataKey="rejected_visits" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                            {/* <div className="radar-wrap">
                            <svg viewBox="0 0 200 200" width="170" height="170">
                                {[.32, .5, .67, .84].map((s, i) => (
                                    <polygon key={i} points="100,20 180,70 160,160 40,160 20,70"
                                        className="radar-grid"
                                        style={{
                                            transform: `scale(${s}) translate(${-100 * (1 - s)}px,${-100 * (1 - s)}px)`
                                        }} />
                                ))}

                                <polygon className="radar-a" points="100,30 165,75 150,155 50,155 35,75" />
                                <polygon className="radar-b" points="100,45 155,80 145,145 55,145 45,80" />
                                <polygon className="radar-c" points="100,60 140,90 132,138 68,138 60,90" />

                                {mo.map((lb, i) => {
                                    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
                                    return (
                                        <text
                                            key={lb}
                                            x={100 + 90 * Math.cos(a)}
                                            y={100 + 90 * Math.sin(a)}
                                            className="radar-text"
                                        >
                                            {lb}
                                        </text>
                                    );
                                })}
                            </svg>
                            
                        </div> */}

                        </div>
                    </div>
                </div>

                <div className="sv-card p-0 overflow-hidden">
                    {[
                        { title: "Tenant Agreement Verification", sub: "Unit 402 • Rahul Sharma (Tenant)", badge: "Pending Verify", bc: "orange" },
                        { title: "Interior Renovation Request", sub: "Unit 105 • Painting & Flooring", badge: "Review Docs", bc: "blue" },
                        { title: "NOC for Bank Loan – Flat C-201", sub: "Unit C-201 • Priya Mehta (Owner)", badge: "Approved", bc: "green" },
                    ].map((p, i, arr) => (
                        <div key={i} className={`activity-row ${i < arr.length - 1 ? "bordered" : ""}`}>
                            <div className="text-start">
                                <div className="activity-title">{p.title}</div>
                                <div className="activity-sub">{p.sub}</div>
                            </div>
                            <Badge label={p.badge} c={p.bc} />
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}

export default Overview