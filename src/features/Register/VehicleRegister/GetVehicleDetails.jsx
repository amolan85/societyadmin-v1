import { useState, useEffect } from 'react';
import { GetSessionData } from "../../../utils/SessionManagement";
import {
    GetVehicleByIdApi, UpdateVehicleApi, DeleteVehicleApi
} from '../../../services/VehicleRegisterAPI';
import { Badge } from '../../../components/Common/ReusableFunction';
import { toast } from "react-toastify";
import { FiMapPin } from 'react-icons/fi';
import VehicleModal from './VehicleModal';

const GetVehicleDetails = ({ vehicleId, setActive, onBack }) => {

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState(null);

    // Edit modal
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorText, setErrorText] = useState("");

    // Form fields
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [color, setColor] = useState("");
    const [stickerId, setStickerId] = useState("");
    const [rcDocument, setRcDocument] = useState(null);
    const [flatId, setFlatId] = useState("");

    useEffect(() => { SessionData(); }, []);

    useEffect(() => {
        if (vehicle) {
            setVehicleNumber(vehicle.vehicle_number || "");
            setVehicleType(vehicle.vehicle_type || "");
            setVehicleModel(vehicle.vehicle_model || "");
            setColor(vehicle.color || "");
            setStickerId(vehicle.sticker_id || "");
            setFlatId(vehicle.flat_id || "");
        }
    }, [vehicle]);

    const SessionData = async () => {
        const data = await GetSessionData();

        const firstFlat = data.data.flats?.[0];

        if (firstFlat) {
            const sid = firstFlat.society_id;

            setSocietyId(sid);
            setUserId(data.data.user_id);

            fetchVehicle(sid);
        }
    };

    const fetchVehicle = async (sid) => {
        try {
            setLoading(true);

            const res = await GetVehicleByIdApi(
                vehicleId,
                sid
            );

            setVehicle(res?.data || res);
        } catch (e) {
            toast.error("Could not load vehicle details");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await DeleteVehicleApi(vehicle.id, societyId);
            toast.success("Vehicle deleted");
            onBack && onBack();
        } catch (e) {
            toast.error(e?.message || "Delete failed");
        }
    };

    const handleUpdate = async () => {
        let errs = {};

        if (!vehicleNumber) errs.vehicleNumber = "required";
        if (!vehicleType) errs.vehicleType = "required";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            await UpdateVehicleApi(
                vehicle.vehicle_id,
                societyId,
                vehicleNumber,
                vehicleType,
                vehicleModel,
                color,
                stickerId,
                rcDocument
            );

            toast.success("Vehicle updated successfully");

            setShow(false);
            setErrors({});
            setErrorText("");

            fetchVehicle(societyId);

        } catch (e) {
            toast.error(e?.message || "Update failed");
            setErrorText(e?.message || "Update failed");
        }
    };

    const fmt = (dt, type) => {
        if (!dt) return "—";
        const normalized = dt.includes("T") ? dt : dt.replace(" ", "T");
        const withZ = normalized.includes("Z") || normalized.includes("+") ? normalized : normalized + "Z";
        const date = new Date(withZ);
        if (isNaN(date)) return "—";
        return type === "time"
            ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
            : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const vehicleTypeLabel = (type) => {
        if (type === "2_wheeler") return "2 Wheeler";
        if (type === "4_wheeler") return "4 Wheeler";
        return type || "—";
    };

    const vehicleTypeBadgeColor = (type) => {
        if (type === "2_wheeler") return "blue";
        if (type === "4_wheeler") return "green";
        return "grey";
    };

    const initials = (name) => {
        if (!name) return "V";
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    };

    if (loading) return <div className="text-center py-5 text-muted">Loading...</div>;
    if (!vehicle) return null;

    return (
        <>
            <div className="pg cp-wrap">

                {/* Profile Header Card */}
                <div className="sv-card p-4 mb-3" style={{
                    background: "#eff6ff",
                    border: "1px solid #93c5fd"
                }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

                        {/* Left: Icon + Info */}
                        <div className="d-flex align-items-center gap-3">
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%",
                                background: "#e0e7ff", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 22, fontWeight: 700, color: "#4f46e5", flexShrink: 0
                            }}>
                                {vehicle.vehicle_type === "2_wheeler" ? "🛵" : "🚗"}
                            </div>
                            <div className="text-start">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">{vehicle.vehicle_number}</h5>
                                    <Badge
                                        label={vehicleTypeLabel(vehicle.vehicle_type)}
                                        c={vehicleTypeBadgeColor(vehicle.vehicle_type)}
                                    />
                                </div>
                                <div className="d-flex align-items-center gap-3 mt-1 flex-wrap">
                                    {vehicle.vehicle_model && (
                                        <span className="text-muted" style={{ fontSize: 13 }}>
                                            {vehicle.vehicle_model}
                                        </span>
                                    )}
                                    {vehicle.color && (
                                        <span className="text-muted" style={{ fontSize: 13 }}>
                                            🎨 {vehicle.color}
                                        </span>
                                    )}
                                    {vehicle.flat_id && (
                                        <span className="text-muted" style={{ fontSize: 13 }}>
                                            <FiMapPin size={12} className="me-1" />
                                            Unit {vehicle.flat_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Buttons */}
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setShow(true)}
                                style={{ borderRadius: 8 }}
                            >
                                Edit Vehicle
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleDelete}
                                style={{ borderRadius: 8 }}
                            >
                                Delete
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setActive("vehicleRegister")}
                                style={{ borderRadius: 8 }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    {/* Left Column */}
                    <div className="col-12 col-lg-8">

                        {/* Vehicle Information */}
                        <div className="sv-card p-4 mb-3">
                            <h6 className="fw-bold mb-3 text-start">Vehicle Information</h6>
                            <div className="row g-3 text-start">
                                {[
                                    ["Vehicle Number", vehicle.vehicle_number || "—"],
                                    ["Vehicle Type", vehicleTypeLabel(vehicle.vehicle_type)],
                                    ["Model", vehicle.vehicle_model || "—"],
                                    ["Color", vehicle.color || "—"],
                                    ["Sticker ID", vehicle.sticker_id || "—"],
                                    ["Flat / Unit", vehicle.flat_id || "—"],
                                    ["Registered On", fmt(vehicle.created_at, "date")],
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

                        {/* RC Document */}
                        {vehicle.rc_document_url && (
                            <div className="sv-card p-4 mb-3">
                                <h6 className="fw-bold mb-3 text-start">RC Document</h6>
                                <a
                                    href={vehicle.rc_document_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    📄 View RC Document
                                </a>
                            </div>
                        )}

                    </div>

                    {/* Right Column */}
                    <div className="col-12 col-lg-4">

                        {/* Vehicle Profile Card */}
                        <div className="sv-card p-4 mb-3 text-start">
                            <h6 className="fw-bold mb-3">Vehicle Summary</h6>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "#e0e7ff", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 22, flexShrink: 0
                                }}>
                                    {vehicle.vehicle_type === "2_wheeler" ? "🛵" : "🚗"}
                                </div>
                                <div>
                                    <div className="fw-bold" style={{ fontSize: 14 }}>{vehicle.vehicle_number}</div>
                                    <small className="text-muted text-capitalize">{vehicleTypeLabel(vehicle.vehicle_type)}</small>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {vehicle.vehicle_model && (
                                    <div style={{ fontSize: 13 }}>
                                        <span className="text-muted">Model: </span>{vehicle.vehicle_model}
                                    </div>
                                )}
                                {vehicle.color && (
                                    <div style={{ fontSize: 13 }}>
                                        <span className="text-muted">Color: </span>{vehicle.color}
                                    </div>
                                )}
                                {vehicle.sticker_id && (
                                    <div style={{ fontSize: 13 }}>
                                        <span className="text-muted">Sticker: </span>{vehicle.sticker_id}
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
                                        <div className="fw-semibold" style={{ fontSize: 13 }}>Vehicle Registered</div>
                                        <small className="text-muted">
                                            {fmt(vehicle.created_at, "date")} &bull; {fmt(vehicle.created_at, "time")}
                                        </small>
                                    </div>
                                </div>
                                {vehicle.updated_at && vehicle.updated_at !== vehicle.created_at && (
                                    <div className="d-flex gap-3 align-items-start">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", marginTop: 4, flexShrink: 0 }} />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: 13 }}>Last Updated</div>
                                            <small className="text-muted">
                                                {fmt(vehicle.updated_at, "date")} &bull; {fmt(vehicle.updated_at, "time")}
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <VehicleModal
                show={show}
                setShow={setShow}
                mode="edit"
                errors={errors}
                societyId={societyId}
                vehicleId={vehicle?.id}
                setErrors={setErrors}
                errorText={errorText}
                vehicleNumber={vehicleNumber}
                setVehicleNumber={setVehicleNumber}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                vehicleModel={vehicleModel}
                setVehicleModel={setVehicleModel}
                color={color}
                setColor={setColor}
                stickerId={stickerId}
                setStickerId={setStickerId}
                rcDocument={rcDocument}
                setRcDocument={setRcDocument}
                flatId={flatId}
                handleSubmit={handleUpdate}
            />
        </>
    );
};

export default GetVehicleDetails;
