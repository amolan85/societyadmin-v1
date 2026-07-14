import { useState, useEffect } from "react";
import {
    FiPrinter,
    FiCheckCircle,
    FiMessageSquare,
    FiFileText,
    FiUser,
    FiMapPin,
    FiTag,
    FiClock,
    FiAlertCircle,
    FiSettings,
} from "react-icons/fi";
import { GetSessionData } from "../../utils/SessionManagement";
import { getComplaintsApi, updateComplaintStatusApi, updateComplaintPriorityApi ,GetComplaintByIdApi} from "../../services/ComplaintsApi";
import { Badge } from "../../components/Common/ReusableFunction";

const ViewComplaintDetails = ({ setActive, complaintId, societyId }) => {

    // const [societyId, setSocietyId] = useState("");
    const [complaintDetails, setComplaintDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // status/priority modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [comments, setComments] = useState("");
    const [activityLog, setActivityLog] = useState([]);
    const [activityCount, setActivityCount] = useState(0);

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
            setSocietyId(flats.society_id);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("complaintId =", complaintId);
        console.log("societyId =", societyId);

        if (complaintId && societyId) {
            getComplaintById();
        }
    }, [complaintId, societyId]);

    // =====================================================
    // FETCH COMPLAINT BY ID
    // =====================================================

    const getComplaintById = async () => {
    try {
        setLoading(true);

        const response = await GetComplaintByIdApi({
        societyId,
        complaintId
        });

        console.log("GetComplaintByIdApi raw response =", response);

        // service function may return the raw {data:{...}} envelope,
        // or may already unwrap it to {complaint, activity_log, activity_count}
        const payload = response?.data ?? response ?? {};

        const complaint = payload?.complaint || {};
        const activity = payload?.activity_log || [];
        const count = payload?.activity_count ?? activity.length;

        setComplaintDetails(complaint);
        setActivityLog(activity);
        setActivityCount(count);

        setStatus(complaint.status || "");
        setPriority(complaint.priority || "");

    } catch (error) {
        console.log(error);
        setComplaintDetails({});
        setActivityLog([]);
        setActivityCount(0);
    } finally {
        setLoading(false);
    }
};
    // =====================================================
    // UPDATE STATUS / PRIORITY
    // =====================================================

    const UpdateData = async () => {
        try {
            if (modalType === "priority") {
                await updateComplaintPriorityApi(complaintId, societyId, priority, comments);
            }
            if (modalType === "status") {
                await updateComplaintStatusApi(complaintId, societyId, status, comments);
            }
            setComments("");
            setShowModal(false);
            getComplaintById();
        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // HELPERS
    // =====================================================

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return "-";
        }
    };

    const timeAgo = (utcDate) => {
        if (!utcDate) return "-";
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

    const getStatusColor = (s) => {
        if (s === "open") return "red";
        if (s === "in_progress") return "orange";
        if (s === "resolved") return "green";
        if (s === "closed") return "blue";
        return "gray";
    };

    const getPriorityColor = (p) => {
        if (p === "high") return "red";
        if (p === "urgent") return "red";
        if (p === "medium") return "orange";
        if (p === "low") return "gray";
        return "gray";
    };

    // Who posted the activity/comment entry, and what icon/label to show for it
    const getActivityMeta = (item) => {
        if (item.commenter_type === "staff") {
            return {
                name: item.by?.name || "Staff",
                icon: <FiUser size={14} />,
                badgeLabel: "Staff",
            };
        }
        if (item.commenter_type === "resident" || item.commenter_type === "user") {
            return {
                name: item.by?.name || "Resident",
                icon: <FiUser size={14} />,
                badgeLabel: "Resident",
            };
        }
        return {
            name: "System",
            icon: <FiSettings size={14} />,
            badgeLabel: "System",
        };
    };

    const modalConfig = {
        priority: {
            title: "Update Priority",
            label: "Priority",
            value: priority,
            setValue: setPriority,
            options: [
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
                { label: "Urgent", value: "urgent" },
            ],
        },
        status: {
            title: "Update Status",
            label: "Status",
            value: status,
            setValue: setStatus,
            options: [
                { label: "Open", value: "open" },
                { label: "In Progress", value: "in_progress" },
                { label: "Resolved", value: "resolved" },
                { label: "Closed", value: "closed" },
                { label: "Rejected", value: "rejected" },
            ],
        },
    };

    // =====================================================
    // RENDER
    // =====================================================

    // if (loading) {
    //     return (
    //         <div className="text-center py-5 text-muted">
    //             <div className="spinner-border mb-3" role="status" />
    //             <div>Loading complaint details...</div>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="container-fluid min-vh-100">

                {/* ── PAGE HEADER ── */}
                <div className="mb-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex gap-3">
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">
                                        {complaintDetails.title || "Complaint Details"}
                                    </h5>
                                    <Badge
                                        label={complaintDetails.status}
                                        c={getStatusColor(complaintDetails.status)}
                                    />
                                    <Badge
                                        label={complaintDetails.priority}
                                        c={getPriorityColor(complaintDetails.priority)}
                                    />
                                </div>
                                <div className="text-muted text-start small mt-2">
                                     
                                    <span>
                                        {complaintDetails.category_name || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm btn-ad print-btn">
                                <FiPrinter /> Print
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => { setModalType("status"); setShowModal(true); }}
                                disabled={complaintDetails.status === "resolved" || complaintDetails.status === "closed"}
                            >
                                <FiCheckCircle /> Update Status
                            </button>
                            <button
                                className="btn btn-sm btn-ac btn-primary"
                                onClick={() => setActive("complaints")}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    {/* ── LEFT COLUMN ── */}
                    <div className="col-lg-8">

                        {/* Complaint Details Card */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Complaint Details
                            </div>
                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">UNIT / FLAT</small>
                                        <div className="fw-semibold">{complaintDetails.unit || "-"}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">CATEGORY</small>
                                        <div className="fw-semibold">{complaintDetails.category_name || "-"}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">PRIORITY</small>
                                        <div className="fw-semibold">
                                            <Badge
                                                label={complaintDetails.priority}
                                                c={getPriorityColor(complaintDetails.priority)}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-link btn-sm p-0 mt-1"
                                            style={{ fontSize: 12 }}
                                            onClick={() => { setModalType("priority"); setShowModal(true); }}
                                            disabled={complaintDetails.status === "resolved" || complaintDetails.status === "closed"}
                                        >
                                            Change Priority
                                        </button>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">REPORTED AT</small>
                                        <div className="fw-semibold">{formatDateTime(complaintDetails.created_at)}</div>
                                        <small className="text-muted">{timeAgo(complaintDetails.created_at)}</small>
                                    </div>

                                    <div className="col-12">
                                        <small className="text-muted d-block">DESCRIPTION</small>
                                        <div className="fw-semibold">{complaintDetails.description || "-"}</div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Complainant Info
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-4 text-secondary">

                                    <div className="d-flex align-items-center gap-2">
                                        <FiUser size={16} />
                                        <div>
                                            <small className="text-muted d-block">RESIDENT</small>
                                            
                                            <span className="fw-semibold text-dark">
                                                {complaintDetails.raised_by?.name || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <FiMapPin size={16} />
                                        <div>
                                            <small className="text-muted d-block">UNIT</small>
                                            <span className="fw-semibold text-dark">
                                                {complaintDetails.unit || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <FiTag size={16} />
                                        <div>
                                            <small className="text-muted d-block">CATEGORY</small>
                                            <span className="fw-semibold text-dark">
                                                {complaintDetails.category_name || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <FiClock size={16} />
                                        <div>
                                            <small className="text-muted d-block">SUBMITTED</small>
                                            <span className="fw-semibold text-dark">
                                                {timeAgo(complaintDetails.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <FiAlertCircle size={16} color={complaintDetails.priority === "high" || complaintDetails.priority === "urgent" ? "#ef4444" : "#f59e0b"} />
                                        <div>
                                            <small className="text-muted d-block">PRIORITY</small>
                                            <span className="fw-semibold text-dark">
                                                {complaintDetails.priority || "-"}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="col-lg-4">

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
                                onClick={() => setActive("complaints")}
                            >
                                <div
                                    className="qa-ico"
                                    style={{ background: "#dbeafe" }}
                                >
                                    📡
                                </div>
                                <span className="bc-qa-text">
                                    Complaint List
                                </span>
                            </button>
                        </div>

                        {/* Activity Log */}
                        <div className="card shadow-sm border mt-4 text-start">
                            <div className="card-header bg-white fw-bold d-flex align-items-center justify-content-between">
                                <span>Activity Log</span>
                                {activityCount > 0 && (
                                    <span className="badge bg-light text-dark">{activityCount}</span>
                                )}
                            </div>
                            <div className="card-body">
                                {activityLog.length === 0 ? (
                                    <div className="text-muted small text-center py-3">
                                        No activity yet.
                                    </div>
                                ) : (
                                    <div className="unauth-timeline">
                                        {activityLog.map((item, idx) => {
                                            const meta = getActivityMeta(item);
                                            return (
                                                <div
                                                    key={item.comment_id ?? idx}
                                                    className={`unauth-timeline-item ${idx === activityLog.length - 1 ? "active" : ""}`}
                                                >
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        {meta.icon}
                                                        <h6 className="mb-0">{meta.name}</h6>
                                                        <span
                                                            className={`badge ${meta.badgeLabel === "System" ? "bg-secondary" : "bg-primary"}`}
                                                            style={{ fontSize: 10 }}
                                                        >
                                                            {meta.badgeLabel}
                                                        </span>
                                                    </div>

                                                    {item.comment && (
                                                        <div className="d-flex align-items-start gap-2">
                                                            <FiMessageSquare size={14} className="text-muted mt-1" />
                                                            <small className="text-muted">
                                                                {item.comment}
                                                            </small>
                                                        </div>
                                                    )}

                                                    {item.status && (
                                                        <div className="mt-1">
                                                            <Badge
                                                                label={item.status}
                                                                c={getStatusColor(item.status)}
                                                            />
                                                        </div>
                                                    )}

                                                    <br />
                                                    <small className="text-muted">
                                                        {formatDateTime(item.created_at)}
                                                    </small>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── STATUS / PRIORITY MODAL ── */}
            {showModal && modalConfig[modalType] && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">{modalConfig[modalType].title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>

                                <div className="modal-body">
                                    <div className="container-fluid">

                                        <div className="row mb-2">
                                            <div className="col-md-3 text-start">
                                                <label className="fw-semibold">
                                                    {modalConfig[modalType].label}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="d-flex gap-4 flex-wrap">
                                                    {modalConfig[modalType].options.map((opt) => (
                                                        <label
                                                            key={opt.value}
                                                            className="form-check d-flex align-items-center gap-2"
                                                        >
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={modalType}
                                                                value={opt.value}
                                                                checked={modalConfig[modalType].value === opt.value}
                                                                onChange={(e) =>
                                                                    modalConfig[modalType].setValue(e.target.value)
                                                                }
                                                            />
                                                            <span>{opt.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-3 mb-1">
                                            <div className="col-md-3 text-start">
                                                <label className="fw-semibold">Comments</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    placeholder="Enter comments..."
                                                    value={comments}
                                                    onChange={(e) => setComments(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn-ol"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-ac px-4"
                                            onClick={UpdateData}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ViewComplaintDetails;
