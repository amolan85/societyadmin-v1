import { useState, useEffect, useMemo } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { toast } from 'react-toastify';
import { deleteStaffApi, getStaffAttendanceApi, markAttendanceStaffApi } from '../../services/StaffAttendanceApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ManualEntryModal from './ManualEntryModal';
import { FiFilter, FiSearch, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { FaClipboardCheck } from 'react-icons/fa';
import FilterAttendanceModal from './FilterAttendanceModal';
import { CgExport } from 'react-icons/cg';
import ExportModal from '../../components/Common/ExportModal';
import { exportFile, exportToPDF } from '../../components/Common/ExportFile';
import MonthlyAttendanceSheet from './MonthlyAttendanceSheet';

// ── Small presentational stat tile, matches the icon + trend design ─────────
const StatTile = ({ icon, iconBg, iconColor, label, value, trend, trendDirection, trendNote }) => (
    <div className="col-6 col-md-3">
        <div className="stat-card">
            <div className="stat-card-icon" style={{ background: iconBg, color: iconColor }}>
                {icon}
            </div>
            <div className="stat-card-body text-start">
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value">{value}</div>
                {trend !== undefined && trend !== null && (
                    <div className={`stat-card-trend ${trendDirection === "up" ? "trend-up" : trendDirection === "down" ? "trend-down" : "trend-neutral"}`}>
                        {trendDirection === "up" && <FiArrowUp size={12} />}
                        {trendDirection === "down" && <FiArrowDown size={12} />}
                        <span>{trend}</span>
                        {trendNote && <span className="trend-note">{trendNote}</span>}
                    </div>
                )}
            </div>
        </div>
    </div>
);

// ── Donut chart for the Attendance Overview card ─────────────────────────────
const AttendanceDonut = ({ percentage = 0 }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="donut-svg">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#eef1f6" strokeWidth="14" />
            <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="#2563eb" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
            />
            <text x="70" y="65" textAnchor="middle" className="donut-pct">{percentage}%</text>
            <text x="70" y="84" textAnchor="middle" className="donut-label">Attendance Rate</text>
        </svg>
    );
};

