import { useState } from 'react'
import { FaBalanceScale, FaCar, FaSwimmingPool, FaUsers } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiMessageSquare, FiPrinter, FiSlash, FiStopCircle, FiFile, FiTruck, FiFileText } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../styles/RentalAndTenant.css";
import ResolveViolationModal from './ResolveViolationModal';
import WarningNotificationModal from './WarningNotificationModal';
import ViewDocumentModal from './ViewDocumentModal';
const ViewParkingDetails = ({ setActive, /* memberId, setFlatId */ }) => {

    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);
    const [show, setShow] = useState(false)
    const [notificationShow, setNotificationShow] = useState(false)
    const [resolutionMethodField, setResolutionMethodField] = useState("")

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
    const handleWarningNotification = () => {
        setNotificationShow(true)
    };

    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className=" mb-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center ">

                        <div className="d-flex  gap-3">

                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Unauthorized Parking</h5>
                                    <span className="badge bg-danger text-white">
                                        Active Violation
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        {/* <i className="bi bi-envelope me-1"></i> */}
                                        {/* <BiLocationPlus className="me-1" /> */}
                                        Reported 12 minutes ago at Slot P-102
                                    </div>

                                    {/* <div>
                                        <i className="bi bi-telephone me-1"></i>
                                        {phone}
                                        <span className="mx-2">|</span>
                                        Standard Covered
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm common-outline-btn print-btn" /*onClick={() => setActive("parkingRegister")}*/><FiPrinter /> Print Ticket</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setShow(true)}><FiCheckCircle /> Resolve Violation</button>

                            <button className="btn btn-primary btn-sm" onClick={() => setActive("parkingDashboard")}>Back</button>
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
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">RIGHTFUL OWNER</small>
                                        <div className="fw-semibold">-</div>
                                        <div className="fw-semibold text-primary" onClick={() => setShowDocument(true)} style={{ cursor: "pointer" }}>
                                            View Document
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">DETECTED VEHICLE</small>
                                        <div className="fw-semibold">-</div>
                                        <div className="fw-semibold text-danger" /* onClick={() => setShowDocument(true)} */ style={{ cursor: "pointer" }}>
                                            Unregistered vehicle
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">TIME OF INCIDENT</small>
                                        <div className="fw-semibold">-</div>
                                        <small className="text-muted d-block">Duration: 12m so far</small>
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
                                                src="https://picsum.photos/600/350"
                                                alt=""
                                                className="card-img-top"
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover"
                                                }}
                                            />



                                        </div>
                                    </div>

                                    {/* Image Card */}
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

                                {/* <div className="card shadow-sm border-0 p-3" style={{ maxWidth: "320px", borderRadius: "10px" }}> */}


                                {/* {[
                                        [
                                            <FiMessageSquare className="text-primary" />,
                                            "Send Warning Notification",
                                            "",
                                            handleWarningNotification,
                                        ],
                                        [
                                            <FaSwimmingPool className="text-success" />,
                                            "Issue Violation Fine",
                                            "",

                                        ],
                                        [
                                            <FaBalanceScale style={{ color: "orange" }} />,
                                            "Request Towing Service",
                                            "",

                                        ],
                                    ].map(([ic, lb, sub, onClick]) => (
                                        <button
                                            key={lb}
                                            className="qa mb-2"
                                            onClick={onClick}
                                            type="button"
                                        >
                                            <div className="qa-ico pl-qa-ico rounded-circle">
                                                {ic}
                                            </div>

                                            <div>
                                                <div className="pl-qa-title">{lb}</div>
                                                {sub && <div className="pl-qa-sub">{sub}</div>}
                                            </div>
                                        </button>
                                    ))}
                                 */}

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
                            {/* <div className="card shadow-sm border mt-3">
                            <div className="card-header bg-light fw-bold py-3">
                                Activity Log
                            </div>

                            <div className="card-body">
                                <div className="visitor-timeline">

                                    <div className="visitor-timeline-item active">
                                        <h6 className="mb-1">Check In Approved</h6>
                                        <small className="text-muted">
                                            10:45 AM • Guard Gate 1
                                        </small>
                                    </div>

                                    <div className="visitor-timeline-item">
                                        <h6 className="mb-1">Host Approval Received</h6>
                                        <small className="text-muted">
                                            10:42 AM • App Notification
                                        </small>
                                    </div>

                                    <div className="visitor-timeline-item">
                                        <h6 className="mb-1">Entry Request Created</h6>
                                        <small className="text-muted">
                                            10:40 AM • Gate System
                                        </small>
                                    </div>

                                </div>
                            </div>
                        </div> */}
                            <div className="card-body">
                                <div className="unauth-timeline">

                                    <div className="unauth-timeline-item active">
                                        <h6 className="mb-1">Violation Detected</h6>
                                        <small className="text-muted">
                                          System detected vehicle in reserved slot.
                                        </small><br/>
                                         <small className="text-muted">
                                           10:42 AM
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">Alert Sent to Admin</h6>
                                        <small className="text-muted">
                                           Push notification sent to 3 active admins.
                                        </small><br/>
                                        <small className="text-muted">
                                           10:43 AM
                                        </small>
                                    </div>

                                    <div className="unauth-timeline-item">
                                        <h6 className="mb-1">Pending Action</h6>
                                        <small className="text-muted">
                                           Awaiting resolution...
                                        </small><br/>
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