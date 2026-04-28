import React, { useState } from 'react'
import "../../styles/AddMember.css"

const AddMember = () => {
    const [memType, setMemType] = useState("Owner");
    return (
        // <div className="pg d-flex justify-content-center">
        //     <div className="sv-card text-start" style={{ maxWidth: 580, width: "100%" }}>
        //         <div className="d-flex justify-content-between align-items-center mb-4">
        //             <h5 style={{ fontWeight: 800, marginBottom: 0 }}>Add New Member</h5>
        //             <button style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--muted)" }}>✕</button>
        //         </div>

        //         <div className="row g-3 mb-3 ">
        //             <div className="col-6">
        //                 <label className="sv-lb">Select Wing</label>
        //                 <select className="sv-sel">
        //                     <option>Select Wing</option>
        //                     {["Wing A", "Wing B", "Wing C"].map(w => <option key={w}>{w}</option>)}
        //                 </select>
        //             </div>
        //             <div className="col-6">
        //                 <label className="sv-lb">Flat / Unit Number</label>
        //                 <select className="sv-sel"><option>Select Unit</option></select>
        //             </div>
        //         </div>

        //         <label className="sv-lb">Membership Type</label>
        //         <div className="d-flex mb-3 p-1" style={{ background: "#f1f5f9", borderRadius: 30 }}>
        //             {["Owner", "Tenant", "Family Member"].map(t => (
        //                 <button key={t} onClick={() => setMemType(t)} style={{
        //                     flex: 1, padding: "8px 0", border: "none", borderRadius: 26, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        //                     background: memType === t ? "var(--accent)" : "transparent", color: memType === t ? "#fff" : "var(--muted)"
        //                 }}>
        //                     {t}
        //                 </button>
        //             ))}
        //         </div>

        //         <div className="row g-3 mb-3">
        //             <div className="col-6"><label className="sv-lb">First Name</label><input className="sv-in" placeholder="Enter First Name" /></div>
        //             <div className="col-6"><label className="sv-lb">Last Name</label><input className="sv-in" placeholder="Enter Last Name" /></div>
        //         </div>

        //         <div className="row g-3 mb-3">
        //             <div className="col-6">
        //                 <label className="sv-lb">Phone Number</label>
        //                 <div className="d-flex">
        //                     <span style={{ padding: "9px 12px", background: "#f8fafc", border: "1px solid var(--border)", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 13, color: "var(--muted)" }}>+91</span>
        //                     <input className="sv-in" placeholder="98765 43210" style={{ borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
        //                 </div>
        //             </div>
        //             <div className="col-6"><label className="sv-lb">Email Address</label><input className="sv-in" placeholder="Enter Email Address" /></div>
        //         </div>

        //         <div className="row g-3 mb-3">
        //             <div className="col-6">
        //                 <label className="sv-lb">Residency Status</label>
        //                 <select className="sv-sel"><option>Select Status</option><option>Resident</option><option>Non-Resident</option></select>
        //             </div>
        //             <div className="col-6"><label className="sv-lb">Move-in Date</label><input className="sv-in" type="date" /></div>
        //         </div>

        //         <div className="form-check mb-4">
        //             <input className="form-check-input" type="checkbox" defaultChecked />
        //             <label className="form-check-label" style={{ fontSize: 13 }}>Mark as Primary Member for this unit</label>
        //         </div>
        //         <div className="d-flex gap-2 justify-content-end">
        //             <button className="btn-ol">Cancel</button>
        //             <button className="btn-ac px-4">Add Member</button>
        //         </div>
        //     </div>
        // </div>
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
                        <label className="sv-lb">Select Wing</label>
                        <select className="form-select">
                            <option>Select Wing</option>
                            {["Wing A", "Wing B", "Wing C"].map(w => (
                                <option key={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-6">
                        <label className="sv-lb">Flat / Unit Number</label>
                        <select className="form-select">
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
                        <label className="sv-lb">First Name</label>
                        <input className="sv-in" placeholder="Enter First Name" />
                    </div>

                    <div className="col-6">
                        <label className="sv-lb">Last Name</label>
                        <input className="sv-in" placeholder="Enter Last Name" />
                    </div>
                </div>

                {/* Contact */}
                <div className="row g-3 mb-3">

                    <div className="col-6">
                        <label className="sv-lb">Phone Number</label>

                        <div className="d-flex">
                            <span className="am-code">+91</span>
                            <input className="sv-in am-phone" placeholder="98765 43210" />
                        </div>
                    </div>

                    <div className="col-6">
                        <label className="sv-lb">Email Address</label>
                        <input className="sv-in" placeholder="Enter Email Address" />
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
                        <label className="sv-lb">Move-in Date</label>
                        <input className="sv-in" type="date" />
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
                    <button className="btn-ac px-4">Add Member</button>
                </div>

            </div>
        </div>
    );
}

export default AddMember