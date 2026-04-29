import React, { useState } from 'react'
import "../../styles/AddMember.css"
import { AddMemberApi } from './AddMemberApi';

const AddMember = () => {
    const [memType, setMemType] = useState("Owner");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [wing, setWing] = useState("")
    const [flat, setFlat] = useState("")
    const [residency, setResidency] = useState("")
    const [date, setDate] = useState("")
    const [errors, setErrors] = useState({});

    //function for validation
    const validateForm = () => {
        let errors = {};

        if (!firstName) {
            errors.firstName = "required";
        }

        if (!lastName) {
            errors.lastName = "required";
        }

        if (!emailId) {
            errors.emailId = "required";
        } else if (!/\S+@\S+\.\S+/.test(emailId)) {
            errors.emailId = "Invalid email";
        }

        if (!mobileNo) {
            errors.mobileNo = "required";
        } else if (!/^[0-9]{10}$/.test(mobileNo)) {
            errors.mobileNo = "Invalid mobile no.";
        }

        if (!wing) {
            errors.wing = "required";
        }

        if (!flat) {
            errors.flat = "required";
        }
        if (!date) {
            errors.date = "required";
        }
        return errors;
    };

    //submit function for add member
    const handleSubmit = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const data = await AddMemberApi(firstName, lastName, mobileNo, emailId, wing, flat, memType, residency, date)
            console.log("Form Submitted ✅");
        }
    };

    return (
        <div className="pg d-flex justify-content-center am-wrap">
            <div className="sv-card text-start am-card">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="am-title">Add New Member</h5>
                    <button className="am-close">✕</button>
                </div>

                {/* Wing + Unit */}
                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <div className='d-flex'>
                            <label className="sv-lb" >Select Wing</label>
                            {errors.wing && <span className='text-danger mx-2 '>{errors.wing}</span>}
                        </div>
                        <select className={`form-select ${errors.wing ? "error-input" : ""}`} value={wing}
                            onChange={(e) => setWing(e.target.value)}>
                            <option>Select Wing</option>
                            {["Wing A", "Wing B", "Wing C"].map(w => (
                                <option key={w} >{w}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-6">
                        <div className='d-flex'>
                            <label className="sv-lb">Flat / Unit Number</label>
                            {errors.flat && <span className='text-danger mx-2 '>{errors.flat}</span>}
                        </div>
                        <select className={`form-select  ${errors.flat ? "error-input" : ""}`} value={flat} onChange={(e) => setFlat(e.target.value)}>
                            <option>Select Unit</option>
                        </select>
                    </div>
                </div>

                {/* Membership Type */}
                <label className="sv-lb">Membership Type</label>
                <div className="am-type-wrap mb-3">
                    {["Owner", "Tenant", "Family Member"].map(t => (
                        <button
                            key={t}
                            onClick={() => setMemType(t)}
                            className={`am-type-btn ${memType === t ? "active" : ""}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Name */}
                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <div className='d-flex'><label className="sv-lb">First Name</label>
                            {errors.firstName && <span className='text-danger mx-2 '>{errors.firstName}</span>}</div>
                        <input className={`sv-in ${errors.firstName ? "error-input" : ""}`} placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="col-6">
                        <div className='d-flex'>
                            <label className="sv-lb">Last Name</label>
                            {errors.lastName && <span className='text-danger mx-2 '>{errors.lastName}</span>}
                        </div>
                        <input className={`sv-in ${errors.lastName ? "error-input" : ""}`} placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                </div>

                {/* Contact */}
                <div className="row g-3 mb-3">
                    <div className="col-6">
                        <div className='d-flex'>
                            <label className='sv-lb'>Phone Number</label>
                            {errors.mobileNo && <span className='text-danger mx-2 '>{errors.mobileNo}</span>}
                        </div>

                        <div className="d-flex">
                            <span className={`am-code ${errors.mobileNo ? "error-input" : ""}`}>+91</span>
                            <input
                                className={`sv-in am-phone ${errors.mobileNo ? "error-input" : ""}`}
                                // className={`form-control ${errors.mobileNo ? "is-invalid" : ""}`}
                                type='text'
                                maxLength={10}
                                placeholder="98765 43210"
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    <div className="col-6">
                        <div className='d-flex'>
                            <label className="sv-lb">Email Address</label>
                            {errors.emailId && <span className='text-danger mx-2 '>{errors.emailId}</span>}
                        </div>
                        <input className={`sv-in ${errors.emailId ? "error-input" : ""}`} placeholder="Enter Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                    </div>

                </div>

                {/* Status */}
                <div className="row g-3 mb-3">

                    <div className="col-6">
                        <label className="sv-lb">Residency Status</label>
                        <select className="form-select">
                            <option>Select Status</option>
                            <option>Resident</option>
                            <option>Non-Resident</option>
                        </select>
                    </div>

                    <div className="col-6">
                        <div className='d-flex'>
                            <label className="sv-lb">Move-in Date</label>
                            {errors.date && <span className='text-danger mx-2'>{errors.date}</span>}
                        </div>
                        <input className={`sv-in ${errors.date ? "error-input" : ""}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                </div>

                {/* Checkbox */}
                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                    <label className="form-check-label am-check">
                        Mark as Primary Member for this unit
                    </label>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 justify-content-end">
                    <button className="btn-ol">Cancel</button>
                    <button className="btn-ac px-4" onClick={handleSubmit}>Add Member</button>
                </div>

            </div>
        </div>
    );
}

export default AddMember