import { useState, useMemo } from 'react'
import "../../styles/polls.css"
import {
    FiPlus,
    FiSearch,
    FiCalendar,
    FiClock,
    FiMapPin,
    FiEye,
    FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BsCalendarEvent } from 'react-icons/bs';
import { PiConfettiBold } from 'react-icons/pi';
import { FaRegClipboard } from 'react-icons/fa';

// ---- TEMPORARY HARDCODED DATA (replace with real API once endpoint is ready) ----
const MOCK_EVENTS = [
    {
        id: 1,
        day: "05",
        month: "JUL",
        title: "Independence Day Celebration",
        description: "Flag hoisting ceremony and cultural program",
        organizer: "Society Committee",
        type: "National Event",
        date: "05 Jul 2026",
        time: "8:00 AM - 12:00 PM",
        venueLine1: "Society Clubhouse",
        venueLine2: "Main Ground",
        participants: 120,
        expected: 200,
        status: "Upcoming",
    },
    {
        id: 2,
        day: "12",
        month: "JUL",
        title: "Tree Plantation Drive",
        description: "Let's make our society greener together",
        organizer: "Environment Team",
        type: "Environment",
        date: "12 Jul 2026",
        time: "7:00 AM - 10:00 AM",
        venueLine1: "Society Garden",
        venueLine2: "Near Gate 2",
        participants: 75,
        expected: 100,
        status: "Upcoming",
    },
    {
        id: 3,
        day: "19",
        month: "JUL",
        title: "Society Annual General Meeting",
        description: "Annual review and future planning discussion",
        organizer: "Management Committee",
        type: "Meeting",
        date: "19 Jul 2026",
        time: "4:00 PM - 6:00 PM",
        venueLine1: "Community Hall",
        venueLine2: "2nd Floor",
        participants: 80,
        expected: 150,
        status: "Upcoming",
    },
    {
        id: 4,
        day: "26",
        month: "JUL",
        title: "Children's Talent Show",
        description: "Showcase amazing talents of our little stars",
        organizer: "Cultural Committee",
        type: "Cultural",
        date: "26 Jul 2026",
        time: "5:00 PM - 8:00 PM",
        venueLine1: "Society Amphitheater",
        venueLine2: "Open Air Stage",
        participants: 45,
        expected: 80,
        status: "Upcoming",
    },
    {
        id: 5,
        day: "02",
        month: "AUG",
        title: "Senior Citizens Health Checkup",
        description: "Free health checkup for senior members",
        organizer: "Health Committee",
        type: "Health",
        date: "02 Aug 2026",
        time: "9:00 AM - 1:00 PM",
        venueLine1: "Community Hall",
        venueLine2: "1st Floor",
        participants: 60,
        expected: 100,
        status: "Upcoming",
    },
    {
        id: 6,
        day: "09",
        month: "AUG",
        title: "Independence Day Sports Meet",
        description: "Friendly sports competition for all age groups",
        organizer: "Sports Committee",
        type: "National Event",
        date: "09 Aug 2026",
        time: "6:00 AM - 11:00 AM",
        venueLine1: "Society Playground",
        venueLine2: "Main Ground",
        participants: 30,
        expected: 150,
        status: "Upcoming",
    },
    {
        id: 7,
        day: "15",
        month: "AUG",
        title: "Ganesh Chaturthi Celebration",
        description: "Community pooja and cultural celebration",
        organizer: "Cultural Committee",
        type: "Cultural",
        date: "15 Aug 2026",
        time: "10:00 AM - 9:00 PM",
        venueLine1: "Society Clubhouse",
        venueLine2: "Main Hall",
        participants: 10,
        expected: 300,
        status: "Upcoming",
    },
    {
        id: 8,
        day: "22",
        month: "AUG",
        title: "Fire Safety Drill",
        description: "Mandatory fire safety awareness and evacuation drill",
        organizer: "Management Committee",
        type: "Meeting",
        date: "22 Aug 2026",
        time: "11:00 AM - 12:30 PM",
        venueLine1: "Entire Society",
        venueLine2: "All Towers",
        participants: 5,
        expected: 250,
        status: "Upcoming",
    },
];
// -----------------------------------------------------------------------------

const TYPE_COLORS = {
    "National Event": { bg: "#dbeafe", color: "#1d4ed8" },
    "Environment": { bg: "#dcfce7", color: "#16a34a" },
    "Meeting": { bg: "#fee2e2", color: "#dc2626" },
    "Cultural": { bg: "#f3e8ff", color: "#9333ea" },
    "Health": { bg: "#cffafe", color: "#0891b2" },
};

const PAGE_SIZE = 5;

