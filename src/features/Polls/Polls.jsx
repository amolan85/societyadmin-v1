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
    FiCalendar,
    FiUsers,
    FiSearch,
    FiPlus,
} from "react-icons/fi";
import { FaBalanceScale, FaUsers, FaChartBar } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdOutlineHowToVote } from 'react-icons/md';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { BsCalendarEvent } from 'react-icons/bs';

const Polls = ({ setActive, setPollId }) => {
    const [tab, setTab] = useState("");
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [allPolls, setAllPolls] = useState([])
    const [pollsOverview, setPollsOverview] = useState({})
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedPollId, setSelectedPollId] = useState(null);
const [selectedPollTitle, setSelectedPollTitle] = useState("");
const [deleting, setDeleting] = useState(false);

    const tabs = [
        { id: "All", value: "" },
        { id: "Active", value: "ACTIVE" },
        { id: "Upcoming", value: "UPCOMING" },
        { id: "Expired", value: "EXPIRED" },
    ];

    // status -> icon / colors (matches green/red/orange pill icons in design)
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

    // badge color per status (Active = green, Upcoming = orange, Expired = red)
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "green";
            case "UPCOMING":
                return "orange";
            case "EXPIRED":
                return "red";
            default:
                return "gray";
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
            const res = await getPollApi(societyId, userId)
            console.log("GetPollsData raw response:", res)
            // Handle both cases: service returns raw API json { data: [...] }
            // OR service already unwraps and returns the array directly.
            const polls = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            setAllPolls(polls)
        } catch (error) {
            console.error("Error fetching polls:", error)
        }
    }

    //get polls overview function
    const GetPollsOverview = async (societyId) => {
        try {
            const res = await getPollOverviewApi(societyId)
            // Handle both cases: service returns raw API json { data: {...} }
            // OR service already unwraps and returns the object directly.
            const overview = res?.active_polls !== undefined ? res : (res?.data || {});
            setPollsOverview(overview)
        } catch (error) {
            console.error("Error fetching poll overview:", error)
        }
    }

    //statsData for count — order matches design: Active Polls, Avg Participation, Total Participants, Expired Polls
    // API overview only returns active_polls, avg_turnout_percent, digital_adoption_percent, total_polls
    // so total_participants & expired_polls are derived from the polls list itself
    const totalParticipants = Array.isArray(allPolls)
        ? allPolls.reduce((sum, p) => sum + (p.total_votes || 0), 0)
        : 0;

    const expiredPollsCount = Array.isArray(allPolls)
        ? allPolls.filter((p) => p.status === "EXPIRED").length
        : 0;

    const statsData = [
        [pollsOverview.active_polls ?? 0, "Active Polls", "tx-primary"],
        [`${Math.round((pollsOverview.avg_turnout_percent || 0) * 100)}%`, "Avg Participation", "tx-pink"],
        [totalParticipants, "Total Participants", "tx-warning"],
        [expiredPollsCount, "Expired Polls", "tx-success"],
    ];

    const getPollById = (pollId) => {
        setActive("createPoll")
        setPollId(pollId)
    }

    const deletePoll = (pollId, pollTitle) => {
    setSelectedPollId(pollId);
    setSelectedPollTitle(pollTitle || "");
    setShowDeleteModal(true);
};

