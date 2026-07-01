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
    FiEye,
    FiSend,
    FiClock,
    FiFile,
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
    const [loading, setLoading] = useState(false);
    const [societyId, setSocietyId] = useState("");
    const societyIdRef = useRef("");
    const [name, setName] = useState("");

    const [search, setSearch] = useState("");
    const [broadcastTypeTab, setBroadcastTypeTab] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // These now hold TRUE all-time totals (independent of current page/filters)
    const [statsTotal, setStatsTotal] = useState(0);
    const [statsSent, setStatsSent] = useState(0);
    const [statsScheduled, setStatsScheduled] = useState(0);
    const [statsDraft, setStatsDraft] = useState(0);

    const [typeCounts, setTypeCounts] = useState({
        announcement: 0,
        emergency: 0,
        circular: 0,
        event: 0,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBroadcastId, setSelectedBroadcastId] = useState(null);

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
    // LOAD SESSION
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
            getBroadcast({
                sid,
                currentPage: 1,
                currentSearch: "",
                currentType: "",
                currentStatus: "",
                currentStartDate: "",
                currentEndDate: "",
            });
            fetchStats(sid);
        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // STATS (all-time totals, independent of pagination/filters)
    // =====================================================

    // =====================================================
    // STATS — computed client-side from the full dataset,
    // because the backend's status filter is currently broken
    // (it returns unfiltered records regardless of `status` sent).
    // =====================================================

    const fetchStats = async (sid) => {
        try {
            const apiData = await getBroadcastListApi({
                society_id: sid,
                currentPage: 1,
                limit: 1000, // high ceiling as a fallback in case get_all is ignored
                currentSearch: "",
                currentType: "",
                currentStatus: "",
                currentStartDate: "",
                currentEndDate: "",
                getAll: true,
            });
            const records = apiData?.records || [];

            setStatsTotal(records.length);
            setStatsSent(records.filter((r) => r.status === "sent").length);
            setStatsScheduled(records.filter((r) => r.status === "scheduled").length);
            setStatsDraft(records.filter((r) => r.status === "draft").length);
        } catch (error) {
            console.error("Error fetching broadcast stats:", error);
        }
    };

    const getBroadcast = async ({ sid, currentPage, currentSearch, currentType, currentStatus, currentStartDate, currentEndDate }) => {
        try {
            const payload = { society_id: sid, currentPage, limit, currentSearch, currentType, currentStatus, currentStartDate, currentEndDate };
            const apiData = await getBroadcastListApi(payload);
            const records = apiData?.records || [];

            setAllBroadcast(records);
            setTotalPages(apiData?.total_pages || 1);
            setTotalRecords(apiData?.total_records || 0);

            // Type count (page-level breakdown for the type tabs, not used for stat tiles)
            const counts = { announcement: 0, emergency: 0, circular: 0, event: 0 };
            records.forEach((r) => { if (counts[r.type] !== undefined) counts[r.type]++; });
            setTypeCounts(counts);
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

    const deleteBroadcast = (broadcastId) => {
        setSelectedBroadcastId(broadcastId);
        setShowDeleteModal(true);
    };

    const confirmDeleteBroadcast = async () => {
        try {
            await deleteBroadcastApi(selectedBroadcastId, societyIdRef.current);
            toast.success("Broadcast deleted successfully");
            setShowDeleteModal(false);
            getBroadcast({ sid: societyIdRef.current, currentPage: page, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
            fetchStats(societyIdRef.current);
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete broadcast");
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

    const getNoticeIcon = (type) => {
        switch (type) {
            case "announcement": return { icon: <FiVolume2 size={18} color="#f59e0b" />, cls: "bc-icon-bg-announcement" };
            case "circular": return { icon: <FiFileText size={18} color="#7c3aed" />, cls: "bc-icon-bg-circular" };
            case "emergency": return { icon: <FiAlertTriangle size={18} color="#ef4444" />, cls: "bc-icon-bg-emergency" };
            case "event": return { icon: <FiCalendar size={18} color="#10b981" />, cls: "bc-icon-bg-event" };
            default: return { icon: <FiCalendar size={18} color="#6b7280" />, cls: "bc-icon-bg-default" };
        }
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "email": return <FiMail size={11} />;
            case "sms": return <FiMessageSquare size={11} />;
            case "whatsapp": return <span style={{ fontSize: 11 }}>💬</span>;
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

    const ChannelPill = ({ channel }) => (
        <span className="bc-pill bc-pill-channel">{getChannelIcon(channel)} {channel}</span>
    );

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

                {/* ── STAT TILES ── */}

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

                {/* ── LIST CARD ── */}
                <div className="bc-list-card">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold">Broadcasts</h6>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 text-muted">
                            <div className="spinner-border mb-3" role="status" />
                            Loading...
                        </div>
                    ) : allBroadcast.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FiGrid size={32} className="mb-2 opacity-25" />
                            <br />
                            No Broadcast Found
                        </div>
                    ) : (
                        allBroadcast.map((p, i) => {
                            const noticeData = getNoticeIcon(p.type);
                            return (
                                <div key={p.id} className="text-start bc-item">
                                    <div className="d-flex gap-3 align-items-start">

                                        {/* TYPE ICON */}
                                        <div
                                            className={`bc-item-icon ${noticeData.cls}`}
                                            onClick={() => handleViewDetails(p)}
                                        >
                                            {noticeData.icon}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-grow-1 min-w-0" style={{ cursor: "pointer" }} onClick={() => handleViewDetails(p)}>
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                <span className="bc-item-title">{p.title}</span>
                                                <TypePill type={p.type} />
                                                {p.channel && <ChannelPill channel={p.channel} />}
                                                <StatusPill s={p.status} />
                                            </div>
                                            <p className="bc-item-message">{p.message}</p>
                                            <div className="bc-item-meta">
                                                <span>{name}</span>
                                                <span>•</span>
                                                <span>{timeAgo(p.sent_at || p.created_at)}</span>
                                                {p.scheduled_at && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{new Date(p.scheduled_at).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* ⋮ DROPDOWN */}
                                        <div className="dropdown flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                className="bc-action-btn"
                                            >
                                                ⋮
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><button className="dropdown-item" onClick={() => handleViewDetails(p)}>View Details</button></li>
                                                <li><button className="dropdown-item" onClick={() => handleEditClick(p.id)}>Edit Broadcast</button></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger" onClick={() => deleteBroadcast(p.id)}>Delete Broadcast</button></li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* FOOTER */}
                    {!loading && totalRecords > 0 && (
                        <div className="bc-list-footer">
                            <div className="bc-records-info">
                                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalRecords)} of {totalRecords} broadcasts
                            </div>
                            <Pagination page={page} total={totalPages} onChange={handlePageChange} />
                        </div>
                    )}
                </div>
            </div>

            {/* ── DELETE MODAL ── */}
            <div className={`modal fade ${showDeleteModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} />
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this broadcast?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeleteBroadcast}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Broadcast;