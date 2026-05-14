import React, { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi, getBroadcastByIdApi, UpdateBroadcastApi } from '../../services/BroadcastApi';
import { createNoticeApi, getNoticeBoardByIdApi, updateNoticeApi } from '../../services/NoticeBoardApi';
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

const CreateNoticeBoard = ({ setActive, selectedNoticeData }) => {
    console.log(selectedNoticeData, "id")
    const [noticeType, setNoticeType] = useState("general");
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState(null)
    const [channel, setChannel] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [schedule, setSchedule] = useState("sendNow")
    const [errors, setErrors] = useState({})
    const [scheduleDateTime, setScheduleDateTime] = useState("");
    const [noticeId, setNoticeId] = useState("")
    const [errorText, setErrorText] = useState("")

    const tabs = [
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

    const priorityTabs = [
        {
            id: "High",
            value: "high",
            // icon: "🔴"
        },
        {
            id: "Normal",
            value: "normal",
            // icon: "🟢"
        },
        {
            id: "Urgent",
            value: "urgent",
            // icon: "🚨"
        },
        {
            id: "Low",
            value: "low",
            // icon: "🟡"
        }
    ];

    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //function for session data
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(data.data.user_id)
        // GetBroadCastById()
    }

    //fetch get notice board by id api
    useEffect(() => {
        if (selectedNoticeData) {
            GetNoticeBoardById();
        }
    }, [selectedNoticeData]);

    //fetch get notice board by id
    const GetNoticeBoardById = async () => {
        try {
            const data = await getNoticeBoardByIdApi(selectedNoticeData);
            console.log(data);
            setSubject(data.title)
            setDescription(data.description)
            setPriority(data.priority)
            setNoticeType(data.notice_type)
            setNoticeId(data.notice_id)
        } catch (error) {
            console.log(error);
        }
    };

    //function for validate form
    const validateForm = () => {
        let errors = {};

        if (!subject) {
            errors.subject = "required";
        }

        if (!description) {
            errors.description = "required";
        }
        if (!priority) {
            errors.priority = "required";
        }
        return errors;
    };

    //function for submit notice board
    const submitNoticeBoard = async (status) => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            let response;

            if (noticeId) {
                response = await updateNoticeApi(
                    noticeId, subject, description, noticeType, priority, status
                );
                toast.success("Notice updated successfully!")

            } else {
                response = await createNoticeApi(
                    societyId, userId, subject, description, noticeType, priority, status
                );
                toast.success("Notice created successfully!")
            }
            setActive("noticeboard")
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error(error);
            setErrorText(error)
        }
    };

    //handle change for channel
    const handleChannelChange = (e) => {
        const { name, checked } = e.target;

        setChannel(prev => ({
            ...prev,
            [name]: checked
        }));
    };


    return (
        <div className="pg row g-4 bc-wrap">
            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="bc-title">
                            {noticeId ? "Update" : "Create"} Notice Board
                        </h5>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setActive("noticeboard")}
                        >
                            Back
                        </button>
                    </div>
                    <div className="broadcastTabs mt-2">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setNoticeType(t.value)}
                                className={`broadcastTab-btn ${noticeType === t.value ? "active" : ""}`}
                            >
                                {t.icon} {t.id}
                            </button>
                        ))}
                    </div>
                    <div className='d-flex'>
                        <label className="sv-lb">Subject / Title <span className='text-danger'>*</span></label>
                        {errors.subject && <span className='text-danger mx-2 '>{errors.subject}</span>}
                    </div>

                    <input className={`sv-in mb-3 ${errors.subject ? "error-input" : ""}`} placeholder="Example: Scheduled Maintenance of Lift B"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} />

                    <div className='d-flex'>
                        <label className="sv-lb">Description <span className='text-danger'>*</span></label>
                        {errors.description && <span className='text-danger mx-2 '>{errors.description}</span>}
                    </div>

                    <div className={`bc-editor-box ${errors.description ? "error-input" : ""}`}>
                        <div className="bc-editor-toolbar">
                            {["B", "I", "U", "≡", "≔", "🔗"].map(b => (
                                <button key={b} className={`bc-editor-btn ${b === "B" ? "bold" : ""}`}>
                                    {b}
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="sv-ta bc-editor-textarea"
                            placeholder="Type your announcement details here…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>


                    <label className="sv-lb">Priority <span className='text-danger'>*</span></label>

                    {/* <div className="d-flex gap-3 mb-4">

                        <label className="bx">
                            <input
                                type="radio"
                                name="priority"
                                value="high"
                                checked={priority === "high"}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            &nbsp; High
                        </label>

                        <label className="bx">
                            <input
                                type="radio"
                                name="priority"
                                value="normal"
                                checked={priority === "normal"}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            &nbsp; Normal
                        </label>

                        <label className="bx">
                            <input
                                type="radio"
                                name="priority"
                                value="urgent"
                                checked={priority === "urgent"}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            &nbsp; Urgent
                        </label>

                        <label className="bx">
                            <input
                                type="radio"
                                name="priority"
                                value="low"
                                checked={priority === "low"}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            &nbsp; Low
                        </label>
                        
                    </div> */}

                    <div className="priorityTab mt-2">
                        {priorityTabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setPriority(t.value)}
                                className={`priorityTab-btn ${priority === t.value ? "active" : ""}`}
                            >
                                {t.icon} {t.id}
                            </button>
                        ))}
                    </div>

                    {errorText && <h6 className='text-danger'>{errorText}</h6>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn-ol">Preview</button>
                        <button className="btn-ol" onClick={() => { submitNoticeBoard("draft") }}>Save Draft</button>
                        <button className="btn-ac" onClick={() => { submitNoticeBoard("published") }}>Publish ✈</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notifications */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Notifications</h6>

                    {[
                        { lbl: "Committee Meeting", time: "Today, 08:00 PM", dot: "dot-org" },
                        { lbl: "New user registered.", time: "59 minutes ago", dot: "dot-blu" },
                        { lbl: "Mr. Roy Sing update notice board", time: "1 hour ago", dot: "dot-org" },
                        { lbl: "Complaint by Riya Mittal", time: "Today, 10:59 AM", dot: "dot-red" },
                    ].map((n, i) => (
                        <div key={i} className="bc-notify-item">
                            <span className={`dot ${n.dot}`} />
                            <div className="text-start">
                                <div className="bc-notify-label">{n.lbl}</div>
                                <div className="bc-notify-time">{n.time}</div>
                            </div>
                        </div>
                    ))}

                    <button className="btn-dk w-100 mt-2">Show all notifications</button>
                </div>

                {/* Quick Actions */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Quick Actions</h6>

                    {[["➕", "New Notice", "#dbeafe"], ["📊", "Create Poll", "#ffedd5"], ["📄", "Issue NOC", "#ede9fe"]].map(([ic, lb, bg]) => (
                        <button key={lb} className="qa mb-2">
                            <div className="qa-ico" style={{ background: bg }}>{ic}</div>
                            <span className="bc-qa-text">{lb}</span>
                        </button>
                    ))}
                </div>

                {/* Recent Communications */}
                <div className="sv-card">
                    <h6 className="bc-side-title text-start">Recent Communications</h6>

                    {[
                        { title: "Water Supply Cut", time: "Today, 10:30 AM", type: "Alert", s: "Sent", sc: "green" },
                        { title: "New Year Event", time: "Dec 31, 08:00 PM", type: "Invitation", s: "Scheduled", sc: "blue" },
                        { title: "Parking Lot Resurfacing", time: "Edited 2h ago", type: "Announcement", s: "Draft", sc: "gray" },
                    ].map((r, i, arr) => (
                        <div key={i} className={`bc-rc-item ${i < arr.length - 1 ? "bordered" : ""}`}>
                            <div className="text-start">
                                <div className="bc-rc-title">{r.title}</div>
                                <div className="bc-rc-sub">{r.time} • {r.type}</div>
                            </div>
                            <Badge label={r.s} c={r.sc} />
                        </div>
                    ))}

                    <button className="btn-dk w-100 mt-3">Show all communication</button>
                </div>

            </div>
        </div>
    );


}

export default CreateNoticeBoard