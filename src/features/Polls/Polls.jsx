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
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPollId, setSelectedPollId] = useState(null);
    const [selectedPollTitle, setSelectedPollTitle] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [analytics, setAnalytics] = useState({
        total: 0,
        active: 0,
        upcoming: 0,
        closed: 0,
    });

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText, setSearchText] = useState("");

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

    useEffect(() => {

        const timer = setTimeout(() => {
            setSearch(searchText);
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);

    }, [searchText]);

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
        //GetPollsData(flats.society_id,data.data.user_id,1,search,tab);
    }


    useEffect(() => {

        if (!societyId) return;

        GetPollsData(societyId, userId, page, search, tab);

    }, [societyId, userId, page, search, tab]);


    //function for get polls data
    const GetPollsData = async (
    societyId,
    userId,
    pageNo = 1,
    searchText = "",
    status = ""
) => {

    try {

       const data = await getPollApi(
    societyId,
    userId,
    status,
    "",
    searchText,
    "",
    "",
    pageNo,
    pageSize
);

setAllPolls(data || []);

const analytics = {
    active: data.filter(x => x.status === "ACTIVE").length,
    upcoming: data.filter(x => x.status === "UPCOMING").length,
    closed: data.filter(x => x.status === "EXPIRED").length,
    total: data.length
};

setAnalytics(analytics);

setTotalRecords(data.length);
setTotalPages(1);

    } catch (err) {
        console.log(err);
    }
};

    //statsData for count — order matches design: Active Polls, Avg Participation, Total Participants, Expired Polls
    // API overview only returns active_polls, avg_turnout_percent, digital_adoption_percent, total_polls
    // so total_participants & expired_polls are derived from the polls list itself
    const totalParticipants = allPolls.reduce(
        (sum, poll) => sum + Number(poll.total_votes || 0),
        0
    );

    const statsData = [

        [
            analytics.active || 0,
            "Active Polls",
            "tx-primary"
        ],

        [
            analytics.upcoming || 0,
            "Upcoming Polls",
            "tx-pink"
        ],

        [
            totalParticipants,
            "Total Participants",
            "tx-warning"
        ],

        [
            analytics.closed || 0,
            "Closed Polls",
            "tx-success"
        ],

    ];

    // ── always clears pollId before navigating to a fresh "create" form,
    // so CreatePoll never inherits a stale id from a previous edit ──
    const goToCreatePoll = () => {
        setPollId("");
        setActive("createPoll");
    };

    const getPollById = (pollId) => {
        setPollId(pollId);
        setActive("createPoll")
    }

    const deletePoll = (pollId, pollTitle) => {
        setSelectedPollId(pollId);
        setSelectedPollTitle(pollTitle || "");
        setShowDeleteModal(true);
    };

    const confirmDeletePoll = async () => {
        try {
            setDeleting(true);

            await deletePollApi(selectedPollId, societyId);

            toast.success("Poll deleted successfully!");

            setShowDeleteModal(false);

            GetPollsData(societyId, userId);


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
    const filteredData = allPolls;

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
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-ac"
                            onClick={goToCreatePoll}
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
                                goToCreatePoll,
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
