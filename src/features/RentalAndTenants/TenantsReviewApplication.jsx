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
    const [tenantData, setTenantData] = useState(null)

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
            const res = await getMembersByIdApi(societyId, tenantId);
            // getMembersByIdApi already unwraps response.data.data,
            // so `res` IS the member object itself
            if (res) {
                setTenantData(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDuration = (start, end) => {
        if (!start || !end) return "-";

        const startDate = new Date(start);
        const endDate = new Date(end);

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();

        if (days < 0) {
            months--;

            const lastMonthDays = new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                0
            ).getDate();

            days += lastMonthDays;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years > 0) {
            return `${years} year${years > 1 ? "s" : ""}`;
        }

        if (months > 0) {
            return `${months} month${months > 1 ? "s" : ""}`;
        }

        return `${days} day${days > 1 ? "s" : ""}`;
    };

    // The relevant flat (with owner/occupancy/documents) lives in flats[0]
    const flat = tenantData?.flats?.[0] || {};
    const owner = flat.owner || {};
    const occupancy = flat.occupancy || {};
    const documents = flat.documents || [];

    return (
        <>
            <div className="container-fluid min-vh-100">

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">

                        <div className="d-flex  gap-3">
                            <div className="icon-box mt-1">
                                <FiArrowLeft size={20} className="text-dark" />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <h5 className="mb-0 fw-bold">Unit {flat.block}-{flat.flat_number} Tenant Registration</h5>
                                    <span className="badge bg-warning-subtle text-warning">
                                        {occupancy.occupant_status}
                                    </span>
                                </div>

                                <div className="text-muted text-start small mt-2">
                                    <div className="mb-1">
                                        submitted on 28 Feb 2024 by {owner.owner_name} (Owner)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-lg-0">
                            <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setActive("rentals")}>Back</button>
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
                                            src={tenantData?.profile_url || '../src/assets/profile.png'}
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
                                                <div className="fw-semibold">{tenantData?.first_name} {tenantData?.last_name}</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">DATE OF BIRTH</small>
                                                <div className="fw-semibold">{tenantData?.dob || "-"}</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">EMAIL ADDRESS</small>
                                                <div className="fw-semibold">{tenantData?.email}</div>
                                            </div>

                                            <div className="col-md-6">
                                                <small className="text-muted d-block">PHONE NUMBER</small>
                                                <div className="fw-semibold">{tenantData?.mobile}</div>
                                            </div>

                                            <div className="col-md-12">
                                                <small className="text-muted d-block">PERMANENT ADDRESS</small>
                                                <div className="fw-semibold">
                                                    {[tenantData?.address_line, tenantData?.city, tenantData?.state]
                                                        .filter(Boolean)
                                                        .join(", ") || "-"}
                                                </div>
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
                                        <small className="text-muted d-block">LEASE START DATE</small>
                                        <div className="fw-semibold">{occupancy.start_date || "-"}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">LEASE END DATE</small>
                                        <div className="fw-semibold">{occupancy.end_date || "-"}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">DURATION</small>
                                        <div className="fw-semibold">{getDuration(occupancy.start_date, occupancy.end_date)}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">MONTHLY RENT</small>
                                        <div className="fw-semibold">{occupancy.monthly_rent ?? "-"}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">SECURITY DEPOSIT</small>
                                        <div className="fw-semibold">{occupancy.security_deposit ?? "-"}</div>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">TOTAL OCCUPANTS</small>
                                        <div className="fw-semibold">{flat.current_tenants?.length ?? "-"}</div>
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
                                    src={owner.owner_profile_url || '../src/assets/profile.png'}
                                    alt="profile"
                                    className="rounded-circle me-3"
                                    width="45"
                                    height="45"
                                />

                                <div>
                                    <div className="fw-semibold">{owner.owner_name}</div>
                                    <small className="text-muted">Unit {flat.block}-{flat.flat_number} Owner</small>
                                </div>

                            </div>
                            <div className="card-body">

                                <div className="mb-4">
                                    <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                        Contact Number
                                    </small>
                                    <div className="fw-semibold">{owner.owner_mobile || "-"}</div>
                                </div>

                                <div className="mb-4">
                                    <small className="text-uppercase text-muted fw-semibold d-block mb-1">
                                        Email Address
                                    </small>
                                    <div className="fw-semibold text-break">
                                        {owner.owner_email || "-"}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        className='btn btn-sm d-block'
                                        style={{ backgroundColor: "#37c759", color: "#fff", borderColor: "#37c759" }}
                                    >
                                        <FiCheckCircle /> Owner Approved Registration
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="card shadow-sm border mt-3">
                            <div className="card-header bg-white fw-semibold">
                                Verification Checklist
                            </div>

                            <div className="card-body">
                                {[
                                    { label: "Police Verification", type: "police_noc" },
                                    { label: "Rent Agreement", type: "rent_agreement" },
                                ].map((doc, index) => {
                                    const matchedDoc = documents.find(
                                        (item) => item.document_type === doc.type
                                    );
                                    const isChecked = !!matchedDoc?.url;

                                    return (
                                        <div className="form-check mb-2" key={index}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                                id={doc.type}
                                            />

                                            <label className="form-check-label" htmlFor={doc.type}>
                                                {doc.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default TenantsReviewApplication