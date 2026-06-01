import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/NoticeBoard.css"
import { deleteNoticeApi, getNoticeBoardApi } from '../../services/NoticeBoardApi';
import { GetSessionData } from '../../utils/SessionManagement';
import { toast } from "react-toastify";
import {
    FiVolume2,
    FiTool,
    FiAlertTriangle,
    FiCalendar,
    FiBriefcase,
    FiUsers,
    FiEdit,
    FiTrash2
} from "react-icons/fi";

const NoticeBoard = ({ setActive, setSelectedNoticeData }) => {

    const [tab, setTab] = useState("");
    const [societyId, setSocietyId] = useState("");
    const [name, setName] = useState("")
    const [allNoticeBoard, setAllNoticeBoard] = useState([])
    const [page, setPage] = useState(1);
    // const [selectedNoticeData, setSelectedNoticeData] = useState()
    const posts = [
        { icon: "📢", title: "AGM 2025 Date Rescheduled", tag: "Official", tc: "blue", author: "Sara Sharan", time: "2 hours ago", views: "128 views", content: "Due to unforeseen weather conditions, the AGM is postponed to Nov 12th at 5 PM in the Clubhouse." },
        { icon: "💬", title: "Water Seepage in Block B Basement", tag: "Discussion", tc: "orange", author: "Raj Singh (B-402)", time: "Yesterday", comments: "14", locked: true, content: "There is a significant leak near pillar 14. Can the maintenance team prioritize this?" },
        { icon: "👥", title: "Diwali Decoration Volunteers", tag: "Discussion", tc: "orange", author: "Priya Desai (Cultural Comm.)", time: "5 hours ago", comments: "8", content: "Looking for enthusiastic residents to help with rangoli and lighting for Diwali celebrations." },
        { icon: "📋", title: "Found: Car Keys near Gate 2", tag: "Lost & Found", tc: "blue", author: "Security Office", time: "30 min ago", content: "A set of Honda car keys was found near Gate 2. Please collect from security." },
    ];

    const tabs = [
        {
            id: "All",
            value: "",
        },
        {
            id: "General",
            icon: <FiVolume2 size={18} color="#2563eb" />,
            value: "general",
        },
        {
            id: "Maintenance",
            icon: <FiTool size={18} color="#f59e0b" />,
            value: "maintenance",
        },
        {
            id: "Emergency",
            icon: <FiAlertTriangle size={18} color="#ef4444" />,
            value: "emergency",
        },
        {
            id: "Event",
            icon: <FiCalendar size={18} color="#10b981" />,
            value: "event",
        },
        {
            id: "Legal",
            icon: <FiBriefcase size={18} color="#7c3aed" />,
            value: "legal",
        },
        {
            id: "Meeting",
            icon: <FiUsers size={18} color="#06b6d4" />,
            value: "meeting",
        },
    ];



    const getNoticeIcon = (type) => {
        switch (type) {
            case "meeting":
                return {
                    icon: <FiUsers size={18} color="#06b6d4" />,
                    bg: "#cffafe",
                };

            case "general":
                return {
                    icon: <FiVolume2 size={18} color="#2563eb" />,
                    bg: "#dbeafe",
                };

            case "maintenance":
                return {
                    icon: <FiTool size={18} color="#f59e0b" />,
                    bg: "#fef3c7",
                };

            case "emergency":
                return {
                    icon: <FiAlertTriangle size={18} color="#ef4444" />,
                    bg: "#fee2e2",
                };

            case "legal":
                return {
                    icon: <FiBriefcase size={18} color="#7c3aed" />,
                    bg: "#ede9fe",
                };

            case "event":
                return {
                    icon: <FiCalendar size={18} color="#10b981" />,
                    bg: "#d1fae5",
                };

            default:
                return {
                    icon: <FiCalendar size={18} color="#6b7280" />,
                    bg: "#f3f4f6",
                };
        }
    };

    // const tabs = [{ id: "General", icon: "📢", value: "general" }, { id: "Maintenance", icon: "⚠️", value: "maintenance" }, { id: "Emergency", icon: "📄", value: "emergency" }, { id: "Event", icon: "📅", value: "event" }, { id: "Legal", icon: "📅", value: "legal" }, { id: "Meeting", icon: "📅", value: "meeting" },];
    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //fetch session data
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        console.log(data.data.first_name)
        setName(data.data.first_name + " " + data.data.last_name)
        setSocietyId(flats.society_id)
        //fetch get notice board
        getNoticeBoard(flats.society_id)
    }

    //function for get broadcast
    const getNoticeBoard = async (societyId) => {

        try {
            const data = await getNoticeBoardApi(societyId)
            console.log(data.list)
            setAllNoticeBoard(data.list)
        } catch (error) {
            console.log(error)
        }
    }

    //fetch get notice board by id
    const getNoticeBoardById = async (selectedData) => {
        setSelectedNoticeData(selectedData);
        setActive("createNoticeBoard");
    };

    // const deleteNotice = async (noticeId) => {
    //     try {
    //         const data = await deleteNoticeApi(noticeId)
    //         console.log(data)
    //         toast.success("Notice deleted successfully!")
    //         getNoticeBoard(societyId)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const deleteNotice = async (noticeId) => {
        const confirmed = window.confirm("Are you sure you want to delete this notice?");

        if (!confirmed) return;

        try {
            const data = await deleteNoticeApi(noticeId);
            console.log(data);
            toast.success("Notice deleted successfully!");
            getNoticeBoard(societyId);
        } catch (error) {
            console.log(error);
        }
    };

    const timeAgo = (utcDate) => {

        // UTC date convert
        const past = new Date(utcDate);

        // current UTC time
        const now = new Date();

        const seconds = Math.floor((now - past) / 1000);

        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        if (minutes > 0) {
            return `${minutes} min ago`;
        }

        return "Just now";
    };

    //filter data by notice type
    const filteredData = tab === ""
        ? allNoticeBoard
        : allNoticeBoard.filter((item) => item.notice_type === tab);

    const per = 5, total = Math.ceil(allNoticeBoard.length / per);
    const rows = allNoticeBoard.slice((page - 1) * per, page * per);
    return (
        <>

            <div className="pg row g-4 nb-wrap">

                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card">
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-sm btn-ac ms-2 btn-primary'
                                onClick={() => {
                                    setActive("createNoticeBoard");
                                    setSelectedNoticeData("")
                                }}>
                                Create
                            </button>
                        </div>
                        <div className="NoticeBoardTabs mt-3"
                        >
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.value)}
                                    className={`NoticeBoardTabs-btn ${tab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} &nbsp;{t.id}
                                </button>
                            ))}
                        </div>
                        {filteredData.map((p, i, arr) => {
                            const noticeData = getNoticeIcon(p.notice_type);
                            return (
                                <div
                                    key={i}
                                    className={`nb-post text-start ${i < arr.length - 1 ? "nb-border" : ""}`}
                                >

                                    <div className="d-flex gap-3">

                                        <div
                                            className="nb-avatar"
                                            style={{ background: noticeData.bg }}
                                        >
                                            {noticeData.icon}
                                        </div>
                                        <div className="flex-grow-1">

                                            <div className="d-flex justify-content-between align-items-start flex-wrap mb-1">

                                                {/* Left Side */}
                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    <span className="nb-title">{p.title}</span>
                                                    <Badge
                                                        label={p.notice_type}
                                                        c={
                                                            p.notice_type === "general"
                                                                ? "blue"
                                                                : p.notice_type === "maintenance"
                                                                    ? "orange"
                                                                    : p.notice_type === "emergency"
                                                                        ? "red"
                                                                        : p.notice_type === "event"
                                                                            ? "green"
                                                                            : p.notice_type === "legal"
                                                                                ? "purple"
                                                                                : p.notice_type === "meeting"
                                                                                    ? "peacock"
                                                                                    : "gray"
                                                        }
                                                    />
                                                    {/* <Badge label={p.notice_type} c={p.tc} /> */}
                                                </div>

                                                {/* Right Side */}
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
                            )
                        })}
                        <Pagination
                            page={page}
                            total={total}
                            onChange={setPage}
                        />

                    </div>
                </div>

                {/* RIGHT */}
                <div className="col-12 col-lg-4">

                    {/* Stats */}
                    <div className="sv-card mb-3">
                        <div className="row g-0 text-center">
                            {[["24", "Active notices", ""], ["3", "Pending Review", "tx-danger"], ["156", "Comments Today", ""], ["12", "New Threads", ""]]
                                .map(([v, l, cls], i) => (
                                    <div
                                        key={l}
                                        className={`col-6 py-3 nb-stat ${cls} ${i < 2 ? "nb-bb" : ""} ${i % 2 === 0 ? "nb-br" : ""}`}
                                    >
                                        <div className="nb-stat-val">{v}</div>
                                        <div className="nb-stat-label">{l}</div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Moderation */}
                    <div className="sv-card">

                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span>⚠️</span>
                            <h6 className="nb-side-title">Moderation Queue (3)</h6>
                        </div>

                        {[
                            { name: "Raj Singh (A-612)", time: "10m ago", text: "Why is the gym AC never working?…" },
                            { name: "Neha Verma (C-501)", time: "45m ago", text: "Selling my old sofa set..." },
                        ].map((m, i) => (
                            <div key={i} className="nb-mod-box">

                                <div className="d-flex justify-content-between mb-1">
                                    <span className="nb-mod-name">{m.name}</span>
                                    <span className="nb-mod-time">{m.time}</span>
                                </div>

                                <p className="nb-mod-text text-start">"{m.text}"</p>

                                <div className="d-flex gap-2">
                                    <button className="btn-ok flex-grow-1">Approve</button>
                                    <button className="btn-er flex-grow-1">Reject</button>
                                </div>

                            </div>
                        ))}

                        <button className="btn-ac w-100">Show all moderation</button>
                    </div>

                </div>
            </div>
        </>

    );
}

export default NoticeBoard