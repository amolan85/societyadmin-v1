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
                            <button className="btn btn-sm deallocate-btn" onClick={() => setActive("parkingRegister")}><FiPrinter /> Print Ticket</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setShow(true)}><FiCheckCircle /> Resolve Violation</button>

                            <button className="btn btn-primary btn-sm" onClick={() => setActive("parkingRegister")}>Back</button>
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
                                <div className="card shadow-sm border mt-3">
                                    <div className="card-header bg-light fw-bold py-3">
                                        Activity Log
                                    </div>

                                    <div className="card-body">
                                        <div className="d-flex flex-column">

                                            {/* Violation Detected */}
                                            <div className="d-flex align-items-start position-relative pb-4">
                                                <div className="position-absolute top-0 start-0 translate-middle-x border-start border-2 h-100 mt-3" style={{ left: '9px' }} />
                                                <div className="rounded-circle bg-danger flex-shrink-0 mt-1 z-1" style={{ width: '20px', height: '20px' }} />
                                                <div className="ms-3">
                                                    <div className="fw-semibold small">Violation Detected</div>
                                                    <div className="text-muted small">System detected vehicle in reserved slot.</div>
                                                    <div className="text-muted small">10:42 AM</div>
                                                </div>
                                            </div>

                                            {/* Alert Sent to Admin */}
                                            <div className="d-flex align-items-start position-relative pb-4">
                                                <div className="position-absolute top-0 start-0 translate-middle-x border-start border-2 h-100 mt-3" style={{ left: '9px' }} />
                                                <div className="rounded-circle bg-secondary flex-shrink-0 mt-1 z-1" style={{ width: '20px', height: '20px' }} />
                                                <div className="ms-3">
                                                    <div className="fw-semibold small">Alert Sent to Admin</div>
                                                    <div className="text-muted small">Push notification sent to 3 active admins.</div>
                                                    <div className="text-muted small">10:43 AM</div>
                                                </div>
                                            </div>

                                            {/* Pending Action */}
                                            <div className="d-flex align-items-start">
                                                <div className="rounded-circle bg-secondary flex-shrink-0 mt-1" style={{ width: '20px', height: '20px' }} />
                                                <div className="ms-3">
                                                    <div className="fw-semibold small">Pending Action</div>
                                                    <div className="text-muted small">Awaiting resolution...</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
                </div>
                {deallocateShow && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="modal-backdrop fade show"
                            onClick={() => setDeallocateShow(false)}
                        ></div>

                        {/* Modal */}
                        <div
                            className="modal fade show d-block"
                            tabIndex="-1"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div
                                    className="modal-content border-0"
                                    style={{ borderRadius: "16px" }}
                                >

                                    {/* Header */}
                                    <div className="modal-header ">

                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "34px",
                                                    height: "34px",
                                                    background: "#fdeaea",
                                                    borderRadius: "8px",
                                                }}
                                            >
                                                <FiAlertTriangle
                                                    color="#ef4444"
                                                    size={18}
                                                />
                                            </div>

                                            <h5 className="mb-0 fw-bold">
                                                Deallocate Parking Slot
                                            </h5>
                                        </div>

                                        <button
                                            className="btn-close"
                                            onClick={() => setDeallocateShow(false)}
                                        ></button>

                                    </div>

                                    {/* Body */}
                                    <div className="modal-body pt-3">

                                        {/* Description */}
                                        <p
                                            className="text-muted text-start"
                                            style={{
                                                fontSize: "14px",
                                                lineHeight: "22px",
                                            }}
                                        >
                                            Are you sure you want to deallocate   <span style={{ fontWeight: "700", color: "#111827" }}>
                                                Slot P-204
                                            </span>? This action will remove
                                            the assignment from   <span style={{ fontWeight: "700", color: "#111827" }}>Unit A-502
                                                (Sarah Jenkins)</span> and make the slot available for
                                            new allocation.
                                        </p>

                                        {/* Details Box */}
                                        <div
                                            className="rounded overflow-hidden mb-4"
                                            style={{ background: "#f3f6f9" }}
                                        >

                                            {/* Row */}
                                            <div className="d-flex justify-content-between p-2 border-bottom">
                                                <span className="text-muted">
                                                    Slot Number
                                                </span>

                                                <strong>P - 204</strong>
                                            </div>

                                            {/* Row */}
                                            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                                <span className="text-muted">
                                                    Current Status
                                                </span>

                                                <span
                                                    className="badge rounded-pill"
                                                    style={{
                                                        background: "#22c55e",
                                                        padding: "7px 14px",
                                                    }}
                                                >
                                                    Occupied
                                                </span>
                                            </div>

                                            {/* Row */}
                                            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                                <span className="text-muted">
                                                    Assigned To
                                                </span>

                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src="https://i.pravatar.cc/40?img=12"
                                                        alt="profile"
                                                        className="rounded-circle"
                                                        width="28"
                                                        height="28"
                                                    />

                                                    <span className="fw-semibold">
                                                        Sarah Williams
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Reason */}
                                        <div>
                                            <label className="fw-semibold mb-2 text-start d-block">
                                                Reason for Deallocation{" "}
                                                <span className="text-muted fw-normal">
                                                    (Optional)
                                                </span>
                                            </label>

                                            <textarea
                                                rows={3}
                                                className="form-control border-0"
                                                placeholder="E.g., Resident moved out, request for change..."
                                                style={{
                                                    background: "#f3f4f6",
                                                    resize: "none",
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="modal-footer">

                                        <button
                                            className="btn btn-sm btn-light px-4 border"
                                            onClick={() => setDeallocateShow(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button className="btn btn-sm btn-danger px-4">
                                            <FiSlash /> Confirm Deallocation
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )
                }
                <ResolveViolationModal
                    show={show}
                    setShow={setShow}
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