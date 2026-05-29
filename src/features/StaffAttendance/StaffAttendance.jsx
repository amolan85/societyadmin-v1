import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { toast } from 'react-toastify';
import { deleteStaffApi, getStaffAttendanceApi, markAttendanceStaffApi } from '../../services/StaffAttendanceApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ManualEntryModal from './ManualEntryModal';
import { FiFilter, FiSearch } from 'react-icons/fi';
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
    const total = Math.ceil(totalCount / limit);

    const recordType = [
        { id: "Check In", value: "checkIn" },
        { id: "Check Out", value: "checkOut" },

    ];
    const filterData = {
        date: "14 Sept, 2025",

        status: [
            "On Duty",
            "Late Entry",
            "Shift Completed",
            "Absent",
        ],

        departments: [
            "Security Guard",
            "Technicians",
            "Technicians",
        ],

        shiftTypes: [
            "Morning Shift",
            "Evening Shift",
            "Night Shift",
        ],

        checkInMethods: [
            "Biometric",
            "Mobile App",
            "Manual Entry",
        ],
    };
    useEffect(() => {
        SessionData()
    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        getStaff(flats.society_id)

    }
    //function for get staff
    const getStaff = async (societyId) => {
        const data = await getStaffAttendanceApi(societyId, page, limit, date)
        console.log(data)
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
    }

    const getAllExportStaff = async (societyId) => {
        const data = await getStaffAttendanceApi(societyId, "", "", date)
        console.log(data)
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
            console.log(data);
            toast.success("Staff deleted successfully!");
            getStaff(societyId);
        } catch (error) {
            console.log(error);
        }
    };

    const validateForm = () => {
        let errors = {};

        if (!selectedStaff) {
            errors.selectedStaff = "required";
        }

        if (!recordTypeTab) {
            errors.recordTypeTab = "required";
        }

        if (!attendanceDate) {
            errors.attendanceDate = "required";
        }

        if (!attendanceTime) {
            errors.attendanceTime = "required";
        }

        return errors;
    };

    const markAttendance = async () => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const data = await markAttendanceStaffApi(selectedStaff.value, selectedStaff?.attendance_id, societyId, attendanceDate, attendanceTime, attendanceStatus, recordTypeTab)
            console.log(data)
            toast.success("Attendance mark successfully!")
            getStaff(societyId)
            setShow(false)
            resetForm("")
        } catch (error) {
            console.log(error)
        }
    }

    // const per = 5, total = Math.ceil(allStaff.length / per);
    // const rows = allStaff.slice((page - 1) * per, page * per);

    const dateHandleChange = async (e) => {
        setDate(e.target.value)
        const data = await getStaffAttendanceApi(societyId, page, limit, e.target.value)
        setAllStaff(data.list)
    }

    const handlePageChange = (value) => {
        setPage(value);
        getStaff(societyId, value, limit);
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value && value.length < 4) return;

        const data = await getStaffAttendanceApi(
            societyId,
            page,
            limit,
            date,
            value
        );

        setAllStaff(data?.list || []);
    };

    const exportData =
        selectedRange === "all"
            ? allExportStaff
            : selectedRange === "search"
                ? allStaff
                : "";


    const downloadExcel = async () => {
        exportFile({
            data: exportData,
            fileName: "Staff",
            sheetName: "Staff",
            type: "xlsx",
        });
    };

    const downloadCSV = async () => {
        exportFile({
            data: exportData,
            fileName: "Staff",
            sheetName: "Staff",
            type: "csv",
        });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Staff Report",
            fileName: "Staff",
            columns: [
                "Name",
                "Role",
                "Shift",
                "Status",
                "Time In",
                "Time Out",
            ],
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
        if (activeTab === "excel") {
            downloadExcel();
            setExportModal(false);
        } else if (activeTab === "csv") {
            downloadCSV();
            setExportModal(false);
        } else if (activeTab === "pdf") {
            downloadPDF();
            setExportModal(false);
        }
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
                        onClick={() => {
                            getAllExportStaff(societyId);
                            setExportModal(true);
                        }}
                    >
                        <CgExport /> Export
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => setActive("createStaff")}>Create</button>
                    <button className="btn btn-sm btn-primary" onClick={() => { setShow(true); resetForm() }}>Manual Entry</button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    [present, "Present", "tile-grn"],
                    [absent, "Absent", "tile-red"],
                    ["-", "Late", "tile-org"],
                    [totalStaff, "Total Staff", "tile-blu"]
                ].map(([v, l, cls]) => (
                    // <div className="col-6 col-md-3" key={l}>
                    //     <div className={`tile ${cls}`}>
                    //         <div className="tile-val">{v}</div>
                    //         <div className="tile-lbl">{l}</div>
                    //     </div>
                    // </div>
                    <div className="col-6 col-md-3" key={l}>
                        <div className={`tile bg-white ${cls}`}>
                            <div className=" text-start fw-bold">{l}</div>
                            <div className="tile-val text-start mt-1">{v}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                {/* <div>
                        <h4 className="cp-title">Members</h4>
                        <p className="cp-sub">
                            Manage and track all society members
                        </p>
                    </div> */}
                <div className="col-12 col-md-4 col-lg-3 position-relative">
                    <span
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#aaa",
                        }}
                    >
                        <FiSearch size={16} />
                    </span>

                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Search by name, role"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onChange={handleSearch}
                        style={{ paddingLeft: "35px" }}
                    />
                </div>
                <div className="d-flex">
                    <button
                        className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                        data-bs-toggle="dropdown" onClick={() => setShowFilterAttendance(true)}
                    >
                        <FiFilter size={14} />
                        Filter
                    </button>

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

                                    <td>
                                        {/* <Badge label={s.shift} c="gray" /> */}
                                    </td>

                                    <td>
                                        <Badge label={s.status} c={
                                            s.status === "present"
                                                ? "green"
                                                : s.status === "absent"
                                                    ? "red"
                                                    : s.status === "late"
                                                        ? "tile-org"
                                                        : "gray"
                                        } />
                                    </td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>
                                        {s.check_in}
                                    </td>
                                    <td className={s.st === "Absent" ? "sa-muted" : "sa-time"}>
                                        {s.check_out}
                                    </td>
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
                                                        onClick={() => {
                                                            // setMode("edit");
                                                            // setShow(true);
                                                            // GetMemberDetailsById(s.user_id);
                                                            GetStaffById(s.staff_id)
                                                        }}
                                                    >
                                                        Edit Staff
                                                    </button>
                                                </li>

                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>

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

                {/* Pagination */}
                <Pagination
                    page={page}
                    total={total}
                    onChange={handlePageChange}
                />

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