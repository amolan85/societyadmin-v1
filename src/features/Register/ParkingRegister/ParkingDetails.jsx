import { useState } from 'react'
import { FaCar } from 'react-icons/fa';
import { FiAlertTriangle, FiDownload, FiEdit, FiExternalLink, FiPrinter, FiSlash } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../../styles/ParkingRegister.css";

const ParkingDetails = ({ setActive, /* memberId, setFlatId */ }) => {

    const [deallocateShow, setDeallocateShow] = useState(false);
    const [showDocument, setShowDocument] = useState(false);



    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex align-items-center gap-3">
                            {/* <img
                                src="https://i.pravatar.cc/100"
                                className="rounded-circle border"
                                width="70"
                                height="70"
                                alt="profile"
                            /> */}
                            <div className="car-icon-box">
                                <FaCar size={70} className="text-primary" />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Slot P-B05</h5>

                                    <span className="badge bg-primary-subtle text-primary">
                                        Allocated
                                    </span>

                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        {/* <i className="bi bi-envelope me-1"></i> */}
                                        <BiLocationPlus className="me-1" />
                                        Basement 2  Standard Covered
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
                            <button className="btn btn-sm btn-ad grey-btn" onClick={() => setActive("parkingHistory")}>
                                {/* <i className="bi bi-chat-left-text me-1"></i> */}
                                <BiHistory className="me-1" size={16} />
                                History
                            </button>
                            <button className="btn btn-sm btn-ad grey-btn">
                                {/* <i className="bi bi-chat-left-text me-1"></i> */}
                                <FiEdit className="me-1" size={16} />
                                Edit Details
                            </button>

                            <button className="btn btn-sm deallocate-btn" onClick={() => setDeallocateShow(true)}>
                                {/* <i className="bi bi-pencil-square me-1"></i> */}
                                <FiSlash className="me-1" />
                                <strong>Deallocate</strong>
                            </button>
                            <button className="btn btn-sm btn-ac btn-primary" onClick={() => setActive("parkingRegister")}>Back</button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-start">

                    <div className="col-lg-8">


                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white fw-semibold">
                                Slot Information
                            </div>

                            <div className="card-body">
                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">SLOT ID</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">LOCATION</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">DIMENSIONS</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">TYPE</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">MONTHLY FEE</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                    <div className="col-md-6">
                                        <small className="text-muted d-block">ACCESS LEVEL</small>
                                        <div className="fw-semibold">-</div>
                                    </div>

                                </div>
                            </div>
                        </div>


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
                                        <div className="fw-semibold">-</div>
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


                    <div className="col-lg-4">


                        <div className="card shadow-sm border-0 p-3" style={{ maxWidth: "320px", borderRadius: "10px" }}>


                            <h6 className="fw-bold mb-3">Current Allocation</h6>


                            <div className="border rounded p-2 d-flex align-items-center mb-4 bg-light">


                                <img
                                    src='../src/assets/profile.png'
                                    alt="profile"
                                    className="rounded-circle me-3"
                                    width="45"
                                    height="45"
                                />


                                <div>
                                    <div className="fw-semibold">Sarah Williams</div>
                                    <small className="text-muted">Unit B-204 • Owner</small>
                                </div>

                            </div>


                            <div className="mb-4">
                                <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                    Allocated Since
                                </small>
                                <div className="fw-semibold">Jan 15, 2025</div>
                            </div>


                            <div className="mb-4">
                                <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                    Contact
                                </small>
                                <div className="fw-semibold">+918987666553</div>
                            </div>


                            <div className="mb-4">
                                <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                    Email
                                </small>
                                <div className="fw-semibold text-break">
                                    sarah.williams@example.com
                                </div>
                            </div>


                            <a href="#!" className="text-decoration-none fw-semibold">
                                View Member Profile →
                            </a>

                        </div>



                        <div className="card border-0 shadow-sm mt-3">
                            <div className="card-header bg-white fw-semibold">
                                Recent History
                            </div>

                            <div className="list-group list-group-flush">

                                <div className="list-group-item d-flex align-items-start gap-3">
                                    <div
                                        className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                                        // style="width:40px;height:40px;"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="bi bi-check-lg"></i>
                                    </div>

                                    <div>
                                        <div className="fw-semibold" onClick={() => setActive("parkingHistory")}>
                                            Sticker Renewed
                                        </div>

                                        <small className="text-muted">
                                            2 hours ago
                                        </small>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
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
            )}

            {showDocument && (
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
            )}
        </>
    )
}

export default ParkingDetails