import { useState, useEffect } from 'react'
import { Badge, Prog } from '../../components/Common/ReusableFunction';
import "../../styles/polls.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { deletePollApi, getPollApi, getPollOverviewApi } from '../../services/PollApi';
import { toast } from "react-toastify";
import {
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";
import { FaBalanceScale, FaSwimmingPool, FaUsers } from 'react-icons/fa';
import { BiPieChartAlt2 } from 'react-icons/bi';

const Polls = ({ setActive, setPollId }) => {
    const [tab, setTab] = useState("");
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [allPolls, setAllPolls] = useState([])
    const [pollsOverview, setPollsOverview] = useState({})
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "All", value: "" },
        { id: "Active", value: "ACTIVE" },
        { id: "Upcoming", value: "UPCOMING" },
        { id: "Expired", value: "EXPIRED" },
    ];

    const getPollStatusIcon = (status) => {
        switch (status) {
            case "ACTIVE":
                return {
                    icon: <FiCheckCircle size={18} color="#16a34a" />,
                    bg: "#dcfce7",
                };

            case "UPCOMING":
                return {
                    icon: <FiClock size={18} color="#f59e0b" />,
                    bg: "#fef3c7",
                };

            case "EXPIRED":
                return {
                    icon: <FiXCircle size={18} color="#ef4444" />,
                    bg: "#fee2e2",
                };

            default:
                return {
                    icon: <FiClock size={18} color="#6b7280" />,
                    bg: "#f3f4f6",
                };
        }
    };
    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //function for session data
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)
        GetPollsData(flats.society_id, data.data.user_id)
        GetPollsOverview(flats.society_id)
    }

    //function for get polls data
    const GetPollsData = async (societyId, userId) => {
        try {
            const data = await getPollApi(societyId, userId)
            setAllPolls(data)
        } catch (error) {
            console.error("Error fetching polls:", error)
        }
    }

    //get polls overview function
    const GetPollsOverview = async (societyId) => {
        const data = await getPollOverviewApi(societyId)
        setPollsOverview(data)
    }

    //statusdata for count
    const statsData = [
        [pollsOverview.active_polls || "", "Active Polls", ""],
        [`${Math.round(pollsOverview.avg_turnout_percent || " " * 100)}%`, "Avg Turnout", ""],
        [pollsOverview.total_polls || "", "Total Polls (YTD)", ""],
        [`${Math.round(pollsOverview.digital_adoption_percent)}%` | "", "Digital Adoption", "tx-success"]
    ];


    const getPollById = (pollId) => {
        setActive("createPoll")
        setPollId(pollId)
    }
    
    const deletePoll = async (pollId) => {
        try {
            const data = await deletePollApi(pollId)
            console.log(data)
            toast.success("Poll deleted successfully!")
            GetPollsData(societyId, userId)
        } catch (error) {
            console.log(error)
        }
    }

    const totalUsers = 300; // ⚠️ replace with API value if available

    // 👉 total votes from options
    const getTotalVotes = (options) => {
        return options.reduce((sum, o) => sum + o.votes, 0);
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const startDate = new Date(dateString);

        const diffMs = now - startDate;

        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    };

    // Filter by status + search title
    const filteredData = allPolls.filter((item) => {
        const statusMatch =
            tab === "" || item.status === tab;

        const searchMatch =
            search === "" ||
            item.question?.toLowerCase().includes(search.toLowerCase());

        return statusMatch && searchMatch;
    });
    return (
        <div className="pg row g-4 pl-wrap">

            {/* LEFT */}
            <div className="col-12 col-lg-8">

                <div className="d-flex gap-2 flex-wrap mb-3 align-items-center ">
                    <div className="PollsTabs"
                    >
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.value)}
                                className={`PollsTabs-btn ${tab === t.value ? "active" : ""}`}
                            >
                                {t.id}

                            </button>
                        ))}
                    </div>
                    <input className="sv-in ms-auto pl-search" placeholder="Search polls…" value={search}
                        onChange={(e) => setSearch(e.target.value)} />

                    <button className="btn-ac" onClick={() => setActive("createPoll")}>+ Create Poll</button>
                </div>

                {filteredData.map((p, i) => {

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
                    const startedAgo = p.start_datetime
                        ? getTimeAgo(p.start_datetime)
                        : "";
                    const pollStatus = getPollStatusIcon(p.status);
                    return (
                        <div key={i} className="sv-card mb-3 p-3">

                            <div className="d-flex gap-3 align-items-start text-start">

                                <div
                                    className="pl-icon"
                                    style={{ background: pollStatus.bg }}
                                >
                                    {pollStatus.icon}
                                </div>

                                <div className="flex-grow-1">

                                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                        <span className="pl-title">{p.question}</span>
                                        <Badge label={`● ${p.status}`}
                                            c={p.status === "ACTIVE" ? "green"
                                                : p.status === "UPCOMING" ? "orange"
                                                    : p.status === "EXPIRED" ? "red"
                                                        : "gray"}
                                        />
                                    </div>
                                    <div className="pl-meta">
                                        #POLL-2024-004 • Started: {startedAgo}
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
                                                {/* Result: <span className="tx-success pl-result-val">Yes (65%)</span> vs No (35%) */}
                                                Result:{" "}

                                                <span className="tx-success pl-result-val">
                                                    {p.options.map((t, index) => (
                                                        <span key={index}>
                                                            {t.text} ({t.votes}%)
                                                        </span>
                                                    ))}
                                                </span>

                                                &nbsp;

                                                <span className="tx-muted">
                                                    {p.totalVotes}
                                                </span>
                                            </div>

                                            <Prog
                                                pct={p.totalVotes || 0}
                                                color="var(--accent)"
                                            />
                                        </>
                                    )}

                                </div>

                                <div className="d-flex gap-2 align-items-center flex-shrink-0">

                                    {p.status !== "Scheduled" && (
                                        <button className="btn-ol py-1 px-3 pl-btn-sm">
                                            {p.status === "EXPIRED" ? "View Report" : "Analytics"}
                                        </button>
                                    )}

                                    {p.status === "Scheduled" && (
                                        <button className="btn-ol py-1 px-3 pl-btn-sm">
                                            Edit
                                        </button>
                                    )}

                                    {/* <span className="tx-muted pl-menu">⋮</span> */}

                                    <div className="member-action-dropdown dropdown">
                                        <button
                                            className="member-action-btn"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            ⋮
                                        </button>

                                        <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item"
                                                    onClick={() => {
                                                        getPollById(p.poll_id);
                                                    }}
                                                >
                                                    Edit Poll
                                                </button>
                                            </li>

                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>

                                            <li>
                                                <button
                                                    className="dropdown-item member-action-item member-action-delete"
                                                    onClick={() => deletePoll(p.poll_id)}
                                                >
                                                    Delete Poll
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                })}

            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Voting Overview */}
                {/* <div className="pl-overview-card mb-3">
                    <h6 className="pl-side-title text-start">🗳 Voting Overview</h6>

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
                </div> */}
                <div className="pl-overview-card mb-3">
                    <h6 className="pl-side-title text-start">
                        <BiPieChartAlt2 className="me-2 text-primary" />
                        Voting Overview
                    </h6>

                    <div className="row g-0 text-center">
                        {statsData.map(([v, l, cls], i) => (
                            <div
                                key={l}
                                className={`col-6 py-3 pl-stat ${cls}
        ${i < 2 ? "pl-bb" : ""}
        ${i % 2 === 0 ? "pl-br" : ""}`}
                            >
                                <div className="pl-stat-val">{v}</div>
                                <div className="pl-stat-label">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Quick Create */}
                <div className=" mb-3">
                    <h6 className="pl-side-title text-start">⚡ Quick Create</h6>

                    {[[<FaUsers className='text-primary' />, "AGM Voting", "One vote per flat"], [<FaSwimmingPool className='text-success' />, "Swimming Pool Rules", "Financial approval"], [<FaBalanceScale style={{ color: "orange" }} />, "Rule Change", "Amend by-laws"]]
                        .map(([ic, lb, sub]) => (
                            <button key={lb} className="qa mb-2">

                                <div className="qa-ico pl-qa-ico rounded-circle">{ic}</div>

                                <div>
                                    <div className="pl-qa-title">{lb}</div>
                                    <div className="pl-qa-sub">{sub}</div>
                                </div>

                            </button>
                        ))}
                </div>

                {/* Events */}
                <div className="sv-card">
                    <h6 className="pl-side-title text-start">🗓 Upcoming Events</h6>

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