import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import ViolationAlertModal from "./ViolationAlertModal";
import ViewParkingDetails from "./ViewParkingDetails";
import {
    AddMemberApi,
    getMembersApi,
    getAllMembersWithoutPaginationApi,
    getMembersByIdApi,
    UpdateMemberApi,
    deleteMembersApi,
} from "../../services/AddMemberApi";
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
    FaUserCircle,
    FaFileUpload,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
} from "react-icons/fa";
import { getAllBlocksApi, getAllFlatsApi } from "../../services/UnitRegisterApi";
import { CgExport, CgImport } from "react-icons/cg";
import { parkingDashboardApi, ListParkingSlotsApi } from "../../services/ParkingApi";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import {
    violationAlertsApi,
    deleteViolationAlertsApi,
    createViolationAlertApi,
    getViolationAlertByIdApi,
    updateViolationAlertApi,
} from "../../services/ViolationAlertsApi";
import ExportModal from "../../components/Common/ExportModal";

const ViolationAlertsList = ({ setActive, setMemberId, setFlatId, setViolationId }) => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [mode, setMode] = useState("add");
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");
    const [allViolationAlerts, setAllViolationAlerts] = useState([]);
    const [allExportViolationAlerts, setAllExportViolationAlerts] = useState([]);

    // ── Single source of truth for status filter ──────────────────────────────
    // Used by both the tabs AND the dropdown — both set this same state
    const [filterStatus, setFilterStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // ── Parking slots ──────────────────────────────────────────────────────────
    const [allSlots, setAllSlots] = useState([]);

    // ── ViolationAlertModal form state ────────────────────────────────────────
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [slot, setSlot] = useState(null);
    const [vehicleNo, setVehicleNo] = useState("");
    const [violationType, setViolationType] = useState(null);
    const [vehicleType, setVehicleType] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [status, setStatus] = useState(null);

    // ── Currently editing violation id ────────────────────────────────────────
    const [editingViolationId, setEditingViolationId] = useState(null);

    const violationStatusTabs = [
        { id: "All",       value: "" },
        { id: "Open",      value: "open" },
        { id: "Resolved",  value: "resolved" },
        { id: "Dismissed", value: "dismissed" },
    ];

    const violationTypeOptions = [
        { value: "unauthorized_parking", label: "Unauthorized Parking" },
        { value: "visitor_overstay",     label: "Visitor Overstay" },
        { value: "wrong_slot",           label: "Wrong Slot" },
        { value: "double_parking",       label: "Double Parking" },
        { value: "no_sticker",           label: "No Sticker" },
        { value: "other",                label: "Other" },
    ];

    const vehicleTypeOptions = [
        { value: "2_wheeler", label: "2 Wheeler" },
        { value: "4_wheeler", label: "4 Wheeler" },
    ];

    const statusOptions = [
        { value: "open",      label: "Open" },
        { value: "resolved",  label: "Resolved" },
        { value: "dismissed", label: "Dismissed" },
    ];

    useEffect(() => {
        SessionData();
    }, []);

    // Re-fetch whenever filters change — but only after societyId is ready
    useEffect(() => {
        if (!societyId) return;
        getAllVisitorAlerts(societyId, 1, search, filterStatus, dateFrom, dateTo);
    }, [filterStatus, dateFrom, dateTo, societyId]);

    const SessionData = async () => {
        const data = await GetSessionData();
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        getAllVisitorAlerts(flats.society_id, 1, "", "", "", "");
        getParkingSlots(flats.society_id);
    };

    const getAllVisitorAlerts = async (sid, pg, searchText, statusFilter, fromDate, toDate) => {
        try {
            const data = await violationAlertsApi(
                sid,
                pg || 1,
                limit,
                searchText,
                statusFilter,
                fromDate,
                toDate
            );
            console.log("API response:", data); // ← add this
            setAllViolationAlerts(data.violations || []);
            setPage(data.page);
            setLimit(data.limit);
            setTotalCount(data.total);
        } catch (error) {
            console.error("Error fetching violation alerts:", error);
        }
    };

    const getAllExportViolationAlerts = async (sid) => {
        try {
            const data = await violationAlertsApi(sid);
            setAllExportViolationAlerts(data.violations || []);
        } catch (error) {
            console.error("Error fetching export violation alerts:", error);
        }
    };

    const getParkingSlots = async (sid) => {
        try {
            const data = await ListParkingSlotsApi(sid);
            const slotOptions = (data?.slots || []).map((item) => ({
                value: item.id,
                label: item.slot_number,
            }));
            setAllSlots(slotOptions);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    const handlePageChange = (value) => {
        setPage(value);
        getAllVisitorAlerts(societyId, value, search, filterStatus, dateFrom, dateTo);
    };

    const handleSearchClick = () => {
        setPage(1);
        getAllVisitorAlerts(societyId, 1, search, filterStatus, dateFrom, dateTo);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value.trim()) {
            setPage(1);
            getAllVisitorAlerts(societyId, 1, "", filterStatus, dateFrom, dateTo);
        }
    };

    // Single handler for both tabs and dropdown — sets filterStatus and triggers useEffect
    const handleStatusChange = (value) => {
        setFilterStatus(value);
        setPage(1);
    };

    const resetForm = () => {
        setSlot(null);
        setVehicleNo("");
        setViolationType(null);
        setVehicleType(null);
        setFirstName("");
        setLastName("");
        setStatus(null);
        setEditingViolationId(null);
        setErrors({});
        setErrorText("");
    };

    const handleCreateSubmit = async () => {
        const newErrors = {};
        if (!slot)              newErrors.slot          = "Required";
        if (!vehicleNo.trim())  newErrors.vehicleNo     = "Required";
        if (!violationType)     newErrors.violationType = "Required";
        if (!vehicleType)       newErrors.vehicleType   = "Required";
        if (!firstName.trim())  newErrors.firstName     = "Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createViolationAlertApi(
                societyId,
                userId,
                slot?.value,
                vehicleNo,
                violationType?.value,
                lastName,
                null,
                firstName
            );

            toast.success("Violation Alert Added Successfully");
            setShowViolationAlert(false);
            resetForm();
            getAllVisitorAlerts(societyId, page, search, filterStatus, dateFrom, dateTo);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to add violation");
        }
    };

    const handleEditSubmit = async () => {
        const newErrors = {};
        if (!slot)              newErrors.slot          = "Required";
        if (!vehicleNo.trim())  newErrors.vehicleNo     = "Required";
        if (!violationType)     newErrors.violationType = "Required";
        if (!vehicleType)       newErrors.vehicleType   = "Required";
        if (!firstName.trim())  newErrors.firstName     = "Required";
        if (!status)            newErrors.status        = "Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await updateViolationAlertApi(
                societyId,
                editingViolationId,
                slot?.value,
                vehicleNo,
                violationType?.value,
                lastName,
                null,
                firstName,
                vehicleType?.value,
                status?.value
            );

            toast.success("Violation Alert Updated Successfully");
            setShowViolationAlert(false);
            resetForm();
            getAllVisitorAlerts(societyId, page, search, filterStatus, dateFrom, dateTo);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to update violation");
        }
    };

    const handleViolationSubmit = async () => {
        if (mode === "edit") {
            await handleEditSubmit();
        } else {
            await handleCreateSubmit();
        }
    };

    const handleEditClick = async (item) => {
        try {
            resetForm();
            setMode("edit");
            setEditingViolationId(item.id);

            let data = item;
            try {
                const response = await getViolationAlertByIdApi(societyId, item.id);
                data = response?.violation || response || item;
            } catch (err) {
                console.warn("Could not fetch latest violation details, using row data:", err);
            }

            const matchedSlot = allSlots.find(
                (s) => s.value === data.slot_id || s.label === data.slot_number
            );
            setSlot(matchedSlot || (data.slot_number ? { value: data.slot_id, label: data.slot_number } : null));

            setVehicleNo(data.vehicle_number || "");

            const matchedViolationType = violationTypeOptions.find(
                (v) => v.value === data.violation_type
            );
            setViolationType(matchedViolationType || null);

            const matchedVehicleType = vehicleTypeOptions.find(
                (v) => v.value === data.vehicle_type
            );
            setVehicleType(matchedVehicleType || null);

            setFirstName(
                data.penalty_amount !== undefined && data.penalty_amount !== null
                    ? String(data.penalty_amount)
                    : ""
            );
            setLastName(data.description || "");

            const matchedStatus = statusOptions.find((s) => s.value === data.status);
            setStatus(matchedStatus || null);

            setShowViolationAlert(true);
        } catch (error) {
            console.error("Error preparing edit form:", error);
            toast.error("Failed to load violation for editing");
        }
    };

    const handleDelete = async (violationId) => {
        const confirmed = window.confirm("Are you sure you want to delete this violation alert?");
        if (!confirmed) return;
        try {
            await deleteViolationAlertsApi(societyId, violationId);
            toast.success("Violation alert deleted successfully");
            getAllVisitorAlerts(societyId, page, search, filterStatus, dateFrom, dateTo);
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error);
        }
    };

    const exportData =
        selectedRange === "all"
            ? allExportViolationAlerts
            : selectedRange === "search"
                ? allViolationAlerts
                : "";

    const downloadExcel = () => {
        exportFile({ data: exportData, fileName: "ViolationAlerts", sheetName: "ViolationAlerts", type: "xlsx" });
    };

    const downloadCSV = () => {
        exportFile({ data: exportData, fileName: "ViolationAlerts", sheetName: "ViolationAlerts", type: "csv" });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Violation Alerts Report",
            fileName: "ViolationAlerts",
            columns: ["Violation Type", "Slot No.", "Vehicle No.", "Penalty Amount"],
            data: exportData.map((item) => [
                item.violation_type,
                item.slot_number,
                item.vehicle_number,
                item.penalty_amount,
            ]),
        });
    };

    const handleExport = () => {
        if (activeTab === "excel")     { downloadExcel(); setExportModal(false); }
        else if (activeTab === "csv")  { downloadCSV();   setExportModal(false); }
        else if (activeTab === "pdf")  { downloadPDF();   setExportModal(false); }
    };

    // Derived counts from current page data
    const totalAlerts    = totalCount;
    const totalOpen      = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "open").length;
    const totalResolved  = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "resolved").length;
    const totalDismissed = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "dismissed").length;

    const totalPages = Math.ceil(totalCount / limit);

    const handleViewDetails = (item) => {
        setViolationId(item.id);
        setActive("viewParkingDetails");
    };

    return (
        <>
            <div className="pg cp-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Violation Alerts</h4>
                        <p className="cp-sub">Monitor occupancy, manage visitor alerts, and handle violations.</p>
                    </div>
                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-ac ms-2 btn-primary"
                            onClick={() => {
                                resetForm();
                                setSelectedViolation(null);
                                setMode("add");
                                setShowViolationAlert(true);
                            }}
                        >
                            + Create Violation Alert
                        </button>
                        <button
                            className="btn btn-sm btn-ac ms-2 btn-primary"
                            onClick={() => setActive("parkingDashboard")}
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [totalAlerts,    "All Violations Alerts",       "tile-blu"],
                        [totalOpen,      "Open Violations Alerts",      "tile-grn"],
                        [totalResolved,  "Resolved Violations Alerts",  "tile-yel"],
                        [totalDismissed, "Dismissed Violations Alerts", "tile-red"],
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className="text-start text-muted">{l}</div>
                                <div className="tile-val text-start mt-1">{v}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Tabs — now use handleStatusChange (server-side) */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="NoticeBoardTabs mt-3 bg-white">
                            {violationStatusTabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleStatusChange(t.value)}
                                    className={`NoticeBoardTabs-btn ${filterStatus === t.value ? "active" : ""}`}
                                >
                                    {t.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="visitor-toolbar mb-4 mt-3">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control visitor-search"
                                placeholder="Search by vehicle no..."
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <button className="btn btn-primary" onClick={handleSearchClick}>
                                <FiSearch />
                            </button>
                        </div>
                        <button
                            className="btn-ol ms-2"
                            onClick={() => { getAllExportViolationAlerts(societyId); setExportModal(true); }}
                        >
                            <CgImport /> Export
                        </button>
                    </div>

                    {/* Filter row: Status dropdown + Date From + Date To */}
                    <div className="row g-2">

                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="open">Open</option>
                                <option value="resolved">Resolved</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
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
                                    <th>VIOLATION TYPE</th>
                                    <th>SLOT NO</th>
                                    <th>VEHICLE NO</th>
                                    <th>PENALTY AMOUNT</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allViolationAlerts.map((item, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleViewDetails(item)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td className="text-start">
                                            <div className="fw-bold">{item.violation_type}</div>
                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.slot_number}</div>
                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.vehicle_number}</div>
                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.penalty_amount}</div>
                                        </td>
                                        <td className="text-start">
                                            <Badge
                                                label={item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : ""}
                                                c={
                                                    item.status === "open"      ? "green"
                                                    : item.status === "resolved"  ? "yellow"
                                                    : item.status === "dismissed" ? "red"
                                                    : "gray"
                                                }
                                            />
                                        </td>
                                        <td className="text-start" onClick={(e) => e.stopPropagation()}>
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
                                                            onClick={() => handleViewDetails(item)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            Edit Violation Alert
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            Delete Violation Alert
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
                    <Pagination page={page} total={totalPages} onChange={handlePageChange} />
                </div>
            </div>

            {/* Modal */}
            <ViolationAlertModal
                showViolationAlert={showViolationAlert}
                setShowViolationAlert={setShowViolationAlert}
                allSlots={allSlots}
                slot={slot}
                setSlot={setSlot}
                vehicleNo={vehicleNo}
                setVehicleNo={setVehicleNo}
                violationType={violationType}
                setViolationType={setViolationType}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                status={status}
                setStatus={setStatus}
                errors={errors}
                handleSubmit={handleViolationSubmit}
                resetForm={resetForm}
                mode={mode}
            />

            <ExportModal
                show={exportModal}
                onClose={() => setExportModal(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportViolationAlerts.length}
                currentRecords={allViolationAlerts.length}
            />
        </>
    );
};

export default ViolationAlertsList;
