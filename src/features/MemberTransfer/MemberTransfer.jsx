import React, { useState } from "react";
import "../../styles/MemberTransfer.css";
import { Badge } from "../../components/Common/ReusableFunction";

const MemberTransfer = () => {

    const [showConfirm, setShowConfirm] = useState(false);

    const [member] = useState({
        name: "Ruchi Gupta",
        memberId: "MEM-1025",
        mobile: "9876543210",
        email: "ruchi@gmail.com",
        memberType: "Owner",
        currentBlock: "A",
        currentFloor: "1",
        currentFlat: "A-102"
    });

    const [form, setForm] = useState({
        block: "",
        floor: "",
        flat: "",
        transferDate: "",
        reason: "",
        maintenance: true,
        parking: true,
        vehicle: true,
        accessCard: false
    });

    const history = [
        {
            date: "10-Jun-2026",
            from: "A-102",
            to: "B-204",
            by: "Admin"
        },
        {
            date: "15-Jan-2026",
            from: "A-101",
            to: "A-102",
            by: "Manager"
        }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    return (
        <div className="pg">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap">

                <div>

                    <div className="mt-breadcrumb">
                        Members › Transfer Member
                    </div>

                    <h4 className="mt-title">
                        Member Transfer
                        <Badge label="Pending" c="orange" />
                    </h4>

                    <p className="mt-sub">
                        Transfer resident to another flat inside society
                    </p>

                </div>

                <div>

                    <button className="btn-ol me-2">
                        Cancel
                    </button>

                    <button
                        className="btn-ac"
                        onClick={() => setShowConfirm(true)}
                    >
                        Transfer Member
                    </button>

                </div>

            </div>

            <div className="row g-4">

                {/* LEFT */}

                <div className="col-lg-8">

                    {/* MEMBER DETAILS */}

                    <div className="sv-card mb-4">

                        <h5 className="mb-3">
                            Member Details
                        </h5>

                        <div className="row">

                            <div className="col-md-3 text-center">

                                <div className="mt-avatar">
                                    RG
                                </div>

                            </div>

                            <div className="col-md-9">

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label>Name</label>

                                        <input
                                            className="form-control"
                                            value={member.name}
                                            readOnly
                                        />

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label>Member ID</label>

                                        <input
                                            className="form-control"
                                            value={member.memberId}
                                            readOnly
                                        />

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label>Mobile</label>

                                        <input
                                            className="form-control"
                                            value={member.mobile}
                                            readOnly
                                        />

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label>Email</label>

                                        <input
                                            className="form-control"
                                            value={member.email}
                                            readOnly
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label>Member Type</label>

                                        <input
                                            className="form-control"
                                            value={member.memberType}
                                            readOnly
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* TRANSFER DETAILS */}

                    <div className="sv-card mb-4">

                        <h5 className="mb-3">
                            Transfer Details
                        </h5>

                        <div className="row">

                            <div className="col-md-4 mb-3">

                                <label>Current Block</label>

                                <input
                                    className="form-control"
                                    value={member.currentBlock}
                                    readOnly
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>Current Floor</label>

                                <input
                                    className="form-control"
                                    value={member.currentFloor}
                                    readOnly
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>Current Flat</label>

                                <input
                                    className="form-control"
                                    value={member.currentFlat}
                                    readOnly
                                />

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>New Block</label>

                                <select
                                    className="form-select"
                                    name="block"
                                    value={form.block}
                                    onChange={handleChange}
                                >
                                    <option>Select Block</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                </select>

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>New Floor</label>

                                <select
                                    className="form-select"
                                    name="floor"
                                    value={form.floor}
                                    onChange={handleChange}
                                >
                                    <option>Select Floor</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>

                            </div>

                            <div className="col-md-4 mb-3">

                                <label>New Flat</label>

                                <select
                                    className="form-select"
                                    name="flat"
                                    value={form.flat}
                                    onChange={handleChange}
                                >
                                    <option>Select Flat</option>
                                    <option>B-201</option>
                                    <option>B-202</option>
                                    <option>B-203</option>
                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>Transfer Date</label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="transferDate"
                                    value={form.transferDate}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-12">

                                <label>Reason</label>

                                <textarea
                                    rows="3"
                                    className="form-control"
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>
                                        {/* CHECKLIST */}

                    <div className="sv-card mb-4">

                        <h5 className="mb-3">
                            Transfer Checklist
                        </h5>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="maintenance"
                                        checked={form.maintenance}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        No Maintenance Due
                                    </label>

                                </div>

                            </div>

                            <div className="col-md-6 mb-3">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="parking"
                                        checked={form.parking}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Parking Updated
                                    </label>

                                </div>

                            </div>

                            <div className="col-md-6 mb-3">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="vehicle"
                                        checked={form.vehicle}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Vehicle Mapping Updated
                                    </label>

                                </div>

                            </div>

                            <div className="col-md-6 mb-3">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="accessCard"
                                        checked={form.accessCard}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Access Card Updated
                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* DOCUMENTS */}

                    <div className="sv-card">

                        <h5 className="mb-3">
                            Documents
                        </h5>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>
                                    Approval Letter
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>
                                    NOC Document
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-12">

                                <label>
                                    Remarks
                                </label>

                                <textarea
                                    rows="3"
                                    className="form-control"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-4">

                    {/* CURRENT STATUS */}

                    <div className="sv-card mb-4">

                        <h5 className="mb-3">
                            Current Status
                        </h5>

                        <div className="mb-3 d-flex justify-content-between">

                            <span>Current Flat</span>

                            <strong>{member.currentFlat}</strong>

                        </div>

                        <div className="mb-3 d-flex justify-content-between">

                            <span>New Flat</span>

                            <strong>
                                {form.flat || "-"}
                            </strong>

                        </div>

                        <div className="mb-3 d-flex justify-content-between">

                            <span>Status</span>

                            <Badge
                                label="Pending"
                                c="orange"
                            />

                        </div>

                    </div>

                    {/* TRANSFER HISTORY */}

                    <div className="sv-card">

                        <h5 className="mb-3">
                            Transfer History
                        </h5>

                        <table className="table table-sm">

                            <thead>

                                <tr>

                                    <th>Date</th>
                                    <th>From</th>
                                    <th>To</th>

                                </tr>

                            </thead>

                            <tbody>

                                {history.map((item, index) => (

                                    <tr key={index}>

                                        <td>{item.date}</td>

                                        <td>{item.from}</td>

                                        <td>{item.to}</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* CONFIRM MODAL */}

            {showConfirm && (

                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal fade show d-block">

                        <div className="modal-dialog modal-dialog-centered">

                            <div className="modal-content">

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Confirm Member Transfer
                                    </h5>

                                    <button
                                        className="btn-close"
                                        onClick={() => setShowConfirm(false)}
                                    ></button>

                                </div>

                                <div className="modal-body">

                                    <p>

                                        Are you sure you want to transfer

                                        <strong>
                                            {" "}{member.name}
                                        </strong>

                                        from

                                        <strong>
                                            {" "}{member.currentFlat}
                                        </strong>

                                        to

                                        <strong>
                                            {" "}{form.flat || "selected flat"}
                                        </strong>

                                        ?

                                    </p>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn-ac"
                                        onClick={() => {

                                            // TODO:
                                            // Call TransferMember API

                                            setShowConfirm(false);

                                        }}
                                    >
                                        Confirm Transfer
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </>

            )}

        </div>

    );

};

export default MemberTransfer;