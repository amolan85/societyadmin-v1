import { useState, useEffect } from "react";
import {
    FiVolume2,
    FiAlertTriangle,
    FiCalendar,
    FiFileText,
    FiMail,
    FiMessageSquare,
    FiEdit,
    FiTrash2,
    FiClock,
    FiUser,
    FiHash,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { Badge } from "../../components/Common/ReusableFunction";
import "../../styles/StaffAttendance.css";
import { getBroadcastByIdApi, deleteBroadcastApi } from "../../services/BroadcastApi";
import { GetSessionData } from "../../utils/SessionManagement";

// ─────────────────────────────────────────────────────────────────────────────
// KEY CHANGE vs original:
//   • Accepts `preloadedBroadcast` prop (the full row object passed from the
//     list page).  This is used as the INITIAL value of `broadcast` state so
//     the page renders immediately with no blank flash.
//   • The API fetch still runs in the background and silently replaces the
//     preloaded data with fresh/complete data when it arrives.
//   • If `preloadedBroadcast` is NOT supplied (e.g. direct URL / refresh),
//     the component falls back to the original "undefined → fetch" flow.
// ─────────────────────────────────────────────────────────────────────────────

const ViewBroadcastDetails = ({
    setActive,
    setBroadcastId,
    broadcastId,
    preloadedBroadcast,   // <── NEW: full row data passed from Broadcast.jsx
}) => {

    // Initialise with preloaded data if available — avoids the blank flash
    const [broadcast, setBroadcast] = useState(preloadedBroadcast || undefined);
    const [societyId, setSocietyId] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // =====================================================
    // LOAD SESSION + BROADCAST
    // =====================================================

    useEffect(() => {
        const init = async () => {
            try {
                const data = await GetSessionData();
                const sid = data.data.flats?.[0]?.society_id;
                setSocietyId(sid);

                if (broadcastId) {
                    // Fetch fresh data silently in the background.
                    // If we already have preloaded data the user sees content
                    // immediately; the state just quietly updates when this resolves.
                    await fetchBroadcast(broadcastId, sid);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load session");
            }
        };

        init();
    }, [broadcastId]);

    const fetchBroadcast = async (id, sid) => {
        try {
            const data = await getBroadcastByIdApi(id, sid);
            setBroadcast(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load broadcast details");
            // Only set null (error state) when we have no preloaded data to fall back on
            if (!preloadedBroadcast) setBroadcast(null);
        }
    };

    // =====================================================
    // LOADING / ERROR GUARDS
    // =====================================================

    // Still waiting for API and no preloaded data to show
    if (broadcast === undefined) {
        return null; // GlobalLoader is already visible
    }

    // API failed and no preloaded fallback
    if (broadcast === null) {
        return (
            <div className="pg text-center py-5 text-muted">
                <FiFileText size={40} className="mb-3 opacity-25" />
                <p>Broadcast not found.</p>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setActive("broadcasting")}
                >
                    Back to Broadcasts
                </button>
            </div>
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    const confirmDelete = async () => {
        try {
            await deleteBroadcastApi(broadcastId, societyId);
            toast.success("Broadcast deleted successfully");
            setShowDeleteModal(false);
            setActive("broadcasting");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete broadcast");
        }
    };

    // =====================================================
    // HELPERS
    // =====================================================

    const getNoticeIcon = (type) => {
        switch (type) {
            case "announcement": return { icon: <FiVolume2 size={22} color="#ff9800" />,      bg: "#fff3e0" };
            case "circular":     return { icon: <FiFileText size={22} color="#7c3aed" />,      bg: "#ede9fe" };
            case "emergency":    return { icon: <FiAlertTriangle size={22} color="#ef4444" />, bg: "#fee2e2" };
            case "event":        return { icon: <FiCalendar size={22} color="#10b981" />,      bg: "#d1fae5" };
            default:             return { icon: <FiCalendar size={22} color="#6b7280" />,      bg: "#f3f4f6" };
        }
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case "email":    return <FiMail size={14} />;
            case "sms":      return <FiMessageSquare size={14} />;
            case "whatsapp": return <span style={{ fontSize: 14 }}>💬</span>;
            default:         return null;
        }
    };

    const getStatusColor = (s) => {
        if (s === "sent")      return "green";
        if (s === "scheduled") return "blue";
        if (s === "draft")     return "orange";
        return "red";
    };

    const getTypeColor = (t) => {
        if (t === "announcement") return "orange";
        if (t === "emergency")    return "red";
        if (t === "circular")     return "purple";
        return "green";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const timeAgo = (utcDate) => {
        if (!utcDate) return "Not sent";
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

    const noticeData = getNoticeIcon(broadcast.type);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <div className="pg">

                {/* ── HEADER ── */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start flex-wrap gap-2">
                    <h5 className="mb-0 fw-semibold">Broadcast Details</h5>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            onClick={() => {
                                setBroadcastId(broadcast.broadcast_id || broadcastId);
                                setActive("createbroadcast");
                            }}
                        >
                            <FiEdit size={14} /> Edit Broadcast
                        </button>
                        <button
                            className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <FiTrash2 size={14} /> Delete
                        </button>
                        <button
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                            onClick={() => setActive("broadcasting")}
                        >
                            Back
                        </button>
                    </div>
                </div>

                <div className="row g-4">

                    {/* ── LEFT: MAIN DETAILS ── */}
                    <div className="col-12 col-lg-8">

                        {/* BROADCAST HEADER CARD */}
                        <div className="sv-card mb-4">
                            <div className="d-flex gap-3 align-items-start">
                                <div
                                    style={{
                                        width: 52, height: 52, borderRadius: 12,
                                        background: noticeData.bg, display: "flex",
                                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}
                                >
                                    {noticeData.icon}
                                </div>
                                <div className="flex-grow-1 text-start">
                                    <h5 className="fw-semibold mb-2">{broadcast.title}</h5>
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        <Badge label={broadcast.type}   c={getTypeColor(broadcast.type)} />
                                        <Badge label={broadcast.status} c={getStatusColor(broadcast.status)} />
                                        {broadcast.channel && (
                                            <span
                                                className="badge rounded-pill"
                                                style={{
                                                    fontSize: 11,
                                                    background: "#f3f4f6",
                                                    color: "#374151",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    padding: "3px 9px",
                                                }}
                                            >
                                                {getChannelIcon(broadcast.channel)} {broadcast.channel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MESSAGE CARD */}
                        <div className="sv-card mb-4 text-start">
                            <h6 className="fw-semibold mb-3" style={{ color: "#374151" }}>Message</h6>
                            <p style={{
                                fontSize: 14,
                                color: "#4b5563",
                                lineHeight: 1.7,
                                whiteSpace: "pre-wrap",
                                margin: 0,
                            }}>
                                {broadcast.message || "No message content."}
                            </p>
                        </div>

                        {/* ATTACHMENT CARD (if any) */}
                        {broadcast.attachment && (
                            <div className="sv-card mb-4 text-start">
                                <h6 className="fw-semibold mb-3" style={{ color: "#374151" }}>Attachment</h6>
                                <a
                                    href={broadcast.attachment}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    📎 View Attachment
                                </a>
                            </div>
                        )}

                        {/* TIMELINE CARD */}
                        <div className="sv-card text-start">
                            <h6 className="fw-semibold mb-3" style={{ color: "#374151" }}>Timeline</h6>
                            <div className="d-flex flex-column gap-3">

                                {broadcast.created_at && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "#f0f9ff", display: "flex",
                                            alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <FiClock size={14} color="#0369a1" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Created</div>
                                            <div style={{ fontSize: 12, color: "#6b7280" }}>{formatDate(broadcast.created_at)}</div>
                                        </div>
                                    </div>
                                )}

                                {broadcast.scheduled_at && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "#fefce8", display: "flex",
                                            alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <FiCalendar size={14} color="#a16207" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Scheduled For</div>
                                            <div style={{ fontSize: 12, color: "#6b7280" }}>{formatDate(broadcast.scheduled_at)}</div>
                                        </div>
                                    </div>
                                )}

                                {broadcast.sent_at && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "#f0fdf4", display: "flex",
                                            alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <FiClock size={14} color="#15803d" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Sent</div>
                                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                                                {formatDate(broadcast.sent_at)} &nbsp;•&nbsp; {timeAgo(broadcast.sent_at)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT: BROADCAST INFO ── */}
                    <div className="col-12 col-lg-4">

                        <div className="sv-card">
                            <h6 className="fw-semibold mb-3 text-start" style={{ color: "#374151" }}>Broadcast Info</h6>

                            {/* Broadcast ID */}
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "#f3f4f6", display: "flex",
                                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <FiHash size={14} color="#6b7280" />
                                </div>
                                <div className="text-start">
                                    <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Broadcast ID</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                        #{broadcast.broadcast_id || broadcastId}
                                    </div>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3 text-start" style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: noticeData.bg, display: "flex",
                                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <span style={{ transform: "scale(0.75)", display: "flex" }}>
                                        {getNoticeIcon(broadcast.type).icon}
                                    </span>
                                </div>
                                <div className="text-start">
                                    <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "capitalize" }}>
                                        {broadcast.type}
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3 text-start" style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "#f0f9ff", display: "flex",
                                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <span style={{ fontSize: 14 }}>📊</span>
                                </div>
                                <div className="text-start">
                                    <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
                                    <div style={{ marginTop: 2 }}>
                                        <Badge label={broadcast.status} c={getStatusColor(broadcast.status)} />
                                    </div>
                                </div>
                            </div>

                            {/* Channel */}
                            {broadcast.channel && (
                                <div className="d-flex align-items-center gap-2 mb-3 pb-3 text-start" style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: "#f0fdf4", display: "flex",
                                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        {broadcast.channel === "email"    && <FiMail size={14} color="#15803d" />}
                                        {broadcast.channel === "sms"      && <FiMessageSquare size={14} color="#15803d" />}
                                        {broadcast.channel === "whatsapp" && <span style={{ fontSize: 14 }}>💬</span>}
                                        {broadcast.channel === "push"     && <span style={{ fontSize: 14 }}>🔔</span>}
                                    </div>
                                    <div className="text-start">
                                        <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Channel</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "capitalize" }}>
                                            {broadcast.channel}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Created By */}
                            <div className="d-flex align-items-center gap-2 text-start">
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "#fdf4ff", display: "flex",
                                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <FiUser size={14} color="#7e22ce" />
                                </div>
                                <div className="text-start">
                                    <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Created By</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                        {broadcast.created_by_name || "—"}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* ── DELETE MODAL ── */}
            <div
                className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setShowDeleteModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{broadcast.title}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewBroadcastDetails;
