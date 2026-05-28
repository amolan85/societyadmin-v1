import { useState } from 'react'
import { FaCar } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiPrinter, FiSlash, FiStopCircle } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../styles/RentalAndTenant.css";
const TenantsReviewApplication = ({ setActive, /* memberId, setFlatId */ }) => {

    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);



    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex  gap-3">
                            {/* <img
                                src="https://i.pravatar.cc/100"
                                className="rounded-circle border"
                                width="70"
                                height="70"
                                alt="profile"
                            /> */}
                            <div className="icon-box mt-1">
                                <FiArrowLeft size={20} className="text-dark" />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Unit B-402 Tenant Registration</h5>
                                    <span className="badge bg-warning-subtle text-warning">
                                        Pending Verification
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        {/* <i className="bi bi-envelope me-1"></i> */}
                                        {/* <BiLocationPlus className="me-1" /> */}
                                        submitted on 28 Feb 2024 by Amit Patel (Owner)
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

                            <button className="btn btn-primary btn-sm" onClick={() => setActive("parkingRegister")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Tenant Profile
                            </div>

                            <div className="card-body">
                                <div className='row'>
                                    <div className="col-lg-2">
                                        <img
                                            src='../src/assets/profile.png'
                                            alt="profile"
                                            className="rounded-circle me-3"
                                            width="80"
                                            height="80"
                                        />

                                    </div>
                                    <div className="col-lg-10">
                                        <div className="row g-4">

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">FULL NAME</small>
                                                <div className="fw-semibold">-</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">DATE OF BIRTH</small>
                                                <div className="fw-semibold">-</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">EMAIL ADDRESS</small>
                                                <div className="fw-semibold">-</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">PHONE NUMBER</small>
                                                <div className="fw-semibold">-</div>
                                            </div>

                                            <div className="col-md-12">
                                                <small className="text-muted d-block">PERMANENT ADDRESS</small>
                                                <div className="fw-semibold">-</div>
                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">Lease Information</span>

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
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Owner Details
                            </div>
                            <div className=" card-header bg-white fw-semibold d-flex align-items-center">


                                <img
                                    src='../src/assets/profile.png'
                                    alt="profile"
                                    className="rounded-circle me-3"
                                    width="45"
                                    height="45"
                                />


                                <div>
                                    <div className="fw-semibold">Amit Patel</div>
                                    <small className="text-muted">Unit B-204  Owner</small>
                                </div>

                            </div>
                            <div className="card-body">
                                {/* <div className="card shadow-sm border-0 p-3" style={{ maxWidth: "320px", borderRadius: "10px" }}> */}



                                <div className="mb-4">
                                    <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                        Contact Number
                                    </small>
                                    <div className="fw-semibold">+918987666553</div>
                                </div>


                                <div className="mb-4">
                                    <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                        Email Address
                                    </small>
                                    <div className="fw-semibold text-break">
                                        sarah.williams@example.com
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button className='btn btn-sm' style={{ backgroundColor: "#37c759", color: "#fff", borderColor: "#37c759" ,width: "350px"}}><FiCheckCircle /> Owner Approved Registration</button>
                                </div>


                            </div>
                        </div>




                        <div className="card shadow-sm border mt-3">
                            <div className="card-header bg-white fw-semibold">
                                Verification Checklist
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

            {
                showDocument && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="modal-backdrop fade show"
                            onClick={() => setShowDocument(false)}
                        ></div>

                        {/* Modal */}
                        <div className="modal fade show d-block">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div
                                    className="modal-content border-0 overflow-hidden"
                                    style={{
                                        borderRadius: "20px",
                                    }}
                                >

                                    {/* Header */}
                                    <div className="modal-header   pt-4 ">

                                        <div className="d-flex align-items-center gap-2">

                                            {/* Icon */}
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    background: "#eef2ff",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                <CgFileDocument style={{ color: "#2563eb" }} />
                                            </div>

                                            <h3
                                                className="mb-0"
                                                style={{
                                                    fontWeight: "600",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                Document Viewer
                                            </h3>

                                        </div>

                                        <button
                                            className="btn-close"
                                            onClick={() => setShowDocument(false)}
                                        ></button>

                                    </div>

                                    {/* Body */}
                                    <div className="modal-body px-4 pt-2 bg-light">

                                        {/* Top Box */}
                                        <div
                                            className=" p-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                                            style={{
                                                background: "#ffffff",
                                            }}
                                        >

                                            {/* File Details */}
                                            <div className="mb-3">

                                                <div
                                                    className="fw-semibold text-start"
                                                    style={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Vehicle Registration - EV-22-ZZ-5555.pdf
                                                </div>

                                                <div
                                                    className="text-muted text-start mt-1"
                                                    style={{
                                                        fontSize: "11px",
                                                    }}
                                                >
                                                    Uploaded on Jan 15, 2023 • 2.4 MB
                                                </div>

                                            </div>

                                            {/* Button */}
                                            <button className="btn btn-sm border  py-2">
                                                {/* <i className="bi bi-box-arrow-up-right"></i> */}
                                                <FiExternalLink className="me-2" />
                                                Open in New Tab
                                            </button>

                                        </div>

                                        {/* Image Preview */}
                                        <div
                                            className="overflow-hidden rounded-1 border"
                                            style={{
                                                background: "#f1f5f9",
                                            }}
                                        >

                                            <img
                                                src="https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=1200&auto=format&fit=crop"
                                                alt="document"
                                                className="w-100"
                                                style={{
                                                    height: "300px",
                                                    objectFit: "cover",
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className="modal-footer px-4 pb-4 pt-3">

                                        <button className="btn btn-sm btn-light border px-4">
                                            {/* <i className="bi bi-printer me-2 "></i> */}
                                            <FiPrinter className="me-2" />
                                            Print
                                        </button>

                                        <button className="btn btn-sm btn-primary px-4">
                                            {/* <i className="bi bi-download me-2"></i> */}
                                            <FiDownload className="me-2" />
                                            Download
                                        </button>

                                        <button
                                            className="btn btn-sm  btn-light border ms-auto"
                                            onClick={() => setShowDocument(false)}
                                        >
                                            Close
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default TenantsReviewApplication