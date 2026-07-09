import { useState, useEffect, useMemo } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { CgExport } from 'react-icons/cg';
import { Pagination } from '../../components/Common/ReusableFunction';
import { exportFile, exportToPDF } from '../../components/Common/ExportFile';
// TODO: add this function to services/StaffAttendanceApi.js — see the shape
// documented above generateDemoMonthlyData() below. Until the backend
// endpoint exists, this component falls back to demo data so the UI can be
// reviewed/wired up independently of the backend.
// import { getMonthlyAttendanceApi } from '../../services/StaffAttendanceApi';

const STATUS_META = {
    P: { label: "Present", className: "day-present" },
    A: { label: "Absent", className: "day-absent" },
    L: { label: "Late", className: "day-late" },
    H: { label: "Holiday", className: "day-holiday" },
    WO: { label: "Weekly Off", className: "day-weekoff" },
    CL: { label: "Casual Leave", className: "day-casual" },
    SL: { label: "Sick Leave", className: "day-sick" },
};

const monthLabel = (m, y) =>
    new Date(y, m - 1, 1).toLocaleString("en-US", { month: "long", year: "numeric" });

const daysInMonth = (m, y) => new Date(y, m, 0).getDate();

// Demo/fallback data generator — remove once getMonthlyAttendanceApi is wired up.
const generateDemoMonthlyData = (month, year) => {
    const names = [
        ["Rucha", "Junghare", "Security Guard"],
        ["Amit", "Kale", "Technician"],
        ["Prakash", "Patil", "Housekeeping"],
        ["Sunil", "Borse", "Gardener"],
        ["Mayur", "Gawade", "Electrician"],
        ["Rahul", "Pawar", "Plumber"],
    ];
    const totalDays = daysInMonth(month, year);
    const statuses = ["P", "P", "P", "P", "A", "L", "WO", "H"];
    return names.map(([first, last, role], idx) => {
        const days = {};
        let present = 0, absent = 0, late = 0;
        for (let d = 1; d <= totalDays; d++) {
            const dow = new Date(year, month - 1, d).getDay();
            let status;
            if (dow === 0) status = "WO";
            else status = statuses[(d + idx) % statuses.length];
            days[d] = status;
            if (status === "P") present++;
            if (status === "A") absent++;
            if (status === "L") { late++; present++; }
        }
        return {
            staff_id: idx + 1,
            first_name: first,
            last_name: last,
            role,
            days,
            present,
            absent,
            late,
            percentage: Math.round((present / totalDays) * 100),
        };
    });
};

