import { useState, useEffect, useRef } from "react";
import {
    FiVolume2,
    FiAlertTriangle,
    FiCalendar,
    FiGrid,
    FiFileText,
    FiSearch,
    FiMail,
    FiMessageSquare,
    FiClock,
    FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Pagination } from "../../components/Common/ReusableFunction";
import "../../styles/StaffAttendance.css";
import "../../styles/Broadcast.css";
import {
    deleteBroadcastApi,
    getBroadcastListApi,
} from "../../services/BroadcastApi";
// NOTE: getBroadcastApi (GetBroadcasts endpoint) only accepts society_id and
// has NO pagination/filter support — never use it for the filtered list or stats.
import { GetSessionData } from "../../utils/SessionManagement";

const Broadcast = ({ setActive, setBroadcastId, setSelectedBroadcast }) => {

    // =====================================================
    // STATES
    // =====================================================

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [allBroadcast, setAllBroadcast] = useState([]);
    //const [loading, setLoading] = useState(false);
    const [societyId, setSocietyId] = useState("");
    const societyIdRef = useRef("");
    const [name, setName] = useState("");

    // ── filters — all blank on page load ──
    const [search, setSearch] = useState("");
    const [broadcastTypeTab, setBroadcastTypeTab] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // ── stat tiles — now populated straight from `analytics` in the SAME
    // response as the paginated list. The API returns analytics on every
    // call regardless of filters/get_all, so there is no need for a
    // separate "fetch everything" request just for these numbers. ──
    const [statsTotal, setStatsTotal] = useState(0);
    const [statsSent, setStatsSent] = useState(0);
    const [statsScheduled, setStatsScheduled] = useState(0);
    const [statsDraft, setStatsDraft] = useState(0);
    const [statsFailed, setStatsFailed] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBroadcastId, setSelectedBroadcastId] = useState(null);
    const [selectedBroadcastTitle, setSelectedBroadcastTitle] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [sortBy, setSortBy] = useState("latest");

    // =====================================================
    // TABS CONFIG
    // =====================================================

    const broadcastType = [
        { id: "All", icon: <FiGrid size={14} />, value: "" },
        { id: "Announcement", icon: <FiVolume2 size={14} />, value: "announcement" },
        { id: "Emergency", icon: <FiAlertTriangle size={14} />, value: "emergency" },
        { id: "Circular", icon: <FiFileText size={14} />, value: "circular" },
        { id: "Event", icon: <FiCalendar size={14} />, value: "event" },
    ];

    // =====================================================
    // LOAD SESSION — fires the ONE initial API call, with every
    // filter blank (search "", type "", status "", dates "").
    // =====================================================

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            const flats = data.data.flats[0];
            const sid = flats.society_id;
            setSocietyId(sid);
            societyIdRef.current = sid;
            setName(`${data.data.first_name} ${data.data.last_name}`);

            // single call — list + pagination + stats all come back together
            getBroadcast({
                sid,
                currentPage: 1,
                currentSearch: "",
                currentType: "",
                currentStatus: "",
                currentStartDate: "",
                currentEndDate: "",
            });
        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // SINGLE FETCH — list, pagination, AND stat tiles all come from
    // this one call to getBroadcastListApi. Response shape:
    // {
    //   analytics: { draft, failed, scheduled, sent, total },
    //   broadcasts: [...],
    //   pagination: { limit, page, total_pages, total_records }
    // }
    // =====================================================

    const getBroadcast = async ({
    sid,
    currentPage = 1,
    currentSearch = "",
    currentType = "",
    currentStatus = "",
    currentStartDate = "",
    currentEndDate = "",
    getAll = false,
}) => {
    try {
        const apiData = await getBroadcastListApi({
            society_id: sid,
            currentPage,
            limit,
            currentSearch,
            currentType,
            currentStatus,
            currentStartDate,
            currentEndDate,
            getAll,
        });

        setAllBroadcast(apiData?.broadcasts || []);

        setTotalPages(apiData?.pagination?.total_pages || 1);
        setTotalRecords(apiData?.pagination?.total_records || 0);

        setStatsTotal(apiData?.analytics?.total || 0);
        setStatsSent(apiData?.analytics?.sent || 0);
        setStatsScheduled(apiData?.analytics?.scheduled || 0);
        setStatsDraft(apiData?.analytics?.draft || 0);
        setStatsFailed(apiData?.analytics?.failed || 0);
    } catch (error) {
        console.log(error);
        toast.error("Failed to load broadcasts");
    }
};

    const handleSearch = () => {
        setPage(1);
        getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
    };

    const handleSearchKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getBroadcast({ sid: societyIdRef.current, currentPage: newPage, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
    };

    const deleteBroadcast = (broadcastId, broadcastTitle) => {
        setSelectedBroadcastId(broadcastId);
        setSelectedBroadcastTitle(broadcastTitle || "");
        setShowDeleteModal(true);
    };

    const confirmDeleteBroadcast = async () => {
        try {
            setDeleting(true);
            await deleteBroadcastApi(selectedBroadcastId, societyIdRef.current);
            toast.success("Broadcast deleted successfully");
            setShowDeleteModal(false);
            // single refresh call — brings back updated list + pagination + stats together
            getBroadcast({ sid: societyIdRef.current, currentPage: page, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete broadcast");
        } finally {
            setDeleting(false);
        }
    };

    const handleEditClick = (id) => {
        setBroadcastId(id);
        setActive("createbroadcast");
    };

    const handleViewDetails = (broadcast) => {
        setBroadcastId(broadcast.id);
        if (setSelectedBroadcast) setSelectedBroadcast(broadcast);
        setActive("viewbroadcastdetails");
    };

    const timeAgo = (utcDate) => {
        if (!utcDate) return "Not sent";
        const past = new Date(utcDate);
        const now = new Date();
        const seconds = Math.floor((now - past) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} min ago`;
        return "Just now";
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "email": return <FiMail size={12} />;
            case "sms": return <FiMessageSquare size={12} />;
            case "whatsapp": return <span style={{ fontSize: 12 }}>💬</span>;
            default: return null;
        }
    };

    const TypePill = ({ type }) => {
        const clsMap = {
            announcement: "bc-pill-type-announcement",
            emergency: "bc-pill-type-emergency",
            circular: "bc-pill-type-circular",
            event: "bc-pill-type-event",
        };
        return <span className={`bc-pill ${clsMap[type] || "bc-pill-type-default"}`}>{type}</span>;
    };

    const StatusPill = ({ s }) => {
        const clsMap = {
            sent: "bc-pill-status-sent",
            scheduled: "bc-pill-status-scheduled",
            draft: "bc-pill-status-draft",
            failed: "bc-pill-status-failed",
        };
        return <span className={`bc-pill bc-pill-strong ${clsMap[s] || "bc-pill-status-default"}`}>{s}</span>;
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            
            <div className="pg bc-page">

                {/* ── HEADER ── */}
                <div className="d-flex justify-content-between align-items-start mb-4 text-start">
                    <div className="d-flex gap-3 align-items-start">
                        <div className="bc-header-icon">
                            <FiVolume2 size={20} color="#2563eb" />
                        </div>
                        <div>
                            <h4 className="cp-title mb-0">Broadcasting</h4>
                            <p className="cp-sub mb-0">Send announcements, alerts and updates to residents.</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-sm btn-ac btn-primary"
                        onClick={() => { setActive("createbroadcast"); setBroadcastId(""); }}
                    >
                        + Create Broadcast
                    </button>
                </div>

                {/* ── STAT TILES — sourced from analytics in the same list response ── */}

                <div className="row g-3 mb-4">

                    {[
                        [statsTotal, "Total Broadcasts", "tile-blu"],
                        [statsSent, "Sent", "tile-grn"],
                        [statsScheduled, "Scheduled", "tile-yel"],
                        [statsDraft, "Draft", "tile-red"],
                    ].map(([value, label, cls]) => (

                        <div className="col-6 col-md-3" key={label}>

                            <div className={`tile bg-white ${cls}`}>

                                <div className="text-start text-muted">
                                    {label}
                                </div>

                                <div className="tile-val text-start mt-1">
                                    {value}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ── MAIN LAYOUT: list (left) + sidebar (right) ── */}
                <div className="row g-4">

                    {/* LEFT — filters + broadcast list */}
                    <div className="col-12 col-lg-8">

                        {/* ── FILTER BAR ── */}
                        <div className="bc-filter-card">
                            <div className="row g-2">
                                <div className="col-md-3">
                                    <select
                                        className="form-select form-select-sm"
                                        value={status}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setStatus(val);
                                            setPage(1);
                                            getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: val, currentStartDate: startDate, currentEndDate: endDate });
                                        }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="sent">Sent</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        placeholder="From Date"
                                        value={startDate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setStartDate(val);
                                            setPage(1);
                                            getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: val, currentEndDate: endDate });
                                        }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        placeholder="To Date"
                                        value={endDate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setEndDate(val);
                                            setPage(1);
                                            getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: val });
                                        }}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search broadcasts..."
                                            className="form-control form-control-sm"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                        />
                                        <button className="btn btn-primary btn-sm bc-search-btn" onClick={handleSearch}>
                                            <FiSearch size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* TYPE TABS */}
                            <div className="bc-tabs-wrap">
                                {broadcastType.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setBroadcastTypeTab(t.value);
                                            setPage(1);
                                            getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: t.value, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
                                        }}
                                        className={`bc-tab-btn ${broadcastTypeTab === t.value ? "active" : ""}`}
                                    >
                                        {t.icon} {t.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── LIST — Complaints-style cards ── */}
                        {allBroadcast.length === 0 ? (
                            <div className="sv-card text-center py-5 text-muted">
                                <FiGrid size={32} className="mb-2 opacity-25" />
                                <br />
                                No Broadcast Found
                            </div>
                        ) : (
                            allBroadcast.map((p) => (
                                <div
                                    key={p.id}
                                    className="card border-0 shadow-sm rounded-3"
                                    style={{ padding: "10px 14px", marginTop: 8 }}
                                >
                                    <div className="d-flex justify-content-between align-items-start gap-2">

                                        <div
                                            className="text-start flex-grow-2 min-w-0"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleViewDetails(p)}
                                        >
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                <span style={{ fontSize: 16, fontWeight: 600 }}>{p.title}</span>
                                                <TypePill type={p.type} />
                                            </div>

                                            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary" style={{ fontSize: 13 }}>
                                                <div className="d-flex align-items-center gap-1"><FiUser size={12} /><span>{name}</span></div>
                                                <div className="d-flex align-items-center gap-1"><FiClock size={12} /><span>{timeAgo(p.sent_at || p.created_at)}</span></div>
                                                {p.scheduled_at && (
                                                    <div className="d-flex align-items-center gap-1"><FiCalendar size={12} /><span>{new Date(p.scheduled_at).toLocaleDateString()}</span></div>
                                                )}
                                                {p.channel && (
                                                    <div className="d-flex align-items-center gap-1">{getChannelIcon(p.channel)}<span>{p.channel}</span></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <StatusPill s={p.status} />

                                            <div
                                                className="member-action-dropdown dropdown flex-shrink-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
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
                                                            onClick={() => handleViewDetails(p)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => handleEditClick(p.id)}
                                                        >
                                                            Edit Broadcast
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => deleteBroadcast(p.id, p.title)}
                                                        >
                                                            Delete Broadcast
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))
                        )}

                        {/* FOOTER */}
                        {totalRecords > 0 && (
                            <div className="sv-card p-0 mt-2">
                                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                                    <div className="bc-records-info">
                                        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalRecords)} of {totalRecords} broadcasts
                                    </div>
                                </div>
                                <Pagination page={page} total={totalPages} onChange={handlePageChange} />
                            </div>
                        )}
                    </div>

                    {/* RIGHT — sidebar */}
                    <div className="col-12 col-lg-4">

                        {/* Quick Actions */}
                        <div className="sv-card mb-3">
                            <h6 className="bc-side-title text-start">Quick Actions</h6>

                            {/* Go to Notice Board */}
                            <button
                                className="qa mb-2"
                                onClick={() => setActive("noticeboard")}
                            >
                                <div
                                    className="qa-ico"
                                    style={{ background: "#ede9fe" }}
                                >
                                    📋
                                </div>
                                <span className="bc-qa-text">
                                    Notice Board
                                </span>
                            </button>

                            {/* Go to Polls & Voting */}
                            <button
                                className="qa mb-2"
                                onClick={() => setActive("polls")}
                            >
                                <div
                                    className="qa-ico"
                                    style={{ background: "#ffedd5" }}
                                >
                                    🗳️
                                </div>
                                <span className="bc-qa-text">
                                    Polls & Voting
                                </span>
                            </button>

                            {/* Go Back */}
                            <button
                                className="qa"
                                onClick={() => setActive("broadcasting")}
                            >
                                <div
                                    className="qa-ico"
                                    style={{ background: "#dbeafe" }}
                                >
                                    📡
                                </div>
                                <span className="bc-qa-text">
                                    Broadcast List
                                </span>
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            {/* ── DELETE MODAL ── */}
            <div className={`modal fade ${showDeleteModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            />
                        </div>
                        <div className="modal-body text-start">
                            <p className="mb-1">
                                Are you sure you want to delete{" "}
                                <strong>{selectedBroadcastTitle ? `"${selectedBroadcastTitle}"` : "this broadcast"}</strong>?
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
                                onClick={confirmDeleteBroadcast}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Broadcast;
