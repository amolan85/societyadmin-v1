import React, { useState } from 'react'
import { Badge, Prog } from '../../components/Common/ReusableFunction';
import "../../styles/polls.css"

const Polls = () => {
    const [tab, setTab] = useState("Active");
    const polls = [
        { icon: "📊", title: "AGM 2025 : Approval of Annual Accounts", id: "#POLL-2024-004", meta: "Started: 2 days ago", ends: "Ends in 24h", endRed: true, tags: ["AGM Voting", "One Vote per Flat", "Secret Ballot"], status: "Live Voting", sc: "green", pct: 78, votes: "234 / 300" },
        { icon: "🔧", title: "Gym Equipment Upgrade Proposal", id: "#POLL-2024-005", meta: "Started: 5 hours ago", ends: "Ends in 5 days", tags: ["Infrastructure", "Per Member", "Open Ballot"], status: "Live Voting", sc: "green", pct: 12, votes: "36 / 300" },
        { icon: "☑", title: "Q3 Maintenance Charge Hike (10%)", id: "#POLL-2024-003", meta: "Ended: Oct 15, 2024", tags: ["Finance", "One Vote per Flat", "Approved"], status: "Closed", sc: "gray", result: true, votes: "280 Total" },
        { icon: "🗓", title: "Visitor Parking Policy Revision", id: "#POLL-2024-006", meta: "Starts: Nov 20, 2024 (10:00 AM)", tags: ["Rules & Regulations", "Per Member"], status: "Scheduled", sc: "orange" },
    ];

    return (
        // <div className="pg row g-4">
        //   <div className="col-12 col-lg-8">
        //     <div className="d-flex gap-2 flex-wrap mb-3 align-items-center">
        //       <div className="tab-pills">
        //         {["Active", "Scheduled", "Closed", "Drafts"].map(t => (
        //           <button key={t} className={`tab-pill ${tab === t ? "t-dark" : ""}`} onClick={() => setTab(t)}>{t}</button>
        //         ))}
        //       </div>
        //       <input className="sv-in ms-auto" placeholder="Search polls…" style={{ maxWidth: 180 }} />
        //       <button className="btn-ac">+ Create Poll</button>
        //     </div>

        //     {polls.map((p, i) => (
        //       <div key={i} className="sv-card mb-3 p-3">
        //         <div className="d-flex gap-3 align-items-start text-start">
        //           <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f1f5f9", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
        //           <div className="flex-grow-1">
        //             <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
        //               <span style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</span>
        //               <Badge label={`● ${p.status}`} c={p.sc} />
        //             </div>
        //             <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
        //               {p.id} • {p.meta}
        //               {p.ends && <> • <span style={{ color: p.endRed ? "var(--danger)" : "var(--muted)", fontWeight: p.endRed ? 600 : 400 }}>{p.ends}</span></>}
        //             </div>
        //             <div className="d-flex gap-1 flex-wrap mb-2">
        //               {p.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 4, background: "#f8fafc", color: "var(--muted)" }}>{t}</span>)}
        //             </div>
        //             {p.pct !== undefined && (
        //               <>
        //                 <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
        //                   <span style={{ fontWeight: 600 }}>{p.pct}% Participation</span>
        //                   <span className="tx-muted">{p.votes} Votes</span>
        //                 </div>
        //                 <Prog pct={p.pct} color={p.pct > 50 ? "var(--success)" : "var(--accent)"} />
        //               </>
        //             )}
        //             {p.result && (
        //               <>
        //                 <div style={{ fontSize: 12, marginBottom: 4 }}>Result: <span className="tx-success" style={{ fontWeight: 600 }}>Yes (65%)</span> vs No (35%) &nbsp;<span className="tx-muted">{p.votes}</span></div>
        //                 <Prog pct={65} color="var(--accent)" />
        //               </>
        //             )}
        //           </div>
        //           <div className="d-flex gap-2 align-items-center flex-shrink-0">
        //             {p.status !== "Scheduled" && <button className="btn-ol py-1 px-3" style={{ fontSize: 12 }}>{p.status === "Closed" ? "View Report" : "Analytics"}</button>}
        //             {p.status === "Scheduled" && <button className="btn-ol py-1 px-3" style={{ fontSize: 12 }}>Edit</button>}
        //             <span className="tx-muted" style={{ cursor: "pointer" }}>⋮</span>
        //           </div>
        //         </div>
        //       </div>
        //     ))}
        //   </div>

        //   <div className="col-12 col-lg-4">
        //     <div className="sv-card mb-3">
        //       <h6 style={{ fontWeight: 700, marginBottom: 12 }}>🗳 Voting Overview</h6>
        //       <div className="row g-0 text-center">
        //         {[["2", "Active Polls", ""], ["85%", "Avg Turnout", ""], ["12", "Total Polls (YTD)", ""], ["98%", "Digital Adoption", "tx-success"]].map(([v, l, cls], i) => (
        //           <div key={l} className="col-6 py-3" style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
        //             <div className={cls} style={{ fontWeight: 800, fontSize: 22 }}>{v}</div>
        //             <div style={{ fontSize: 11, color: "var(--muted)" }}>{l}</div>
        //           </div>
        //         ))}
        //       </div>
        //     </div>

        //     <div className="sv-card mb-3">
        //       <h6 style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Quick Create</h6>
        //       {[["👥", "AGM Voting", "One vote per flat"], ["🔧", "Swimming Pool Rules", "Financial approval"], ["⚖️", "Rule Change", "Amend by-laws"]].map(([ic, lb, sub]) => (
        //         <button key={lb} className="qa mb-2">
        //           <div className="qa-ico" style={{ background: "#f1f5f9" }}>{ic}</div>
        //           <div>
        //             <div style={{ fontWeight: 600, fontSize: 13 }}>{lb}</div>
        //             <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
        //           </div>
        //         </button>
        //       ))}
        //     </div>

        //     <div className="sv-card">
        //       <h6 style={{ fontWeight: 700, marginBottom: 12 }}>🗓 Upcoming Events</h6>
        //       {[["15", "Nov", "Committee Election", "Nominations close in 2 days"], ["01", "Dec", "Vendor Contract Renewal", "Security & Housekeeping"]].map(([d, m, t, s]) => (
        //         <div key={t} className="d-flex gap-3 align-items-center mb-3">
        //           <div style={{ background: "var(--accent-lt)", color: "var(--accent)", fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "6px 10px", textAlign: "center", minWidth: 44 }}>
        //             {d}<br />{m}
        //           </div>
        //           <div className='text-start'>
        //             <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
        //             <div style={{ fontSize: 11, color: "var(--muted)" }}>{s}</div>
        //           </div>
        //         </div>
        //       ))}
        //       <button className="btn-dk w-100">Show all upcoming events</button>
        //     </div>
        //   </div>
        // </div>
        <div className="pg row g-4 pl-wrap">

            {/* LEFT */}
            <div className="col-12 col-lg-8">

                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center ">

                    {/* <div className="tab-pills" >
                        {["Active", "Scheduled", "Closed", "Drafts"].map(t => (
                            <button
                                // style={{ background: "#fff" }}
                                key={t}
                                className={`tab-pill  ${tab === t ? "t-dark" : ""}`}
                                onClick={() => setTab(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div> */}
                    <div className="PollsTabs"
                    >
                        {["Active", "Scheduled", "Closed", "Drafts"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`PollsTabs-btn ${tab === t ? "active" : ""}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <input className="sv-in ms-auto pl-search" placeholder="Search polls…" />

                    <button className="btn-ac">+ Create Poll</button>
                </div>

                {polls.map((p, i) => (
                    <div key={i} className="sv-card mb-3 p-3">

                        <div className="d-flex gap-3 align-items-start text-start">

                            <div className="pl-icon">
                                {p.icon}
                            </div>

                            <div className="flex-grow-1">

                                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                    <span className="pl-title">{p.title}</span>
                                    <Badge label={`● ${p.status}`} c={p.sc} />
                                </div>

                                <div className="pl-meta">
                                    {p.id} • {p.meta}
                                    {p.ends && (
                                        <> • <span className={`pl-ends ${p.endRed ? "red" : ""}`}>{p.ends}</span></>
                                    )}
                                </div>

                                <div className="d-flex gap-1 flex-wrap mb-2">
                                    {p.tags.map(t => (
                                        <span key={t} className="pl-tag">{t}</span>
                                    ))}
                                </div>

                                {p.pct !== undefined && (
                                    <>
                                        <div className="d-flex justify-content-between mb-1 pl-progress-text">
                                            <span className="pl-pct">{p.pct}% Participation</span>
                                            <span className="tx-muted">{p.votes} Votes</span>
                                        </div>

                                        <Prog pct={p.pct} color={p.pct > 50 ? "var(--success)" : "var(--accent)"} />
                                    </>
                                )}

                                {p.result && (
                                    <>
                                        <div className="pl-result">
                                            Result: <span className="tx-success pl-result-val">Yes (65%)</span> vs No (35%)
                                            &nbsp;<span className="tx-muted">{p.votes}</span>
                                        </div>

                                        <Prog pct={65} color="var(--accent)" />
                                    </>
                                )}

                            </div>

                            <div className="d-flex gap-2 align-items-center flex-shrink-0">

                                {p.status !== "Scheduled" && (
                                    <button className="btn-ol py-1 px-3 pl-btn-sm">
                                        {p.status === "Closed" ? "View Report" : "Analytics"}
                                    </button>
                                )}

                                {p.status === "Scheduled" && (
                                    <button className="btn-ol py-1 px-3 pl-btn-sm">
                                        Edit
                                    </button>
                                )}

                                <span className="tx-muted pl-menu">⋮</span>

                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Voting Overview */}
                <div className="sv-card mb-3">
                    <h6 className="pl-side-title">🗳 Voting Overview</h6>

                    <div className="row g-0 text-center">
                        {[["2", "Active Polls", ""], ["85%", "Avg Turnout", ""], ["12", "Total Polls (YTD)", ""], ["98%", "Digital Adoption", "tx-success"]]
                            .map(([v, l, cls], i) => (
                                <div
                                    key={l}
                                    className={`col-6 py-3 pl-stat ${cls} ${i < 2 ? "pl-bb" : ""} ${i % 2 === 0 ? "pl-br" : ""}`}
                                >
                                    <div className="pl-stat-val">{v}</div>
                                    <div className="pl-stat-label">{l}</div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Quick Create */}
                <div className="sv-card mb-3">
                    <h6 className="pl-side-title">⚡ Quick Create</h6>

                    {[["👥", "AGM Voting", "One vote per flat"], ["🔧", "Swimming Pool Rules", "Financial approval"], ["⚖️", "Rule Change", "Amend by-laws"]]
                        .map(([ic, lb, sub]) => (
                            <button key={lb} className="qa mb-2">

                                <div className="qa-ico pl-qa-ico">{ic}</div>

                                <div>
                                    <div className="pl-qa-title">{lb}</div>
                                    <div className="pl-qa-sub">{sub}</div>
                                </div>

                            </button>
                        ))}
                </div>

                {/* Events */}
                <div className="sv-card">
                    <h6 className="pl-side-title">🗓 Upcoming Events</h6>

                    {[["15", "Nov", "Committee Election", "Nominations close in 2 days"], ["01", "Dec", "Vendor Contract Renewal", "Security & Housekeeping"]]
                        .map(([d, m, t, s]) => (
                            <div key={t} className="d-flex gap-3 align-items-center mb-3">

                                <div className="pl-date">
                                    {d}<br />{m}
                                </div>

                                <div className="text-start">
                                    <div className="pl-event-title">{t}</div>
                                    <div className="pl-event-sub">{s}</div>
                                </div>

                            </div>
                        ))}

                    <button className="btn-dk w-100">Show all upcoming events</button>
                </div>

            </div>
        </div>
    );
}

export default Polls