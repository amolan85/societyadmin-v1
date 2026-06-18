import { useState, useEffect } from 'react';
import { GetSessionData } from "../../../utils/SessionManagement";
import {
    GetVisitorApi, VisitorCheckoutApi, UpdateVisitorApprovalApi,
    DeleteVisitorApi, UpdateVisitorApi, AllotVisitorParkingApi
} from '../../../services/VisitorApi';
import { ListParkingSlotsApi } from '../../../services/ParkingApi';
import { getVisitorParkingByIdApi } from '../../../services/VisitorParkingApi';
import { Badge } from '../../../components/Common/ReusableFunction';
import { toast } from "react-toastify";
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import VisitorModal from "./VisitorModal";

const GetVisitorDetails = ({ visitorId, setActive, onBack }) => {

    const [visitor, setVisitor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState(null);
    const [approvalModal, setApprovalModal] = useState(false);
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorText, setErrorText] = useState("");
    const [flatId, setFlatId] = useState("");

    //allot parking
    const [parkingSlots, setParkingSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [parkingModal, setParkingModal] = useState(false);
    const [slotId, setSlotId] = useState("");
    const [vehicleType, setVehicleType] = useState("4_wheeler");
    const [parkingRemarks, setParkingRemarks] = useState("");
    const [parkingErrors, setParkingErrors] = useState({});
    const [parkingDetails, setParkingDetails] = useState(null);
    // Form fields
    const [visitorType, setVisitorType] = useState("guest");
    const [visitorName, setVisitorName] = useState("");
    const [mobile, setMobile] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [purpose, setPurpose] = useState("");
    const [parcelCompany, setParcelCompany] = useState("");
    const [parcelDeliveryType, setParcelDeliveryType] = useState("");
    const [parcelDescription, setParcelDescription] = useState("");

    useEffect(() => { SessionData(); }, []);

    useEffect(() => {
        if (visitor) {
            setVisitorType((visitor.visitor_type || "guest").toLowerCase());
            setVisitorName(visitor.visitor_name || "");
            setMobile(visitor.mobile || "");
            setPurpose(visitor.purpose || "");
            setVehicleNumber(visitor.vehicle_number || "");
            setParcelCompany(visitor.parcel_company || "");
            setParcelDeliveryType(visitor.parcel_delivery_type || "");
            setParcelDescription(visitor.parcel_description || "");
            setFlatId(visitor.flat_id || "");
        }
    }, [visitor]);
    // useEffect(() => {
    //     if (visitor?.visitor_parking_id) {
    //         fetchParkingDetails(visitor.visitor_parking_id);
    //     }
    // }, [visitor]);
    useEffect(() => {
        console.log("Visitor Changed:", visitor);
        console.log("Society Changed:", societyId);
        if (visitor?.visitor_parking_id && societyId) {
            fetchParkingDetails(visitor.visitor_parking_id);
        }
    }, [visitor, societyId]);
    const SessionData = async () => {
        const data = await GetSessionData();
        const firstFlat = data.data.flats[0];
        setSocietyId(firstFlat.society_id);
        setUserId(data.data.user_id);
        fetchVisitor(firstFlat.society_id);
    };
    const loadParkingSlots = async () => {
        try {
            setSlotsLoading(true);

            const res = await ListParkingSlotsApi(societyId);

            const slots =
                res?.data?.slots ||
                res?.slots ||
                res?.parking_slots ||
                [];

            const availableSlots = slots.filter(
                slot => slot.slot_status?.toLowerCase() === "available"
            );

            setParkingSlots(availableSlots);
        } catch (e) {
            toast.error("Failed to load parking slots");
        } finally {
            setSlotsLoading(false);
        }
    };
    const handleAllotParking = async () => {
        let errs = {};
        if (!slotId) errs.slotId = "required";
        if (!vehicleType) errs.vehicleType = "required";
        if (Object.keys(errs).length > 0) { setParkingErrors(errs); return; }

        try {
            const res = await AllotVisitorParkingApi(
                societyId, visitor.id, slotId, userId,
                vehicleNumber, vehicleType, parkingRemarks
            );
            toast.success("Parking allotted successfully");

            // ✅ res.data.id se directly fetch karo
            // const parkingId = res?.data?.id;
            // if (parkingId) {
            //     await fetchParkingDetails(parkingId);
            // }

            setParkingModal(false);
            fetchVisitor(societyId);

        } catch (e) {
            toast.error(e?.message || "Failed to allot parking");
        }
    };
    const fetchVisitor = async (sId) => {
        try {
            setLoading(true);
            const res = await GetVisitorApi(visitorId, sId);
            console.log("Visitor API Response:", res);
            const v = res.data || res;
            console.log("Visitor data:", v);
            console.log("visitor_parking_id:", v?.visitor_parking_id); // ← check if visitor_parking_id exists
            setVisitor(v);
        } catch (e) {
            toast.error("Could not load visitor details");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            await VisitorCheckoutApi(visitor.id, societyId);
            toast.success("Visitor checked out");
            setCheckoutModal(false);
            fetchVisitor(societyId);
        } catch (e) { toast.error(e?.message || "Checkout failed"); }
    };
    const fetchParkingDetails = async (visitorParkingId) => {
        try {
            console.log("societyId:", societyId);
            console.log("visitorParkingId:", visitorParkingId);
            const res = await getVisitorParkingByIdApi(societyId, visitorParkingId);
            console.log("Parking API Response:", res);
            setParkingDetails(res?.data || res);
            console.log("Parking Response:", res);
        } catch (err) {
            console.error(err);
            console.error("Parking Error:", err);
            // toast.error("Failed to load parking details");
        }
    };
    const handleApproval = async (status) => {
        try {
            await UpdateVisitorApprovalApi(visitor.id, societyId, status, rejectionReason, userId);
            toast.success(`Visitor ${status === "approved" ? "approved" : "rejected"} successfully`);
            setApprovalModal(false);
            setRejectionReason("");
            fetchVisitor(societyId);
        } catch (e) { toast.error(e?.message || "Action failed"); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this visitor?")) return;
        try {
            await DeleteVisitorApi(visitor.id, societyId);
            toast.success("Visitor deleted");
            onBack && onBack();
        } catch (e) { toast.error(e?.message || "Delete failed"); }
    };

    const handleUpdate = async () => {
        let errs = {};
        if (!visitorName) errs.visitorName = "required";
        if (!mobile) errs.mobile = "required";
        if (visitorType === "guest" && !purpose) errs.purpose = "required";
        if (visitorType === "delivery") {
            if (!parcelCompany) errs.parcelCompany = "required";
            if (!parcelDeliveryType) errs.parcelDeliveryType = "required";
        }
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        try {
            await UpdateVisitorApi(visitor.id, visitorName, mobile, purpose, vehicleNumber);
            toast.success("Visitor updated successfully");
            setShow(false);
            setErrors({});
            setErrorText("");
            fetchVisitor(societyId);
        } catch (e) {
            toast.error(e?.message || "Update failed");
            setErrorText(e?.message || "Update failed");
        }
    };

    const fmt = (dt, type) => {
        if (!dt) return "—";
        // Replace space with T to make valid ISO, then treat as UTC
        const normalized = dt.includes("T") ? dt : dt.replace(" ", "T");
        const withZ = normalized.includes("Z") || normalized.includes("+")
            ? normalized
            : normalized + "Z";
        const date = new Date(withZ);
        if (isNaN(date)) return "—";
        return type === "time"
            ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
            : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const getStatusColor = () => {
        if (visitor?.entry_status === "checked_in" || visitor?.entry_status === "inside") return "#22c55e";
        if (visitor?.entry_status === "checked_out") return "#94a3b8";
        if (visitor?.entry_status === "cancelled") return "#ef4444";
        if (visitor?.approval_status === "pending") return "#f59e0b";
        if (visitor?.approval_status === "rejected") return "#ef4444";
        if (visitor?.approval_status === "approved") return "#22c55e";
        return "#94a3b8";
    };

    const getStatusLabel = () => {
        if (visitor?.entry_status === "inside") return "Inside";
        if (visitor?.entry_status === "checked_in") return "Inside";
        if (visitor?.entry_status === "checked_out") return "Checked Out";
        if (visitor?.entry_status === "cancelled") return "Cancelled";
        if (visitor?.entry_status === "waiting") return "Waiting";
        if (visitor?.approval_status === "pending") return "Pending Approval";
        if (visitor?.approval_status === "rejected") return "Rejected";
        if (visitor?.approval_status === "approved") return "Approved";
        return "—";
    };

    const initials = (name) => {
        if (!name) return "?";
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    };

    if (!visitor) return null;

    return (
        <>
            <div className="pg cp-wrap">

                {/* ── Profile Header Card (like Member Details) ── */}
                <div className="sv-card p-4 mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                        {/* Left: Avatar + Name + Info */}
                        <div className="d-flex align-items-center gap-3">
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%",
                                background: "#e0e7ff", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 22, fontWeight: 700, color: "#4f46e5", flexShrink: 0
                            }}>
                                {visitor.photo_url
                                    ? <img src={visitor.photo_url} alt="visitor"
                                        style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
                                    : initials(visitor.visitor_name)
                                }
                            </div>
                            <div className="text-start">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold text-capitalize">{visitor.visitor_name}</h5>
                                    <Badge
                                        label={visitor.visitor_type === "delivery" ? "Delivery" : "Guest"}
                                        c={visitor.visitor_type === "delivery" ? "orange" : "blue"}
                                    />
                                    <span style={{
                                        background: getStatusColor() + "20",
                                        color: getStatusColor(),
                                        border: `1px solid ${getStatusColor()}40`,
                                        borderRadius: 20, padding: "2px 10px",
                                        fontSize: 12, fontWeight: 600
                                    }}>
                                        {getStatusLabel()}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-3 mt-1 flex-wrap">
                                    <span className="text-muted" style={{ fontSize: 13 }}>
                                        <FiPhone size={12} className="me-1" />
                                        +91 {visitor.mobile}
                                    </span>
                                    {visitor.email && (
                                        <span className="text-muted" style={{ fontSize: 13 }}>
                                            <FiMail size={12} className="me-1" />
                                            {visitor.email}
                                        </span>
                                    )}
                                    {visitor.coming_from && (
                                        <span className="text-muted text-capitalize" style={{ fontSize: 13 }}>
                                            <FiMapPin size={12} className="me-1" />
                                            {visitor.coming_from}
                                        </span>
                                    )}
                                    <span className="text-muted" style={{ fontSize: 13 }}>
                                        Unit {visitor.flat_id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="d-flex gap-2 flex-wrap">
                            {visitor.approval_status === "pending" && (
                                <button
                                    className="btn btn-sm btn-warning fw-semibold"
                                    onClick={() => setApprovalModal(true)}
                                    style={{ borderRadius: 8 }}
                                >
                                    Approve / Reject
                                </button>
                            )}
                            {(visitor.entry_status === "checked_in" || visitor.entry_status === "inside") && (
                                <button
                                    className="btn btn-sm btn-outline-secondary fw-semibold"
                                    onClick={() => setCheckoutModal(true)}
                                    style={{ borderRadius: 8 }}
                                >
                                    ✓ Checkout
                                </button>
                            )}
                            {/* <button
                                className="btn btn-sm btn-primary"
                                onClick={() => { setParkingModal(true); loadParkingSlots(); }}
                                style={{ borderRadius: 8 }}
                            >
                                + Allot Parking
                            </button> */}
                            <button
                                className="btn btn-sm btn-primary"
                                disabled={
                                    visitor?.approval_status === "approved" ||
                                    visitor?.approval_status === "rejected" ||
                                    visitor?.entry_status === "checked_out"
                                }
                                onClick={() => setShow(true)}
                                style={{ borderRadius: 8 }}
                            >
                                Edit Visitor
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setActive("visitorRegister")}
                                style={{ borderRadius: 8 }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    {/* ── Left Column ── */}
                    <div className="col-12 col-lg-8">

                        {/* Visit Information */}
                        <div className="sv-card p-4 mb-3">
                            <h6 className="fw-bold mb-3 text-start">Visit Information</h6>
                            <div className="row g-3 text-start">
                                {[
                                    ["Purpose", visitor.purpose || visitor.parcel_company || "—"],
                                    ["Coming From", visitor.coming_from || "—"],
                                    ["Vehicle", visitor.vehicle_number || "—"],
                                    ["Entry Status", visitor.entry_status?.replace(/_/g, " ") || "—"],
                                    ["Check In", `${fmt(visitor.check_in_time, "time")}  ${fmt(visitor.check_in_time, "date")}`],
                                    ["Check Out", visitor.check_out_time
                                        ? `${fmt(visitor.check_out_time, "time")}  ${fmt(visitor.check_out_time, "date")}`
                                        : "—"
                                    ],
                                ].map(([label, value]) => (
                                    <div className="col-6 col-md-4" key={label}>
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                            {label}
                                        </div>
                                        <div className="fw-semibold mt-1 text-capitalize" style={{ fontSize: 14 }}>
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ID Verification — Guest only */}
                        {visitor.visitor_type === "guest" && (
                            <div className="sv-card p-4 mb-3">
                                <h6 className="fw-bold mb-3 text-start">ID Verification</h6>
                                <div className="row g-3 text-start">
                                    <div className="col-6">
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>ID Type</div>
                                        <div className="fw-semibold mt-1 text-capitalize" style={{ fontSize: 14 }}>
                                            {visitor.id_type || "—"}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>ID Number</div>
                                        <div className="fw-semibold mt-1" style={{ fontSize: 14 }}>
                                            {visitor.id_number || "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delivery Details — Delivery only */}
                        {visitor.visitor_type === "delivery" && (
                            <div className="sv-card p-4 mb-3">
                                <h6 className="fw-bold mb-3 text-start">Delivery Details</h6>
                                <div className="row g-3 text-start">
                                    <div className="col-6">
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Company / App</div>
                                        <div className="fw-semibold mt-1" style={{ fontSize: 14 }}>{visitor.parcel_company || "—"}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Delivery Type</div>
                                        <div className="fw-semibold mt-1 text-capitalize" style={{ fontSize: 14 }}>{visitor.parcel_delivery_type || "—"}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>Description</div>
                                        <div className="fw-semibold mt-1" style={{ fontSize: 14 }}>{visitor.parcel_description || "—"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {parkingDetails && (
                            <div className="sv-card p-4 mb-3">
                                <h6 className="fw-bold mb-3 text-start">Parking Details</h6>
                                <div className="row g-3 text-start">
                                    {[
                                        ["Slot Number", parkingDetails.slot_number],
                                        ["Zone", parkingDetails.zone || "—"],
                                        ["Block / Floor", `${parkingDetails.block || "—"} / ${parkingDetails.floor || "—"}`],
                                        ["Vehicle Number", parkingDetails.vehicle_number || "—"],
                                        ["Vehicle Type", parkingDetails.vehicle_type?.replace("_", " ") || "—"],
                                        ["Status", parkingDetails.status || "—"],
                                        ["Allotted At", parkingDetails.allotted_at
                                            ? fmt(parkingDetails.allotted_at, "date") + " • " + fmt(parkingDetails.allotted_at, "time")
                                            : "—"],
                                        ["Remarks", parkingDetails.remarks || "—"],
                                    ].map(([label, value]) => (
                                        <div className="col-6 col-md-4" key={label}>
                                            <div className="text-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                                            <div className="fw-semibold mt-1 text-capitalize" style={{ fontSize: 14 }}>{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Rejection Reason */}
                        {visitor.approval_status === "rejected" && visitor.rejection_reason && (
                            <div className="sv-card p-4 mb-3" style={{ borderLeft: "4px solid #ef4444" }}>
                                <h6 className="fw-bold mb-2 text-start text-danger">Rejection Reason</h6>
                                <p className="mb-0 text-start text-muted">{visitor.rejection_reason}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Right Column ── */}
                    <div className="col-12 col-lg-4">

                        {/* Visitor Profile */}
                        <div className="sv-card p-4 mb-3 text-start">
                            <h6 className="fw-bold mb-3">Visitor Profile</h6>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "#e0e7ff", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 16, fontWeight: 700, color: "#4f46e5", flexShrink: 0
                                }}>
                                    {visitor.photo_url
                                        ? <img src={visitor.photo_url} alt="visitor"
                                            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                                        : initials(visitor.visitor_name)
                                    }
                                </div>
                                <div>
                                    <div className="fw-bold text-capitalize" style={{ fontSize: 14 }}>{visitor.visitor_name}</div>
                                    <small className="text-muted text-capitalize">{visitor.gender || "—"}</small>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <FiPhone size={13} className="text-muted" />
                                    <span style={{ fontSize: 13 }}>+91 {visitor.mobile}</span>
                                </div>
                                {visitor.email && (
                                    <div className="d-flex align-items-center gap-2">
                                        <FiMail size={13} className="text-muted" />
                                        <span style={{ fontSize: 13 }}>{visitor.email}</span>
                                    </div>
                                )}
                                {visitor.coming_from && (
                                    <div className="d-flex align-items-center gap-2">
                                        <FiMapPin size={13} className="text-muted" />
                                        <span style={{ fontSize: 13 }} className="text-capitalize">{visitor.coming_from}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="sv-card p-4 text-start">
                            <h6 className="fw-bold mb-3">Activity Log</h6>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex gap-3 align-items-start">
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", marginTop: 4, flexShrink: 0 }} />
                                    <div>
                                        <div className="fw-semibold" style={{ fontSize: 13 }}>Entry Registered</div>
                                        <small className="text-muted">{fmt(visitor.created_at, "date")} &bull; {fmt(visitor.created_at, "time")}</small>
                                    </div>
                                </div>
                                {visitor.approval_status === "pending" && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", marginTop: 4, flexShrink: 0 }} />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>Awaiting Approval</div>
                                            <small className="text-muted">Pending host confirmation</small>
                                        </div>
                                    </div>
                                )}
                                {visitor.approval_time && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{
                                            width: 10, height: 10, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                                            background: visitor.approval_status === "approved" ? "#22c55e" : "#ef4444"
                                        }} />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>
                                                {visitor.approval_status === "approved" ? "Approved" : "Rejected"}
                                            </div>
                                            <small className="text-muted">{fmt(visitor.approval_time, "date")} &bull; {fmt(visitor.approval_time, "time")}</small>
                                        </div>
                                    </div>
                                )}
                                {visitor.check_in_time && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                background: "#22c55e",
                                                marginTop: 4,
                                                flexShrink: 0
                                            }}
                                        />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>
                                                Checked In
                                            </div>
                                            <small className="text-muted">
                                                {fmt(visitor.check_in_time, "date")} &bull; {fmt(visitor.check_in_time, "time")}
                                            </small>
                                        </div>
                                    </div>
                                )}
                                {visitor.check_out_time && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#94a3b8", marginTop: 4, flexShrink: 0 }} />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>Checked Out</div>
                                            <small className="text-muted">{fmt(visitor.check_out_time, "date")} &bull; {fmt(visitor.check_out_time, "time")}</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Edit Visitor Modal ── */}
            <VisitorModal
                show={show}
                setShow={setShow}
                mode="edit"
                allBlocks={[]}
                allFlats={[]}
                selectedBlock=""
                setSelectedBlock={() => { }}
                selectedFlat=""
                setSelectedFlat={() => { }}
                onBlockChange={() => { }}
                errors={errors}
                setErrors={setErrors}
                errorText={errorText}
                visitorType={visitorType}
                setVisitorType={setVisitorType}
                visitorName={visitorName}
                setVisitorName={setVisitorName}
                mobile={mobile}
                setMobile={setMobile}
                flatId={flatId}
                setFlatId={setFlatId}
                flatsList={[]}
                vehicleNumber={vehicleNumber}
                setVehicleNumber={setVehicleNumber}
                email={visitor.email || ""}
                setEmail={() => { }}
                gender={visitor.gender || ""}
                setGender={() => { }}
                comingFrom={visitor.coming_from || ""}
                setComingFrom={() => { }}
                purpose={purpose}
                setPurpose={setPurpose}
                idType={visitor.id_type || ""}
                setIdType={() => { }}
                idNumber={visitor.id_number || ""}
                setIdNumber={() => { }}
                parcelCompany={parcelCompany}
                setParcelCompany={setParcelCompany}
                parcelDeliveryType={parcelDeliveryType}
                setParcelDeliveryType={setParcelDeliveryType}
                parcelDescription={parcelDescription}
                setParcelDescription={setParcelDescription}
                handleSubmit={handleUpdate}
            />

            {/* ── Checkout Confirmation Modal ── */}
            {checkoutModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h1 className="modal-title fs-5">Checkout Visitor</h1>
                                    <button type="button" className="btn-close"
                                        onClick={() => setCheckoutModal(false)} />
                                </div>
                                <div className="modal-body text-start">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div style={{
                                            width: 44, height: 44, borderRadius: "50%",
                                            background: "#e0e7ff", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 15, fontWeight: 700, color: "#4f46e5", flexShrink: 0
                                        }}>
                                            {initials(visitor.visitor_name)}
                                        </div>
                                        <div>
                                            <div className="fw-semibold text-capitalize">{visitor.visitor_name}</div>
                                            <small className="text-muted">+91 {visitor.mobile} &bull; Unit {visitor.flat_id}</small>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-3 mb-2" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-muted" style={{ fontSize: 13 }}>Check In</span>
                                            <span className="fw-semibold" style={{ fontSize: 13 }}>
                                                {fmt(visitor.check_in_time, "time")} &bull; {fmt(visitor.check_in_time, "date")}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted" style={{ fontSize: 13 }}>Check Out</span>
                                            <span className="fw-semibold text-success" style={{ fontSize: 13 }}>Now</span>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                                        This will mark the visitor as checked out and update the entry log.
                                    </p>
                                </div>
                                <div className="modal-footer bg-light">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => setCheckoutModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success fw-semibold"
                                            onClick={handleCheckout}
                                        >
                                            ✓ Confirm Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Approve / Reject Modal ── */}
            {approvalModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h1 className="modal-title fs-5">Visitor Approval</h1>
                                    <button type="button" className="btn-close"
                                        onClick={() => { setApprovalModal(false); setRejectionReason(""); }} />
                                </div>
                                <div className="modal-body text-start">
                                    <p className="mb-1 fw-semibold text-capitalize">{visitor.visitor_name}</p>
                                    <p className="text-muted mb-3" style={{ fontSize: 13 }}>
                                        {visitor.purpose || visitor.parcel_company}
                                    </p>
                                    <label className="sv-lb">Rejection Reason (optional)</label>
                                    <input
                                        className="sv-in mt-1"
                                        placeholder="Enter reason if rejecting..."
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                    />
                                </div>
                                <div className="modal-footer bg-light">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn btn-sm btn-danger" onClick={() => handleApproval("rejected")}>Reject</button>
                                        <button className="btn btn-sm btn-success" onClick={() => handleApproval("approved")}>Approve</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* ── Allot Parking Modal ── */}
            {parkingModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h1 className="modal-title fs-5">Allot Parking</h1>
                                    <button type="button" className="btn-close"
                                        onClick={() => { setParkingModal(false); setParkingErrors({}); }} />
                                </div>
                                <div className="modal-body text-start">

                                    <label className="sv-lb">Slot <span className="text-danger">*</span></label>
                                    <select
                                        className={`sv-in mt-1 mb-3 ${parkingErrors.slotId ? "is-invalid" : ""}`}
                                        value={slotId}
                                        onChange={e => { setSlotId(e.target.value); setParkingErrors(p => ({ ...p, slotId: "" })); }}
                                    >
                                        {slotsLoading ? (
                                            <option value="">Loading slots...</option>
                                        ) : (
                                            <>
                                                <option value="">Select a slot</option>
                                                {parkingSlots.map(slot => (
                                                    <option key={slot.id} value={slot.id}>
                                                        {slot.slot_number} — {slot.parking_type || ""} {slot.vehicle_type ? `(${slot.vehicle_type})` : ""}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>

                                    <label className="sv-lb">Vehicle Type <span className="text-danger">*</span></label>
                                    <select
                                        className={`sv-in mt-1 mb-3 ${parkingErrors.vehicleType ? "is-invalid" : ""}`}
                                        value={vehicleType}
                                        onChange={e => setVehicleType(e.target.value)}
                                    >
                                        <option value="4_wheeler">4 Wheeler</option>
                                        <option value="2_wheeler">2 Wheeler</option>
                                    </select>

                                    <label className="sv-lb">Vehicle Number</label>
                                    <input
                                        className="sv-in mt-1 mb-3"
                                        placeholder="Vehicle number"
                                        value={vehicleNumber}
                                        onChange={e => setVehicleNumber(e.target.value)}
                                    />

                                    <label className="sv-lb">Remarks</label>
                                    <input
                                        className="sv-in mt-1"
                                        placeholder="e.g. Visitor parked near Gate B"
                                        value={parkingRemarks}
                                        onChange={e => setParkingRemarks(e.target.value)}
                                    />
                                </div>
                                <div className="modal-footer bg-light">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => { setParkingModal(false); setParkingErrors({}); }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary fw-semibold"
                                            onClick={handleAllotParking}
                                        >
                                            Allot Parking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default GetVisitorDetails;
