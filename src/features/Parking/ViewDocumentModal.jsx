// ViewDocumentModal.jsx
import { BiDownArrowAlt } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { FiDownload, FiExternalLink, FiMaximize, FiMove, FiPrinter } from "react-icons/fi";
import Select from "react-select";

const ViewDocumentModal = ({
    showDocument,
    setShowDocument,

    allBlocks = [],
    allFlats = [],
    addMemberType = [],
    statusOptions = [],
    typeOptions = [],

    statusField = "",
    setStatusField = () => { },

    typeField = "",
    setTypeField = () => { },

    blocks = null,
    setBlocks = () => { },

    flat = null,
    setFlat = () => { },

    memType = "",
    setMemType = () => { },

    resetForm = () => { },

    firstName = "",
    setFirstName = () => { },

    lastName = "",
    setLastName = () => { },

    mobileNo = "",
    setMobileNo = () => { },

    emailId = "",
    setEmailId = () => { },

    moveInDate = "",
    setMoveInDate = () => { },

    moveOutDate = "",
    setMoveOutDate = () => { },

    familyType = "",
    setFamilyType = () => { },

    // rentAgreement = null,
    setRentAgreement = () => { },

    // policeNoc = null,
    setPoliceNoc = () => { },

    // idProof = null,
    setIdProof = () => { },

    // agreement = null,
    setAgreement = () => { },

    // maintenanceReceipt = null,
    setMaintenanceReceipt = () => { },

    // nominationDetails = null,
    setNominationDetails = () => { },

    // familyPhoto = null,
    setFamilyPhoto = () => { },

    // ownershipDocuments = null,
    setOwnershipDocuments = () => { },

    errors = {},
    errorText = "",
    handleSubmit = () => { },
    mode,
}) => {
    if (!showDocument) return null;

    return (
        <>
            <div
                className="modal-backdrop fade show"
                onClick={() => setShowDocument(false)}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header">
                            <div>
                                <h5 className="modal-title fw-bold text-start">
                                    Camera Evidence
                                </h5>
                                <small className="text-muted">
                                    Violation #VIO-2023-889 • Slot P-102 • 10:42 AM
                                </small>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-secondary btn-sm">
                                    <FiDownload className="me-1" />
                                    Download All
                                </button>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={()=>setShowDocument(false)}
                                ></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div
                            className="modal-body"
                            style={{
                                background: "#edf4fa",
                                maxHeight: "65vh",
                                overflowY: "auto"
                            }}
                        >
                            <div className="row g-3">

                                {/* Image Card */}
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

                                        <div className="card-body py-2">
                                            <div className="d-flex justify-content-between align-items-center">

                                                <small className="fw-semibold">
                                                    Main Entrance View
                                                </small>

                                                {/* <i className="bi bi-arrows-fullscreen"></i> */}
                                                <FiMove />
                                            </div>
                                        </div>

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

                                        <div className="card-body py-2">
                                            <div className="d-flex justify-content-between align-items-center">

                                                <small className="fw-semibold">
                                                    Slot P-102 Overview
                                                </small>

                                                {/* <i className="bi bi-arrows-fullscreen"></i> */}
                                                <FiMove />

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Image Card */}
                                <div className="col-md-6">
                                    <div className="card shadow-sm">

                                        <img
                                            src="https://picsum.photos/602/350"
                                            alt=""
                                            className="card-img-top"
                                            style={{
                                                height: "200px",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <div className="card-body py-2">
                                            <div className="d-flex justify-content-between align-items-center">

                                                <small className="fw-semibold">
                                                    Vehicle License Plate
                                                </small>

                                                {/* <i className="bi bi-arrows-fullscreen"></i> */}
                                                <FiMove />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Image Card */}
                                <div className="col-md-6">
                                    <div className="card shadow-sm">

                                        <img
                                            src="https://picsum.photos/603/350"
                                            alt=""
                                            className="card-img-top"
                                            style={{
                                                height: "200px",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <div className="card-body py-2">
                                            <div className="d-flex justify-content-between align-items-center">

                                                <small className="fw-semibold">
                                                    Parking Zone Camera
                                                </small>

                                                {/* <i className="bi bi-arrows-fullscreen"></i> */}
                                                <FiMove />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer justify-content-between">

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked
                                    readOnly
                                />
                                <label className="form-check-label small text-muted">
                                    Stored in Secure Cloud (Retention: 30 Days)
                                </label>
                            </div>

                            <div>
                                <button className="btn btn-sm btn-outline-secondary me-2">
                                    Close Viewer
                                </button>

                                <button className="btn btn-primary btn-sm">
                                    Export Evidence PDF
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewDocumentModal;
