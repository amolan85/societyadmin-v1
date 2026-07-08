import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/NoticeBoard.css"
import { deleteNoticeApi, getNoticeBoardApi, updateNoticeApi } from '../../services/NoticeBoardApi';
import { GetSessionData } from '../../utils/SessionManagement';
import { toast } from "react-toastify";
import { CgExport } from "react-icons/cg";
import ExportModal from "../../components/Common/ExportModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import {
    FiVolume2,
    FiTool,
    FiAlertTriangle,
    FiCalendar,
    FiBriefcase,
    FiUsers,
    FiEdit,
    FiTrash2,
} from "react-icons/fi";

const NoticeBoard = ({ setActive, setSelectedNoticeData }) => {

    const [tab, setTab] = useState("");
    const [societyId, setSocietyId] = useState("");
    const [name, setName] = useState("");
    const [allNoticeBoard, setAllNoticeBoard] = useState([]);
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState("excel");
    const [selectedRange, setSelectedRange] = useState("all");
    const [allExportNoticeBoard, setAllExportNoticeBoard] = useState([]);
    const [noticeType, setNoticeType] = useState("general");
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState(null)
    const [channel, setChannel] = useState("")
    // ── Stats (independent of filters — like ViolationAlertsList) ─────────────
    const [statsTotal, setStatsTotal] = useState(0);
    const [statsPublished, setStatsPublished] = useState(0);
    const [statsDraft, setStatsDraft] = useState(0);
    const [statsArchived, setStatsArchived] = useState(0);

    const tabs = [
        { id: "All", value: "" },
        { id: "General", icon: <FiVolume2 size={18} color="#2563eb" />, value: "general" },
        { id: "Maintenance", icon: <FiTool size={18} color="#f59e0b" />, value: "maintenance" },
        { id: "Emergency", icon: <FiAlertTriangle size={18} color="#ef4444" />, value: "emergency" },
        { id: "Event", icon: <FiCalendar size={18} color="#10b981" />, value: "event" },
        { id: "Legal", icon: <FiBriefcase size={18} color="#7c3aed" />, value: "legal" },
        { id: "Meeting", icon: <FiUsers size={18} color="#06b6d4" />, value: "meeting" },
    ];

    const getNoticeIcon = (type) => {
        switch (type) {
            case "meeting": return { icon: <FiUsers size={18} color="#06b6d4" />, bg: "#cffafe" };
            case "general": return { icon: <FiVolume2 size={18} color="#2563eb" />, bg: "#dbeafe" };
            case "maintenance": return { icon: <FiTool size={18} color="#f59e0b" />, bg: "#fef3c7" };
            case "emergency": return { icon: <FiAlertTriangle size={18} color="#ef4444" />, bg: "#fee2e2" };
            case "legal": return { icon: <FiBriefcase size={18} color="#7c3aed" />, bg: "#ede9fe" };
            case "event": return { icon: <FiCalendar size={18} color="#10b981" />, bg: "#d1fae5" };
            default: return { icon: <FiCalendar size={18} color="#6b7280" />, bg: "#f3f4f6" };
        }
    };

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        const flats = data.data.flats[0];
        setName(data.data.first_name + " " + data.data.last_name);
        setSocietyId(flats.society_id);
        getNoticeBoard(flats.society_id);
        fetchStats(flats.society_id);
    };

    const getNoticeBoard = async (sid) => {
        try {
            const data = await getNoticeBoardApi(sid);
            setAllNoticeBoard(data.list);
        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // STATS — independent of current filter (like ViolationAlertsList)
    // Uses client-side count from full list since NoticeBoardApi
    // likely doesn't support per-status pagination.
    // If your API supports status filtering, swap to Promise.all like Broadcast.
    // =====================================================

    const fetchStats = async (sid) => {
        try {
            const data = await getNoticeBoardApi(sid);
            const list = data.list || [];
            setStatsTotal(list.length);
            setStatsPublished(list.filter(n => n.status === "published").length);
            setStatsDraft(list.filter(n => n.status === "draft").length);
            setStatsArchived(list.filter(n => n.status === "archived").length);
        } catch (error) {
            console.error("Error fetching notice stats:", error);
        }
    };

    const getNoticeBoardById = async (selectedData) => {
        setSelectedNoticeData(selectedData);
        setActive("createNoticeBoard");
    };

    const getAllExportNoticeBoard = async (sid) => {
        try {
            const data = await getNoticeBoardApi(sid);
            setAllExportNoticeBoard(data.list || []);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteNotice = async (noticeId) => {
        const confirmed = window.confirm("Are you sure you want to delete this notice?");
        if (!confirmed) return;
        try {
            await deleteNoticeApi(noticeId, societyId);
            toast.success("Notice deleted successfully!");
            getNoticeBoard(societyId);
            fetchStats(societyId);
        } catch (error) {
            console.log(error);
        }
    };

    const timeAgo = (utcDate) => {
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

    const filteredData = allNoticeBoard.filter((item) => {
        const matchesTab = tab === "" || item.notice_type === tab;
        const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "" || item.status?.toLowerCase() === filterStatus.toLowerCase();
        const noticeDate = item.publish_date ? new Date(item.publish_date) : null;
        const matchesStart = !startDate || (noticeDate && noticeDate >= new Date(startDate));
        const matchesEnd = !endDate || (noticeDate && noticeDate <= new Date(endDate + "T23:59:59"));
        return matchesTab && matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });

    const per = 5;
    const total = Math.ceil(filteredData.length / per);
    const rows = filteredData.slice((page - 1) * per, page * per);

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        setPage(1);
    };

    const exportData = selectedRange === "all" ? allExportNoticeBoard : filteredData;

    const downloadExcel = () => exportFile({ data: exportData, fileName: "NoticeBoard", sheetName: "NoticeBoard", type: "xlsx" });
    const downloadCSV = () => exportFile({ data: exportData, fileName: "NoticeBoard", sheetName: "NoticeBoard", type: "csv" });
    const downloadPDF = () => exportToPDF({
        title: "Notice Board Report",
        fileName: "NoticeBoard",
        columns: ["Title", "Type", "Status"],
        data: exportData.map((item) => [item.title, item.notice_type, item.status]),
    });

    const handleExport = () => {
        if (activeTab === "excel") downloadExcel();
        else if (activeTab === "csv") downloadCSV();
        else if (activeTab === "pdf") downloadPDF();
        setShow(false);
    };

    // Draft notices waiting for moderation
    const moderationQueue = allNoticeBoard
        .filter(item => item.status === "draft")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Priority badge color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "red";
            case "high":
                return "orange";
            case "normal":
                return "blue";
            case "low":
                return "gray";
            default:
                return "gray";
        }
    }; const approveNotice = async (item) => {
        try {
            await updateNoticeApi(
                item.notice_id,
                societyId,
                item.title,
                item.description,
                item.notice_type,
                item.priority,
                "published"
            );

            toast.success("Notice Approved");

            getNoticeBoard(societyId);
            fetchStats(societyId);
        } catch (error) {
            console.log(error);
        }
    };

    const rejectNotice = async (item) => {
        try {
            await updateNoticeApi(
                item.notice_id,
                societyId,
                item.title,
                item.description,
                item.notice_type,
                item.priority,
                "archived"
            );

            toast.success("Notice Rejected");

            getNoticeBoard(societyId);
            fetchStats(societyId);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="pg">

                {/* ── HEADER ── */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Notice Board</h4>
                        <p className="cp-sub">Manage and publish notices for residents.</p>
                    </div>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => { setActive("createNoticeBoard"); setSelectedNoticeData(""); }}
                    >
                        + Create
                    </button>
                </div>

                {/* ── STAT TILES   ── */}
                <div className="row g-3 mb-4">
                    {[
                        [statsTotal, "Total Notices", "tile-blu"],
                        [statsPublished, "Published", "tile-grn"],
                        [statsDraft, "Draft", "tile-yel"],
                        [statsArchived, "Archived", "tile-red"],
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className="text-start text-muted">{l}</div>
                                <div className="tile-val text-start mt-1">{v}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── MAIN ROW ── */}
                <div className="row g-4 nb-wrap">

                    {/* ── LEFT ── */}
                    <div className="col-12 col-lg-8">
                        <div className="sv-card">

                            {/* SEARCH & EXPORT */}
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by title..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    />
                                </div>
                                <div className="col-md-6 text-md-end mt-2 mt-md-0">
                                    <button
                                        className="btn-ol ms-2"
                                        onClick={() => { getAllExportNoticeBoard(societyId); setShow(true); }}
                                    >
                                        <CgExport className="me-1" /> Export
                                    </button>
                                </div>
                            </div>

                            {/* FILTERS */}
                            <div className="row g-2 mb-3">
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={filterStatus}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                                    />
                                </div>
                            </div>

                            {/* TYPE TABS */}
                            <div className="NoticeBoardTabs mt-3">
                                {tabs.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setTab(t.value); setPage(1); }}
                                        className={`NoticeBoardTabs-btn ${tab === t.value ? "active" : ""}`}
                                    >
                                        {t.icon} &nbsp;{t.id}
                                    </button>
                                ))}
                            </div>

                            {/* ROWS */}
                            {rows.map((p, i, arr) => {
                                const noticeData = getNoticeIcon(p.notice_type);
                                return (
                                    <div
                                        key={i}
                                        className={`nb-post text-start ${i < arr.length - 1 ? "nb-border" : ""}`}
                                    >
                                        <div className="d-flex gap-3">

                                            <div className="nb-avatar" style={{ background: noticeData.bg }}>
                                                {noticeData.icon}
                                            </div>

                                            <div className="flex-grow-1">

                                                <div className="d-flex justify-content-between align-items-start flex-wrap mb-1">

                                                    {/* Left Side — title + type badge + STATUS BADGE */}
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                        <span className="nb-title">{p.title}</span>
                                                        <Badge
                                                            label={p.notice_type}
                                                            c={
                                                                p.notice_type === "general" ? "blue"
                                                                    : p.notice_type === "maintenance" ? "orange"
                                                                        : p.notice_type === "emergency" ? "red"
                                                                            : p.notice_type === "event" ? "green"
                                                                                : p.notice_type === "legal" ? "purple"
                                                                                    : p.notice_type === "meeting" ? "peacock"
                                                                                        : "gray"
                                                            }
                                                        />
                                                        {/* ── STATUS BADGE ── */}
                                                        <Badge
                                                            label={p.status}
                                                            c={
                                                                p.status === "published" ? "green"
                                                                    : p.status === "draft" ? "orange"
                                                                        : p.status === "archived" ? "red"
                                                                            : "gray"
                                                            }
                                                        />
                                                    </div>

                                                    {/* Right Side — edit / delete */}
                                                    <div className="d-flex align-items-center gap-3">
                                                        {p.status === "draft" && (
                                                            <FiEdit
                                                                size={18}
                                                                style={{ cursor: "pointer", color: "orange" }}
                                                                onClick={() => getNoticeBoardById(p.notice_id)}
                                                            />
                                                        )}
                                                        {p.locked && (
                                                            <span className="nb-locked">🔒 Locked</span>
                                                        )}
                                                        <FiTrash2
                                                            size={18}
                                                            style={{ cursor: "pointer", color: "red" }}
                                                            onClick={() => deleteNotice(p.notice_id)}
                                                        />
                                                    </div>
                                                </div>

                                                <p className="nb-content">{p.description}</p>

                                                <div className="nb-meta">
                                                    👤 {name} • {timeAgo(p.publish_date)}
                                                    {p.views && ` • 👁 ${p.views}`}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <Pagination page={page} total={total} onChange={setPage} />

                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-12 col-lg-4">

                        <div className="sv-card">

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: 20 }}>⚠️</span>
                                    <h6 className="nb-side-title mb-0">
                                        Draft Notices ({moderationQueue.length})
                                    </h6>
                                </div>

                                <Badge
                                    label={`${moderationQueue.length} Pending`}
                                    c="orange"
                                />
                            </div>

                            {/* Empty State */}

                            {moderationQueue.length === 0 && (
                                <div
                                    className="text-center py-5"
                                    style={{ color: "#6b7280" }}
                                >
                                    <div style={{ fontSize: 40 }}>✅</div>

                                    <h6 className="mt-2">
                                        No Pending Notices
                                    </h6>

                                    <small>
                                        All notices have been reviewed.
                                    </small>
                                </div>
                            )}

                            {/* Queue */}

                            {moderationQueue.slice(0, 5).map((item) => {

                                const notice = getNoticeIcon(item.notice_type);

                                return (

                                    <div
                                        key={item.notice_id}
                                        className="nb-mod-box"
                                    >

                                        {/* Icon + Title */}

                                        <div className="d-flex gap-3">

                                            <div
                                                className="nb-avatar"
                                                style={{
                                                    background: notice.bg,
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                {notice.icon}
                                            </div>

                                            <div className="flex-grow-1">

                                                <div className="d-flex justify-content-between">

                                                    <div
                                                        className="fw-semibold"
                                                        style={{ fontSize: 15 }}
                                                    >
                                                        {item.title}
                                                    </div>

                                                    <small
                                                        className="text-muted"
                                                    >
                                                        {timeAgo(item.created_at)}
                                                    </small>

                                                </div>

                                                <div className="mt-1 d-flex gap-2 flex-wrap">

                                                    <Badge
                                                        label={item.notice_type}
                                                        c={
                                                            item.notice_type === "general"
                                                                ? "blue"
                                                                : item.notice_type === "maintenance"
                                                                    ? "orange"
                                                                    : item.notice_type === "emergency"
                                                                        ? "red"
                                                                        : item.notice_type === "meeting"
                                                                            ? "peacock"
                                                                            : item.notice_type === "legal"
                                                                                ? "purple"
                                                                                : item.notice_type === "event"
                                                                                    ? "green"
                                                                                    : "gray"
                                                        }
                                                    />

                                                    <Badge
                                                        label={item.priority}
                                                        c={getPriorityColor(item.priority)}
                                                    />

                                                    {item.is_pinned && (
                                                        <Badge
                                                            label="Pinned"
                                                            c="yellow"
                                                        />
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                        {/* Description */}

                                        <p
                                            className="text-start mt-3 mb-2 text-muted"
                                            style={{
                                                fontSize: 13,
                                                lineHeight: "20px"
                                            }}
                                        >
                                            {item.description.length > 70
                                                ? item.description.substring(0, 70) + "..."
                                                : item.description}
                                        </p>

                                        {/* Footer */}

                                        <div
                                            className="d-flex justify-content-between align-items-center mb-3"
                                        >

                                            <small className="text-secondary">

                                                Created

                                                <br />

                                                {new Date(item.created_at).toLocaleDateString()}

                                            </small>

                                            <small className="text-secondary">

                                                ID #{item.notice_id}

                                            </small>

                                        </div>

                                        {/* Buttons */}

                                        <div className="d-flex gap-2">

                                            <button
                                                className="btn-ok flex-grow-1"
                                                onClick={() => approveNotice(item)}
                                            >
                                                ✓ Publish
                                            </button>

                                            <button
                                                className="btn-er flex-grow-1"
                                                onClick={() => rejectNotice(item)}
                                            >
                                                ✕ Archive
                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                            {moderationQueue.length > 5 && (

                                <button className="btn-ac w-100 mt-3">

                                    Show All Pending

                                </button>

                            )}

                        </div>

                    </div>
                </div>
            </div>

            <ExportModal
                show={show}
                onClose={() => setShow(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportNoticeBoard.length}
                currentRecords={filteredData.length}
            />
        </>
    );
};

export default NoticeBoard;
