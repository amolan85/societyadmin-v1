import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { deleteBroadcastApi, getBroadcastApi } from '../../services/BroadcastApi';
import { GetSessionData } from '../../utils/SessionManagement';
import { toast } from "react-toastify";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {
    FiVolume2,
    FiAlertTriangle,
    FiCalendar,
    FiGrid,
    FiFileText
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Broadcast = ({ setActive, setBroadcastId }) => {
    const [page, setPage] = useState(1);
    const [allBroadcast, setAllBroadcast] = useState([])
    const [broadcastTypeTab, setBroadcastTypeTab] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [name, setName] = useState("")

    const broadcastType = [
        { id: "All", icon: <FiGrid size={18} color="#2563eb" />, value: "" },
        { id: "Announcement", icon: <FiVolume2 size={18} color="#f59e0b" />, value: "announcement" },
        { id: "Emergency", icon: <FiAlertTriangle size={18} color="#ef4444" />, value: "emergency" },
        { id: "Circular", icon: <FiFileText size={18} color="purple" />, value: "circular" },
        { id: "Event", icon: <FiCalendar size={18} color="#10b981" />, value: "event" },
    ];



    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    // Get session data and fetch broadcast list
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setName(data.data.first_name + " " + data.data.last_name)
        //call function for get broadcast
        getBroadcast(flats.society_id)
    }

    //function for get broadcast
    const getBroadcast = async (societyId) => {
        try {
            const data = await getBroadcastApi(societyId)
            setAllBroadcast(data)
        } catch (error) {
            console.log(error)
        }
    }

    //function for get broad cast by id
    const getBroadcastById = (id) => {
        setBroadcastId(id);
        setActive("createbroadcast");    // pehle ID set karo
    };

    const deleteBroadcast = async (broadcastId) => {
        try {
            const data = await deleteBroadcastApi(broadcastId)
            console.log(data)
            toast.success("Broadcast deleted successfully!")
            getBroadcast(societyId)
        } catch (error) {
            console.log(error)
        }
    }

    const downloadExcel = () => {

        // convert json to worksheet
        const worksheet = XLSX.utils.json_to_sheet(allBroadcast);

        // create workbook
        const workbook = XLSX.utils.book_new();

        // append worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Broadcast");

        // download file
        XLSX.writeFile(workbook, "BroadcastData.xlsx");
    };

    const downloadCSV = () => {

        // convert json data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(allBroadcast);

        // convert worksheet to csv
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

        // create blob
        const blob = new Blob([csvOutput], {
            type: "text/csv;charset=utf-8;",
        });

        // create download link
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "BroadcastData.csv";

        link.click();
    };

    const downloadPDF = () => {

        // landscape mode
        const doc = new jsPDF("landscape");

        // PDF Heading
        doc.setFontSize(18);
        doc.text("Broadcast Report", 14, 15);

        // table columns
        const tableColumn = [
            "Subject",
            "Content",
            "Type",
            "Schedule Date",
            "Status",
        ];

        // table rows
        const tableRows = allBroadcast.map((item) => [
            item.title,
            item.message,
            item.type,
            item.scheduled_at,
            item.status,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,

            // table start after heading
            startY: 25,

            styles: {
                fontSize: 8,
                cellPadding: 3,
            },

            headStyles: {
                fillColor: [13, 110, 253],
            },

            theme: "grid",
        });

        doc.save("BroadcastData.pdf");
    };

    const filteredData = broadcastTypeTab === ""
        ? allBroadcast
        : allBroadcast.filter((item) => item.type === broadcastTypeTab);

    //for pagination
    const per = 10, total = Math.ceil(filteredData.length / per);
    const rows = filteredData.slice((page - 1) * per, page * per);


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


    const getNoticeIcon = (type) => {
        switch (type) {
            case "announcement":
                return {
                    icon: <FiVolume2 size={18} color="#ff9800" />,
                    bg: "#fff3e0",
                };
            case "circular":
                return {
                    icon: <FiFileText size={18} color="#7c3aed" />,
                    bg: "#ede9fe",
                };

            case "emergency":
                return {
                    icon: <FiAlertTriangle size={18} color="#ef4444" />,
                    bg: "#fee2e2",
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


    return (
        <>
            <div className="pg row g-4 nb-wrap">

                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card">
                        <div className="d-flex justify-content-end">

                            <button className='btn btn-sm btn-primary' onClick={() => { setActive("createbroadcast"); setBroadcastId("") }}>Create</button>
                        </div>
                        <div className="NoticeBoardTabs mt-3"
                        >
                            {broadcastType.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { setBroadcastTypeTab(t.value); setPage(1); }}
                                    className={`NoticeBoardTabs-btn ${broadcastTypeTab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} &nbsp;{t.id}
                                </button>
                            ))}
                        </div>
                        {rows.map((p, i, arr) => {
                            const noticeData = getNoticeIcon(p.type);
                            return (
                                <div
                                    key={p.broadcast_id}
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
                                                        label={p.type}
                                                        c={
                                                            p.type === "announcement"
                                                                ? "orange"
                                                                : p.type === "circular"
                                                                    ? "purple"
                                                                    : p.type === "emergency"
                                                                        ? "red"
                                                                        : p.type === "event"
                                                                            ? "green"

                                                                            : "gray"
                                                        }
                                                    />
                                                    {/* <Badge label={p.notice_type} c={p.tc} /> */}
                                                </div>

                                                {/* Right Side */}
                                                <div className="d-flex align-items-center gap-3">
                                                    {p.status === "draft" ? (
                                                        <FiEdit
                                                            size={18}
                                                            style={{ cursor: "pointer", color: "orange" }}
                                                            onClick={() => getBroadcastById(p.broadcast_id)}
                                                        />
                                                    ) : (
                                                        <Badge
                                                            label={p.status}
                                                            c={
                                                                p.status === "scheduled"
                                                                    ? "blue"
                                                                    : p.status === "sent"
                                                                        ? "green"
                                                                        : p.status === "failed"
                                                                            ? "red"
                                                                            : "gray"
                                                            }
                                                        />
                                                    )}
                                                    {p.locked && (
                                                        <span className="nb-locked">🔒 Locked</span>
                                                    )}

                                                    <FiTrash2
                                                        size={18}
                                                        style={{ cursor: "pointer", color: "red" }}
                                                        onClick={() => deleteBroadcast(p.broadcast_id)}
                                                    />
                                                </div>
                                            </div>

                                            <p className="nb-content">{p.message}</p>

                                            <div className="nb-meta">
                                                👤 {name} • {timeAgo(p.sent_at)}
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
    )
}

export default Broadcast






































// import { useState, useEffect } from "react";
// import {
//     FiEdit,
//     FiTrash2,
//     FiVolume2,
//     FiAlertTriangle,
//     FiCalendar,
//     FiGrid,
//     FiFileText,
//     FiSearch,
//     FiMail,
//     FiMessageSquare,
// } from "react-icons/fi";
// import { toast } from "react-toastify";
// import { Badge, Pagination } from "../../components/Common/ReusableFunction";
// import "../../styles/StaffAttendance.css";
// import {
//     deleteBroadcastApi,
//     getBroadcastListApi,
// } from "../../services/BroadcastApi";
// import { GetSessionData } from "../../utils/SessionManagement";

// const Broadcast = ({ setActive, setBroadcastId }) => {

//     // =====================================================
//     // STATES
//     // =====================================================

//     const [page, setPage] = useState(1);
//     const [limit] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [allBroadcast, setAllBroadcast] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [societyId, setSocietyId] = useState("");
//     const [name, setName] = useState("");

//     // filters
//     const [search, setSearch] = useState("");
//     const [broadcastTypeTab, setBroadcastTypeTab] = useState("");
//     const [status, setStatus] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // type counts for stats
//     const [typeCounts, setTypeCounts] = useState({
//         announcement: 0,
//         emergency: 0,
//         circular: 0,
//         event: 0,
//     });

//     // =====================================================
//     // TABS CONFIG
//     // =====================================================

//     const broadcastType = [
//         { id: "All",          icon: <FiGrid size={15} color="#2563eb" />,          value: "" },
//         { id: "Announcement", icon: <FiVolume2 size={15} color="#f59e0b" />,       value: "announcement" },
//         { id: "Emergency",    icon: <FiAlertTriangle size={15} color="#ef4444" />, value: "emergency" },
//         { id: "Circular",     icon: <FiFileText size={15} color="purple" />,       value: "circular" },
//         { id: "Event",        icon: <FiCalendar size={15} color="#10b981" />,      value: "event" },
//     ];

//     // =====================================================
//     // LOAD SESSION
//     // =====================================================

//     useEffect(() => {
//         SessionData();
//     }, []);

//     const SessionData = async () => {
//         try {
//             const data = await GetSessionData();
//             const flats = data.data.flats[0];
//             setSocietyId(flats.society_id);
//             setName(`${data.data.first_name} ${data.data.last_name}`);
//             // pass societyId directly since state won't be set yet
//             getBroadcast({
//                 sid: flats.society_id,
//                 currentPage: 1,
//                 currentSearch: "",
//                 currentType: "",
//                 currentStatus: "",
//                 currentStartDate: "",
//                 currentEndDate: "",
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // =====================================================
//     // AUTO LOAD — re-fetch when any filter or page changes
//     // (skips on first render — SessionData handles that call)
//     // =====================================================

//     useEffect(() => {
//         if (!societyId) return;
//         getBroadcast({
//             sid: societyId,
//             currentPage: page,
//             currentSearch: search,
//             currentType: broadcastTypeTab,
//             currentStatus: status,
//             currentStartDate: startDate,
//             currentEndDate: endDate,
//         });
//     }, [page, broadcastTypeTab, status, startDate, endDate]);
//     // NOTE: search is intentionally excluded — it fires only on button/Enter

//     // =====================================================
//     // API — GET BROADCAST LIST
//     //
//     // Your getBroadcastListApi service already does:
//     //   return response.data.data
//     // So what comes back is directly:
//     //   { records: [...], total_pages: 3, total_records: 28, page: 1, limit: 10 }
//     //
//     // Payload keys MUST match what the service function expects:
//     //   currentPage, currentSearch, currentType,
//     //   currentStatus, currentStartDate, currentEndDate
//     // =====================================================

//     const getBroadcast = async ({
//         sid,
//         currentPage,
//         currentSearch,
//         currentType,
//         currentStatus,
//         currentStartDate,
//         currentEndDate,
//     }) => {
//         try {
//             setLoading(true);

//             const payload = {
//                 society_id:       sid,
//                 currentPage:      currentPage,
//                 limit:            limit,
//                 currentSearch:    currentSearch,
//                 currentType:      currentType,
//                 currentStatus:    currentStatus,
//                 currentStartDate: currentStartDate,
//                 currentEndDate:   currentEndDate,
//             };

//             // service returns response.data.data directly
//             // shape: { records: [], total_pages: N, total_records: N }
//             const apiData = await getBroadcastListApi(payload);

//             const records = apiData?.records || [];

//             setAllBroadcast(records);
//             setTotalPages(apiData?.total_pages || 1);
//             setTotalRecords(apiData?.total_records || 0);

//             // type counts for breakdown bars
//             const counts = { announcement: 0, emergency: 0, circular: 0, event: 0 };
//             records.forEach((r) => {
//                 if (counts[r.type] !== undefined) counts[r.type]++;
//             });
//             setTypeCounts(counts);

//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load broadcasts");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // SEARCH — fires API with current search value
//     // =====================================================

//     const handleSearch = () => {
//         setPage(1);
//         getBroadcast({
//             sid:              societyId,
//             currentPage:      1,
//             currentSearch:    search,
//             currentType:      broadcastTypeTab,
//             currentStatus:    status,
//             currentStartDate: startDate,
//             currentEndDate:   endDate,
//         });
//     };

//     const handleSearchKeyDown = (e) => {
//         if (e.key === "Enter") handleSearch();
//     };

//     // =====================================================
//     // PAGINATION — page change triggers useEffect above
//     // =====================================================

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//         // useEffect [page, ...] will fire getBroadcast automatically
//     };

//     // =====================================================
//     // DELETE
//     // =====================================================

//     const deleteBroadcast = async (broadcastId) => {
//         try {
//             await deleteBroadcastApi(broadcastId);
//             toast.success("Broadcast deleted successfully");
//             // reload current page
//             getBroadcast({
//                 sid:              societyId,
//                 currentPage:      page,
//                 currentSearch:    search,
//                 currentType:      broadcastTypeTab,
//                 currentStatus:    status,
//                 currentStartDate: startDate,
//                 currentEndDate:   endDate,
//             });
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to delete broadcast");
//         }
//     };

//     // =====================================================
//     // EDIT
//     // =====================================================

//     const getBroadcastById = (id) => {
//         setBroadcastId(id);
//         setActive("createbroadcast");
//     };

//     // =====================================================
//     // TIME AGO
//     // =====================================================

//     const timeAgo = (utcDate) => {
//         if (!utcDate) return "Not sent";
//         const past    = new Date(utcDate);
//         const now     = new Date();
//         const seconds = Math.floor((now - past) / 1000);
//         const minutes = Math.floor(seconds / 60);
//         const hours   = Math.floor(minutes / 60);
//         const days    = Math.floor(hours / 24);
//         if (days > 0)    return `${days} day${days > 1 ? "s" : ""} ago`;
//         if (hours > 0)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//         if (minutes > 0) return `${minutes} min ago`;
//         return "Just now";
//     };

//     // =====================================================
//     // ICON CONFIG
//     // =====================================================

//     const getNoticeIcon = (type) => {
//         switch (type) {
//             case "announcement": return { icon: <FiVolume2 size={16} color="#ff9800" />,       bg: "#fff3e0" };
//             case "circular":     return { icon: <FiFileText size={16} color="#7c3aed" />,      bg: "#ede9fe" };
//             case "emergency":    return { icon: <FiAlertTriangle size={16} color="#ef4444" />, bg: "#fee2e2" };
//             case "event":        return { icon: <FiCalendar size={16} color="#10b981" />,      bg: "#d1fae5" };
//             default:             return { icon: <FiCalendar size={16} color="#6b7280" />,      bg: "#f3f4f6" };
//         }
//     };

//     const getChannelIcon = (channel) => {
//         switch (channel) {
//             case "email":    return <FiMail size={12} />;
//             case "sms":      return <FiMessageSquare size={12} />;
//             case "whatsapp": return <span style={{ fontSize: 12 }}>💬</span>;
//             default:         return null;
//         }
//     };

//     const getStatusColor = (s) => {
//         if (s === "sent")      return "green";
//         if (s === "scheduled") return "blue";
//         if (s === "draft")     return "orange";
//         return "red";
//     };

//     const getTypeColor = (t) => {
//         if (t === "announcement") return "orange";
//         if (t === "emergency")    return "red";
//         if (t === "circular")     return "purple";
//         return "green";
//     };

//     // =====================================================
//     // RENDER
//     // =====================================================

//     return (
//         <div className="pg row g-4 nb-wrap">

//             {/* ── LEFT COLUMN ── */}
//             <div className="col-12 col-lg-8">
//                 <div className="sv-card">

//                     {/* TOP BAR */}
//                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//                         <button
//                             className="btn btn-primary btn-sm"
//                             onClick={() => { setActive("createbroadcast"); setBroadcastId(""); }}
//                         >
//                             + Create
//                         </button>

//                         <div className="d-flex gap-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 className="form-control form-control-sm"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 onKeyDown={handleSearchKeyDown}
//                             />
//                             <button className="btn btn-primary btn-sm" onClick={handleSearch}>
//                                 <FiSearch size={14} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* FILTERS */}
//                     <div className="row mt-3 g-2">
//                         <div className="col-md-4">
//                             <select
//                                 className="form-select form-select-sm"
//                                 value={status}
//                                 onChange={(e) => { setStatus(e.target.value); setPage(1); }}
//                             >
//                                 <option value="">All Status</option>
//                                 <option value="draft">Draft</option>
//                                 <option value="scheduled">Scheduled</option>
//                                 <option value="sent">Sent</option>
//                                 <option value="failed">Failed</option>
//                             </select>
//                         </div>
//                         <div className="col-md-4">
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 value={startDate}
//                                 onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
//                             />
//                         </div>
//                         <div className="col-md-4">
//                             <input
//                                 type="date"
//                                 className="form-control form-control-sm"
//                                 value={endDate}
//                                 onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
//                             />
//                         </div>
//                     </div>

//                     {/* TYPE TABS */}
//                     <div className="NoticeBoardTabs mt-3">
//                         {broadcastType.map((t) => (
//                             <button
//                                 key={t.id}
//                                 onClick={() => { setBroadcastTypeTab(t.value); setPage(1); }}
//                                 className={`NoticeBoardTabs-btn ${broadcastTypeTab === t.value ? "active" : ""}`}
//                             >
//                                 {t.icon} {t.id}
//                             </button>
//                         ))}
//                     </div>

//                     {/* LIST */}
//                     {loading ? (

//                         <div className="text-center py-5 text-muted">
//                             <div className="spinner-border spinner-border-sm me-2" role="status" />
//                             Loading...
//                         </div>

//                     ) : allBroadcast.length === 0 ? (

//                         <div className="text-center py-5 text-muted">
//                             <FiGrid size={32} className="mb-2 opacity-25" />
//                             <br />
//                             No Broadcast Found
//                         </div>

//                     ) : (

//                         allBroadcast.map((p, i) => {
//                             const noticeData = getNoticeIcon(p.type);
//                             return (
//                                 <div
//                                     key={p.id}
//                                     className={`nb-post text-start ${i !== allBroadcast.length - 1 ? "nb-border" : ""}`}
//                                 >
//                                     <div className="d-flex gap-3">

//                                         <div className="nb-avatar" style={{ background: noticeData.bg }}>
//                                             {noticeData.icon}
//                                         </div>

//                                         <div className="flex-grow-1 min-w-0">

//                                             {/* ROW 1 — title + actions */}
//                                             <div className="d-flex justify-content-between align-items-start flex-wrap gap-1 mb-1">

//                                                 <div className="d-flex align-items-center gap-2 flex-wrap">
//                                                     <span className="nb-title">{p.title}</span>
//                                                     <Badge label={p.type} c={getTypeColor(p.type)} />
//                                                     {p.channel && (
//                                                         <span
//                                                             className="badge rounded-pill"
//                                                             style={{
//                                                                 fontSize: 10,
//                                                                 background: "#f3f4f6",
//                                                                 color: "#374151",
//                                                                 display: "inline-flex",
//                                                                 alignItems: "center",
//                                                                 gap: 3,
//                                                                 padding: "2px 7px",
//                                                             }}
//                                                         >
//                                                             {getChannelIcon(p.channel)} {p.channel}
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 <div className="d-flex gap-2 align-items-center">
//                                                     {p.status === "draft" ? (
//                                                         <FiEdit
//                                                             size={16}
//                                                             title="Edit draft"
//                                                             style={{ cursor: "pointer", color: "orange" }}
//                                                             onClick={() => getBroadcastById(p.id)}
//                                                         />
//                                                     ) : (
//                                                         <Badge label={p.status} c={getStatusColor(p.status)} />
//                                                     )}
//                                                     <FiTrash2
//                                                         size={16}
//                                                         title="Delete"
//                                                         style={{ cursor: "pointer", color: "red" }}
//                                                         onClick={() => deleteBroadcast(p.id)}
//                                                     />
//                                                 </div>
//                                             </div>

//                                             {/* MESSAGE */}
//                                             <p className="nb-content">{p.message}</p>

//                                             {/* META FOOTER */}
//                                             <div className="nb-meta d-flex flex-wrap gap-2">
//                                                 <span>👤 {name}</span>
//                                                 <span>•</span>
//                                                 <span>{timeAgo(p.sent_at || p.created_at)}</span>
//                                                 {p.scheduled_at && (
//                                                     <>
//                                                         <span>•</span>
//                                                         <span>📅 {new Date(p.scheduled_at).toLocaleDateString()}</span>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}

//                     {/* PAGINATION */}
//                     <Pagination
//                         page={page}
//                         total={totalPages}
//                         onChange={handlePageChange}
//                     />

//                     {/* RECORDS INFO */}
//                     {!loading && totalRecords > 0 && (
//                         <div className="text-center mt-2" style={{ fontSize: 12, color: "#6b7280" }}>
//                             Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalRecords)} of {totalRecords} records
//                         </div>
//                     )}

//                 </div>
//             </div>

//             {/* ── RIGHT COLUMN ── */}
//             <div className="col-12 col-lg-4">

//                 {/* STATS CARD */}
//                 <div className="sv-card mb-3">
//                     <h6 className="mb-3 fw-semibold">Broadcast Statistics</h6>
//                     <div className="row text-center g-2">
//                         <div className="col-6">
//                             <div className="p-2 rounded" style={{ background: "#f0f9ff" }}>
//                                 <h4 className="mb-0" style={{ color: "#0369a1" }}>{totalRecords}</h4>
//                                 <small className="text-muted">Total Records</small>
//                             </div>
//                         </div>
//                         <div className="col-6">
//                             <div className="p-2 rounded" style={{ background: "#f0fdf4" }}>
//                                 <h4 className="mb-0" style={{ color: "#15803d" }}>{page}</h4>
//                                 <small className="text-muted">Current Page</small>
//                             </div>
//                         </div>
//                         <div className="col-6">
//                             <div className="p-2 rounded" style={{ background: "#fefce8" }}>
//                                 <h4 className="mb-0" style={{ color: "#a16207" }}>{totalPages}</h4>
//                                 <small className="text-muted">Total Pages</small>
//                             </div>
//                         </div>
//                         <div className="col-6">
//                             <div className="p-2 rounded" style={{ background: "#fdf4ff" }}>
//                                 <h4 className="mb-0" style={{ color: "#7e22ce" }}>{limit}</h4>
//                                 <small className="text-muted">Per Page</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* TYPE BREAKDOWN CARD */}
//                 <div className="sv-card">
//                     <h6 className="mb-3 fw-semibold">Type Breakdown</h6>
//                     {[
//                         { key: "announcement", label: "Announcement", icon: <FiVolume2 size={14} color="#ff9800" />,       bg: "#fff3e0", color: "#c05500" },
//                         { key: "emergency",    label: "Emergency",    icon: <FiAlertTriangle size={14} color="#ef4444" />, bg: "#fee2e2", color: "#991b1b" },
//                         { key: "circular",     label: "Circular",     icon: <FiFileText size={14} color="#7c3aed" />,      bg: "#ede9fe", color: "#5b21b6" },
//                         { key: "event",        label: "Event",        icon: <FiCalendar size={14} color="#10b981" />,      bg: "#d1fae5", color: "#065f46" },
//                     ].map(({ key, label, icon, bg, color }) => {
//                         const count = typeCounts[key] || 0;
//                         const pct   = allBroadcast.length
//                             ? Math.round((count / allBroadcast.length) * 100)
//                             : 0;
//                         return (
//                             <div key={key} className="d-flex align-items-center gap-2 mb-3">
//                                 <div style={{
//                                     width: 28, height: 28, borderRadius: 6, background: bg,
//                                     display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                                 }}>
//                                     {icon}
//                                 </div>
//                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                     <div className="d-flex justify-content-between mb-1">
//                                         <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
//                                         <span style={{ fontSize: 12, fontWeight: 600, color }}>{count}</span>
//                                     </div>
//                                     <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4 }}>
//                                         <div style={{
//                                             height: 4, width: `${pct}%`,
//                                             background: color, borderRadius: 4,
//                                             transition: "width 0.4s ease",
//                                         }} />
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Broadcast;