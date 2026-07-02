import { useState, useEffect } from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/Broadcast.css"
import { GetSessionData } from '../../utils/SessionManagement';
import { CreateBroadcastApi, getBroadcastByIdApi, UpdateBroadcastApi, getBroadcastListApi } from '../../services/BroadcastApi';
import { toast } from "react-toastify";
import {
    FiVolume2,
    FiAlertTriangle,
    FiFileText,
    FiCalendar,
    FiMail,
    FiMessageSquare,
} from "react-icons/fi";

const CreateBroadcast = ({ setActive, broadcastId }) => {
    const [tab, setTab] = useState("announcement");
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [attchment, setAttchment] = useState(null)
    const [channel, setChannel] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [schedule, setSchedule] = useState("sendNow")
    const [errors, setErrors] = useState({})
    const [scheduleDateTime, setScheduleDateTime] = useState("");
    const [bId, setBId] = useState("")
    const [errorText, setErrorText] = useState("")

    // ── preview modal ──
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // ── confirmation modal (create/update) ──
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmType, setConfirmType] = useState(""); // "createSent" | "createScheduled" | "update"

    // ── sidebar data (real, not static) ──
    const [recentBroadcasts, setRecentBroadcasts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(false);

    const tabs = [
        { id: "Announcement", icon: "📢", value: "announcement" },
        { id: "Emergency", icon: "⚠️", value: "emergency" },
        { id: "Circular", icon: "📄", value: "circular" },
        { id: "Event", icon: "📅", value: "event" },
    ];

    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    //fetch get session data 
    const SessionData = async () => {
        try {
            const data = await GetSessionData();

            const flats = data.data.flats[0];

            console.log("Session Society Id:", flats.society_id);

            setSocietyId(flats.society_id);
            fetchSidebarData(flats.society_id);
        } catch (error) {
            console.log(error);
        }
    };

    //load getbroadcast by id data on component mount
    useEffect(() => {
        if (broadcastId && societyId) {
            GetBroadCastById();
        }
    }, [broadcastId, societyId]);

    //function for fetch get broadcast by id api
    const GetBroadCastById = async () => {
        try {
            const data = await getBroadcastByIdApi(broadcastId, societyId);

            console.log("Broadcast Data:", data);

            setSubject(data.title || "");
            setContent(data.message || "");
            setTab(data.type || "announcement");
            setChannel(data.channel || "");
            setBId(data.broadcast_id || "");

            if (data.scheduled_at) {
                setSchedule("scheduleLater");

                const dt = new Date(data.scheduled_at);
                const formatted =
                    dt.getFullYear() +
                    "-" +
                    String(dt.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(dt.getDate()).padStart(2, "0") +
                    "T" +
                    String(dt.getHours()).padStart(2, "0") +
                    ":" +
                    String(dt.getMinutes()).padStart(2, "0");

                setScheduleDateTime(formatted);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //shared time-ago helper for sidebar
    const timeAgo = (utcDate) => {
        if (!utcDate) return "";
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

    const statusToBadgeColor = (s) => {
        switch (s) {
            case "sent": return "green";
            case "scheduled": return "blue";
            case "draft": return "gray";
            case "failed": return "red";
            default: return "gray";
        }
    };

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

    //fetch real data for Notifications + Recent Communications side cards
    const fetchSidebarData = async (sid) => {
        setSidebarLoading(true);
        try {
            const apiData = await getBroadcastListApi({
                society_id: sid,
                currentPage: 1,
                limit: 5,
                currentSearch: "",
                currentType: "",
                currentStatus: "",
                currentStartDate: "",
                currentEndDate: "",
            });
            const records = apiData?.records || [];

            setRecentBroadcasts(records.slice(0, 3));

            const notifs = records.slice(0, 4).map((r) => {
                let lbl;
                let dot;
                if (r.status === "scheduled") {
                    lbl = `"${r.title}" scheduled for ${r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : "later"}`;
                    dot = "dot-blu";
                } else if (r.status === "draft") {
                    lbl = `Draft "${r.title}" not sent yet`;
                    dot = "dot-red";
                } else if (r.status === "failed") {
                    lbl = `"${r.title}" failed to send`;
                    dot = "dot-red";
                } else {
                    lbl = `"${r.title}" was sent`;
                    dot = "dot-org";
                }
                return { lbl, time: timeAgo(r.sent_at || r.created_at), dot };
            });
            setNotifications(notifs);
        } catch (error) {
            console.log(error);
        } finally {
            setSidebarLoading(false);
        }
    };

    //handle change for file attachment
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setAttchment(selected);
        }
    };

    //handle for drop file attachment
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setAttchment(droppedFile);
        }
    };

    //handle for drag file attachment
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    //validation for form
    const validateForm = () => {
        const errors = {};

        if (!subject || subject.trim() === "") {
            errors.subject = "required";
        }

        if (!content || content.trim() === "") {
            errors.content = "required";
        }

        return errors;
    };
    //function for submit broadcast
    const SubmitBroadcast = async (status) => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {

            if (bId) {
                await UpdateBroadcastApi(
                    societyId,
                    bId,
                    subject,
                    content,
                    channel,
                    status,
                    tab,
                    attchment,
                    scheduleDateTime
                );
                toast.success("Broadcast updated  successfully!");
            } else {
                await CreateBroadcastApi(
                    societyId,
                    subject,
                    content,
                    channel,
                    status,
                    tab,
                    attchment,
                    scheduleDateTime
                );
                toast.success("Broadcast created successfully!");
            }
            setActive("broadcasting")
        } catch (error) {
            toast.error(error);
            setErrorText(error)
            console.error("Submit Error:", error);
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

    //clear form back to blank state
    const handleClearForm = () => {
        setSubject("");
        setContent("");
        setAttchment(null);
        setChannel("");
        setSchedule("sendNow");
        setScheduleDateTime("");
        setTab("announcement");
        setErrors({});
        setErrorText("");
    };

    //open preview — validate first so preview always reflects a submittable form
    const handlePreview = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.warning("Please fill Subject and Content before previewing.");
            return;
        }
        setShowPreviewModal(true);
    };

    // ── clears a single field error as soon as user fills it ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    //preview helpers — same icon/style mapping as Broadcast.jsx list
    const getPreviewIcon = (type) => {
        switch (type) {
            case "announcement": return { icon: <FiVolume2 size={18} color="#f59e0b" />, cls: "bc-icon-bg-announcement" };
            case "circular": return { icon: <FiFileText size={18} color="#7c3aed" />, cls: "bc-icon-bg-circular" };
            case "emergency": return { icon: <FiAlertTriangle size={18} color="#ef4444" />, cls: "bc-icon-bg-emergency" };
            case "event": return { icon: <FiCalendar size={18} color="#10b981" />, cls: "bc-icon-bg-event" };
            default: return { icon: <FiCalendar size={18} color="#6b7280" />, cls: "bc-icon-bg-default" };
        }
    };

    const getPreviewChannelIcon = (ch) => {
        switch (ch) {
            case "email": return <FiMail size={11} />;
            case "sms": return <FiMessageSquare size={11} />;
            case "whatsapp": return <span style={{ fontSize: 11 }}>💬</span>;
            default: return null;
        }
    };

    const previewIconData = getPreviewIcon(tab);

    // ── OPEN confirmation for Publish button (handles both create + update) ──
    const handlePublishClick = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        if (bId) {
            setConfirmType("update");
        } else {
            setConfirmType(scheduleDateTime ? "createScheduled" : "createSent");
        }
        setShowConfirmModal(true);
    };

    // ── runs the actual action once the user confirms in the modal ──
    const handleConfirmProceed = async () => {
        setShowConfirmModal(false);

        if (confirmType === "createSent") {
            SubmitBroadcast("sent");
        } else if (confirmType === "createScheduled") {
            SubmitBroadcast("scheduled");
        } else if (confirmType === "update") {
            SubmitBroadcast(scheduleDateTime ? "scheduled" : "sent");
        }
    };

    // ── content shown inside the confirm modal, based on confirmType ──
    const confirmModalContent = {
        createSent: {
            title: "Confirm Send Broadcast",
            message: `Are you sure you want to send "${subject}" now? It will be delivered immediately.`,
            confirmLabel: "Yes, Send Now",
            confirmClass: "btn-ac",
        },
        createScheduled: {
            title: "Confirm Schedule Broadcast",
            message: `Are you sure you want to schedule "${subject}" for ${scheduleDateTime ? new Date(scheduleDateTime).toLocaleString() : "the selected time"}?`,
            confirmLabel: "Yes, Schedule It",
            confirmClass: "btn-ac",
        },
        update: {
            title: "Confirm Update Broadcast",
            message: `Are you sure you want to update "${subject}"? This will overwrite the existing broadcast.`,
            confirmLabel: "Yes, Update",
            confirmClass: "btn-ac",
        },
    };

    const activeConfirm = confirmModalContent[confirmType] || {};


    return (
        <div className="pg row g-4 bc-wrap">
            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="bc-title">{bId ? "Update" : "Create"} & Publish</h5>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setActive("broadcasting")}
                        >
                            Back
                        </button>
                    </div>
                    <div className="broadcastTabs mt-2">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.value)}
                                className={`broadcastTab-btn ${tab === t.value ? "active" : ""}`}
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
                        }
                        } />

                    <div className='d-flex'>
                        <label className="sv-lb">Content <span className='text-danger'>*</span></label>
                        {errors.content && <span className='text-danger mx-2 '>{errors.content}</span>}
                    </div>

                    <div className={`bc-editor-box ${errors.content ? "error-input" : ""}`}>
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
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                clearError("content");
                            }}
                        />
                    </div>

                    <label className="sv-lb">Attachment (Optional)</label>
                    <div
                        className="upload-zone mb-4"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{ cursor: "pointer" }}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <div className="bc-upload-icon">☁️</div>
                        <div className="bc-upload-title">
                            {attchment ? attchment.name : "Click to upload or drag files here"}
                        </div>
                        <div className="bc-upload-sub">PDF, JPG, PNG up to 10 MB</div>

                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <label className="sv-lb">Broadcasting Channels</label>

                    <div className="d-flex gap-3 mb-4">

                        <label className="bx">
                            <input
                                type="radio"
                                name="channel"
                                value="whatsapp"
                                checked={channel === "whatsapp"}
                                onChange={(e) => setChannel(e.target.value)}
                            />
                            &nbsp; WhatsApp
                        </label>

                        <label className="bx">
                            <input
                                type="radio"
                                name="channel"
                                value="sms"
                                checked={channel === "sms"}
                                onChange={(e) => setChannel(e.target.value)}
                            />
                            &nbsp; SMS
                        </label>

                        <label className="bx">
                            <input
                                type="radio"
                                name="channel"
                                value="email"
                                checked={channel === "email"}
                                onChange={(e) => setChannel(e.target.value)}
                            />
                            &nbsp; Email
                        </label>
                        <label className="bx">
                            <input
                                type="radio"
                                name="channel"
                                value="push"
                                checked={channel === "push"}
                                onChange={(e) => setChannel(e.target.value)}
                            />
                            &nbsp; push
                        </label>

                    </div>
                    <div className="d-flex gap-4 mb-4 bc-radio">
                        <label className="bx">
                            <input
                                type="radio"
                                name="schedule"
                                value="sendNow"
                                checked={schedule === "sendNow"}
                                onChange={(e) => setSchedule(e.target.value)}
                            />
                            &nbsp; Send Now
                        </label>
                        <label className="bx">
                            <input
                                type="radio"
                                name="schedule"
                                value="scheduleLater"
                                checked={schedule === "scheduleLater"}
                                onChange={(e) => setSchedule(e.target.value)}
                            />
                            &nbsp; Schedule for Later
                        </label>

                    </div>
                    <div className='d-flex'>
                        <div className="gap-3">
                            {schedule === "scheduleLater" && (
                                <div className="">
                                    <label className="sv-lb">Select Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="sv-in"
                                        value={scheduleDateTime}
                                        onChange={(e) => setScheduleDateTime(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {errorText && <h6 className='text-danger'>{errorText}</h6>}
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn-ol" onClick={handleClearForm}>Clear Form</button>
                        <button className="btn-ol" onClick={handlePreview}>Preview</button>
                        <button className="btn-ol" onClick={() => { SubmitBroadcast("draft") }}>Save Draft</button>
                        <button className="btn-ac" onClick={handlePublishClick}>Publish ✈</button>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">

                {/* Notifications — real, derived from recent broadcast activity
                <div className="sv-card mb-3">
                    <h6 className="bc-side-title text-start">Notifications</h6>

                    {sidebarLoading ? (
                        <div className="text-muted small text-start">Loading…</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-muted small text-start">No recent activity</div>
                    ) : (
                        notifications.map((n, i) => (
                            <div key={i} className="bc-notify-item">
                                <span className={`dot ${n.dot}`} />
                                <div className="text-start">
                                    <div className="bc-notify-label">{n.lbl}</div>
                                    <div className="bc-notify-time">{n.time}</div>
                                </div>
                            </div>
                        ))
                    )}

                    <button className="btn-dk w-100 mt-2" onClick={() => setActive("broadcasting")}>
                        Show all broadcasts
                    </button>
                </div> */}

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

                {/* Recent Communications — real, last 3 broadcasts
                <div className="sv-card">
                    <h6 className="bc-side-title text-start">Recent Communications</h6>

                    {sidebarLoading ? (
                        <div className="text-muted small text-start">Loading…</div>
                    ) : recentBroadcasts.length === 0 ? (
                        <div className="text-muted small text-start">No broadcasts yet</div>
                    ) : (
                        recentBroadcasts.map((r, i, arr) => (
                            <div key={r.id} className={`bc-rc-item ${i < arr.length - 1 ? "bordered" : ""}`}>
                                <div className="text-start">
                                    <div className="bc-rc-title">{r.title}</div>
                                    <div className="bc-rc-sub">
                                        {timeAgo(r.sent_at || r.created_at)} • {capitalize(r.type)}
                                    </div>
                                </div>
                                <Badge label={capitalize(r.status)} c={statusToBadgeColor(r.status)} />
                            </div>
                        ))
                    )}

                    <button className="btn-dk w-100 mt-3" onClick={() => setActive("broadcasting")}>
                        Show all communication
                    </button>
                </div> */}

            </div>

            {/* ── PREVIEW MODAL ── */}
            <div
                className={`modal fade ${showPreviewModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Broadcast Preview</h5>
                            <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)} />
                        </div>
                        <div className="modal-body text-start">

                            {/* Mimics the exact card style from the Broadcast list */}
                            <div className="bc-item" style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className={`bc-item-icon ${previewIconData.cls}`}>
                                        {previewIconData.icon}
                                    </div>
                                    <div className="flex-grow-1 min-w-0">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <span className="bc-item-title">{subject || "(No subject entered)"}</span>
                                            <span className={`bc-pill bc-pill-type-${tab}`}>{tab}</span>
                                            {channel && (
                                                <span className="bc-pill bc-pill-channel">
                                                    {getPreviewChannelIcon(channel)} {channel}
                                                </span>
                                            )}
                                            <span className="bc-pill bc-pill-strong bc-pill-status-draft">
                                                {schedule === "scheduleLater" ? "scheduled" : "sent"}
                                            </span>
                                        </div>
                                        <p className="bc-item-message" style={{ whiteSpace: "pre-wrap" }}>
                                            {content || "(No content entered)"}
                                        </p>
                                        <div className="bc-item-meta">
                                            <span>You</span>
                                            <span>•</span>
                                            <span>Just now</span>
                                            {schedule === "scheduleLater" && scheduleDateTime && (
                                                <>
                                                    <span>•</span>
                                                    <span>Scheduled for {new Date(scheduleDateTime).toLocaleString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {attchment && (
                                <div className="mt-3">
                                    <label className="sv-lb">Attachment</label>
                                    <div className="text-muted" style={{ fontSize: 13 }}>{attchment.name}</div>
                                </div>
                            )}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowPreviewModal(false)}>
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn-ac"
                                onClick={() => {
                                    setShowPreviewModal(false);
                                    handlePublishClick();
                                }}
                            >
                                Looks Good, Publish ✈
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONFIRMATION MODAL (create / update) ── */}
            <div
                className={`modal fade ${showConfirmModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{activeConfirm.title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowConfirmModal(false)}
                            />
                        </div>
                        <div className="modal-body text-start">
                            <p className="mb-0">{activeConfirm.message}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={activeConfirm.confirmClass}
                                onClick={handleConfirmProceed}
                            >
                                {activeConfirm.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default CreateBroadcast