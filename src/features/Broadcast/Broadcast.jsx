import { useState, useEffect, useRef } from "react";
import {
    FiTrash2,
    FiVolume2,
    FiAlertTriangle,
    FiCalendar,
    FiGrid,
    FiFileText,
    FiSearch,
    FiMail,
    FiMessageSquare,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import "../../styles/StaffAttendance.css";
import {
    deleteBroadcastApi,
    getBroadcastListApi,
} from "../../services/BroadcastApi";
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

    // filters
    const [search, setSearch] = useState("");
    const [broadcastTypeTab, setBroadcastTypeTab] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // type counts for stats
    const [typeCounts, setTypeCounts] = useState({
        announcement: 0,
        emergency: 0,
        circular: 0,
        event: 0,
    });

    // delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBroadcastId, setSelectedBroadcastId] = useState(null);

    // =====================================================
    // TABS CONFIG
    // =====================================================

    const broadcastType = [
        { id: "All",          icon: <FiGrid size={15} color="#2563eb" />,        value: "" },
        { id: "Announcement", icon: <FiVolume2 size={15} color="#f59e0b" />,     value: "announcement" },
        { id: "Emergency",    icon: <FiAlertTriangle size={15} color="#ef4444" />, value: "emergency" },
        { id: "Circular",     icon: <FiFileText size={15} color="purple" />,     value: "circular" },
        { id: "Event",        icon: <FiCalendar size={15} color="#10b981" />,    value: "event" },
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
        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // API — GET BROADCAST LIST
    // =====================================================

    const getBroadcast = async ({
        sid,
        currentPage,
        currentSearch,
        currentType,
        currentStatus,
        currentStartDate,
        currentEndDate,
    }) => {
        try {
            const payload = {
                society_id: sid,
                currentPage,
                limit,
                currentSearch,
                currentType,
                currentStatus,
                currentStartDate,
                currentEndDate,
            };

            const apiData = await getBroadcastListApi(payload);
            const records = apiData?.records || [];

            setAllBroadcast(records);
            setTotalPages(apiData?.total_pages || 1);
            setTotalRecords(apiData?.total_records || 0);

            const counts = { announcement: 0, emergency: 0, circular: 0, event: 0 };
            records.forEach((r) => {
                if (counts[r.type] !== undefined) counts[r.type]++;
            });
            setTypeCounts(counts);

        } catch (error) {
            console.log(error);
            toast.error("Failed to load broadcasts");
        }
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {
        setPage(1);
        getBroadcast({
            sid: societyIdRef.current,
            currentPage: 1,
            currentSearch: search,
            currentType: broadcastTypeTab,
            currentStatus: status,
            currentStartDate: startDate,
            currentEndDate: endDate,
        });
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getBroadcast({
            sid: societyIdRef.current,
            currentPage: newPage,
            currentSearch: search,
            currentType: broadcastTypeTab,
            currentStatus: status,
            currentStartDate: startDate,
            currentEndDate: endDate,
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteBroadcast = (broadcastId) => {
        setSelectedBroadcastId(broadcastId);
        setShowDeleteModal(true);
    };

    const confirmDeleteBroadcast = async () => {
        try {
            await deleteBroadcastApi(selectedBroadcastId, societyIdRef.current);
            toast.success("Broadcast deleted successfully");
            setShowDeleteModal(false);
            getBroadcast({
                sid: societyIdRef.current,
                currentPage: page,
                currentSearch: search,
                currentType: broadcastTypeTab,
                currentStatus: status,
                currentStartDate: startDate,
                currentEndDate: endDate,
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete broadcast");
        }
    };

    // =====================================================
    // EDIT — navigate to CreateBroadcast with id
    // =====================================================

    const handleEditClick = (id) => {
        setBroadcastId(id);
        setActive("createbroadcast");
    };

    // =====================================================
    // VIEW DETAILS — pass full object so detail page renders instantly
    // =====================================================

    const handleViewDetails = (broadcast) => {
        setBroadcastId(broadcast.id);
        // Pass the full row data so ViewBroadcastDetails can render immediately
        // while it fetches fresh data in the background
        if (setSelectedBroadcast) setSelectedBroadcast(broadcast);
        setActive("viewbroadcastdetails");
    };

    // =====================================================
    // HELPERS
    // =====================================================

    const timeAgo = (utcDate) => {
        if (!utcDate) return "Not sent";
        const past = new Date(utcDate);
        const now = new Date();
        const seconds = Math.floor((now - past) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)    return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} min ago`;
        return "Just now";
    };

    const getNoticeIcon = (type) => {
        switch (type) {
            case "announcement": return { icon: <FiVolume2 size={16} color="#ff9800" />,      bg: "#fff3e0" };
            case "circular":     return { icon: <FiFileText size={16} color="#7c3aed" />,      bg: "#ede9fe" };
            case "emergency":    return { icon: <FiAlertTriangle size={16} color="#ef4444" />, bg: "#fee2e2" };
            case "event":        return { icon: <FiCalendar size={16} color="#10b981" />,      bg: "#d1fae5" };
            default:             return { icon: <FiCalendar size={16} color="#6b7280" />,      bg: "#f3f4f6" };
        }
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "email":    return <FiMail size={12} />;
            case "sms":      return <FiMessageSquare size={12} />;
            case "whatsapp": return <span style={{ fontSize: 12 }}>💬</span>;
            default:         return null;
        }
    };

    const getStatusColor = (s) => {
        if (s === "sent")      return "green";
        if (s === "scheduled") return "blue";
        if (s === "draft")     return "orange";
        return "red";
    };

    const getTypeColor = (t) => {
        if (t === "announcement") return "orange";
        if (t === "emergency")    return "red";
        if (t === "circular")     return "purple";
        return "green";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <div className="pg row g-4 nb-wrap">

                {/* ── LEFT COLUMN ── */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card">

                        {/* TOP BAR */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => { setActive("createbroadcast"); setBroadcastId(""); }}
                            >
                                + Create
                            </button>

                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-control form-control-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                                <button className="btn btn-primary btn-sm" onClick={handleSearch}>
                                    <FiSearch size={14} />
                                </button>
                            </div>
                        </div>

                        {/* FILTERS */}
                        <div className="row mt-3 g-2">
                            <div className="col-md-4">
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
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={startDate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setStartDate(val);
                                        setPage(1);
                                        getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: val, currentEndDate: endDate });
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={endDate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEndDate(val);
                                        setPage(1);
                                        getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: broadcastTypeTab, currentStatus: status, currentStartDate: startDate, currentEndDate: val });
                                    }}
                                />
                            </div>
                        </div>

                        {/* TYPE TABS */}
                        <div className="NoticeBoardTabs mt-3">
                            {broadcastType.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setBroadcastTypeTab(t.value);
                                        setPage(1);
                                        getBroadcast({ sid: societyIdRef.current, currentPage: 1, currentSearch: search, currentType: t.value, currentStatus: status, currentStartDate: startDate, currentEndDate: endDate });
                                    }}
                                    className={`NoticeBoardTabs-btn ${broadcastTypeTab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} {t.id}
                                </button>
                            ))}
                        </div>

                        {/* LIST */}
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
                                    <div
                                        key={p.id}
                                        className={`nb-post text-start ${i !== allBroadcast.length - 1 ? "nb-border" : ""}`}
                                    >
                                        <div className="d-flex gap-3 align-items-start">

                                            {/* TYPE ICON */}
                                            <div
                                                className="nb-avatar flex-shrink-0"
                                                style={{ background: noticeData.bg, cursor: "pointer" }}
                                                onClick={() => handleViewDetails(p)}
                                            >
                                                {noticeData.icon}
                                            </div>

                                            {/* CONTENT */}
                                            <div
                                                className="flex-grow-1 min-w-0"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleViewDetails(p)}
                                            >
                                                {/* ROW 1 — title + badges */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                    <span className="nb-title">{p.title}</span>
                                                    <Badge label={p.type} c={getTypeColor(p.type)} />
                                                    {p.channel && (
                                                        <span
                                                            className="badge rounded-pill"
                                                            style={{
                                                                fontSize: 10,
                                                                background: "#f3f4f6",
                                                                color: "#374151",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: 3,
                                                                padding: "2px 7px",
                                                            }}
                                                        >
                                                            {getChannelIcon(p.channel)} {p.channel}
                                                        </span>
                                                    )}
                                                    <Badge label={p.status} c={getStatusColor(p.status)} />
                                                </div>

                                                {/* MESSAGE */}
                                                <p className="nb-content">{p.message}</p>

                                                {/* META FOOTER */}
                                                <div className="nb-meta d-flex flex-wrap gap-2">
                                                    <span>👤 {name}</span>
                                                    <span>•</span>
                                                    <span>{timeAgo(p.sent_at || p.created_at)}</span>
                                                    {p.scheduled_at && (
                                                        <>
                                                            <span>•</span>
                                                            <span>📅 {new Date(p.scheduled_at).toLocaleDateString()}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ⋮ DROPDOWN — stop propagation so click doesn't trigger view */}
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
                                                            onClick={() => deleteBroadcast(p.id)}
                                                        >
                                                            Delete Broadcast
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* PAGINATION */}
                        <Pagination
                            page={page}
                            total={totalPages}
                            onChange={handlePageChange}
                        />

                        {/* RECORDS INFO */}
                        {!loading && totalRecords > 0 && (
                            <div className="text-center mt-2" style={{ fontSize: 12, color: "#6b7280" }}>
                                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalRecords)} of {totalRecords} records
                            </div>
                        )}

                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="col-12 col-lg-4">

                    {/* STATS CARD */}
                    <div className="sv-card mb-3">
                        <h6 className="mb-3 fw-semibold">Broadcast Statistics</h6>
                        <div className="row text-center g-2">
                            <div className="col-6">
                                <div className="p-2 rounded" style={{ background: "#f0f9ff" }}>
                                    <h4 className="mb-0" style={{ color: "#0369a1" }}>{totalRecords}</h4>
                                    <small className="text-muted">Total Records</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 rounded" style={{ background: "#f0fdf4" }}>
                                    <h4 className="mb-0" style={{ color: "#15803d" }}>{page}</h4>
                                    <small className="text-muted">Current Page</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 rounded" style={{ background: "#fefce8" }}>
                                    <h4 className="mb-0" style={{ color: "#a16207" }}>{totalPages}</h4>
                                    <small className="text-muted">Total Pages</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-2 rounded" style={{ background: "#fdf4ff" }}>
                                    <h4 className="mb-0" style={{ color: "#7e22ce" }}>{limit}</h4>
                                    <small className="text-muted">Per Page</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TYPE BREAKDOWN CARD */}
                    <div className="sv-card">
                        <h6 className="mb-3 fw-semibold">Type Breakdown</h6>
                        {[
                            { key: "announcement", label: "Announcement", icon: <FiVolume2 size={14} color="#ff9800" />,      bg: "#fff3e0", color: "#c05500" },
                            { key: "emergency",    label: "Emergency",    icon: <FiAlertTriangle size={14} color="#ef4444" />, bg: "#fee2e2", color: "#991b1b" },
                            { key: "circular",     label: "Circular",     icon: <FiFileText size={14} color="#7c3aed" />,      bg: "#ede9fe", color: "#5b21b6" },
                            { key: "event",        label: "Event",        icon: <FiCalendar size={14} color="#10b981" />,      bg: "#d1fae5", color: "#065f46" },
                        ].map(({ key, label, icon, bg, color }) => {
                            const count = typeCounts[key] || 0;
                            const pct = allBroadcast.length
                                ? Math.round((count / allBroadcast.length) * 100)
                                : 0;
                            return (
                                <div key={key} className="d-flex align-items-center gap-2 mb-3">
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 6, background: bg,
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color }}>{count}</span>
                                        </div>
                                        <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4 }}>
                                            <div style={{
                                                height: 4, width: `${pct}%`,
                                                background: color, borderRadius: 4,
                                                transition: "width 0.4s ease",
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* ── DELETE MODAL ── */}
            <div
                className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setShowDeleteModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this broadcast?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={confirmDeleteBroadcast}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Broadcast;
