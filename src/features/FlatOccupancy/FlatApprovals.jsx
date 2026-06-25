import { useState, useEffect } from 'react'
import { GetSessionData } from '../../utils/SessionManagement';
import { ListOccupancyRequestsApi, ApproveFlatOccupancyApi } from '../../services/FlatOccupancyApi';
import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle, FiClock, FiHome, FiCalendar, FiPhone, FiMail, FiX } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import "../../styles/FlatOccupancy.css"

const FlatApprovals = () => {
    const [societyId, setSocietyId] = useState("");
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState("Pending");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(""); // "Approved" | "Rejected"
    const [rejectionReason, setRejectionReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        GetRequests(flats.society_id, "Pending");
    };

    const GetRequests = async (sId, status) => {
        setLoading(true);
        setRequests([]);
        try {
            const data = await ListOccupancyRequestsApi(sId, status, 1, 10);
            setRequests(Array.isArray(data?.requests) ? data.requests : []);
        } catch (error) {
            console.error("Error fetching occupancy requests:", error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (status) => {
        setTab(status);
        GetRequests(societyId, status);
    };

    // Open popup instead of acting directly
    const openActionModal = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setRejectionReason("");
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setActionType("");
        setRejectionReason("");
    };

    // Called when user confirms inside the modal
    const confirmAction = async () => {
        if (!selectedRequest) return;
        setSubmitting(true);
        try {
            await ApproveFlatOccupancyApi(
                selectedRequest.occupant_id,
                actionType,
                societyId,
                actionType === "Rejected" ? rejectionReason : ""
            );
            toast.success(`Occupancy ${actionType.toLowerCase()} successfully!`);
            closeModal();
            GetRequests(societyId, tab);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Approved": return { bg: "#dcfce7", color: "#16a34a", avatarBg: "#bbf7d0", icon: <FiCheckCircle size={13} /> };
            case "Rejected": return { bg: "#fee2e2", color: "#ef4444", avatarBg: "#fecaca", icon: <FiXCircle size={13} /> };
            default: return { bg: "#fef3c7", color: "#d97706", avatarBg: "#fde68a", icon: <FiClock size={13} /> };
        }
    };

    const formatOccupancyType = (type) => {
        if (!type) return "";
        return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    };

    const getInitials = (name) =>
        (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    const tabs = ["Pending", "Approved", "Rejected"];

    return (
        <div className="pg row g-4">
            <div className="col-12">
                <div className="d-flex gap-2 mb-3">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={`PollsTabs-btn ${tab === t ? "active" : ""}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {!loading && requests.length === 0 && (
                    <div className="sv-card p-5 text-center">
                        <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                        <p className="tx-muted mb-0">No {tab.toLowerCase()} occupancy requests found.</p>
                    </div>
                )}

                {!loading && requests.map((r) => {
                    const statusStyle = getStatusStyle(r.occupant_status);
                    return (
                        <div key={r.occupant_id} className="sv-card mb-3 p-3 occ-card">
                            <div className="d-flex gap-3 align-items-start">

                                {/* Avatar */}
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: 48, height: 48,
                                        background: statusStyle.avatarBg,
                                        color: statusStyle.color,
                                        fontWeight: 700,
                                        fontSize: 15,
                                    }}
                                >
                                    {getInitials(r.member?.full_name)}
                                </div>

                                {/* Main Info */}
                                <div className="flex-grow-1 text-start">
                                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                        <span style={{ fontWeight: 700, fontSize: 15 }}>
                                            {r.member?.full_name || `Occupant #${r.occupant_id}`}
                                        </span>
                                        <span
                                            className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                                            style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                fontSize: 11.5,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {statusStyle.icon} {r.occupant_status}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-wrap gap-3 mb-1" style={{ fontSize: 13, color: "var(--muted)" }}>
                                        <span className="d-flex align-items-center gap-1">
                                            <FiHome size={13} />
                                            Flat {r.flat?.flat_number} (Block {r.flat?.block})
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <FaUser size={11} />
                                            {formatOccupancyType(r.occupancy_type)}
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <FiCalendar size={13} />
                                            Requested {new Date(r.requested_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </span>
                                    </div>

                                    {r.member?.mobile && (
                                        <div className="d-flex flex-wrap gap-3" style={{ fontSize: 12.5, color: "var(--muted)" }}>
                                            <span className="d-flex align-items-center gap-1">
                                                <FiPhone size={12} /> {r.member.mobile}
                                            </span>
                                            {r.member?.email && (
                                                <span className="d-flex align-items-center gap-1">
                                                    <FiMail size={12} /> {r.member.email}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions — open modal instead of direct call */}
                                {r.occupant_status === "Pending" && (
                                    <div className="d-flex gap-2 flex-shrink-0">
                                        <button
                                            className="btn-ac py-1 px-3 d-flex align-items-center gap-1"
                                            onClick={() => openActionModal(r, "Approved")}
                                        >
                                            <FiCheckCircle size={13} /> Approve
                                        </button>
                                        <button
                                            className="btn-ol py-1 px-3 d-flex align-items-center gap-1"
                                            onClick={() => openActionModal(r, "Rejected")}
                                        >
                                            <FiXCircle size={13} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== Confirmation Modal ===== */}
            {selectedRequest && (
                <div
                    className="modal-backdrop-custom"
                    onClick={closeModal}
                >
                    <div
                        className="occ-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">
                                {actionType === "Approved" ? "Approve Occupancy Request" : "Reject Occupancy Request"}
                            </h5>
                            <button className="occ-modal-close" onClick={closeModal}>
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Occupant details */}
                        <div className="d-flex gap-3 align-items-start mb-3 text-start">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                    width: 48, height: 48,
                                    background: "#e0e7ff",
                                    color: "#4338ca",
                                    fontWeight: 700,
                                    fontSize: 15,
                                }}
                            >
                                {getInitials(selectedRequest.member?.full_name)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>
                                    {selectedRequest.member?.full_name}
                                </div>
                                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                                    Flat {selectedRequest.flat?.flat_number} (Block {selectedRequest.flat?.block})
                                </div>
                                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                                    {formatOccupancyType(selectedRequest.occupancy_type)}
                                </div>
                                {selectedRequest.member?.mobile && (
                                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                                        📞 {selectedRequest.member.mobile}
                                        {selectedRequest.member?.email && ` • ✉️ ${selectedRequest.member.email}`}
                                    </div>
                                )}
                                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                                    Requested: {new Date(selectedRequest.requested_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                </div>
                            </div>
                        </div>

                        {actionType === "Rejected" && (
                            <div className="text-start mb-3">
                                <label className="sv-lb">Rejection Reason</label>
                                <textarea
                                    className="sv-ta w-100"
                                    rows={3}
                                    placeholder="Enter reason for rejection (optional)"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        )}

                        <p className="tx-muted text-start mb-3" style={{ fontSize: 13 }}>
                            Are you sure you want to {actionType === "Approved" ? "approve" : "reject"} this occupancy request?
                        </p>

                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn-ol py-1 px-3" onClick={closeModal} disabled={submitting}>
                                Cancel
                            </button>
                            <button
                                className={actionType === "Approved" ? "btn-ac py-1 px-3" : "btn-ol py-1 px-3"}
                                style={actionType === "Rejected" ? { borderColor: "#ef4444", color: "#ef4444" } : {}}
                                onClick={confirmAction}
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Processing..."
                                    : actionType === "Approved" ? "Confirm Approve" : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlatApprovals;