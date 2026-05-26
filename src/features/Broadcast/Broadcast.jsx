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