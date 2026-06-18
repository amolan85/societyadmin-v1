import { useState, useEffect } from 'react'
import { FaCar } from 'react-icons/fa';
import { FiAlertTriangle, FiDownload, FiEdit, FiExternalLink, FiPrinter, FiSlash } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../../styles/ParkingRegister.css";
import { GetParkingSlotApi, DeallocateParkingSlotApi, UpdateParkingSlotApi, AllocateParkingSlotApi } from '../../../services/ParkingApi';
import { getAllBlocksApi, getAllFlatsApi } from '../../../services/UnitRegisterApi';
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import ParkingSlotModal from './ParkingSlotModal';
import { GetSessionData } from "../../../utils/SessionManagement";

const ParkingDetails = ({ setActive, slotId, societyId }) => {

    const { setLoading } = useLoader();
    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);
    const [slotData, setSlotData] = useState(null);
    const [editShow, setEditShow] = useState(false);
    const [editFloor, setEditFloor] = useState("");
    const [editZone, setEditZone] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editEvReady, setEditEvReady] = useState(false);
    const [sessionUserId, setSessionUserId] = useState(null);
    //const [loading, setLoading] = useState(true);
    const [profileUrl, setProfileUrl] = useState("")
    const [deallocationReason, setDeallocationReason] = useState("");
    const [showDeallocate, setShowDeallocate] = useState(false);
    const [allocateShow, setAllocateShow] = useState(false);
    const [allocateFlatId, setAllocateFlatId] = useState("");
    const [allocateUserId, setAllocateUserId] = useState("");
    const [allocateRemarks, setAllocateRemarks] = useState("");
    const slotStatus = slotData?.slot_status?.toLowerCase();
    const [allBlocks, setAllBlocks] = useState([]);
    const [allFlats, setAllFlats] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState("");
    const [selectedFlat, setSelectedFlat] = useState("");
    //const [societyId, setSocietyId] = useState(null);
    useEffect(() => {
        if (slotId && societyId) {
            loadSlotDetails();
        }
    }, [slotId, societyId]);

    const SessionData = async () => {
        const data = await GetSessionData();
        setSessionUserId(data?.data?.user_id);

        const blockRes = await getAllBlocksApi(data?.data?.society_id);
        console.log("Blocks response:", blockRes);
        setAllBlocks(blockRes?.blocks || []);
    };
    const loadBlocks = async () => {
        const data = await GetSessionData();
        setSessionUserId(data?.data?.user_id);

        const blockRes = await getAllBlocksApi(data?.data?.society_id);
        setAllBlocks(blockRes?.blocks || []);
    };
    const handleBlockChange = async (e) => {
        const block = e.target.value;
        setSelectedBlock(block);
        setSelectedFlat("");
        setAllFlats([]);

        if (block) {
            const res = await getAllFlatsApi(slotData?.society_id, block);
            setAllFlats(res?.flats || []);
        }
    };
    // const filteredFlats = allFlats.filter(
    //     x => x.block === selectedBlock
    // );

    const loadSlotDetails = async () => {
        try {
            setLoading(true);
            const res = await GetParkingSlotApi(slotId, societyId);
            setSlotData(res?.data || null);
        } catch (e) {
            console.error("Failed to load slot details", e);
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val) => val ? val.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "-";

    const fmtDate = (val) => {
        if (!val) return "-";
        const d = new Date(val);
        return isNaN(d) ? val : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };
    const handleAllocate = async () => {

        const selectedFlatData = allFlats.find(x => x.flat_id == selectedFlat);
        if (!selectedFlatData) {
            toast.error("Please select a flat");
            return;
        }

        try {
            await AllocateParkingSlotApi(
                slotData?.society_id,
                slotId,
                selectedFlatData.flat_id,
                sessionUserId,   // hidden user id
                sessionUserId,
                allocateRemarks
            );

            toast.success("Parking slot allocated successfully");

            setAllocateShow(false);
            setSelectedBlock("");
            setSelectedFlat("");
            setAllocateRemarks("");

            await loadSlotDetails();

        } catch (error) {
            toast.error(error?.message || "Failed to allocate parking slot");
        }
    };
    const handleDeallocate = async () => {
        try {
            await DeallocateParkingSlotApi(allocation.id);
            toast.success("Parking slot deallocated successfully");
            setDeallocateShow(false);        // ✅ was: setShowDeallocateModal(false)
            setDeallocationReason("");
            await loadSlotDetails();
        } catch (error) {
            toast.error(error?.message || "Failed to deallocate parking slot");
        }
    };
    const handleEdit = async () => {
        try {
            await UpdateParkingSlotApi(slotId, editZone, editFloor, editEvReady, editStatus, "");
            toast.success("Slot updated successfully");
            setEditShow(false);
            await loadSlotDetails();
        } catch (error) {
            toast.error(error?.message || "Failed to update slot");
        }
    };
    const allocation = slotData?.allocation;

    const statusColor = (s) => {
        if (s === "allocated") return "bg-primary-subtle text-primary";
        if (s === "reserved") return "bg-warning-subtle text-warning";
        if (s === "available") return "bg-success-subtle text-success";
        return "bg-secondary-subtle text-secondary";
    };


    return (
        <>
            <div className="container-fluid min-vh-100">

                {/* ── Header Card ── */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex align-items-center gap-3">
                            <div className="car-icon-box">
                                <FaCar size={70} className="text-primary" />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Slot {slotData?.slot_number || "-"}</h5>
                                    <span className={`badge ${statusColor(slotData?.slot_status)}`}>
                                        {fmt(slotData?.slot_status)}
                                    </span>
                                </div>
                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        <BiLocationPlus className="me-1" />
                                        {slotData?.zone || "-"} &nbsp; {fmt(slotData?.parking_type)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm btn-ad grey-btn" onClick={() => setActive("parkingHistory")}>
                                <BiHistory className="me-1" size={16} />History
                            </button>
                            <button className="btn btn-sm btn-ad grey-btn" onClick={() => {
                                setEditFloor(slotData?.floor || "");
                                setEditZone(slotData?.zone || "");
                                setEditStatus(slotData?.slot_status || "");
                                setEditEvReady(slotData?.is_ev_ready || false);
                                setEditShow(true);
                            }}>
                                <FiEdit className="me-1" size={16} />Edit Details
                            </button>
                            {/* <button className="btn btn-sm deallocate-btn" onClick={() => setDeallocateShow(true)}>
                                <FiSlash className="me-1" /><strong>Deallocate</strong>
                            </button> */}
                            {["allocated", "reserved"].includes(slotStatus) ? (
                                <button
                                    className="btn btn-sm deallocate-btn"
                                    onClick={() => setDeallocateShow(true)}
                                >
                                    <FiSlash className="me-1" />
                                    <strong>Deallocate</strong>
                                </button>
                            ) : (
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={async () => {
                                        await loadBlocks();
                                        setAllocateShow(true);
                                    }}
                                >
                                    <i className="bi bi-check-circle me-1"></i>
                                    <strong>Allocate</strong>
                                </button>
                            )}
                            <button className="btn btn-sm btn-ac btn-primary" onClick={() => setActive("parkingRegister")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    {/* ── Left Column ── */}
                    <div className="col-lg-8">

                        {/* Slot Information */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">Slot Information</div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">SLOT ID</small>
                                        <div className="fw-semibold">{slotData?.id || "-"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">LOCATION</small>
                                        <div className="fw-semibold">{slotData?.zone || "-"}</div>
                                        <small className="text-muted">
                                            {slotData?.block ? `Block ${slotData.block}` : ""}
                                            {slotData?.floor ? ` — ${slotData.floor}` : ""}
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">DIMENSIONS</small>
                                        <div className="fw-semibold">
                                            {slotData?.length && slotData?.width
                                                ? `${slotData.length}m × ${slotData.width}m`
                                                : "-"}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">TYPE</small>
                                        <div className="fw-semibold">
                                            {fmt(slotData?.parking_type)}
                                            {slotData?.vehicle_type ? ` • ${fmt(slotData.vehicle_type)}` : ""}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">EV READY</small>
                                        <div className="fw-semibold">{slotData?.is_ev_ready ? "Yes" : "No"}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">ACCESS LEVEL</small>
                                        <div className="fw-semibold">{fmt(slotData?.access_level)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Vehicle Details</span>
                            </div>
                            <div className="card-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">VEHICLE MODEL</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">PLATE NUMBER</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">COLOR</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">VEHICLE TYPE</small>
                                        <div className="fw-semibold">{fmt(slotData?.vehicle_type)}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">STICKER ID</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">REGISTRATION COPY</small>
                                        <div className="fw-semibold text-primary" onClick={() => setShowDocument(true)} style={{ cursor: "pointer" }}>
                                            View Document
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ── */}
                    <div className="col-lg-4">

                        {/* Current Allocation */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-semibold">
                                Current Allocation
                            </div>

                            <div className="card-body">
                                {allocation ? (
                                    <>
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: "50%",
                                                    background: "#e0e7ff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: 700,
                                                    color: "#4f46e5"
                                                }}
                                            >
                                                {allocation?.resident_name
                                                    ?.split(" ")
                                                    .map(x => x[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <div className="fw-bold">
                                                    {allocation.resident_name}
                                                </div>
                                                <small className="text-muted">
                                                    Unit {allocation.flat_block}-{allocation.flat_number}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-12">
                                                <small className="text-muted d-block">
                                                    CONTACT
                                                </small>
                                                <div className="fw-semibold">
                                                    {allocation.resident_mobile || "-"}
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <small className="text-muted d-block">
                                                    ALLOCATED SINCE
                                                </small>
                                                <div className="fw-semibold">
                                                    {fmtDate(allocation.allocated_at)}
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <small className="text-muted d-block">
                                                    STATUS
                                                </small>
                                                <span className="badge bg-primary-subtle text-primary">
                                                    Allocated
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        No active allocation
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="card border-0 shadow-sm mt-3">
                            <div className="card-header bg-white fw-semibold">Recent History</div>
                            <div className="list-group list-group-flush">
                                {slotData?.history?.length > 0 ? (
                                    slotData.history.slice(0, 5).map((h, i) => (
                                        <div key={i} className="list-group-item d-flex align-items-start gap-3">
                                            <div
                                                className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "40px", height: "40px", flexShrink: 0 }}
                                            >
                                                <i className="bi bi-check-lg"></i>
                                            </div>
                                            <div>
                                                <div className="fw-semibold text-capitalize" onClick={() => setActive("parkingHistory")} style={{ cursor: "pointer" }}>
                                                    {fmt(h.action)}
                                                </div>
                                                <small className="text-muted">{fmtDate(h.created_at)}</small>
                                                {h.remarks && <div className="text-muted" style={{ fontSize: 12 }}>{h.remarks}</div>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="list-group-item text-muted text-center py-3">No history available</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Deallocate Modal ── */}
            {deallocateShow && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setDeallocateShow(false)}></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0" style={{ borderRadius: "16px" }}>
                                <div className="modal-header">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="d-flex align-items-center justify-content-center"
                                            style={{ width: "34px", height: "34px", background: "#fdeaea", borderRadius: "8px" }}>
                                            <FiAlertTriangle color="#ef4444" size={18} />
                                        </div>
                                        <h5 className="mb-0 fw-bold">Deallocate Parking Slot</h5>
                                    </div>
                                    <button className="btn-close" onClick={() => setDeallocateShow(false)}></button>
                                </div>
                                <div className="modal-body pt-3">
                                    <p className="text-muted text-start" style={{ fontSize: "14px", lineHeight: "22px" }}>
                                        Are you sure you want to deallocate{" "}
                                        <span style={{ fontWeight: "700", color: "#111827" }}>Slot {slotData?.slot_number}</span>?
                                        This will remove the assignment from{" "}
                                        <span style={{ fontWeight: "700", color: "#111827" }}>
                                            {allocation
                                                ? `Unit ${allocation.flat_block}-${allocation.flat_number} (${allocation.resident_name})`
                                                : "current occupant"}
                                        </span>{" "}
                                        and make the slot available for new allocation.
                                    </p>
                                    <div className="rounded overflow-hidden mb-4" style={{ background: "#f3f6f9" }}>
                                        <div className="d-flex justify-content-between p-2 border-bottom">
                                            <span className="text-muted">Slot Number</span>
                                            <strong>{slotData?.slot_number || "-"}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                            <span className="text-muted">Current Status</span>
                                            <span className="badge rounded-pill" style={{ background: "#22c55e", padding: "7px 14px" }}>
                                                {fmt(slotData?.slot_status)}
                                            </span>
                                        </div>
                                        {allocation && (
                                            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                                <span className="text-muted">Assigned To</span>
                                                <span className="fw-semibold">{allocation.resident_name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="fw-semibold mb-2 text-start d-block">
                                            Reason for Deallocation <span className="text-muted fw-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            placeholder="E.g., Resident moved out, request for change..."
                                            value={deallocationReason}
                                            onChange={(e) => setDeallocationReason(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-sm btn-light px-4 border" onClick={() => setDeallocateShow(false)}>Cancel</button>
                                    <button className="btn btn-sm btn-danger px-4" onClick={handleDeallocate}><FiSlash /> Confirm Deallocation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {allocateShow && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setAllocateShow(false)}></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0" style={{ borderRadius: "16px" }}>
                                <div className="modal-header">
                                    <h5 className="mb-0 fw-bold">Allocate Slot {slotData?.slot_number}</h5>
                                    <button className="btn-close" onClick={() => setAllocateShow(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="fw-semibold mb-1 d-block text-start">
                                            Block
                                        </label>

                                        <select
                                            className="form-select"
                                            value={selectedBlock}
                                            onChange={handleBlockChange}
                                        >
                                            <option value="">Select Block</option>

                                            {allBlocks.map((item, index) => (
                                                <option key={index} value={item.block}>
                                                    {item.block}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-semibold mb-1 d-block text-start">
                                            Flat
                                        </label>

                                        <select
                                            className="form-select"
                                            value={selectedFlat}
                                            onChange={(e) => setSelectedFlat(e.target.value)}
                                        >
                                            <option value="">Select Flat</option>

                                            {allFlats.map((flat) => (
                                                <option key={flat.flat_id} value={flat.flat_id}>
                                                    {flat.flat_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="fw-semibold mb-1 d-block text-start">
                                            Remarks <span className="text-muted fw-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            placeholder="E.g., Permanent slot for flat owner"
                                            value={allocateRemarks}
                                            onChange={(e) => setAllocateRemarks(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-sm btn-light border px-4" onClick={() => setAllocateShow(false)}>Cancel</button>
                                    <button className="btn btn-sm btn-success px-4" onClick={handleAllocate}>
                                        <i className="bi bi-check-circle me-1"></i> Confirm Allocation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <ParkingSlotModal
                show={editShow}
                isEdit={true}
                onClose={() => setEditShow(false)}
                onSubmit={handleEdit}
                slotNo={slotData?.slot_number || ""} setSlotNo={() => { }}
                block={slotData?.block || ""} setBlock={() => { }}
                floor={editFloor} setFloor={setEditFloor}
                zone={editZone} setZone={setEditZone}
                parkingType={slotData?.parking_type || ""} setParkingType={() => { }}
                vehicleSuitability={slotData?.vehicle_type || ""} setVehicleSuitability={() => { }}
                allocationStatus={editStatus} setAllocationStatus={setEditStatus}
                accessLevel={slotData?.access_level || ""} setAccessLevel={() => { }}
                length={slotData?.length || ""} setLength={() => { }}
                width={slotData?.width || ""} setWidth={() => { }}
                isEvReady={editEvReady} setIsEvReady={setEditEvReady}
                errors={{}}
                errorText=""
            />

            {/* ── Document Viewer Modal ── */}
            {showDocument && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowDocument(false)}></div>
                    <div className="modal fade show d-block">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: "20px" }}>
                                <div className="modal-header pt-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="d-flex align-items-center justify-content-center"
                                            style={{ width: "32px", height: "32px", background: "#eef2ff", borderRadius: "4px" }}>
                                            <CgFileDocument style={{ color: "#2563eb" }} />
                                        </div>
                                        <h3 className="mb-0" style={{ fontWeight: "600", fontSize: "20px" }}>Document Viewer</h3>
                                    </div>
                                    <button className="btn-close" onClick={() => setShowDocument(false)}></button>
                                </div>
                                <div className="modal-body px-4 pt-2 bg-light">
                                    <div className="p-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                                        style={{ background: "#ffffff" }}>
                                        <div className="mb-3">
                                            <div className="fw-semibold text-start" style={{ fontSize: "13px" }}>
                                                Vehicle Registration - EV-22-ZZ-5555.pdf
                                            </div>
                                            <div className="text-muted text-start mt-1" style={{ fontSize: "11px" }}>
                                                Uploaded on Jan 15, 2023 • 2.4 MB
                                            </div>
                                        </div>
                                        <button className="btn btn-sm border py-2">
                                            <FiExternalLink className="me-2" />Open in New Tab
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-1 border" style={{ background: "#f1f5f9" }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=1200&auto=format&fit=crop"
                                            alt="document" className="w-100"
                                            style={{ height: "300px", objectFit: "cover" }} />
                                    </div>
                                </div>
                                <div className="modal-footer px-4 pb-4 pt-3">
                                    <button className="btn btn-sm btn-light border px-4"><FiPrinter className="me-2" />Print</button>
                                    <button className="btn btn-sm btn-primary px-4"><FiDownload className="me-2" />Download</button>
                                    <button className="btn btn-sm btn-light border ms-auto" onClick={() => setShowDocument(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default ParkingDetails
