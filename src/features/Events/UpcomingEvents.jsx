import { useState, useEffect, useMemo } from 'react'
import "../../styles/polls.css"
import {
    FiPlus,
    FiSearch,
    FiCalendar,
    FiClock,
    FiEye,
    FiRefreshCw,
    FiArrowLeft,
} from "react-icons/fi";
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BsCalendarEvent } from 'react-icons/bs';
import { PiConfettiBold } from 'react-icons/pi';
import { FaRegClipboard } from 'react-icons/fa';
import { GetSessionData } from '../../utils/SessionManagement';
import { deletePollApi, getPollApi } from '../../services/PollApi';
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

const UpcomingEvents = ({ setActive, setPollId }) => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [allPolls, setAllPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            const flats = data.data.flats[0];
            setSocietyId(flats.society_id);
            setUserId(data.data.user_id);
            GetPollsData(flats.society_id, data.data.user_id);
        } catch (error) {
            console.log(error);
        }
    };

    const GetPollsData = async (sid, uid) => {
    try {
        setLoading(true);

        const res = await getPollApi(
            sid,
            uid,
            "upcoming",   // fetch only upcoming polls
            "",
            "",
            "",
            "",
            1,
            100
        );

        const polls = Array.isArray(res?.list)
            ? res.list
            : [];

        setAllPolls(polls);

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    const deletePoll = async (pollId) => {
        const confirmed = window.confirm("Are you sure you want to cancel this event?");
        if (!confirmed) return;

        try {
            await deletePollApi(pollId, societyId);
            toast.success("Event cancelled successfully!");
            GetPollsData(societyId, userId);
        } catch (error) {
            console.log(error);
            toast.error("Failed to cancel event");
        }
    };

    // Only polls with status === "UPCOMING" belong on this page
   const upcomingPolls = allPolls;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const getDayMonth = (dateString) => {
        if (!dateString) return { day: "--", month: "" };
        const date = new Date(dateString);
        return {
            day: String(date.getDate()).padStart(2, "0"),
            month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        };
    };

    const getStartsInLabel = (dateString) => {
        if (!dateString) return "";
        const now = new Date();
        const start = new Date(dateString);
        const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) return `Starts in ${diffDays} Days`;
        if (diffDays === 1) return `Starts Tomorrow`;
        if (diffDays === 0) return `Starts Today`;
        return `Started on ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    };

    const filtered = useMemo(() => {
        return upcomingPolls.filter((p) => {
            const searchMatch =
                search === "" ||
                p.question?.toLowerCase().includes(search.toLowerCase());

            const startDate = p.start_datetime ? new Date(p.start_datetime) : null;
            const fromMatch = !dateFrom || (startDate && startDate >= new Date(dateFrom));
            const toMatch = !dateTo || (startDate && startDate <= new Date(dateTo + "T23:59:59"));

            return searchMatch && fromMatch && toMatch;
        }).sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
    }, [upcomingPolls, search, dateFrom, dateTo]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleReset = () => {
        setDateFrom("");
        setDateTo("");
        setSearch("");
        setPage(1);
    };

    // ── STATS — all derived from the real upcoming polls list ──
    const totalUpcoming = upcomingPolls.length;

    const thisMonthCount = upcomingPolls.filter((p) => {
        if (!p.start_datetime) return false;
        const d = new Date(p.start_datetime);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const nextEvent = [...upcomingPolls].sort(
        (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
    )[0];

    const totalParticipants = upcomingPolls.reduce((sum, p) => sum + (p.total_votes || 0), 0);

    return (
        <div className="pg pl-wrap">

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 24,
                }}
            >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div
                        style={{
                            background: "#dbeafe",
                            borderRadius: 10,
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <BsCalendarEvent size={20} color="#2563eb" />
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <h4 className="mb-0" style={{ fontWeight: 600, fontSize: 22 }}>
                            Upcoming Events
                        </h4>
                        <p className="tx-muted mb-0" style={{ fontSize: 13 }}>
                            View and manage all upcoming polls and activities.
                        </p>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn-ol"
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        onClick={() => setActive && setActive("polls")}
                    >
                        <FiArrowLeft size={16} /> Back
                    </button>
                    <button
                        className="btn-ac"
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        onClick={() => setActive && setActive("createPoll")}
                    >
                        <FiPlus size={16} /> Create Poll
                    </button>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div style={{ background: "#dbeafe", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FiCalendar size={20} color="#2563eb" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>Total Upcoming Events</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{totalUpcoming}</div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>All scheduled events</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div style={{ background: "#dcfce7", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <HiOutlineUserGroup size={20} color="#16a34a" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>This Month</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{thisMonthCount}</div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>Events this month</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div style={{ background: "#f3e8ff", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <PiConfettiBold size={20} color="#9333ea" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>Next Event</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>
                                {nextEvent ? formatDate(nextEvent.start_datetime) : "—"}
                            </div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>
                                {nextEvent ? nextEvent.question : "No upcoming events"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div style={{ background: "#fef3c7", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FaRegClipboard size={18} color="#d97706" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>Total Participants</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{totalParticipants}</div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>Across all events</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="sv-card p-3 mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-3 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Date From</label>
                        <input
                            type="date"
                            className="sv-in w-100"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                        />
                    </div>

                    <div className="col-12 col-md-3 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Date To</label>
                        <input
                            type="date"
                            className="sv-in w-100"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <div style={{ position: "relative" }}>
                            <FiSearch
                                size={15}
                                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                            />
                            <input
                                className="sv-in w-100"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                style={{ paddingLeft: 34 }}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-2 d-flex gap-2">
                        <button className="btn-ac flex-grow-1" onClick={() => setPage(1)}>
                            <FiSearch size={14} />
                        </button>
                        <button className="btn-ol flex-grow-1" onClick={handleReset} title="Reset filters">
                            <FiRefreshCw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="sv-card p-0" style={{ overflowX: "auto" }}>
                <table className="w-100" style={{ borderCollapse: "collapse", minWidth: 800 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eef0f3" }}>
                            {["Event Details", "Start Date & Time", "Ends", "Participants", "Actions"].map((h) => (
                                <th
                                    key={h}
                                    className="text-start tx-muted"
                                    style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center tx-muted" style={{ padding: 32 }}>
                                    Loading events...
                                </td>
                            </tr>
                        ) : paged.map((p) => {
                            const { day, month } = getDayMonth(p.start_datetime);
                            const optionsCount = p.options?.length || 0;
                            return (
                                <tr key={p.poll_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div className="d-flex gap-3 align-items-start text-start">
                                            <div
                                                style={{
                                                    background: "#eef2ff",
                                                    borderRadius: 8,
                                                    width: 46,
                                                    textAlign: "center",
                                                    padding: "4px 0",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <div style={{ fontWeight: 700, fontSize: 15, color: "#4338ca" }}>{day}</div>
                                                <div style={{ fontSize: 10, color: "#6366f1" }}>{month}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.question}</div>
                                                <div className="tx-muted" style={{ fontSize: 12 }}>{optionsCount} options</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px", textAlign: "left" }}>
                                        <div className="d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                                            <FiCalendar size={12} /> {formatDate(p.start_datetime)}
                                        </div>
                                        <div className="d-flex align-items-center gap-1 tx-muted" style={{ fontSize: 12 }}>
                                            <FiClock size={12} /> {formatTime(p.start_datetime)}
                                        </div>
                                        <div className="tx-muted" style={{ fontSize: 11, marginTop: 2 }}>
                                            {getStartsInLabel(p.start_datetime)}
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px", textAlign: "left" }}>
                                        <div style={{ fontSize: 13 }}>{formatDate(p.end_datetime)}</div>
                                        <div className="tx-muted" style={{ fontSize: 12 }}>{formatTime(p.end_datetime)}</div>
                                    </td>

                                    <td style={{ padding: "14px 16px" }}>
                                        <div className="d-flex align-items-center gap-1" style={{ fontSize: 13, fontWeight: 600 }}>
                                            <HiOutlineUserGroup size={14} /> {p.total_votes || 0}
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px" }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="btn-ol"
                                                style={{ padding: "4px 8px" }}
                                                title="View details"
                                                onClick={() => {
                                                    if (setPollId) setPollId(p.poll_id);
                                                    setActive && setActive("pollAnalytics");
                                                }}
                                            >
                                                <FiEye size={14} />
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
                                                            onClick={() => {
                                                                if (setPollId) setPollId(p.poll_id);
                                                                setActive && setActive("createPoll");
                                                            }}
                                                        >
                                                            Edit Event
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => deletePoll(p.poll_id)}
                                                        >
                                                            Cancel Event
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {!loading && paged.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center tx-muted" style={{ padding: 32 }}>
                                    No upcoming events match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div
                    className="d-flex justify-content-between align-items-center flex-wrap gap-2"
                    style={{ padding: "14px 16px", borderTop: "1px solid #f3f4f6" }}
                >
                    <span className="tx-muted" style={{ fontSize: 13 }}>
                        Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
                        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} events
                    </span>

                    <div className="d-flex align-items-center gap-1">
                        <button
                            className="btn-ol"
                            style={{ padding: "4px 10px" }}
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={n === page ? "btn-ac" : "btn-ol"}
                                style={{ padding: "4px 10px", minWidth: 32 }}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            className="btn-ol"
                            style={{ padding: "4px 10px" }}
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingEvents;