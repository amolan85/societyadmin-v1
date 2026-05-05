import React, { useState, useEffect } from 'react'
import { Badge, Prog } from '../../components/Common/ReusableFunction';
import "../../styles/polls.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { getPollApi, getPollOverviewApi } from '../../services/PollApi';

const Polls = ({ setActive }) => {
    const [tab, setTab] = useState("Active");
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [allPolls, setAllPolls] = useState([])
    const [pollsOverview, setPollsOverview] = useState({})
    // const polls = [
    //     { icon: "📊", title: "AGM 2025 : Approval of Annual Accounts", id: "#POLL-2024-004", meta: "Started: 2 days ago", ends: "Ends in 24h", endRed: true, tags: ["AGM Voting", "One Vote per Flat", "Secret Ballot"], status: "Live Voting", sc: "green", pct: 78, votes: "234 / 300" },
    //     { icon: "🔧", title: "Gym Equipment Upgrade Proposal", id: "#POLL-2024-005", meta: "Started: 5 hours ago", ends: "Ends in 5 days", tags: ["Infrastructure", "Per Member", "Open Ballot"], status: "Live Voting", sc: "green", pct: 12, votes: "36 / 300" },
    //     { icon: "☑", title: "Q3 Maintenance Charge Hike (10%)", id: "#POLL-2024-003", meta: "Ended: Oct 15, 2024", tags: ["Finance", "One Vote per Flat", "Approved"], status: "Closed", sc: "gray", result: true, votes: "280 Total" },
    //     { icon: "🗓", title: "Visitor Parking Policy Revision", id: "#POLL-2024-006", meta: "Starts: Nov 20, 2024 (10:00 AM)", tags: ["Rules & Regulations", "Per Member"], status: "Scheduled", sc: "orange" },
    // ];


    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)
        GetPollsData(flats.society_id, data.data.user_id)
        GetPollsOverview(flats.society_id)
    }

    const GetPollsData = async (societyId, userId) => {
        const data = await getPollApi(societyId, userId)
        setAllPolls(data)
    }

    const GetPollsOverview = async (societyId) => {
        const data = await getPollOverviewApi(societyId)
        setPollsOverview(data)
    }

    const statsData = [
        [pollsOverview.active_polls, "Active Polls", ""],
        [`${Math.round(pollsOverview.avg_turnout_percent * 100)}%`, "Avg Turnout", ""],
        [pollsOverview.total_polls, "Total Polls (YTD)", ""],
        [`${Math.round(pollsOverview.digital_adoption_percent)}%`, "Digital Adoption", "tx-success"]
    ];

    const totalUsers = 300; // ⚠️ replace with API value if available

    // 👉 total votes from options
    const getTotalVotes = (options) => {
        return options.reduce((sum, o) => sum + o.votes, 0);
    };

    return (
        <div className="pg row g-4 pl-wrap">

            {/* LEFT */}
            <div className="col-12 col-lg-8">

                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center ">
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

                    <button className="btn-ac" onClick={() => setActive("createPoll")}>+ Create Poll</button>
                </div>

                {allPolls.map((p, i) => {
                    const totalVotes = getTotalVotes(p.options);
                    let expiryLabel = "";

                    if (p.expiry_datetime) {
                        const date = new Date(p.expiry_datetime);

                        const options = { month: "short", day: "numeric" };
                        const formattedDate = date.toLocaleDateString("en-US", options);

                        const now = new Date();
                        const isExpired = date < now;

                        expiryLabel = isExpired
                            ? `Ended ${formattedDate}`
                            : `Ends ${formattedDate}`;
                    }
                    return (
                        <div key={i} className="sv-card mb-3 p-3">

                            <div className="d-flex gap-3 align-items-start text-start">

                                <div className="pl-icon">
                                    {p.icon}
                                </div>

                                <div className="flex-grow-1">

                                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                        <span className="pl-title">{p.question}</span>
                                        <Badge label={`● ${p.status}`} c={p.sc} />
                                    </div>
                                    <div className="pl-meta">
                                        #POLL-2024-004 • Started: 2 days ago
                                        {expiryLabel && (
                                            <> • <span className={`pl-ends ${"true" ? "red" : ""}`}>{expiryLabel}</span></>
                                        )}
                                    </div>

                                    <div className="d-flex gap-1 flex-wrap mb-2">
                                        {p.options.map(t => (
                                            <span key={t.id} className="pl-tag">{t.text}</span>
                                        ))}
                                    </div>

                                    {p.status === "ACTIVE" && (
                                        <>
                                            <div className="d-flex justify-content-between mb-1 pl-progress-text">
                                                <span className="pl-pct">{totalVotes}% Participation</span>
                                                <span className="tx-muted">{totalVotes}/ {p.total_votes} Votes</span>
                                            </div>
                                            <Prog pct={p.total_votes} color={totalVotes > 50 ? "var(--success)" : "var(--accent)"} />
                                        </>
                                    )}
                                    {p.status !== "ACTIVE" && (
                                        <>
                                            <div className="pl-result">
                                                Result: <span className="tx-success pl-result-val">Yes (65%)</span> vs No (35%)
                                                &nbsp;<span className="tx-muted">{p.totalVotes}</span>
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
                    )
                })}

            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Voting Overview */}
                <div className="sv-card mb-3">
                    <h6 className="pl-side-title">🗳 Voting Overview</h6>

                    <div className="row g-0 text-center">
                        {statsData.map(([v, l, cls], i) => (
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