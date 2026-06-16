import { useState, useEffect } from 'react'
import { FaBalanceScale, FaCar, FaSwimmingPool, FaUsers } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiMessageSquare, FiPrinter, FiSlash, FiStopCircle, FiFile, FiTruck, FiFileText } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../styles/RentalAndTenant.css";
import ResolveViolationModal from './ResolveViolationModal';
import WarningNotificationModal from './WarningNotificationModal';
import ViewDocumentModal from './ViewDocumentModal';
import { GetSessionData } from '../../utils/SessionManagement';
import { getViolationAlertsByIdApi } from '../../services/ViolationAlertsApi';
import { Badge } from '../../components/Common/ReusableFunction';

const ViewParkingDetails = ({ setActive, violationId }) => {

    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);
    const [show, setShow] = useState(false)
    const [notificationShow, setNotificationShow] = useState(false)
    const [resolutionMethodField, setResolutionMethodField] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [violationDetails, setViolationDetails] = useState({})
    const [loading, setLoading] = useState(true)

    const resolutionMethod = [
        {
            value: "unauthorized_parking",
            label: "Vehicle Removed by Owner",
        },
        {
            value: "wrong_slot",
            label: "Fine Paid / Settled",
        },
        {
            value: "double_parking",
            label: "Warning Acknowledged",
        },
        {
            value: "no_sticker",
            label: "Vehicle Towed",
        },
        {
            value: "visitor_overstay",
            label: "Mark as Error/ Dismissed",
        },
    ]

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        try {
            const data = await GetSessionData();
            const flats = data.data.flats[0];
            setSocietyId(flats.society_id);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (violationId && societyId) {
            getViolationDetailsById();
        }
    }, [violationId, societyId]);

    const getViolationDetailsById = async () => {
        try {
            setLoading(true);
            const data = await getViolationAlertsByIdApi(societyId, violationId);
            console.log(data, "Violation Details by id");
            // Handle different possible response shapes
            const details = data?.violation || data?.data || data || {};
            setViolationDetails(details);
        } catch (error) {
            console.log(error, "Error fetching violation details");
            setViolationDetails({});
        } finally {
            setLoading(false);
        }
    }

    const handleWarningNotification = () => {
        setNotificationShow(true)
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return "-";
        }
    };

    const getViolationTypeLabel = (value) => {
        const map = {
            unauthorized_parking: "Unauthorized Parking",
            visitor_overstay: "Visitor Overstay",
            wrong_slot: "Wrong Slot",
            double_parking: "Double Parking",
            no_sticker: "No Sticker",
            other: "Other",
        };
        return map[value] || value || "-";
    };

    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className=" mb-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center ">

                        <div className="d-flex  gap-3">

                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">
                                        {getViolationTypeLabel(violationDetails.violation_type)}
                                    </h5>
                                    <Badge
                                        label={violationDetails.status === "open" ? "Active" : violationDetails.status === "resolved" ? "Resolved" : violationDetails.status === "dismissed" ? "Dismissed" : ""}
                                        c={violationDetails.status === "open" ? "green" : violationDetails.status === "resolved" ? "blue" : violationDetails.status === "dismissed" ? "red" : "gray"}
                                    />
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        Reported at Slot {violationDetails.slot_number || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm btn-ad print-btn"><FiPrinter /> Print Ticket</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setShow(true)}><FiCheckCircle /> Resolve Violation</button>
                            <button className="btn btn-sm btn-ac btn-primary" onClick={() => setActive("parkingDashboard")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Incident Details
                            </div>

                            <div className="card-body">

                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">LOCATION / SLOT</small>
                                        <div className="fw-semibold">{violationDetails.slot_number || "-"}</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">RIGHTFUL OWNER</small>
                                        <div className="fw-semibold">{violationDetails.owner_name || "-"}</div>
                                        <div className="fw-semibold text-primary" onClick={() => setShowDocument(true)} style={{ cursor: "pointer" }}>
                                            View Document
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">DETECTED VEHICLE</small>
                                        <div className="fw-semibold">{violationDetails.vehicle_number || "-"}</div>
                                        <div className="fw-semibold text-danger" style={{ cursor: "pointer" }}>
                                            {violationDetails.vehicle_type === "registered" ? "Registered vehicle" : "Unregistered vehicle"}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">TIME OF INCIDENT</small>
                                        <div className="fw-semibold">{formatDateTime(violationDetails.created_at)}</div>
                                        <small className="text-muted d-block">
                                            {violationDetails.description || ""}
                                        </small>
                                    </div>

                                </div>

                            </div>
                        </div>


                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Evidence & Captures</span>
                                <span className="fw-semibold text-primary">View All Cameras</span>
                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <div className="card shadow-sm">
                                            <img
                                                src={violationDetails.photo_url || "https://picsum.photos/600/350"}
                                                alt=""
                                                className="card-img-top"
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card shadow-sm">
                                            <img
                                                src="https://picsum.photos/601/350"
                                                alt=""
                                                className="card-img-top"
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Enforcement Actions
                            </div>

                            <div className="card-body">

                                {[
                                    [
                                        <FiMessageSquare size={18} color="#ca8a04" />,
                                        "Send Warning Notification",
                                        "",
                                        handleWarningNotification,
                                        "#fef9c3",
                                    ],
                                    [
                                        <FiFileText size={18} color="#e11d48" />,
                                        "Issue Violation Fine",
                                        "",
                                        () => { },
                                        "#ffe4e6",
                                    ],
                                    [
                                        <FiTruck size={18} color="#ea580c" />,
                                        "Request Towing Service",
                                        "",
                                        () => { },
                                        "#ffedd5",
                                    ],
                                ].map(([ic, lb, sub, onClick, bgColor]) => (
                                    <button
                                        key={lb}
                                        className="qa mb-2"
                                        onClick={onClick}
                                        type="button"
                                    >
                                        <div
                                            className="qa-ico rounded-2"
                                            style={{ background: bgColor, padding: "8px", display: "inline-flex" }}
                                        >
                                            {ic}
                                        </div>

                                        <div className="ms-2">
                                            <div className="pl-qa-title">{lb}</div>
                                            {sub && <div className="pl-qa-sub">{sub}</div>}
                                        </div>
                                    </button>
                                ))}

                            </div>
                        </div>
                        <div className="card shadow-sm border mt-4 text-start">
                            <div className="card-header bg-white fw-bold">
                                Activity Log
                            </div>
                            <div className="card-body">
                                <div className="unauth-timeline">

                                    <div className="unauth-timeline-item active">
                                        <h6 className="mb-1">Violation Detected</h6>
                                        <small className="text-muted">
                                            System detected vehicle in reserved slot.
                                        </small><br />
                                        <small className="text-muted">
                                            {formatDateTime(violationDetails.created_at)}
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">Alert Sent to Admin</h6>
                                        <small className="text-muted">
                                            Push notification sent to active admins.
                                        </small><br />
                                        <small className="text-muted">
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">
                                            {violationDetails.status === "resolved" ? "Resolved"
                                                : violationDetails.status === "dismissed" ? "Dismissed"
                                                : "Pending Action"}
                                        </h6>
                                        <small className="text-muted">
                                            {violationDetails.status === "open" ? "Awaiting resolution..." : violationDetails.status || ""}
                                        </small><br />
                                        <small className="text-muted">
                                        </small>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div >
                </div>
            </div>
            <ResolveViolationModal
                show={show}
                setShow={setShow}
                violationId={violationId}
                societyId={societyId}
                resolutionMethod={resolutionMethod}
                resolutionMethodField={resolutionMethodField}
                setResolutionMethodField={setResolutionMethodField}
            />

            <WarningNotificationModal
                notificationShow={notificationShow}
                setNotificationShow={setNotificationShow}
            />
            <ViewDocumentModal
                showDocument={showDocument}
                setShowDocument={setShowDocument}
            />
        </>
    )
}

export default ViewParkingDetails