const MonthlyAttendanceSheet = ({ societyId }) => {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [shift, setShift] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [staffRows, setStaffRows] = useState([]);
    const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, percentage: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!societyId) return;
        fetchMonthlyData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [societyId, month, year]);

    const fetchMonthlyData = async () => {
        setLoading(true);
        try {
            // Real integration — uncomment once the endpoint exists:
            // const data = await getMonthlyAttendanceApi(societyId, month, year, { search, department, shift, status, page, limit });
            // setStaffRows(data.staff);
            // setSummary(data.summary);

            const demo = generateDemoMonthlyData(month, year);
            setStaffRows(demo);
            const totalDays = daysInMonth(month, year);
            setSummary({
                present: demo.reduce((sum, s) => sum + s.present, 0),
                absent: demo.reduce((sum, s) => sum + s.absent, 0),
                late: demo.reduce((sum, s) => sum + s.late, 0),
                percentage: Math.round(
                    (demo.reduce((sum, s) => sum + s.present, 0) / (demo.length * totalDays)) * 100
                ),
            });
        } catch (error) {
            console.error("Error fetching monthly attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRows = useMemo(() => {
        return staffRows.filter((s) => {
            const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
            if (search && !fullName.includes(search.toLowerCase()) && !s.role?.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [staffRows, search]);

    const total = Math.ceil(filteredRows.length / limit) || 1;
    const pagedRows = filteredRows.slice((page - 1) * limit, page * limit);
    const totalDays = daysInMonth(month, year);
    const dayColumns = Array.from({ length: totalDays }, (_, i) => i + 1);

    const handleMonthChange = (e) => {
        const [y, m] = e.target.value.split("-");
        setYear(Number(y));
        setMonth(Number(m));
        setPage(1);
    };

    const downloadExcel = () => {
        const rows = filteredRows.map((s) => ({
            Name: `${s.first_name} ${s.last_name}`,
            Role: s.role,
            Present: s.present,
            Absent: s.absent,
            Late: s.late,
            "Attendance %": s.percentage,
        }));
        exportFile({ data: rows, fileName: "MonthlyAttendance", sheetName: "Attendance", type: "xlsx" });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: `Monthly Attendance Sheet — ${monthLabel(month, year)}`,
            fileName: "MonthlyAttendance",
            columns: ["Name", "Role", "Present", "Absent", "Late", "Attendance %"],
            data: filteredRows.map((s) => [
                `${s.first_name} ${s.last_name}`, s.role, s.present, s.absent, s.late, `${s.percentage}%`
            ]),
        });
    };

    return (
        <div className="monthly-sheet">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div className="d-flex gap-2">
                    <input
                        type="month"
                        className="form-control"
                        style={{ width: "170px" }}
                        value={`${year}-${String(month).padStart(2, "0")}`}
                        onChange={handleMonthChange}
                    />
                    <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                        <option value="">All Departments</option>
                        <option value="Security">Security</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Housekeeping">Housekeeping</option>
                    </select>
                    <select className="form-select" value={shift} onChange={(e) => setShift(e.target.value)}>
                        <option value="">All Shifts</option>
                        <option value="Morning">Morning Shift</option>
                        <option value="Evening">Evening Shift</option>
                        <option value="Night">Night Shift</option>
                    </select>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={downloadExcel}>
                        <CgExport className="me-1" /> Export Excel
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={downloadPDF}>
                        <CgExport className="me-1" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="d-flex gap-2 mb-3">
                <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: "280px" }}
                    placeholder="Search staff..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <button className="btn-ol"><FiFilter size={14} /> Filter</button>
            </div>

            {/* Legend */}
            <div className="sheet-legend mb-3">
                {Object.entries(STATUS_META).map(([code, meta]) => (
                    <span className="legend-chip" key={code}>
                        <span className={`day-cell-inline ${meta.className}`}>{code}</span>
                        {meta.label}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className="sv-card p-0 overflow-hidden">
                <div className="monthly-grid-wrap">
                    <table className="sv-tbl monthly-grid-tbl">
                        <thead>
                            <tr>
                                <th className="sticky-col">Staff Name</th>
                                <th className="sticky-col-2">Role</th>
                                {dayColumns.map((d) => {
                                    const dow = new Date(year, month - 1, d).toLocaleString("en-US", { weekday: "short" });
                                    return (
                                        <th key={d} className="day-header">
                                            <div>{d}</div>
                                            <div className="day-dow">{dow}</div>
                                        </th>
                                    );
                                })}
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Late</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={dayColumns.length + 6} className="text-center py-4">Loading…</td></tr>
                            )}
                            {!loading && pagedRows.map((s) => (
                                <tr key={s.staff_id}>
                                    <td className="sticky-col sa-name text-start">{s.first_name} {s.last_name}</td>
                                    <td className="sticky-col-2 sa-muted text-start">{s.role}</td>
                                    {dayColumns.map((d) => {
                                        const code = s.days[d] || "-";
                                        const meta = STATUS_META[code];
                                        return (
                                            <td key={d} className="day-cell">
                                                <span className={`day-cell-inline ${meta?.className || ""}`}>
                                                    {code}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="fw-bold text-success">{s.present}</td>
                                    <td className="fw-bold text-danger">{s.absent}</td>
                                    <td className="fw-bold text-warning">{s.late}</td>
                                    <td className="fw-bold text-primary">{s.percentage}%</td>
                                </tr>
                            ))}
                            {!loading && pagedRows.length === 0 && (
                                <tr><td colSpan={dayColumns.length + 6} className="text-center py-4">No staff found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <span className="sa-muted small">
                        Showing {pagedRows.length ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, filteredRows.length)} of {filteredRows.length} staff members
                    </span>
                    <Pagination page={page} total={total} onChange={setPage} />
                </div>
            </div>

            {/* Summary footer */}
            <div className="row g-3 mt-3">
                <div className="col-md-8">
                    <div className="sv-card p-3">
                        <h6 className="fw-bold text-start mb-3">Sheet Summary — {monthLabel(month, year)}</h6>
                        <div className="d-flex gap-4 flex-wrap">
                            <div className="summary-metric">
                                <div className="summary-metric-val text-success">{summary.present}</div>
                                <div className="sa-muted small">Total Present</div>
                            </div>
                            <div className="summary-metric">
                                <div className="summary-metric-val text-danger">{summary.absent}</div>
                                <div className="sa-muted small">Total Absent</div>
                            </div>
                            <div className="summary-metric">
                                <div className="summary-metric-val text-warning">{summary.late}</div>
                                <div className="sa-muted small">Total Late</div>
                            </div>
                            <div className="summary-metric">
                                <div className="summary-metric-val text-primary">{summary.percentage}%</div>
                                <div className="sa-muted small">Attendance %</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="sv-card p-3">
                        <h6 className="fw-bold text-start mb-3">Quick Legend</h6>
                        <div className="quick-legend">
                            {Object.entries(STATUS_META).map(([code, meta]) => (
                                <div className="quick-legend-row" key={code}>
                                    <span className={`day-cell-inline ${meta.className}`}>{code}</span>
                                    <span>{meta.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyAttendanceSheet;
