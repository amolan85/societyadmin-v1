import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/NoticeBoard.css"
import { getNoticeBoardApi } from '../../services/NoticeBoardApi';
import { GetSessionData } from '../../utils/SessionManagement';
import CreateNoticeBoard from './CreateNoticeBoard';
import { FiEdit } from 'react-icons/fi';
import { useLoader } from "../../context/LoaderContext";

const NoticeBoard = ({ setActive, setSelectedNoticeData }) => {
    const { setLoading } = useLoader();

    const [tab, setTab] = useState("");
    const [name, setName] = useState("")
    const [allNoticeBoard, setAllNoticeBoard] = useState([])
    // const [selectedNoticeData, setSelectedNoticeData] = useState()
    const posts = [
        { icon: "📢", title: "AGM 2025 Date Rescheduled", tag: "Official", tc: "blue", author: "Sara Sharan", time: "2 hours ago", views: "128 views", content: "Due to unforeseen weather conditions, the AGM is postponed to Nov 12th at 5 PM in the Clubhouse." },
        { icon: "💬", title: "Water Seepage in Block B Basement", tag: "Discussion", tc: "orange", author: "Raj Singh (B-402)", time: "Yesterday", comments: "14", locked: true, content: "There is a significant leak near pillar 14. Can the maintenance team prioritize this?" },
        { icon: "👥", title: "Diwali Decoration Volunteers", tag: "Discussion", tc: "orange", author: "Priya Desai (Cultural Comm.)", time: "5 hours ago", comments: "8", content: "Looking for enthusiastic residents to help with rangoli and lighting for Diwali celebrations." },
        { icon: "📋", title: "Found: Car Keys near Gate 2", tag: "Lost & Found", tc: "blue", author: "Security Office", time: "30 min ago", content: "A set of Honda car keys was found near Gate 2. Please collect from security." },
    ];

    const tabs = [
        { id: "General", icon: "📢", value: "general" },
        { id: "Maintenance", icon: "⚠️", value: "maintenance" },
        { id: "Emergency", icon: "📄", value: "emergency" },
        { id: "Event", icon: "📅", value: "event" },
        { id: "Legal", icon: "📅", value: "legal" },
        { id: "Meeting", icon: "📅", value: "meeting" },
    ];

    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
            const data = await GetSessionData()
            console.log(data.data)
            const flats = data.data.flats[0]
            console.log(data.data.first_name)
            setName(data.data.first_name + " " + data.data.last_name)

            getNoticeBoard(flats.society_id)
    }


    //function for get broadcast
    const getNoticeBoard = async (societyId) => {
        try{    
            setLoading(true)
            const data = await getNoticeBoardApi(societyId)
            console.log(data.list)
            setAllNoticeBoard(data.list)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }

    }
    const getNoticeBoardById = async (selectedData) => {
        setSelectedNoticeData(selectedData);
        setActive("createNoticeBoard");
    };

    const filteredData = tab === ""
        ? allNoticeBoard
        : allNoticeBoard.filter((item) => item.notice_type === tab);

    return (
        <>

            <div className="pg row g-4 nb-wrap">

                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="sv-card">
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary btn-sm'
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
                                    {t.icon} {t.id}
                                </button>
                            ))}
                        </div>
                        {filteredData.map((p, i, arr) => (
                            <div
                                key={i}
                                className={`nb-post text-start ${i < arr.length - 1 ? "nb-border" : ""}`}
                            >
                                <div className="d-flex gap-3">

                                    <div className="nb-avatar">
                                        {p.icon}
                                    </div>

                                    <div className="flex-grow-1">

                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <span className="nb-title">{p.title}</span>
                                            <Badge label={p.notice_type} c={p.tc} />

                                            {p.status === "draft" && (
                                                <FiEdit onClick={() => getNoticeBoardById(p.notice_id)} />
                                            )}
                                            {p.locked && (
                                                <span className="nb-locked">🔒 Thread Locked</span>
                                            )}
                                        </div>

                                        <p className="nb-content">{p.description}</p>

                                        <div className="nb-meta">
                                            👤 {name} • {p.publish_date}
                                            {p.views && ` • 👁 ${p.views}`}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}

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