import { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import { toast } from 'react-toastify';
import { deleteStaffApi, getStaffAttendanceApi } from '../../services/StaffAttendanceApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ManualEntryModal from './ManualEntryModal';

const StaffAttendance = ({ setActive, setStaffId }) => {
    const [page, setPage] = useState(1);
    const [societyId, setSocietyId] = useState("")
    const [allStaff, setAllStaff] = useState([])
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [totalStaff, setTotalStaff] = useState("")
    const [present, setPresent] = useState("")
    const [absent, setAbsent] = useState("")
    const [late, setLate] = useState("")
    const [show, setShow] = useState(false)
    const [recordTypeTab, setRecordTypeTab] = useState("")

    const recordType = [
        { id: "Check In", value: "checkIn" },
        { id: "Check Out", value: "checkOut" },

    ];

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
        const data = await getStaffAttendanceApi(societyId, date)
        console.log(data)
        setAllStaff(data.list)
        setTotalStaff(data.count)
        setPresent(data.summary.present)
        setAbsent(data.summary.absent)
    }

    const GetStaffById = async (staffId) => {
        setActive("createStaff")
        setStaffId(staffId)
    }

    const deleteStaff = async (staffId) => {
        try {
            const data = await deleteStaffApi(staffId)
            console.log(data)
            toast.success("Poll deleted successfully!")
            getStaff(societyId)
        } catch (error) {
            console.log(error)
        }
    }

    const per = 5, total = Math.ceil(allStaff.length / per);
    const rows = allStaff.slice((page - 1) * per, page * per);

    const dateHandleChange = async (e) => {
        setDate(e.target.value)
        const data = await getStaffAttendanceApi(societyId, e.target.value)
        console.log(data)
    }

    //   const exportData =
    //     selectedRange === "all"
    //       ? allUnitsWithoutPagination
    //       : selectedRange === "search"
    //         ? allUnits
    //         : "customData";

    //   const downloadExcel = async () => {
    //     exportFile({
    //       data: exportData,
    //       fileName: "Units",
    //       sheetName: "Units",
    //       type: "xlsx",
    //     });
    //   };

    //   const downloadCSV = async () => {
    //     exportFile({
    //       data: exportData,
    //       fileName: "Units",
    //       sheetName: "Units",
    //       type: "csv",
    //     });
    //   };

    //   const downloadPDF = () => {
    //     exportToPDF({
    //       title: "Units Report",
    //       fileName: "Units",
    //       columns: [
    //         "Unit No.",
    //         "Type & Area",
    //         "Block/Floor",
    //         "Owner",
    //         "Tenant"
    //       ],
    //       data: exportData.map((item) => [
    //         item.flat_number,
    //         `${item.unit_type || ""} (${item.area_sqft || ""} sq.ft)`,
    //         `${item.block || "-"} / ${item.floor || "-"} Flr`,
    //         item.members?.find((m) => m.occupancy_type === "owner")
    //           ? `${item.members.find((m) => m.occupancy_type === "owner")?.first_name || ""} ${item.members.find((m) => m.occupancy_type === "owner")?.last_name || ""}`
    //           : "-",
    //         item.members?.find((m) => m.occupancy_type === "tenant")
    //           ? `${item.members.find((m) => m.occupancy_type === "tenant")?.first_name || ""} ${item.members.find((m) => m.occupancy_type === "tenant")?.last_name || ""}`
    //           : "-",
    //       ]),
    //     });
    //   };

    //   const handleExport = () => {
    //     if (activeTab === "excel") {
    //       downloadExcel();
    //       setExportModal(false);
    //     } else if (activeTab === "csv") {
    //       downloadCSV();
    //       setExportModal(false);
    //     } else if (activeTab === "pdf") {
    //       downloadPDF();
    //       setExportModal(false);
    //     }
    //   };


    return (

        <div className="pg sa-wrap">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="sa-title">Staff Attendance & Tracking</h4>

                <div className="d-flex gap-2">
                    <button className="btn  btn-primary" onClick={() => setActive("createStaff")}>Create</button>
                    <input
                        type="date"
                        className="sv-in sa-date"
                        value={date}
                        onChange={dateHandleChange}
                    />
                    <button className="btn-ol">⬇ Export</button>
                    <button className="btn  btn-primary" onClick={() => setShow(true)}>Manual Entry</button>
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
                            {rows.map((s, i) => (
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
                    onChange={setPage}
                />

            </div>

            <ManualEntryModal
                show={show}
                setShow={setShow}

                recordType={recordType}
                recordTypeTab={recordTypeTab}
                setRecordTypeTab={setRecordTypeTab}
            />
        </div>
    );
}

export default StaffAttendance