const UpcomingEvents = ({ setActive }) => {
    const [eventType, setEventType] = useState("All Types");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [status, setStatus] = useState("All Status");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const eventTypes = ["All Types", ...new Set(MOCK_EVENTS.map((e) => e.type))];
    const statuses = ["All Status", "Upcoming", "Ongoing", "Completed", "Cancelled"];

    const filtered = useMemo(() => {
        return MOCK_EVENTS.filter((e) => {
            const typeMatch = eventType === "All Types" || e.type === eventType;
            const statusMatch = status === "All Status" || e.status === status;
            const searchMatch =
                search === "" ||
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase());
            return typeMatch && statusMatch && searchMatch;
        });
    }, [eventType, status, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleReset = () => {
        setEventType("All Types");
        setDateFrom("");
        setDateTo("");
        setStatus("All Status");
        setSearch("");
        setPage(1);
    };

    const totalUpcoming = MOCK_EVENTS.length;
    const thisMonthCount = MOCK_EVENTS.filter((e) => e.month === "JUL").length;
    const nextEvent = MOCK_EVENTS[0];
    const totalParticipants = MOCK_EVENTS.reduce((sum, e) => sum + e.participants, 0);

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
                            View and manage all upcoming society events and activities.
                        </p>
                    </div>
                </div>

                <button
                    className="btn-ac"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                    onClick={() => setActive && setActive("createEvent")}
                >
                    <FiPlus size={16} /> Create Event
                </button>
            </div>

            {/* STAT CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div
                            style={{
                                background: "#dbeafe",
                                borderRadius: 10,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
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
                        <div
                            style={{
                                background: "#dcfce7",
                                borderRadius: 10,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <HiOutlineUserGroup size={20} color="#16a34a" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>This Month</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{thisMonthCount}</div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>Events in June</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div
                            style={{
                                background: "#f3e8ff",
                                borderRadius: 10,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <PiConfettiBold size={20} color="#9333ea" />
                        </div>
                        <div className="text-start">
                            <div className="tx-muted" style={{ fontSize: 13 }}>Next Event</div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{nextEvent.date}</div>
                            <div className="tx-muted" style={{ fontSize: 12 }}>{nextEvent.title}</div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="sv-card p-3 d-flex gap-3 align-items-center">
                        <div
                            style={{
                                background: "#fef3c7",
                                borderRadius: 10,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
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
                    <div className="col-12 col-md-2 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Event Type</label>
                        <select
                            className="sv-in w-100"
                            value={eventType}
                            onChange={(e) => { setEventType(e.target.value); setPage(1); }}
                        >
                            {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="col-12 col-md-2 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Date From</label>
                        <input
                            type="date"
                            className="sv-in w-100"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-2 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Date To</label>
                        <input
                            type="date"
                            className="sv-in w-100"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-2 text-start">
                        <label className="tx-muted" style={{ fontSize: 12 }}>Status</label>
                        <select
                            className="sv-in w-100"
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="col-12 col-md-3">
                        <div style={{ position: "relative" }}>
                            <FiSearch
                                size={15}
                                style={{
                                    position: "absolute",
                                    left: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
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

                    <div className="col-12 col-md-1 d-flex gap-2">
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
                <table className="w-100" style={{ borderCollapse: "collapse", minWidth: 900 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eef0f3" }}>
                            {["Event Details", "Type", "Date & Time", "Venue", "Participants", "Status", "Actions"].map((h) => (
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
                        {paged.map((e) => {
                            const pct = Math.min(100, Math.round((e.participants / e.expected) * 100));
                            const typeStyle = TYPE_COLORS[e.type] || { bg: "#f3f4f6", color: "#374151" };
                            return (
                                <tr key={e.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
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
                                                <div style={{ fontWeight: 700, fontSize: 15, color: "#4338ca" }}>{e.day}</div>
                                                <div style={{ fontSize: 10, color: "#6366f1" }}>{e.month}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
                                                <div className="tx-muted" style={{ fontSize: 12 }}>{e.description}</div>
                                                <div className="tx-muted" style={{ fontSize: 12 }}>
                                                    Organized by: <span style={{ color: "#374151" }}>{e.organizer}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px" }}>
                                        <span
                                            style={{
                                                background: typeStyle.bg,
                                                color: typeStyle.color,
                                                borderRadius: 6,
                                                padding: "3px 10px",
                                                fontSize: 12,
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {e.type}
                                        </span>
                                    </td>

                                    <td style={{ padding: "14px 16px", textAlign: "left" }}>
                                        <div className="d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                                            <FiCalendar size={12} /> {e.date}
                                        </div>
                                        <div className="d-flex align-items-center gap-1 tx-muted" style={{ fontSize: 12 }}>
                                            <FiClock size={12} /> {e.time}
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px", textAlign: "left" }}>
                                        <div className="d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                                            <FiMapPin size={12} /> {e.venueLine1}
                                        </div>
                                        <div className="tx-muted" style={{ fontSize: 12, marginLeft: 16 }}>{e.venueLine2}</div>
                                    </td>

                                    <td style={{ padding: "14px 16px", minWidth: 140 }}>
                                        <div className="d-flex align-items-center gap-1" style={{ fontSize: 13, fontWeight: 600 }}>
                                            <HiOutlineUserGroup size={14} /> {e.participants}
                                            <span className="tx-muted" style={{ fontWeight: 400 }}>/ {e.expected} expected</span>
                                        </div>
                                        <div
                                            style={{
                                                height: 6,
                                                borderRadius: 4,
                                                background: "#f1f5f9",
                                                marginTop: 6,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${pct}%`,
                                                    height: "100%",
                                                    background: pct > 50 ? "#3b82f6" : "#f59e0b",
                                                    borderRadius: 4,
                                                }}
                                            />
                                        </div>
                                    </td>

                                    <td style={{ padding: "14px 16px" }}>
                                        <span
                                            style={{
                                                background: "#dbeafe",
                                                color: "#1d4ed8",
                                                borderRadius: 6,
                                                padding: "3px 10px",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {e.status}
                                        </span>
                                    </td>

                                    <td style={{ padding: "14px 16px" }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="btn-ol"
                                                style={{ padding: "4px 8px" }}
                                                title="View details"
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
                                                        <button className="dropdown-item member-action-item">Edit Event</button>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button className="dropdown-item member-action-item member-action-delete">
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

                        {paged.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center tx-muted" style={{ padding: 32 }}>
                                    No events match your filters.
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
