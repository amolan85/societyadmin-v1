import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Overview.css"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    ResponsiveContainer, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { OverviewApi } from '../../services/OverviewApi';

const Overview = () => {
    const [barData, setBarData] = useState([])
    const [totalVisits, setTotalVisits] = useState("")
    const [pendingApproval, setPendingApproval] = useState("")
    const [activeComplaints, setActiveComplaints] = useState("")
    const [staffAttendance, setStaffAttendance] = useState({})

    const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ap = [54, 29, 54, 99, 52, 46, 15, 64, 33, 64, 23, 93];
    const pe = [48, 25, 56, 94, 52, 45, 13, 81, 30, 30, 55, 45];
    const re = [24, 10, 39, 40, 50, 40, 29, 75, 77, 89, 26, 33];

    // const barData = [
    //     { name: "Jan", approved: 54, pending: 23, rejected: 48 },
    //     { name: "Feb", approved: 28, pending: 25, rejected: 10 },
    //     { name: "Mar", approved: 55, pending: 56, rejected: 38 },
    //     { name: "Apr", approved: 59, pending: 98, rejected: 52 },
    //     { name: "May", approved: 98, pending: 52, rejected: 93 },
    //     { name: "Jun", approved: 76, pending: 34, rejected: 45 },
    //     { name: "Jul", approved: 88, pending: 67, rejected: 54 },
    //     { name: "Aug", approved: 92, pending: 45, rejected: 61 },
    //     { name: "Sep", approved: 67, pending: 29, rejected: 40 },
    //     { name: "Oct", approved: 73, pending: 38, rejected: 55 },
    //     { name: "Nov", approved: 81, pending: 42, rejected: 36 },
    //     { name: "Dec", approved: 95, pending: 50, rejected: 70 },
    // ];

    const radarData = [
        { subject: "Jan", A: 80, B: 50, C: 20 },
        { subject: "Feb", A: 60, B: 70, C: 30 },
        { subject: "Mar", A: 40, B: 20, C: 60 },
        { subject: "Apr", A: 70, B: 40, C: 50 },
    ];

    useEffect(() => {
        GetDashboard()
    }, [])

    const GetDashboard = async () => {
        const data = await OverviewApi()
        // console.log(data)
        setBarData(data.monthly_data || "")
        setTotalVisits(data.total_visits || "")
        setPendingApproval(data.pending_visits || "")
        setActiveComplaints(data.active_complaints_count || "")
        setStaffAttendance(data.staff_attendance || "")
    }

    return (

        <div className="pg">
            <h2 className="ov-title text-start fw-bold">Welcome Back!</h2>
            <p className="ov-sub tx-muted mb-4 text-start">
                Your Overview Statistics
            </p>
            {/* 
            <div className="row g-3 mb-4">

                {[["Active Complaints", "14"], ["Visits", "3,671"], ["Pending Approvals", "156"], ["Staff Present", "48/50"]].map(([l, v]) => (
                    <div className="col-6 col-md-3" key={l}>

                        <div className="stat-card">
                            <div className="s-label">{l}</div>
                            <div className="s-val">{v}</div>
                        </div>
                    </div>
                ))}
            </div> */}
            <div className="row g-3 mb-4 align-items-center">

                {/* 🔍 Search */}
                <div className="col-12 col-md-4 col-lg-3 position-relative">

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
                </div>

                {/* 📊 Cards */}
                {[
                    ["Active Complaints", activeComplaints],
                    ["Visits", /* "3,671" */ totalVisits],
                    ["Pending Approvals", /* "156" */pendingApproval],
                   ["Staff Present", `${staffAttendance.present || ""} / ${staffAttendance.total || ""}`]
                ].map(([l, v]) => (
                    <div className="col-6 col-md-4 col-lg" key={l}>
                        <div className="stat-card h-100 text-center">
                            <div className="s-label">{l}</div>
                            <div className="s-val">{v}</div>
                        </div>
                    </div>
                ))}

            </div>
            <div className="row g-3 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="sv-card">
                        {/* <div className="d-flex justify-content-between align-items-center mb-3">

                            <div className="d-flex gap-3">
                                {[["#818cf8", "Approved"], ["#fb923c", "Pending"], ["#f87171", "Rejected"]].map(([c, l]) => (
                                    <span key={l} className="legend-item">
                                        <span className="legend-box" style={{ background: c }} />
                                        {l}
                                    </span>
                                ))}
                            </div>

                            <span className="btn-ol fy-btn">F.Y. 2025 ▾</span>
                        </div>
                        <div className="chart-container">
                            {mo.map((m, i) => (
                                <div key={m} className="chart-col">
                                    <div className="chart-bars">
                                        {[[ap[i], "#818cf8"], [pe[i], "#fb923c"], [re[i], "#f87171"]].map(([v, c], j) => (
                                            <div
                                                key={j}
                                                className="chart-bar"
                                                style={{ height: `${v}%`, background: c }}
                                            />
                                        ))}
                                    </div>
                                    <div className="chart-label">{m}</div>
                                </div>
                            ))}
                        </div> */}
                        <ResponsiveContainer width="100%" height={400}>
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
    );
}

export default Overview