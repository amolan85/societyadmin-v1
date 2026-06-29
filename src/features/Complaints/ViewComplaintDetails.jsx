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
} from "react-icons/fi";
import { GetSessionData } from "../../utils/SessionManagement";
import { getComplaintsApi, updateComplaintStatusApi, updateComplaintPriorityApi } from "../../services/ComplaintsApi";
import { Badge } from "../../components/Common/ReusableFunction";

const ViewComplaintDetails = ({ setActive, complaintId }) => {

    const [societyId, setSocietyId] = useState("");
    const [complaintDetails, setComplaintDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // status/priority modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [comments, setComments] = useState("");

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
             
            const data = await getComplaintsApi(societyId);
            const list = data?.list || [];
            const found = list.find(
                (c) => String(c.complaint_id) === String(complaintId)
            );
            if (found) {
                setComplaintDetails(found);
                setStatus(found.status || "");
                setPriority(found.priority || "");
            }
        } catch (error) {
            console.log(error, "Error fetching complaint details");
            setComplaintDetails({});
        } finally {
             
        }
    };

    // =====================================================
    // UPDATE STATUS / PRIORITY
    // =====================================================

    const UpdateData = async () => {
        try {
            if (modalType === "priority") {
                await updateComplaintPriorityApi(complaintId,societyId, priority, comments);
            }
            if (modalType === "status") {
                await updateComplaintStatusApi(complaintId,societyId, status, comments);
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
        if (days > 0)    return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} min ago`;
        return "Just now";
    };

    const getStatusColor = (s) => {
        if (s === "open")        return "red";
        if (s === "in_progress") return "orange";
        if (s === "resolved")    return "green";
        if (s === "closed")      return "blue";
        return "gray";
    };

    const getPriorityColor = (p) => {
        if (p === "high")   return "red";
        if (p === "urgent") return "red";
        if (p === "medium") return "orange";
        if (p === "low")    return "gray";
        return "gray";
    };

    const modalConfig = {
        priority: {
            title: "Update Priority",
            label: "Priority",
            value: priority,
            setValue: setPriority,
            options: [
                { label: "High",   value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low",    value: "low" },
                { label: "Urgent", value: "urgent" },
            ],
        },
        status: {
            title: "Update Status",
            label: "Status",
            value: status,
            setValue: setStatus,
            options: [
                { label: "Open",        value: "open" },
                { label: "In Progress", value: "in_progress" },
                { label: "Resolved",    value: "resolved" },
                { label: "Closed",      value: "closed" },
                { label: "Rejected",    value: "rejected" },
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
                                    <span className="me-3">
                                        #{complaintDetails.complaint_id || "-"}
                                    </span>
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
                                                {complaintDetails.resident_name || "Rahul Sharma"}
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
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Quick Actions
                            </div>
                            <div className="card-body">
                                {[
                                    [
                                        <FiMessageSquare size={18} color="#ca8a04" />,
                                        "Send Notification to Resident",
                                        () => {},
                                        "#fef9c3",
                                    ],
                                    [
                                        <FiFileText size={18} color="#2563eb" />,
                                        "Update Status",
                                        () => { setModalType("status"); setShowModal(true); },
                                        "#dbeafe",
                                    ],
                                    [
                                        <FiCheckCircle size={18} color="#16a34a" />,
                                        "Mark as Resolved",
                                        async () => {
                                            setStatus("resolved");
                                            setModalType("status");
                                            setShowModal(true);
                                        },
                                        "#dcfce7",
                                    ],
                                ].map(([ic, lb, onClick, bgColor]) => (
                                    <button
                                        key={lb}
                                        className="qa mb-2"
                                        onClick={onClick}
                                        type="button"
                                    >
                                        <div
                                            className="qa-ico rounded-2"
                                            style={{ background: bgColor, padding: "8px", display: "inline-flex" }}
                                        >
                                            {ic}
                                        </div>
                                        <div className="ms-2">
                                            <div className="pl-qa-title">{lb}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="card shadow-sm border mt-4 text-start">
                            <div className="card-header bg-white fw-bold">
                                Activity Log
                            </div>
                            <div className="card-body">
                                <div className="unauth-timeline">

                                    <div className="unauth-timeline-item active">
                                        <h6 className="mb-1">Complaint Submitted</h6>
                                        <small className="text-muted">
                                            Resident submitted the complaint.
                                        </small><br />
                                        <small className="text-muted">
                                            {formatDateTime(complaintDetails.created_at)}
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">Under Review</h6>
                                        <small className="text-muted">
                                            Complaint assigned to management team.
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">
                                            {complaintDetails.status === "resolved" ? "Resolved"
                                                : complaintDetails.status === "closed" ? "Closed"
                                                : "Pending Action"}
                                        </h6>
                                        <small className="text-muted">
                                            {complaintDetails.status === "open"        ? "Awaiting action..."
                                                : complaintDetails.status === "in_progress" ? "In progress..."
                                                : complaintDetails.status || ""}
                                        </small>
                                    </div>

                                </div>
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
