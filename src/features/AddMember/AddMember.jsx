import React, { useState, useEffect } from 'react'
import "../../styles/AddMember.css"
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import { GetSessionData } from '../../utils/SessionManagement';
import { AddMemberApi, getMembersApi } from '../../services/AddMemberApi';

const AddMember = () => {
    const [memType, setMemType] = useState("Owner");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [wing, setWing] = useState("")
    const [flat, setFlat] = useState("")
    const [floor, setFloor] = useState("")
    const [residency, setResidency] = useState("")
    const [date, setDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [allMembers, setAllMembers] = useState([])

    useEffect(() => {
        SessionData()

    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(flats.user_id)
        setFloor(flats.floor)
        getMembers(flats.society_id)
    }

    //function for get members
    const getMembers = async (societyId) => {
        const data = await getMembersApi(societyId)
        setAllMembers(data.members)
    }


    const per = 5, total = Math.ceil(allMembers.length / per);
    const rows = allMembers.slice((page - 1) * per, page * per);

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
            const data = await AddMemberApi(societyId, userId, firstName, lastName, mobileNo, emailId, wing, flat, floor, memType, residency, date)
            console.log("Form Submitted ✅");
            setShow(false)
        }
    };

    return (
        <>
            <div className="pg sa-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="sa-title">Members</h4>
                    <div className="d-flex gap-2">
                        <button className='btn btn-sm btn-primary' onClick={() => setShow(true)}>Add Member</button>
                        <button className="btn-ol">⬇ Export</button>
                    </div>
                </div>


                {/* Table */}
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                                        .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.first_name}</td>
                                        <td className="sa-name">{s.last_name}</td>
                                        <td className="sa-name">{s.mobile}</td>
                                        <td className="sa-name">{s.email}</td>
                                        <td className="sa-name">{s.block}</td>
                                        <td className="sa-name">{s.flat_number}</td>
                                        <td ><Badge label={s.occupancy_type} c="gray" /></td>
                                        <td><Badge label={s.residencyStatus} c="orange" /></td>
                                        <td className="sa-name">{s.start_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        total={total}
                        onChange={setPage}
                    />
                </div>
            </div>


            {show && (
                <>
                    {/* ✅ Backdrop (THIS IS IMPORTANT) */}
                    <div className="modal-backdrop fade show"></div>

                    {/* ✅ Modal */}
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Add New Member</h1>

                                    {/* ❌ remove data-bs-dismiss */}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShow(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="pg d-flex justify-content-center am-wrap">
                                        <div className="text-start am-card">

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb" >Select Wing</label>
                                                        {errors.wing && <span className='text-danger mx-2 '>{errors.wing}</span>}
                                                    </div>
                                                    <select className={`form-select ${errors.wing ? "error-input" : ""}`}
                                                        value={wing}
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
                                                        {["101", "102", "103"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>


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


                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Residency Status</label>
                                                    <select className="form-select"
                                                        value={residency}
                                                        onChange={(e) => setResidency(e.target.value)}>
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


                                            <div className="form-check mb-4">
                                                <input className="form-check-input" type="checkbox" defaultChecked />
                                                <label className="form-check-label am-check">
                                                    Mark as Primary Member for this unit
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Member</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AddMember