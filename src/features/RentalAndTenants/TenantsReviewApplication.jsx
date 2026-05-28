import { useState, useEffect } from 'react'
import { FaCar } from 'react-icons/fa';
import { FiAlertTriangle, FiArrowLeft, FiCheckCircle, FiDownload, FiEdit, FiExternalLink, FiPrinter, FiSlash, FiStopCircle } from "react-icons/fi";
import { CgFileDocument } from 'react-icons/cg';
import { BiHistory, BiLocationPlus } from 'react-icons/bi';
import "../../styles/RentalAndTenant.css";

import { GetSessionData } from '../../utils/SessionManagement';
import { getMembersByIdApi } from '../../services/AddMemberApi';
const TenantsReviewApplication = ({ setActive, tenantId }) => {
    const [societyId, setSocietyId] = useState("")
    const [tenantData, setTenantData] = useState("")

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
        if (tenantId && societyId) {
            GetTenantDetailsById();
        }
    }, [tenantId, societyId]);

    const GetTenantDetailsById = async () => {
        try {
            const data = await getMembersByIdApi(societyId, tenantId);
            setTenantData(data)

        } catch (error) {
            console.log(error);
        }
    };
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
                                    <h5 className="mb-0 fw-bold">Unit {tenantData.block}-{tenantData.flat_number} Tenant Registration</h5>
                                    <span className="badge bg-warning-subtle text-warning">
                                        {tenantData.status}
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
                                    <div className="col-2">
                                        <img
                                            src='../src/assets/profile.png'
                                            alt="profile"
                                            className="rounded-circle me-3"
                                            width="80"
                                            height="80"
                                        />

                                    </div>
                                    <div className="col-10">
                                        <div className="row g-4">

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">FULL NAME</small>
                                                <div className="fw-semibold">{tenantData.first_name} {tenantData.last_name}</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">DATE OF BIRTH</small>
                                                <div className="fw-semibold">-</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">EMAIL ADDRESS</small>
                                                <div className="fw-semibold">{tenantData.email}</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">PHONE NUMBER</small>
                                                <div className="fw-semibold">{tenantData.mobile}</div>
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
                                        <div className="fw-semibold">{tenantData.start_date}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">LEASE END DATE</small>
                                        <div className="fw-semibold">{tenantData.end_date}</div>
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
                                    <button className='btn btn-sm d-block' style={{ backgroundColor: "#37c759", color: "#fff", borderColor: "#37c759"}}><FiCheckCircle /> Owner Approved Registration</button>
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
        </>
    )
}

export default TenantsReviewApplication