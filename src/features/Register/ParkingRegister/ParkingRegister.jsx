import { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
import "../../../styles/ParkingRegister.css"
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { GetSessionData } from "../../../utils/SessionManagement";
import { ListParkingSlotsApi } from '../../../services/ParkingApi';
import { BiExport } from 'react-icons/bi';
import { FiFilter, FiSearch } from 'react-icons/fi';


const ParkingRegister = ({ setActive }) => {

    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [societyId, setSocietyId] = useState("");
    const [slotsList, setSlotsList] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [search, setSearch] = useState("");
    const [block, setBlock] = useState("");
    const [floor, setFloor] = useState("");
    const [zone, setZone] = useState("");
    const [isEvReady, setIsEvReady] = useState(false);
    const [accessLevel, setAccessLevel] = useState("resident_only");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");

    const [slotNo, setSlotNo] = useState("");
    const [location, setLocation] = useState("");
    const [allLocation, setAllLocation] = useState("");
    const [parkingType, setParkingType] = useState("");
    const [vehicleSuitability, setVehicleSuitability] = useState("");
    const [allocationStatus, setAllocationStatus] = useState("");
    const [assignUnit, setAssignUnit] = useState("");
    const [stats, setStats] = useState({ total: 0, allocated: 0, available: 0, reserved: 0 });
    const parkingTypeList = [
        { id: "Resident", value: "resident" },
        { id: "Visitor", value: "visitor" },
        { id: "Handicap", value: "handicap" },
        { id: "Service", value: "service" },
    ];

    const vehicleType = [
        { id: "4 Wheeler", value: "4wheeler" },
        { id: "2 Wheeler", value: "2wheeler" },
    ];



    useEffect(() => { SessionData(); }, []);

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            const firstFlat = data.data.flats[0];
            setSocietyId(firstFlat.society_id);
            loadSlots(firstFlat.society_id);
        } catch (e) { console.log(e); }
    };

    const loadSlots = async (sId) => {
        try {
            setLoading(true);
            const data = await ListParkingSlotsApi(sId);
            const slots = data?.slots || [];
            setSlotsList(slots);
            setTotalCount(data?.total || 0);
            setTotalPages(data?.total_pages || 1);

            // count from slots data
            const allocated = slots.filter(s => s.slot_status === "allocated").length;
            const available = slots.filter(s => s.slot_status === "available").length;
            const reserved = slots.filter(s => s.slot_status === "reserved").length;

            setStats({
                total: data?.total || 0,
                allocated,
                available,
                reserved
            });
        } catch (e) {
            toast.error("Failed to load parking slots");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (value) => {
        setPage(value);

    };

    //function for validation
    const validateForm = () => {
        let errors = {};
        if (!slotNo) errors.slotNo = "required";
        if (!block) errors.block = "required";
        if (!floor) errors.floor = "required";
        if (!zone) errors.zone = "required";
        if (!parkingType) errors.parkingType = "required";
        if (!vehicleSuitability) errors.vehicleSuitability = "required";
        if (!allocationStatus) errors.allocationStatus = "required";
        return errors;
    };

    //submit function for add member
    const handleSubmit = async () => {
        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
            await CreateParkingSlotApi(
                societyId, slotNo, block, floor, zone,
                parkingType, vehicleSuitability,
                allocationStatus, length, width,
                isEvReady, accessLevel
            );
            toast.success("Parking slot added successfully");
            setShow(false);
            resetForm();
            loadSlots(societyId);
        } catch (error) {
            toast.error(error?.message || "Failed to add slot");
            setErrorText(error?.message || "Error occurred");
        }
    };

    const resetForm = () => {
        setSlotNo(""); setBlock(""); setFloor(""); setZone("");
        setParkingType(""); setVehicleSuitability("");
        setAllocationStatus(""); setLength(""); setWidth("");
        setIsEvReady(false); setAccessLevel("resident_only");
        setErrors({}); setErrorText("");
    };

    const total = totalPages;
    // const per = limit, total = Math.ceil(filteredData.length / per);
    // const rows = filteredData.slice((page - 1) * per, page * per);

    return (
        <>
            <div className="pg cp-wrap">

                {/* Header */}


                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [stats.total, "Total Slots", ""],
                        ["0", "Allocated Slots", ""],
                        ["0", "Available Slots", "tile-grn"],
                        ["0", "Reserved Slots", "tile-purple"]
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className=" text-start text-muted">{l}</div>
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
                                color: "#aaa"
                            }}
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by slot no, vehicle or owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className='d-flex'>
                        <button
                            className="btn-ol ms-2"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />

                            Filter
                        </button>
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}><BiExport /> Export</button>
                        <button className='btn btn-sm btn-ac ms-2 btn-primary' onClick={() => setShow(true)}>+ Add Slot</button>

                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["SLOT NO.", "LOCATION", "ALLOCATED TO", "VEHICLE DETAILS", "STATUS", "ACTIONS"]
                                        .map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            <div className="spinner-border spinner-border-sm me-2" role="status" />
                                            Loading...
                                        </td>
                                    </tr>
                                ) : slotsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No parking slots found
                                        </td>
                                    </tr>
                                ) : (
                                    slotsList.map((s, i) => (
                                        <tr className="text-start" key={i}>
                                            <td className="fw-semibold">{s.slot_number}</td>
                                            <td>
                                                <div>{s.zone}</div>
                                                <small className="text-muted">{s.block} — {s.floor}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-capitalize">{s.parking_type}</div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-capitalize">
                                                    {s.vehicle_type?.replace("_", " ")}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge
                                                    label={s.slot_status}
                                                    c={
                                                        s.slot_status === "allocated" ? "blue"
                                                            : s.slot_status === "available" ? "green"
                                                                : s.slot_status === "reserved" ? "purple"
                                                                    : "grey"
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <div className="member-action-dropdown dropdown">
                                                    <button className="member-action-btn" type="button" data-bs-toggle="dropdown">⋮</button>
                                                    <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                                                        <li>
                                                            <button className="dropdown-item member-action-item"
                                                                onClick={() => setActive("parkingDetails")}>
                                                                View Slot
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button className="dropdown-item member-action-item">Edit Slot</button>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li>
                                                            <button className="dropdown-item member-action-item member-action-delete">
                                                                Delete Slot
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
            </div>

            {show && (
                <>
                    {/* ✅ Backdrop (THIS IS IMPORTANT) */}
                    <div className="modal-backdrop fade show"></div>

                    {/* ✅ Modal */}
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h1 className="modal-title fs-5">Add Parking Slot</h1>

                                    {/* ❌ remove data-bs-dismiss */}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShow(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="pg d-flex justify-content-center am-wrap">
                                        <div className="text-start am-card">

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Slot Number <span className="text-danger">*</span></label>
                                                        {errors.slotNo && <span className='text-danger mx-2'>{errors.slotNo}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.slotNo ? "error-input" : ""}`}
                                                        placeholder="Eg. A-110" value={slotNo}
                                                        onChange={(e) => setSlotNo(e.target.value)} />
                                                </div>
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Block <span className="text-danger">*</span></label>
                                                        {errors.block && <span className='text-danger mx-2'>{errors.block}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.block ? "error-input" : ""}`}
                                                        placeholder="Eg. A" value={block}
                                                        onChange={(e) => setBlock(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Floor <span className="text-danger">*</span></label>
                                                        {errors.floor && <span className='text-danger mx-2'>{errors.floor}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.floor ? "error-input" : ""}`}
                                                        placeholder="Eg. Ground" value={floor}
                                                        onChange={(e) => setFloor(e.target.value)} />
                                                </div>
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Zone <span className="text-danger">*</span></label>
                                                        {errors.zone && <span className='text-danger mx-2'>{errors.zone}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.zone ? "error-input" : ""}`}
                                                        placeholder="Eg. Basement 1" value={zone}
                                                        onChange={(e) => setZone(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <label className="sv-lb">Parking Type <span className="text-danger">*</span></label>
                                                {errors.parkingType && <span className='text-danger mx-2'>{errors.parkingType}</span>}
                                            </div>
                                            <div className="ps-type-wrap mb-3">
                                                {parkingTypeList.map((t) => (
                                                    <button type="button" key={t.value}
                                                        onClick={() => setParkingType(t.value)}
                                                        className={`ps-type-btn ${parkingType === t.value ? "active" : ""} ${errors.parkingType ? "error-btn" : ""}`}>
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <label className="sv-lb">Vehicle Suitability <span className="text-danger">*</span></label>
                                            <div className="ps-type-wrap mb-3">
                                                {[{ id: "4 Wheeler", value: "4_wheeler" }, { id: "2 Wheeler", value: "2_wheeler" }].map((t) => (
                                                    <button type="button" key={t.value}
                                                        onClick={() => setVehicleSuitability(t.value)}
                                                        className={`ps-type-btn ${vehicleSuitability === t.value ? "active" : ""} ${errors.vehicleSuitability ? "error-btn" : ""}`}>
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Slot Status <span className="text-danger">*</span></label>
                                                    <select className={`form-select ${errors.allocationStatus ? "error-input" : ""}`}
                                                        value={allocationStatus} onChange={(e) => setAllocationStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value="available">Available</option>
                                                        <option value="allocated">Allocated</option>
                                                        <option value="reserved">Reserved</option>
                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <label className="sv-lb">Access Level</label>
                                                    <select className="form-select" value={accessLevel}
                                                        onChange={(e) => setAccessLevel(e.target.value)}>
                                                        <option value="resident_only">Resident Only</option>
                                                        <option value="public">Public</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Length (m)</label>
                                                    <input className="sv-in" placeholder="Eg. 5.5" value={length}
                                                        onChange={(e) => setLength(e.target.value)} />
                                                </div>
                                                <div className="col-6">
                                                    <label className="sv-lb">Width (m)</label>
                                                    <input className="sv-in" placeholder="Eg. 2.5" value={width}
                                                        onChange={(e) => setWidth(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <input type="checkbox" className="form-check-input" id="evReady"
                                                    checked={isEvReady} onChange={(e) => setIsEvReady(e.target.checked)} />
                                                <label className="sv-lb mb-0" htmlFor="evReady">EV Ready</label>
                                            </div>

                                            {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Slot</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {exportModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Export Data</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setExportModal(false)}
                                    ></button>
                                </div>


                                <div className="modal-body">
                                    <h6 className=" text-start" style={{ fontWeight: "bold" }}>Select Format</h6>
                                    <div className="row mb-4">

                                        {/* Excel */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "excel" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("excel") }}
                                            >
                                                <BsFiletypeXls
                                                    className={
                                                        activeTab === "excel"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "excel"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    Excel
                                                </p>
                                            </div>
                                        </div>

                                        {/* CSV */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "csv" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("csv") }}
                                            >
                                                <BsFiletypeCsv
                                                    className={
                                                        activeTab === "csv"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "csv"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    CSV
                                                </p>
                                            </div>
                                        </div>

                                        {/* PDF */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "pdf" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("pdf") }}
                                            >
                                                <BsFiletypePdf
                                                    className={
                                                        activeTab === "pdf"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "pdf"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    PDF
                                                </p>
                                            </div>
                                        </div>

                                    </div>


                                    <h6 className=" text-start fw-bold">Data Range</h6>


                                    <div className="range-card active-range d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" checked />
                                            <h6 className='fw-bold mt-1'>All Data</h6>
                                        </div>

                                        <span className="text-muted mt-1"><h6> records</h6></span>
                                    </div>


                                    <div className="range-card d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" />
                                            <h6 className="fw-bold mt-1">Current Search results</h6>
                                        </div>

                                        <h6 className="text-muted mt-1">40 records</h6>
                                    </div>


                                    <div className="range-card d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" />
                                            <h6 className="fw-bold mt-1">Custom date range</h6>
                                        </div>

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button className="btn-sm btn btn-outline-secondary" onClick={() => setExportModal(false)}>
                                        Cancel
                                    </button>

                                    <button className="btn btn-sm btn-primary" /* onClick={handleExport} */>
                                        <i className="bi bi-download me-2"></i>
                                        Export Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </>
            )}


        </>
    );
}

export default ParkingRegister