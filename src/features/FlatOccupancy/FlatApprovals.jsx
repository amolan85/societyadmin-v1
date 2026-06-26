import { useState, useEffect } from 'react'
import { GetSessionData } from '../../utils/SessionManagement';
import { ListOccupancyRequestsApi, ApproveFlatOccupancyApi } from '../../services/FlatOccupancyApi';
import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle, FiClock, FiHome, FiCalendar, FiPhone, FiMail, FiX, FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi";
import "../../styles/FlatOccupancy.css"

const FlatApprovals = () => {
    const [societyId, setSocietyId] = useState("");
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState("Pending");
    const [loading, setLoading] = useState(true);

    // Tab counts (independent of the currently loaded page)
    const [counts, setCounts] = useState({ Pending: 0, Approved: 0, Rejected: 0 });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 10;

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        GetRequests(flats.society_id, "Pending", 1);
        loadCounts(flats.society_id);
    };

    // Pull a lightweight count for each tab so the segmented control can show totals
    const loadCounts = async (sId) => {
        try {
            const statuses = ["Pending", "Approved", "Rejected"];
            const results = await Promise.all(
                statuses.map((s) => ListOccupancyRequestsApi(sId, s, 1, 1))
            );
            const next = {};
            statuses.forEach((s, i) => {
                const pagination = results[i]?.data?.pagination || results[i]?.pagination || {};
                next[s] = pagination.total || 0;
            });
            setCounts(next);
        } catch {
            // counts are a nice-to-have; fail silently
        }
    };

    const GetRequests = async (sId, status, pg = 1) => {
        setLoading(true);
        setRequests([]);
        try {
            const res = await ListOccupancyRequestsApi(sId, status, pg, PAGE_SIZE);

            const requestsList = Array.isArray(res?.data?.requests)
                ? res.data.requests
                : Array.isArray(res?.requests)
                    ? res.requests
                    : [];

            const pagination = res?.data?.pagination || res?.pagination || {};

            setRequests(requestsList);
            setPage(pagination.page || pg);
            setTotalPages(pagination.total_pages || 1);
            setTotalCount(pagination.total || 0);
            setCounts((prev) => ({ ...prev, [status]: pagination.total ?? prev[status] }));
        } catch (error) {
            console.error("Error fetching occupancy requests:", error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (status) => {
        if (status === tab) return;
        setTab(status);
        setPage(1);
        GetRequests(societyId, status, 1);
    };

    const handlePageChange = (pg) => {
        if (pg < 1 || pg > totalPages) return;
        setPage(pg);
        GetRequests(societyId, tab, pg);
    };

    const openActionModal = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setRejectionReason("");
    };

    const closeModal = () => {
        if (submitting) return;
        setSelectedRequest(null);
        setActionType("");
        setRejectionReason("");
    };

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
            toast.success(`Occupancy request ${actionType.toLowerCase()}.`);
            closeModal();
            GetRequests(societyId, tab, page);
            loadCounts(societyId);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const STATUS_META = {
        Approved: { color: "#1a8a4a", bg: "#e8f7ee", rail: "#1a8a4a", icon: <FiCheckCircle size={13} /> },
        Rejected: { color: "#c23b3b", bg: "#fbeaea", rail: "#c23b3b", icon: <FiXCircle size={13} /> },
        Pending: { color: "#b5790a", bg: "#fdf2e0", rail: "#d9921f", icon: <FiClock size={13} /> },
    };

    const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.Pending;

    const formatOccupancyType = (type) => {
        if (!type) return "";
        return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    };

    const getInitials = (name) =>
        (name || "?").split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase();

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    const tabs = [
        { key: "Pending", label: "Pending" },
        { key: "Approved", label: "Approved" },
        { key: "Rejected", label: "Rejected" },
    ];

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
                pages.push(i);
            } else if (Math.abs(i - page) === 2) {
                pages.push("...");
            }
        }
        return pages.filter((p, idx) => p !== "..." || pages[idx - 1] !== "...");
    };

    const EMPTY_COPY = {
        Pending: "No requests are waiting on a decision.",
        Approved: "No requests have been approved yet.",
        Rejected: "No requests have been rejected.",
    };

    return (
        <div className="occ-page">

            {/* Header */}
            <div className="occ-header">
                <div>
                    <h4 className="occ-title">Occupancy approvals</h4>
                    <p className="occ-subtitle">Review who's moving in or out before it's confirmed on record.</p>
                </div>
            </div>

            {/* Segmented control */}
            <div className="occ-tabs" role="tablist">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        role="tab"
                        aria-selected={tab === t.key}
                        onClick={() => handleTabChange(t.key)}
                        className={`occ-tab ${tab === t.key ? "is-active" : ""}`}
                    >
                        <span
                            className="occ-tab-dot"
                            style={{ background: getStatusMeta(t.key).rail }}
                        />
                        {t.label}
                        <span className="occ-tab-count">{counts[t.key] ?? 0}</span>
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="occ-list">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="occ-card occ-skeleton" />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && requests.length === 0 && (
                <div className="occ-empty">
                    <FiInbox size={28} />
                    <p className="occ-empty-title">Nothing here right now</p>
                    <p className="occ-empty-copy">{EMPTY_COPY[tab]}</p>
                </div>
            )}

            {/* Request cards */}
            {!loading && requests.length > 0 && (
                <div className="occ-list">
                    {requests.map((r) => {
                        const meta = getStatusMeta(r.occupant_status);
                        return (
                            <div key={r.occupant_id} className="occ-card" style={{ "--rail": meta.rail }}>
                                <div className="occ-card-row">

                                    <div
                                        className="occ-avatar"
                                        style={{ background: meta.bg, color: meta.color }}
                                    >
                                        {getInitials(r.member?.full_name)}
                                    </div>

                                    <div className="occ-main">
                                        <div className="occ-name-row">
                                            <span className="occ-name">
                                                {r.member?.full_name || `Occupant #${r.occupant_id}`}
                                            </span>
                                            <span
                                                className="occ-status-pill"
                                                style={{ background: meta.bg, color: meta.color }}
                                            >
                                                {meta.icon} {r.occupant_status}
                                            </span>
                                        </div>

                                        <div className="occ-meta-row">
                                            <span className="occ-meta-item">
                                                <FiHome size={13} /> Flat {r.flat?.flat_number} · Block {r.flat?.block}
                                            </span>
                                            <span className="occ-meta-divider" />
                                            <span className="occ-meta-item">{formatOccupancyType(r.occupancy_type)}</span>
                                            <span className="occ-meta-divider" />
                                            <span className="occ-meta-item">
                                                <FiCalendar size={13} /> In {formatDate(r.start_date)}
                                                {r.end_date && ` · Out ${formatDate(r.end_date)}`}
                                            </span>
                                        </div>

                                        {(r.member?.mobile || r.member?.email) && (
                                            <div className="occ-contact-row">
                                                {r.member?.mobile && (
                                                    <span className="occ-meta-item"><FiPhone size={12} /> {r.member.mobile}</span>
                                                )}
                                                {r.member?.email && (
                                                    <span className="occ-meta-item"><FiMail size={12} /> {r.member.email}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="occ-requested">Requested {formatDate(r.requested_at)}</div>
                                    </div>

                                    {r.occupant_status === "Pending" && (
                                        <div className="occ-actions">
                                            <button
                                                className="btn-ac py-1 px-3 d-flex align-items-center gap-1"
                                                onClick={() => openActionModal(r, "Approved")}
                                            >
                                                <FiCheckCircle size={13} /> Approve
                                            </button>
                                            <button
                                                className="btn-ol py-1 px-3 d-flex align-items-center gap-1 occ-reject-btn"
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
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="occ-pagination">
                    <span className="occ-pagination-count">
                        Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
                    </span>
                    <div className="d-flex align-items-center gap-1">
                        <button
                            className="btn-ol py-1 px-2 d-flex align-items-center"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            aria-label="Previous page"
                        >
                            <FiChevronLeft size={15} />
                        </button>

                        {getPageNumbers().map((p, idx) =>
                            p === "..." ? (
                                <span key={`ellipsis-${idx}`} className="occ-pagination-ellipsis">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`py-1 px-3 ${page === p ? "btn-ac" : "btn-ol"}`}
                                    style={{ minWidth: 36 }}
                                    aria-current={page === p ? "page" : undefined}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            className="btn-ol py-1 px-2 d-flex align-items-center"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            aria-label="Next page"
                        >
                            <FiChevronRight size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {selectedRequest && (
                <div className="modal-backdrop-custom" onClick={closeModal}>
                    <div className="occ-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">
                                {actionType === "Approved" ? "Approve occupancy request" : "Reject occupancy request"}
                            </h5>
                            <button className="occ-modal-close" onClick={closeModal} aria-label="Close" disabled={submitting}>
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="occ-modal-person">
                            <div
                                className="occ-avatar"
                                style={{ background: getStatusMeta(actionType).bg, color: getStatusMeta(actionType).color }}
                            >
                                {getInitials(selectedRequest.member?.full_name)}
                            </div>
                            <div className="text-start">
                                <div className="occ-name">{selectedRequest.member?.full_name}</div>
                                <div className="occ-modal-detail">
                                    Flat {selectedRequest.flat?.flat_number} · Block {selectedRequest.flat?.block} · {formatOccupancyType(selectedRequest.occupancy_type)}
                                </div>
                                {(selectedRequest.member?.mobile || selectedRequest.member?.email) && (
                                    <div className="occ-modal-detail">
                                        {selectedRequest.member?.mobile}
                                        {selectedRequest.member?.mobile && selectedRequest.member?.email && " · "}
                                        {selectedRequest.member?.email}
                                    </div>
                                )}
                                <div className="occ-modal-detail">
                                    Move in {formatDate(selectedRequest.start_date)}
                                    {selectedRequest.end_date && ` · Move out ${formatDate(selectedRequest.end_date)}`}
                                </div>
                            </div>
                        </div>

                        {actionType === "Rejected" && (
                            <div className="text-start mb-3">
                                <label className="sv-lb">Rejection reason</label>
                                <textarea
                                    className="sv-ta w-100"
                                    rows={3}
                                    placeholder="Let the resident know why (optional)"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        )}

                        <p className="occ-modal-confirm-text">
                            Are you sure you want to {actionType === "Approved" ? "approve" : "reject"} this request? This can't be undone from here.
                        </p>

                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn-ol py-1 px-3" onClick={closeModal} disabled={submitting}>
                                Cancel
                            </button>
                            <button
                                className={actionType === "Approved" ? "btn-ac py-1 px-3" : "btn-ol py-1 px-3 occ-reject-btn"}
                                onClick={confirmAction}
                                disabled={submitting}
                            >
                                {submitting ? "Processing…" : actionType === "Approved" ? "Confirm approve" : "Confirm reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlatApprovals;
