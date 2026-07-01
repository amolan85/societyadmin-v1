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
        if (selectedNoticeData && societyId) {
            GetNoticeBoardById();
        }
    }, [selectedNoticeData, societyId]);

    //fetch get notice board by id
    const GetNoticeBoardById = async () => {
        try {
            const data = await getNoticeBoardByIdApi(selectedNoticeData, societyId);
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
                    noticeId,
                    societyId,
                    subject,
                    description,
                    noticeType,
                    priority,
                    status
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

    // ── clears a single field error as soon as user fills it ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
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
                            className="btn btn-sm btn-ac ms-2 btn-primary"
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
                        onChange={(e) => {
                            setSubject(e.target.value);
                            clearError("subject");
                        }} />

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
                            onChange={(e) => {
                                setDescription(e.target.value);
                                clearError("description");
                            }}
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
                        <button className="btn-ol" onClick={() => {
                            submitNoticeBoard("draft");
                            clearError("draft");
                        }}>Save Draft</button>
                        <button className="btn-ac" onClick={() => {
                            submitNoticeBoard("published");
                            clearError("published");
                        }}>Publish ✈</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notice Information */}
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Notice Information</h6>

                    <div className="mb-3 text-start">
                        <small className="text-muted">Status</small>
                        <div>
                            <Badge
                                label={noticeId ? "Draft" : "New"}
                                c={noticeId ? "orange" : "blue"}
                            />
                        </div>
                    </div>

                    <div className="mb-3 text-start">
                        <small className="text-muted">Type</small>
                        <div className="fw-semibold text-capitalize">
                            {noticeType}
                        </div>
                    </div>

                    <div className="mb-3 text-start">
                        <small className="text-muted">Priority</small>
                        <div>
                            <Badge
                                label={priority || "Not Selected"}
                                c={
                                    priority === "urgent"
                                        ? "red"
                                        : priority === "high"
                                            ? "orange"
                                            : priority === "normal"
                                                ? "blue"
                                                : priority === "low"
                                                    ? "gray"
                                                    : "gray"
                                }
                            />
                        </div>
                    </div>
                    {/* 
                    {noticeId && (
                        <div className="text-start">
                            <small className="text-muted">Notice ID</small>
                            <div className="fw-semibold">
                                #{noticeId}
                            </div>
                        </div>
                    )} */}
                </div>

                {/* Quick Actions */}
                <div className="sv-card mb-3">

                    <h6 className="bc-side-title text-start">
                        Quick Actions
                    </h6>

                    <button
                        className="qa mb-2"
                        onClick={() => submitNoticeBoard("draft")}
                    >
                        <div className="qa-ico" style={{ background: "#fff7ed" }}>
                            💾
                        </div>

                        <span className="bc-qa-text">
                            Save Draft
                        </span>
                    </button>

                    <button
                        className="qa mb-2"
                        onClick={() => submitNoticeBoard("published")}
                    >
                        <div className="qa-ico" style={{ background: "#dcfce7" }}>
                            🚀
                        </div>

                        <span className="bc-qa-text">
                            Publish Notice
                        </span>
                    </button>

                    {noticeId && (
                        <button
                            className="qa"
                            onClick={() => setActive("noticeboard")}
                        >
                            <div className="qa-ico" style={{ background: "#dbeafe" }}>
                                📋
                            </div>

                            <span className="bc-qa-text">
                                Back to Notice List
                            </span>
                        </button>
                    )}

                </div>

                {/* Publishing Guidelines */}
                <div className="sv-card">

                    <h6 className="bc-side-title text-start">
                        Publishing Guidelines
                    </h6>

                    <div className="text-start mb-3">

                        <div className="mb-2">
                            ✅ Keep the title short and descriptive.
                        </div>

                        <div className="mb-2">
                            📅 Mention important dates and timings.
                        </div>

                        <div className="mb-2">
                            ⚠️ Use "Urgent" only for emergency notices.
                        </div>

                        <div className="mb-2">
                            📌 Pin only important announcements.
                        </div>

                        <div className="mb-2">
                            👥 Proofread before publishing.
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );


}

export default CreateNoticeBoard