const StaffAttendance = ({ setActive, setStaffId }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(10);
    const [search, setSearch] = useState("");
    const [societyId, setSocietyId] = useState("")
    const [allStaff, setAllStaff] = useState([])
    const [allStaffData, setAllStaffData] = useState([])
    const [allExportStaff, setAllExportStaff] = useState([])
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [totalStaff, setTotalStaff] = useState(0)
    const [present, setPresent] = useState(0)
    const [absent, setAbsent] = useState(0)
    const [notMarked, setNotMarked] = useState(0)   // backend's `not_marked` — attendance not taken yet today
    const [presentTrend, setPresentTrend] = useState(null)   // e.g. { pct: 5, direction: "up" }
    const [absentTrend, setAbsentTrend] = useState(null)     // e.g. { count: 1, direction: "down" }
    const [onTimeRate, setOnTimeRate] = useState(null)
    const [show, setShow] = useState(false)
    const [showFilterAttendance, setShowFilterAttendance] = useState(false)
    const [recordTypeTab, setRecordTypeTab] = useState("")
    const [attendanceStatus, setAttendanceStatus] = useState("present")
    const [attendanceDate, setAttendanceDate] = useState("")
    const [attendanceTime, setAttendanceTime] = useState("")
    const [reason, setReason] = useState("")
    const [errors, setErrors] = useState({});
    const [exportModal, setExportModal] = useState(false)
    const [activeTab, setActiveTab] = useState("excel");
    const [selectedRange, setSelectedRange] = useState("all");

    // ── Tab: Attendance Dashboard vs Monthly Attendance Sheet ───────────────────
    const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "monthlySheet"

    // ── Filter state ───────────────────────────────────────────────────────────
    const [filterStatus, setFilterStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Edit Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [selectedStaffName, setSelectedStaffName] = useState("");

    // Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const total = Math.ceil(totalCount / limit);

    const recordType = [
        { id: "Check In", value: "checkIn" },
        { id: "Check Out", value: "checkOut" },
    ];

    const filterData = {
        date: "14 Sept, 2025",
        status: ["On Duty", "Late Entry", "Shift Completed", "Absent"],
        departments: ["Security Guard", "Technicians", "Technicians"],
        shiftTypes: ["Morning Shift", "Evening Shift", "Night Shift"],
        checkInMethods: ["Biometric", "Mobile App", "Manual Entry"],
    };

    useEffect(() => {
        SessionData()
    }, [])

    // Re-fetch when filters change — only after societyId is ready
    useEffect(() => {
        if (!societyId) return;
        getStaff(societyId, 1, limit, date, search, filterStatus, dateFrom, dateTo);
    }, [filterStatus, dateFrom, dateTo]);

    const SessionData = async () => {
        const data = await GetSessionData()
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        getStaff(flats.society_id, 1, limit, date, "", "", "", "")
    }

    const getStaff = async (sid, pg, lmt, dt, searchText, status, fromDate, toDate) => {
        try {
            const data = await getStaffAttendanceApi(
                sid,
                pg || page,
                lmt || limit,
                dt || date,
                searchText,
                status || null,
                fromDate || null,
                toDate || null
            )
            setAllStaff(data.list)
            console.log("Staff API response:", data)
            console.log("Summary object:", data.summary)
            setAllStaffData(
                data.list.map((item) => ({
                    value: item.staff_id,
                    label: item.first_name + " " + item.last_name,
                    attendance_id: item.attendance_id,
                }))
            );
            setTotalStaff(data.count)
            setPresent(data.summary?.present ?? 0)
            setAbsent(data.summary?.absent ?? 0)
            setNotMarked(data.summary?.not_marked ?? 0)
            // Optional trend fields — wire these up once the backend returns them.
            // Expected shape: data.summary.presentTrendPct, data.summary.absentTrendCount, data.summary.onTimeRate
            setPresentTrend(
                data.summary?.presentTrendPct !== undefined
                    ? { pct: data.summary.presentTrendPct, direction: data.summary.presentTrendPct >= 0 ? "up" : "down" }
                    : null
            )
            setAbsentTrend(
                data.summary?.absentTrendCount !== undefined
                    ? { count: Math.abs(data.summary.absentTrendCount), direction: data.summary.absentTrendCount <= 0 ? "down" : "up" }
                    : null
            )
            setOnTimeRate(data.summary?.onTimeRate ?? null)
            setLimit(data.pagination.per_page)
            setTotalCount(data.pagination.total_records)
        } catch (error) {
            console.error("Error fetching staff:", error)
        }
    }

    const getAllExportStaff = async (sid) => {
        const data = await getStaffAttendanceApi(sid, "", "", date)
        setAllExportStaff(data.list)
    }

    const GetStaffById = async (staffId) => {
        setActive("createStaff")
        setStaffId(staffId)
    }

    const deleteStaff = (staffId, staffName) => {
        setSelectedStaffId(staffId);
        setSelectedStaffName(staffName);
        setShowDeleteModal(true);
    };

    const confirmDeleteStaff = async () => {
        try {
            setDeleting(true);
            await deleteStaffApi(selectedStaffId, societyId);
            toast.success("Staff deleted successfully!");
            setShowDeleteModal(false);
            getStaff(societyId, page, limit, date, search, filterStatus, dateFrom, dateTo);
        } catch (error) {
            console.log(error);
        } finally {
            setDeleting(false);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!selectedStaff) errors.selectedStaff = "required";
        if (!recordTypeTab) errors.recordTypeTab = "required";
        if (!attendanceDate) errors.attendanceDate = "required";
        if (!attendanceTime) errors.attendanceTime = "required";
        return errors;
    };

    const markAttendance = async () => {
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            await markAttendanceStaffApi(
                selectedStaff.value, selectedStaff?.attendance_id,
                societyId, attendanceDate, attendanceTime, attendanceStatus, recordTypeTab
            )
            toast.success("Attendance mark successfully!")
            getStaff(societyId, page, limit, date, search, filterStatus, dateFrom, dateTo);
            setShow(false)
            resetForm()
        } catch (error) {
            console.error(error)
        }
    }

    const dateHandleChange = async (e) => {
        const val = e.target.value;
        setDate(val);
        getStaff(societyId, 1, limit, val, search, filterStatus, dateFrom, dateTo);
    }

    const handlePageChange = (value) => {
        setPage(value);
        getStaff(societyId, value, limit, date, search, filterStatus, dateFrom, dateTo);
    };

    const handleSearchClick = () => {
        setPage(1);
        getStaff(societyId, 1, limit, date, search, filterStatus, dateFrom, dateTo);
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value.trim()) {
            setPage(1);
            getStaff(societyId, 1, limit, date, "", filterStatus, dateFrom, dateTo);
        }
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        setPage(1);
    };

    const exportData =
        selectedRange === "all"
            ? allExportStaff
            : selectedRange === "search"
                ? allStaff
                : "";

    const downloadExcel = async () => {
        exportFile({ data: exportData, fileName: "Staff", sheetName: "Staff", type: "xlsx" });
    };

    const downloadCSV = async () => {
        exportFile({ data: exportData, fileName: "Staff", sheetName: "Staff", type: "csv" });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Staff Report",
            fileName: "Staff",
            columns: ["Name", "Role", "Shift", "Status", "Time In", "Time Out"],
            data: exportData.map((item) => [
                item.first_name + " " + item.last_name,
                item.role,
                item.shift,
                item.status,
                item.check_in,
                item.check_out
            ]),
        });
    };

    const handleExport = () => {
        if (activeTab === "excel") { downloadExcel(); setExportModal(false); }
        else if (activeTab === "csv") { downloadCSV(); setExportModal(false); }
        else if (activeTab === "pdf") { downloadPDF(); setExportModal(false); }
    };

    const resetForm = () => {
        setSelectedStaff(null);
        setRecordTypeTab("");
        setAttendanceStatus("present");
        setAttendanceDate("");
        setAttendanceTime("");
        setReason("");
        setErrors({});
    };

    // ── Shift Summary — grouped from the current page of staff data ────────────
    // NOTE: for an accurate society-wide shift breakdown (not just the current
    // page), ask the backend to return this in `data.summary.shiftBreakdown`
    // and swap this useMemo for that value.
    const shiftSummary = useMemo(() => {
        const groups = {};
        allStaff.forEach((s) => {
            const shiftName = s.shift || "Unassigned";
            groups[shiftName] = (groups[shiftName] || 0) + 1;
        });
        return Object.entries(groups);
    }, [allStaff]);

    const attendanceRate = totalStaff > 0 ? Math.round((present / totalStaff) * 100) : 0;

    return (
        <div className="pg sa-wrap">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="bc-header-icon">
                        <FaClipboardCheck size={20} color="#2563eb" />
                    </div>
                    <div className="text-start">
                        <h4 className="cp-title mb-1">Staff Attendance & Tracking</h4>
                        <p className="cp-sub mb-0">
                            Monitor staff attendance, track daily activities, and manage manual entries.
                        </p>
                    </div>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-2">
                    <input
                        type="date"
                        className="form-control"
                        style={{ width: "170px" }}
                        value={date}
                        onChange={dateHandleChange}
                    />
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => { getAllExportStaff(societyId); setExportModal(true); }}
                    >
                        <CgExport className="me-1" /> Export
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => { setActive("createStaff"); setStaffId(null); }}
                    >
                        Add Staff
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => { setShow(true); resetForm(); }}
                    >
                        Manual Entry
                    </button>
                </div>
            </div>

            {/* ── View tabs ── */}
            <div className="sa-view-tabs mb-4">
                <button
                    className={`sa-view-tab ${activeView === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveView("dashboard")}
                >
                    Attendance Dashboard
                </button>
                <button
                    className={`sa-view-tab ${activeView === "monthlySheet" ? "active" : ""}`}
                    onClick={() => setActiveView("monthlySheet")}
                >
                    Monthly Attendance Sheet
                </button>
            </div>

            {activeView === "monthlySheet" ? (
                <MonthlyAttendanceSheet societyId={societyId} />
            ) : (
                <>
                    {/* Stats */}
                    <div className="row g-3 mb-4">
                        <StatTile
                            icon={<FiCheckCircle size={20} />}
                            iconBg="#e6f4ea" iconColor="#1a7f37"
                            label="Present" value={present}
                            trend={presentTrend ? `${presentTrend.pct}%` : null}
                            trendDirection={presentTrend?.direction}
                            trendNote="from yesterday"
                        />
                        <StatTile
                            icon={<FiXCircle size={20} />}
                            iconBg="#fdeaea" iconColor="#d1242f"
                            label="Absent" value={absent}
                            trend={absentTrend ? `${absentTrend.count}` : null}
                            trendDirection={absentTrend?.direction}
                            trendNote="from yesterday"
                        />
                        <StatTile
                            icon={<FiClock size={20} />}
                            iconBg="#fef3e0" iconColor="#b3690a"
                            label="Not Marked" value={notMarked}
                            trend="Attendance pending for today"
                            trendDirection="neutral"
                        />
                        <StatTile
                            icon={<FiUsers size={20} />}
                            iconBg="#e8f0fe" iconColor="#2563eb"
                            label="Total Staff" value={totalStaff}
                            trend={shiftSummary.length ? `${shiftSummary.length} departments active` : null}
                            trendDirection="neutral"
                        />
                    </div>

                    {/* ── Attendance Overview + Shift Summary ── */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-7">
                            <div className="sv-card overview-card p-3">
                                <h6 className="fw-bold text-start mb-1">Attendance Overview</h6>
                                <p className="sa-muted text-start mb-3">Today's staff attendance status and shift activity.</p>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <div className="d-flex flex-column gap-2">
                                        <div className="overview-stat">
                                            <FiCheckCircle color="#1a7f37" />
                                            <span className="fw-bold">{present} Present</span>
                                            <span className="sa-muted small">Currently on duty</span>
                                        </div>
                                        <div className="overview-stat">
                                            <FiXCircle color="#d1242f" />
                                            <span className="fw-bold">{absent} Absent</span>
                                            <span className="sa-muted small">Not checked in</span>
                                        </div>
                                        <div className="overview-stat">
                                            <FiClock color="#b3690a" />
                                            <span className="fw-bold">{notMarked} Not Marked</span>
                                            <span className="sa-muted small">Attendance not taken yet today</span>
                                        </div>
                                    </div>
                                    <AttendanceDonut percentage={attendanceRate} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="sv-card p-3 h-100">
                                <h6 className="fw-bold text-start mb-3">Shift Summary</h6>
                                {shiftSummary.length === 0 && (
                                    <p className="sa-muted text-start">No shift data for this day.</p>
                                )}
                                {shiftSummary.map(([shiftName, count]) => (
                                    <div className="shift-row" key={shiftName}>
                                        <span className="shift-dot" />
                                        <span className="flex-grow-1 text-start">{shiftName}</span>
                                        <span className="fw-bold">{count} Staff</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Toolbar ── */}
                    <div className="visitor-toolbar mb-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control visitor-search"
                                    placeholder="Search by name, role..."
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-primary" onClick={handleSearchClick}>
                                    <FiSearch />
                                </button>
                            </div>
                            <button className="btn-ol ms-2" onClick={() => setShowFilterAttendance(true)}>
                                <FiFilter size={14} /> Filter
                            </button>
                        </div>

                        <div className="row g-2">
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date" className="form-control" placeholder="From date"
                                    value={dateFrom}
                                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date" className="form-control" placeholder="To date"
                                    value={dateTo}
                                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="sv-card p-0 overflow-hidden">
                        <div className="sa-table-wrap">
                            <table className="sv-tbl">
                                <thead>
                                    <tr>
                                        {["Name", "Role", "Shift", "Status", "Time In", "Time Out", "Action"]
                                            .map(h => <th key={h}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allStaff.map((s, i) => {
                                        const displayStatus = s.status;
                                        return (
                                        <tr className="text-start" key={i}>
                                            <td className="sa-name">{s.first_name + " " + s.last_name}</td>
                                            <td className="sa-muted">{s.role || "-"}</td>
                                            <td className="sa-muted">{s.shift || "-"}</td>
                                            <td>
                                                <Badge
                                                    label={displayStatus}
                                                    c={
                                                        displayStatus === "present" ? "green"
                                                            : displayStatus === "absent" ? "red"
                                                                : displayStatus === "late" ? "tile-org"
                                                                    : "gray"
                                                    }
                                                />
                                            </td>
                                            <td className={displayStatus !== "present" ? "sa-muted" : "sa-time"}>{s.check_in || "-"}</td>
                                            <td className={displayStatus !== "present" ? "sa-muted" : "sa-time"}>{s.check_out || "-"}</td>
                                            <td>
                                                <div className="member-action-dropdown dropdown">
                                                    <button
                                                        className="member-action-btn" type="button"
                                                        data-bs-toggle="dropdown" aria-expanded="false"
                                                    >
                                                        ⋮
                                                    </button>
                                                    <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                                                        <li>
                                                            <button
                                                                className="dropdown-item member-action-item"
                                                                onClick={() => GetStaffById(s.staff_id)}
                                                            >
                                                                Edit Staff
                                                            </button>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item member-action-item member-action-delete"
                                                                onClick={() => deleteStaff(s.staff_id, s.first_name + " " + s.last_name)}
                                                            >
                                                                Delete Staff
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination page={page} total={total} onChange={handlePageChange} />
                    </div>
                </>
            )}

            {/* Delete confirm modal */}
            <div
                className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button
                                className="btn-close"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            />
                        </div>
                        <div className="modal-body text-start">
                            <p>
                                Are you sure you want to delete{" "}
                                <strong>"{selectedStaffName}"</strong>?
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmDeleteStaff}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ManualEntryModal
                show={show}
                setShow={setShow}
                allStaffData={allStaffData}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                recordType={recordType}
                recordTypeTab={recordTypeTab}
                setRecordTypeTab={setRecordTypeTab}
                attendanceStatus={attendanceStatus}
                setAttendanceStatus={setAttendanceStatus}
                attendanceDate={attendanceDate}
                setAttendanceDate={setAttendanceDate}
                attendanceTime={attendanceTime}
                setAttendanceTime={setAttendanceTime}
                reason={reason}
                setReason={setReason}
                errors={errors}
                resetForm={resetForm}
                handleSubmit={markAttendance}
            />

            <FilterAttendanceModal
                showFilterAttendance={showFilterAttendance}
                setShowFilterAttendance={setShowFilterAttendance}
                filterData={filterData}
            />

            <ExportModal
                show={exportModal}
                onClose={() => setExportModal(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportStaff.length}
                currentRecords={allStaff.length}
            />
        </div>
    );
}

export default StaffAttendance
