import { useState } from 'react'
import { FaBalanceScale, FaCar, FaSwimmingPool, FaUsers } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiPrinter, FiSlash, FiStopCircle } from "react-icons/fi";
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
                            <button className="btn btn-danger btn-sm" onClick={() => setActive("parkingRegister")}><FiPrinter /> Print Ticket</button>
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

                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">LEASE INFORMATION</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">LEASE END DATE</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">DURATION</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">MONTHLY RENT</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">SECURITY DEPOSIT</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">TOTAL OCCUPANTS</small>
                                        <div className="fw-semibold">-</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">


                        <div className="card shadow-sm border-0 p-3" style={{ maxWidth: "320px", borderRadius: "10px" }}>


                            {[
                                [
                                    <FaUsers className="text-primary" />,
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
                        </div>


                        <div className="card shadow-sm border mt-3">
                            <div className="card-header bg-light fw-bold py-3">
                                Activity Log
                            </div>

                            <div className="card-body">
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked
                                        readOnly
                                        id="docVerified"
                                    />
                                    <label className="form-check-label" htmlFor="docVerified">
                                        Identity Documents Verified
                                    </label>
                                </div>

                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="policeVerification"
                                    />
                                    <label className="form-check-label" htmlFor="policeVerification">
                                        Police Verification Complete
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked
                                        readOnly
                                        id="agreementMatch"
                                    />
                                    <label className="form-check-label" htmlFor="agreementMatch">
                                        Agreement Matches Lease Period
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

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