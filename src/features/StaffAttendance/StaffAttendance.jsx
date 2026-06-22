import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { toast } from 'react-toastify';
import { deleteStaffApi, getStaffAttendanceApi, markAttendanceStaffApi } from '../../services/StaffAttendanceApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ManualEntryModal from './ManualEntryModal';
import { FiDelete, FiFilter, FiSearch } from 'react-icons/fi';
import FilterAttendanceModal from './FilterAttendanceModal';
import { CgExport } from 'react-icons/cg';
import ExportModal from '../../components/Common/ExportModal';
import { exportFile, exportToPDF } from '../../components/Common/ExportFile';

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
    const [totalStaff, setTotalStaff] = useState("")
    const [present, setPresent] = useState("")
    const [absent, setAbsent] = useState("")
    const [late, setLate] = useState("")
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

    // ── Filter state ───────────────────────────────────────────────────────────
    const [filterStatus, setFilterStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

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
            console.log("Staff API response:", data)  // ← add this
            console.log("Summary:", data.summary)      // ← add this
            setAllStaff(data.list)
            setAllStaffData(
                data.list.map((item) => ({
                    value: item.staff_id,
                    label: item.first_name + " " + item.last_name,
                    attendance_id: item.attendance_id,
                }))
            );
            setTotalStaff(data.count)
            setPresent(data.summary.present)
            setAbsent(data.summary.absent)
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

    const deleteStaff = async (staffId) => {
        const confirmed = window.confirm("Are you sure you want to delete this staff?");
        if (!confirmed) return;
        try {
            const data = await deleteStaffApi(staffId);
            toast.success("Staff deleted successfully!");
            getStaff(societyId, page, limit, date, search, filterStatus, dateFrom, dateTo);
        } catch (error) {
            console.error(error);
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!selectedStaff)   errors.selectedStaff  = "required";
        if (!recordTypeTab)   errors.recordTypeTab   = "required";
        if (!attendanceDate)  errors.attendanceDate  = "required";
        if (!attendanceTime)  errors.attendanceTime  = "required";
        return errors;
    };

    const markAttendance = async () => {
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            const data = await markAttendanceStaffApi(
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

    // Search fires on button click
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

    // Single handler — used by both status dropdown change
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
        if (activeTab === "excel")    { downloadExcel(); setExportModal(false); }
        else if (activeTab === "csv") { downloadCSV();   setExportModal(false); }
        else if (activeTab === "pdf") { downloadPDF();   setExportModal(false); }
    };

    const resetForm = () => {
        setSelectedStaff(null)
        setRecordTypeTab("")
        setAttendanceDate("")
        setAttendanceTime("")
    }

    return (
        <div className="pg sa-wrap">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="sa-title">Staff Attendance & Tracking</h4>
                <div className="d-flex gap-2">
                    <input
                        type="date"
                        className="sv-in sa-date"
                        value={date}
                        onChange={dateHandleChange}
                    />
                    <button
                        className="btn-ol"
                        onClick={() => { getAllExportStaff(societyId); setExportModal(true); }}
                    >
                        <CgExport /> Export
                    </button>
                    <button className="btn btn-sm btn-ac btn-primary" onClick={() => setActive("createStaff")}>Create</button>
                    <button className="btn btn-sm btn-ac btn-primary" onClick={() => { setShow(true); resetForm(); }}>Manual Entry</button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    [present,    "Present",    "tile-grn"],
                    [absent,     "Absent",     "tile-red"],
                    ["-",        "Late",       "tile-org"],
                    [totalStaff, "Total Staff", "tile-blu"]
                ].map(([v, l, cls]) => (
                    <div className="col-6 col-md-3" key={l}>
                        <div className={`tile bg-white ${cls}`}>
                            <div className="text-start fw-bold">{l}</div>
                            <div className="tile-val text-start mt-1">{v}</div>
                        </div>
                    </div>
                ))}
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

                    <button
                        className="btn-ol ms-2"
                        onClick={() => setShowFilterAttendance(true)}
                    >
                        <FiFilter size={14} /> Filter
                    </button>
                </div>

                {/* Filter row: Status + Date From + Date To */}
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
                            type="date"
                            className="form-control"
                            placeholder="From date"
                            value={dateFrom}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="To date"
                            value={dateTo}
                            onChange={(e) => {
                                setDateTo(e.target.value);
                                setPage(1);
                            }}
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
                            {allStaff.map((s, i) => (
                                <tr className="text-start" key={i}>
                                    <td className="sa-name">{s.first_name + " " + s.last_name}</td>
                                    <td className="sa-muted">{s.role}</td>
                                    <td></td>
                                    <td>
                                        <Badge
                                            label={s.status}
                                            c={
                                                s.status === "present" ? "green"
                                                : s.status === "absent"  ? "red"
                                                : s.status === "late"    ? "tile-org"
                                                : "gray"
                                            }
                                        />
                                    </td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>{s.check_in}</td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>{s.check_out}</td>
                                    <td>
                                        <div className="member-action-dropdown dropdown">
                                            <button
                                                className="member-action-btn"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
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
                                                        onClick={() => deleteStaff(s.staff_id)}
                                                    >
                                                        Delete Staff
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} total={total} onChange={handlePageChange} />
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
