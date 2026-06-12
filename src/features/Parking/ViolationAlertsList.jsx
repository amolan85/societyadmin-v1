import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import ViolationAlertModal from "./ViolationAlertModal";
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
import { violationAlertsApi, deleteViolationAlertsApi, createViolationAlertApi,getViolationAlertByIdApi } from "../../services/ViolationAlertsApi";
import ExportModal from "../../components/Common/ExportModal";

const ViolationAlertsList = ({ setActive, setMemberId, setFlatId }) => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [mode, setMode] = useState("add");
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");
    const [violationStatusTab, setViolationStatusTab] = useState("");
    const [allViolationAlerts, setAllViolationAlerts] = useState([]);
    const [allExportViolationAlerts, setAllExportViolationAlerts] = useState([]);

    // ── Parking slots ──────────────────────────────────────────────────────────
    const [allSlots, setAllSlots] = useState([]);

    // ── ViolationAlertModal form state (mirrors ParkingDashboard) ─────────────
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [slot, setSlot] = useState(null);
    const [vehicleNo, setVehicleNo] = useState("");
    const [violationType, setViolationType] = useState(null);   // violation_type sent to API
    const [vehicleType, setVehicleType] = useState(null);       // vehicle_type (2_wheeler / 4_wheeler)
    const [firstName, setFirstName] = useState("");             // penalty_amount
    const [lastName, setLastName] = useState("");  
    const [violationId, setViolationId] = useState(null);             // description

    const violationStatus = [
        { id: "All",       value: "" },
        { id: "Open",      value: "open" },
        { id: "Resolved",  value: "resolved" },
        { id: "Dismissed", value: "dismissed" },
    ];

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        getAllVisitorAlerts(flats.society_id);
        getParkingSlots(flats.society_id);
    };

    const getAllVisitorAlerts = async (sid, pg) => {
        try {
            const data = await violationAlertsApi(sid, pg, limit);
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
        getAllVisitorAlerts(societyId, value);
    };

    // ✅ Matches ParkingDashboard: positional args + correct field mapping
    const handleViolationSubmit = async () => {
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
                societyId,              // society_id
                userId,                 // reported_by
                slot?.value,            // slot_id
                vehicleNo,              // vehicle_number
                violationType?.value,   // violation_type
                lastName,               // description
                null,                   // photo_url
                firstName               // penalty_amount
            );

            toast.success("Violation Alert Added Successfully");
            setShowViolationAlert(false);
            resetForm();
            getAllVisitorAlerts(societyId, page);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to add violation");
        }
    };

    // ✅ Resets only violation form fields — does not touch unrelated member state
    const resetForm = () => {
        setSlot(null);
        setVehicleNo("");
        setViolationType(null);
        setVehicleType(null);
        setFirstName("");
        setLastName("");
        setErrors({});
        setErrorText("");
    };

    const handleDelete = async (violationId) => {
        const confirmed = window.confirm("Are you sure you want to delete this violation alert?");
        if (!confirmed) return;
        try {
            await deleteViolationAlertsApi(societyId, violationId);
            toast.success("Violation alert deleted successfully");
            getAllVisitorAlerts(societyId, page);
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

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        try {
            if (!value.trim()) {
                setPage(1);
                const data = await violationAlertsApi(societyId, page, limit);
                setAllViolationAlerts(data.violations || []);
                return;
            }
            if (value.length < 3) return;
            const data = await violationAlertsApi(societyId, page, limit, value);
            setAllViolationAlerts(data.violations || []);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const filteredData =
        violationStatusTab === ""
            ? allViolationAlerts
            : allViolationAlerts.filter((item) => item.status === violationStatusTab);

    const totalAlerts    = allViolationAlerts.length;
    const totalOpen      = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "open").length;
    const totalResolved  = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "resolved").length;
    const totalDismissed = allViolationAlerts.filter((i) => i.status?.toLowerCase() === "dismissed").length;

    const total = Math.ceil(totalCount / limit);

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
                            onClick={() => { resetForm(); setMode("add"); setShowViolationAlert(true); }}
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

                {/* Status Tabs */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="NoticeBoardTabs mt-3 bg-white">
                            {violationStatus.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { setViolationStatusTab(t.value); setPage(1); }}
                                    className={`NoticeBoardTabs-btn ${violationStatusTab === t.value ? "active" : ""}`}
                                >
                                    {t.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search & Filter bar */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start mt-3">
                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}>
                            <FiSearch size={16} />
                        </span>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by vehicle no..."
                            value={search}
                            onChange={handleSearch}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className="d-flex">
                        <button className="btn-ol ms-2" data-bs-toggle="dropdown">
                            <FiFilter size={14} /> Filter
                        </button>
                        <button
                            className="btn-ol ms-2"
                            onClick={() => { getAllExportViolationAlerts(societyId); setExportModal(true); }}
                        >
                            <CgImport /> Export
                        </button>
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
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
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
                                        <td className="text-start">
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
                                                            setViolationId(item.id);
                                                            setActive("violationDetails");
                                                        }}
                                                    >
                                                        View Details
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item member-action-item">
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
                    <Pagination page={page} total={total} onChange={handlePageChange} />
                </div>
            </div>

            {/* ✅ All modal props mirror ParkingDashboard exactly */}
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
                setActive={setActive}
                setViolationId={setViolationId}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
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