const confirmDeletePoll = async () => {
    try {
        setDeleting(true);

        await deletePollApi(selectedPollId,societyId);

        toast.success("Poll deleted successfully!");

        setShowDeleteModal(false);

        GetPollsData(societyId, userId);
        GetPollsOverview(societyId);

    } catch (error) {
        console.log(error);
        toast.error("Failed to delete poll");
    } finally {
        setDeleting(false);
    }
};
    // 👉 total votes from options
    const getTotalVotes = (options) => {
        return options.reduce((sum, o) => sum + o.votes, 0);
    };

    // "Ends in X Days" style label used in design header row
    const getEndsInLabel = (dateString) => {
        if (!dateString) return "";
        const now = new Date();
        const end = new Date(dateString);
        const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) return `Ends in ${diffDays} Days`;
        if (diffDays === 1) return `Ends in 1 Day`;
        if (diffDays === 0) return `Ends Today`;
        return `Expired on ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    };

    const upcomingPolls = allPolls
    .filter((p) => p.status === "UPCOMING")
    .sort(
        (a, b) =>
            new Date(a.start_datetime) -
            new Date(b.start_datetime)
    )
    .slice(0, 5);

    
    // Filter by status + search title
    const filteredData = Array.isArray(allPolls)
        ? allPolls.filter((item) => {
            const statusMatch =
                tab === "" || item.status === tab;

            const searchMatch =
                search === "" ||
                item.question?.toLowerCase().includes(search.toLowerCase());

            return statusMatch && searchMatch;
        })
        : [];

    return (
        <div className="pg pl-wrap">

            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <MdOutlineHowToVote size={22} />
                <h4 className="mb-0" style={{ fontWeight: 600, fontSize: 22 }}>Public Voting</h4>
            </div>
            <p className="tx-muted" style={{ margin: "0 0 20px 0", textAlign: "left" }}>
                Create and manage polls. View voting results and participation.
            </p>

            <div className="row g-4">

                {/* LEFT */}
                <div className="col-12 col-lg-8">

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 12,
                            alignItems: "center",
                        }}
                    >
                        <div className="PollsTabs">
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

                        <div style={{ position: "relative", marginLeft: "auto" }}>
                            <FiSearch
                                size={15}
                                style={{
                                    position: "absolute",
                                    left: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                    pointerEvents: "none",
                                }}
                            />
                            <input
                                className="sv-in"
                                placeholder="Search polls..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: 34, minWidth: 220 }}
                            />
                        </div>

                        <button
                            className="btn-ac"
                            onClick={() => setActive("createPoll")}
                            style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                        >
                            <FiPlus size={16} /> Create Poll
                        </button>
                    </div>

                    {filteredData.length === 0 && (
                        <div className="sv-card p-4 text-center">
                            <p className="tx-muted mb-0">No polls Added Here.</p>
                        </div>
                    )}

                    {filteredData.map((p, i) => {

                        const totalVotes = p.total_votes || 0;
                        const pollStatus = getPollStatusIcon(p.status);
                        const endsLabel = getEndsInLabel(p.expiry_datetime);
                        const optionsCount = p.options?.length || 0;

                        return (
                            <div key={i} className="sv-card mb-3 p-3 pl-card">

                                <div className="d-flex gap-3 align-items-start text-start">

                                    <div className="pl-icon" style={{ background: pollStatus.bg }}>
                                        {pollStatus.icon}
                                    </div>

                                    <div className="flex-grow-1">

                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <span className="pl-title">{p.question}</span>
                                            <Badge
                                                label={p.status === "ACTIVE" ? "Active" : p.status === "UPCOMING" ? "Upcoming" : p.status === "EXPIRED" ? "Expired" : p.status}
                                                c={getStatusBadgeColor(p.status)}
                                            />
                                        </div>

                                        <div className="pl-meta d-flex align-items-center flex-wrap gap-3 mb-2">
                                            <span className="d-flex align-items-center gap-1">
                                                <FiCalendar size={13} /> {formatDate(p.start_datetime)}
                                            </span>
                                            {endsLabel && (
                                                <span className={`d-flex align-items-center gap-1 ${p.status === "EXPIRED" ? "tx-danger" : "tx-muted"}`}>
                                                    <FiClock size={13} /> {endsLabel}
                                                </span>
                                            )}
                                            <span className="d-flex align-items-center gap-1">
                                                <FiUsers size={13} /> {totalVotes} Participants
                                            </span>
                                        </div>

                                        {p.status !== "ACTIVE" && (
                                            <div className="pl-result mb-1">
                                                Result:{" "}
                                                {p.options.map((t, index) => (
                                                    <span key={index} className={`pl-result-val ${index === 0 ? "tx-success" : "tx-muted"}`}>
                                                        {t.text} ({t.votes}%){index < p.options.length - 1 ? " | " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="btn-ol py-1 px-3 pl-btn-sm"
                                                onClick={() => {
                                                    setPollId(p.poll_id);
                                                    setActive("pollAnalytics");
                                                }}
                                            >
                                                {p.status === "EXPIRED" ? "View Report" : "Analyze"}
                                            </button>

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
                                                            onClick={() => getPollById(p.poll_id)}
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
                                                            onClick={() => deletePoll(p.poll_id, p.question)}
                                                        >
                                                            Delete Poll
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {p.status === "ACTIVE" && (
                                            <span className="pl-options-count">{optionsCount}/5 Options</span>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )
                    })}

                </div>

                {/* RIGHT */}
                <div className="col-12 col-lg-4">

                    {/* Voting Overview */}
                    <div className="pl-overview-card mb-3">
                        <h6 className="pl-side-title text-start">
                            <BiTime className="me-2 text-primary" size={18} />
                            Voting Overview
                        </h6>

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

                    {/* Quick Actions */}
                    <div className="sv-card mb-3">
                        <h6 className="pl-side-title text-start">
                            <HiOutlineLightningBolt className="me-2 text-warning" size={18} />
                            Quick Actions
                        </h6>

                        {[
    [
        <FaUsers className="text-primary" />,
        "Add New Poll",
        "Create a new public poll",
        () => {
            setPollId("");
            setActive("createPoll");
        },
    ],

    [
        <FaChartBar className="text-success" />,
        "Voting Reports",
        "View poll analytics",
        () => {
    if (allPolls.length > 0) {
        setPollId(allPolls[0].poll_id);
        setActive("pollAnalytics");
    }
}
    ],

    [
        <FaBalanceScale style={{ color: "orange" }} />,
        "Upcoming Polls",
        "View scheduled polls",
        () => {
            setTab("UPCOMING");
        },
    ],
].map(([ic, lb, sub, onClick]) => (
                            <button key={lb} className="qa mb-2" onClick={onClick || undefined}>
                                <div className="qa-ico pl-qa-ico rounded-circle">{ic}</div>
                                <div>
                                    <div className="pl-qa-title">{lb}</div>
                                    <div className="pl-qa-sub">{sub}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                   <div className="sv-card">

    <h6 className="pl-side-title text-start">
        <BsCalendarEvent className="me-2 text-primary" size={16} />
        Upcoming Polls
    </h6>

    {upcomingPolls.length === 0 ? (

        <div className="text-center py-3 text-muted">
            No Upcoming Polls
        </div>

    ) : (

        upcomingPolls.map((poll) => {

            const date = new Date(poll.start_datetime);

            return (

                <div
                    key={poll.poll_id}
                    className="d-flex gap-3 align-items-center mb-3"
                >

                    <div className="pl-date">
                        {date.toLocaleDateString("en-US", {
                            day: "2-digit",
                        })}
                        <br />
                        {date.toLocaleDateString("en-US", {
                            month: "short",
                        })}
                    </div>

                    <div className="text-start flex-grow-1">

                        <div className="pl-event-title">
                            {poll.question}
                        </div>

                        <div className="pl-event-sub">
                            Starts on {formatDate(poll.start_datetime)}
                        </div>

                    </div>

                    <Badge
                        label="Upcoming"
                        c="orange"
                    />

                </div>

            );
        })

    )}

    <button
        className="btn-dk w-100"
        onClick={() => setActive("upcomingEvents")}
    >
        Show All Upcoming Polls
    </button>

</div>

                </div>
                <div
    className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title">
                    Confirm Delete
                </h5>

                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                />
            </div>

            <div className="modal-body text-start">

                <p className="mb-0">
                    Are you sure you want to delete{" "}
                    <strong>
                        {selectedPollTitle
                            ? `"${selectedPollTitle}"`
                            : "this poll"}
                    </strong>
                    ?
                </p>

            </div>

            <div className="modal-footer">

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDeletePoll}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>

            </div>

        </div>
    </div>
</div>
            </div>
        </div>
    );
}

export default Polls
