import { useState, useEffect } from "react";
import { GetSessionData } from "../../utils/SessionManagement";
import { GetAllStaffApi } from '../../services/StaffAttendanceApi';

const AssignStaffModal = ({ show, setShow, complaintId, onAssigned }) => {

    const [societyId, setSocietyId] = useState("");
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [selectedStaffName, setSelectedStaffName] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [notes, setNotes] = useState("");
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // =====================================================
    // LOAD SESSION + FETCH STAFF
    // =====================================================

    useEffect(() => {
        if (show) {
            resetForm();
            SessionData();
        }
    }, [show]);

    const resetForm = () => {
        setSelectedStaffId("");
        setSelectedStaffName("");
        setPriority("");
        setDueDate("");
        setNotes("");
    };

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            const sid = data.data.flats[0].society_id;
            setSocietyId(sid);
            fetchStaff(sid);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStaff = async (sid) => {
        try {
            setLoadingStaff(true);
            const data = await GetAllStaffApi(sid, "", "", true);
            const list = (data.list || data.staff || data.data || data || []).map((s) => ({
                id:     s.staff_id   || s.id,
                name:   `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.name || "",
                role:   s.role       || s.designation || "",
            }));
            setStaffList(list);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingStaff(false);
        }
    };

    // =====================================================
    // ASSIGN
    // =====================================================

    const handleAssign = async () => {
        if (!selectedStaffId) return;
        try {
            setSubmitting(true);
            // TODO: replace with your assign API call
            console.log("Assigning:", { complaintId, staffId: selectedStaffId, staffName: selectedStaffName, priority, dueDate, notes });
            await new Promise((r) => setTimeout(r, 400));
            if (onAssigned) onAssigned();
            setShow(false);
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!show) return null;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
            <div className="modal show d-block" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-md modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-3">

                        {/* ── HEADER ── */}
                        <div className="modal-header px-4 py-3">
                            <h5 className="modal-title fw-bold mb-0">Assign Staff</h5>
                            <button type="button" className="btn-close" onClick={() => setShow(false)} />
                        </div>

                        {/* ── BODY ── */}
                        <div className="modal-body px-4 py-3 text-start">

                            {/* ROW 1 — Staff + Role */}
                            <div className="row g-3 mb-3">

                                {/* Staff Member */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold mb-1">
                                        Staff Member <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={selectedStaffId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSelectedStaffId(val);
                                            const found = staffList.find((s) => String(s.id) === String(val));
                                            setSelectedStaffName(found?.name || "");
                                        }}
                                        disabled={loadingStaff}
                                    >
                                        <option value="">
                                            {loadingStaff ? "Loading..." : "Select Staff"}
                                        </option>
                                        {staffList.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Role (auto-filled) */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold mb-1">Role</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={staffList.find((s) => String(s.id) === String(selectedStaffId))?.role || ""}
                                        placeholder="Auto-filled on selection"
                                        readOnly
                                        style={{ background: "#f9fafb" }}
                                    />
                                </div>

                            </div>

                            {/* ROW 2 — Due Date */}
                            <div className="row g-3 mb-3">

                                {/* Due Date */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={dueDate}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>

                            </div>

                            {/* ROW 3 — Notes (full width) */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold mb-1">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter description"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {/* ROW 4 — Priority (full width, pill buttons) */}
                            <div className="mb-1">
                                <label className="form-label fw-semibold mb-2">
                                    Priority <span className="text-danger">*</span>
                                </label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {[
                                        { label: "Low",    value: "low",    color: "#6b7280" },
                                        { label: "Medium", value: "medium", color: "#f59e0b" },
                                        { label: "High",   value: "high",   color: "#ef4444" },
                                        { label: "Urgent", value: "urgent", color: "#dc2626" },
                                    ].map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setPriority(p.value)}
                                            style={{
                                                padding: "5px 18px",
                                                borderRadius: 20,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                border: priority === p.value
                                                    ? `2px solid ${p.color}`
                                                    : "1px solid #e2e8f0",
                                                background: priority === p.value
                                                    ? p.color + "18"
                                                    : "#fff",
                                                color: priority === p.value ? p.color : "#6b7280",
                                                cursor: "pointer",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* ── FOOTER ── */}
                        <div className="modal-footer px-4 py-3 border-top">
                            <button
                                className="btn btn-outline-secondary px-4"
                                onClick={() => setShow(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary px-4"
                                onClick={handleAssign}
                                disabled={submitting || !selectedStaffId || !priority}
                            >
                                {submitting ? (
                                    <><span className="spinner-border spinner-border-sm me-1" role="status" /> Assigning...</>
                                ) : (
                                    "Assign Staff"
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AssignStaffModal;