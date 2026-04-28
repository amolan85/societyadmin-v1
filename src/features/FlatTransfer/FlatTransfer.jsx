import React from 'react'
import { Badge } from '../../components/Common/ReusableFunction';
import "../../styles/FlatTransfer.css"

const FlatTransfer = () => {
    const steps = ["Request Details", "No-Dues", "Calculations", "Doc Verify", "Final Approval"];
    const cur = 2;
    return (
        // <div className="pg">
        //     <div className="text-start d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        //         <div>
        //             <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Transfers › #TR-2024-852</div>
        //             <h4 style={{ fontWeight: 800, marginBottom: 4 }}>Transfer Request: Flat A-402 &nbsp;<Badge label="In Progress" c="blue" /></h4>
        //             <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 0 }}>Green Valley Heights • Block A • 4th Floor</p>
        //         </div>
        //         <div className="d-flex gap-2"><button className="btn-ol">Reject Request</button><button className="btn-ac">Proceed to Approval</button></div>
        //     </div>

        //     {/* Stepper */}
        //     <div className="sv-card mb-4 ">
        //         <div className="stepper-row">
        //             {steps.map((s, i) => (
        //                 <div key={s} className="step-col">
        //                     {i < steps.length - 1 && <div className="step-line" style={{ background: i < cur ? "var(--accent)" : "var(--border)" }} />}
        //                     <div className="step-circle" style={{ background: i < cur ? "var(--accent)" : i === cur ? "#fff" : "#f1f5f9", border: i === cur ? "2px solid var(--accent)" : "none", color: i < cur ? "#fff" : i === cur ? "var(--accent)" : "var(--muted)" }}>
        //                         {i < cur ? "✓" : i === cur ? "⊙" : "○"}
        //                     </div>
        //                     <div className="step-lbl" style={{ color: i === cur ? "var(--text)" : "var(--muted)", fontWeight: i === cur ? 700 : 400 }}>{s}</div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>

        //     <div className="row g-4 text-start">
        //         <div className="col-12 col-lg-8">
        //             <div className="sv-card mb-3">
        //                 <div className="d-flex justify-content-between align-items-center mb-3">
        //                     <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Ownership Transfer Details</h6>
        //                     <a href="#!" className="tx-accent" style={{ fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View Full Application</a>
        //                 </div>
        //                 <div className="row g-3">
        //                     {[
        //                         { role: "CURRENT OWNER (SELLER)", name: "Rajesh Kumar", ph: "+91 98765 43210", em: "rajesh.k@gmail.com", init: "RK" },
        //                         { role: "NEW OWNER (BUYER)", name: "Priya Sharma", ph: "+91 91234 56789", em: "priya.s.design@gmail.com", init: "PS" },
        //                     ].map(p => (
        //                         <div className="col-6" key={p.role}>
        //                             <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>{p.role}</div>
        //                             <div className="owner-bg">
        //                                 <div className="d-flex align-items-center gap-3">
        //                                     <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{p.init}</div>
        //                                     <div>
        //                                         <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
        //                                         <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.ph}</div>
        //                                         <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.em}</div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             </div>

        //             <div className="row g-3">
        //                 <div className="col-6">
        //                     <div className="sv-card">
        //                         <div className="d-flex justify-content-between mb-2">
        //                             <h6 style={{ fontWeight: 700, marginBottom: 0 }}>No-Dues Clearance</h6>
        //                             <span className="tx-success" style={{ fontWeight: 600, fontSize: 13 }}>✅ Cleared</span>
        //                         </div>
        //                         {[["💧 Water & Maintenance", "Paid"], ["⚡ Electricity Dues", "Paid"]].map(([l, v]) => (
        //                             <div key={l} className="d-flex justify-content-between mt-2" style={{ fontSize: 13 }}>
        //                                 <span>{l}</span><span className="tx-success" style={{ fontWeight: 600 }}>{v}</span>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 </div>
        //                 <div className="col-6">
        //                     <div className="sv-card">
        //                         <div className="d-flex justify-content-between mb-2">
        //                             <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Transfer Charges</h6>
        //                             <span style={{ fontSize: 11, color: "var(--muted)" }}>Due: Today</span>
        //                         </div>
        //                         {[["Society Transfer Fee", "₹25,000"], ["Stamp Duty", "₹3,500"]].map(([l, v]) => (
        //                             <div key={l} className="d-flex justify-content-between mt-2" style={{ fontSize: 13 }}>
        //                                 <span>{l}</span><span style={{ fontWeight: 700 }}>{v}</span>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="col-12 col-lg-4">
        //             <div className="sv-card">
        //                 <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Approval Workflow</h6>
        //                 {[
        //                     { lbl: "Application Submitted", sub: "Oct 12, 10:30 AM • Rajesh K.", dot: "dot-blu" },
        //                     { lbl: "NDC Generated", sub: "Oct 13, 02:15 PM • System", dot: "dot-blu" },
        //                     { lbl: "Manager Review", sub: "Oct 14, 09:00 AM • James W.", dot: "dot-blu" },
        //                     { lbl: "Committee Approval", sub: "Pending • Awaiting Meeting", dot: "dot-org", pending: true },
        //                 ].map((w, i) => (
        //                     <div key={i} className="d-flex gap-3 align-items-start mb-3">
        //                         <span className={`dot ${w.dot}`} style={{ marginTop: 4 }} />
        //                         <div>
        //                             <div style={{ fontWeight: 600, fontSize: 13, color: w.pending ? "var(--warning)" : "var(--text)" }}>{w.lbl}</div>
        //                             <div style={{ fontSize: 11, color: "var(--muted)" }}>{w.sub}</div>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="pg tr-wrap">

            {/* Header */}
            <div className="text-start d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">

                <div>
                    <div className="tr-breadcrumb">
                        Transfers › #TR-2024-852
                    </div>

                    <h4 className="tr-title">
                        Transfer Request: Flat A-402
                        <Badge label="In Progress" c="blue" />
                    </h4>

                    <p className="tr-sub">
                        Green Valley Heights • Block A • 4th Floor
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn-ol">Reject Request</button>
                    <button className="btn-ac">Proceed to Approval</button>
                </div>
            </div>

            {/* Stepper */}
            <div className="sv-card mb-4">
                <div className="stepper-row">

                    {steps.map((s, i) => (
                        <div key={s} className="step-col">

                            {i < steps.length - 1 && (
                                <div className={`step-line ${i < cur ? "active" : ""}`} />
                            )}

                            <div className={`step-circle 
                ${i < cur ? "done" : ""} 
                ${i === cur ? "current" : ""}`}>

                                {i < cur ? "✓" : i === cur ? "⊙" : "○"}
                            </div>

                            <div className={`step-lbl ${i === cur ? "active" : ""}`}>
                                {s}
                            </div>

                        </div>
                    ))}

                </div>
            </div>

            <div className="row g-4 text-start">

                {/* LEFT */}
                <div className="col-12 col-lg-8">

                    {/* Owners */}
                    <div className="sv-card mb-3">

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="tr-section-title">Ownership Transfer Details</h6>
                            <a href="#!" className="tr-link">View Full Application</a>
                        </div>

                        <div className="row g-3">

                            {[
                                { role: "CURRENT OWNER (SELLER)", name: "Rajesh Kumar", ph: "+91 98765 43210", em: "rajesh.k@gmail.com", init: "RK" },
                                { role: "NEW OWNER (BUYER)", name: "Priya Sharma", ph: "+91 91234 56789", em: "priya.s.design@gmail.com", init: "PS" },
                            ].map(p => (
                                <div className="col-6" key={p.role}>

                                    <div className="tr-role">{p.role}</div>

                                    <div className="owner-bg">
                                        <div className="d-flex align-items-center gap-3">

                                            <div className="tr-avatar">{p.init}</div>

                                            <div>
                                                <div className="tr-name">{p.name}</div>
                                                <div className="tr-muted">{p.ph}</div>
                                                <div className="tr-muted">{p.em}</div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Dues + Charges */}
                    <div className="row g-3">

                        {/* No Dues */}
                        <div className="col-6">
                            <div className="sv-card">

                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="tr-section-title">No-Dues Clearance</h6>
                                    <span className="tx-success tr-ok">✅ Cleared</span>
                                </div>

                                {[["💧 Water & Maintenance", "Paid"], ["⚡ Electricity Dues", "Paid"]]
                                    .map(([l, v]) => (
                                        <div key={l} className="d-flex justify-content-between mt-2 tr-row">
                                            <span>{l}</span>
                                            <span className="tx-success tr-ok">{v}</span>
                                        </div>
                                    ))}

                            </div>
                        </div>

                        {/* Charges */}
                        <div className="col-6">
                            <div className="sv-card">

                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="tr-section-title">Transfer Charges</h6>
                                    <span className="tr-muted-sm">Due: Today</span>
                                </div>

                                {[["Society Transfer Fee", "₹25,000"], ["Stamp Duty", "₹3,500"]]
                                    .map(([l, v]) => (
                                        <div key={l} className="d-flex justify-content-between mt-2 tr-row">
                                            <span>{l}</span>
                                            <span className="tr-bold">{v}</span>
                                        </div>
                                    ))}

                            </div>
                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="col-12 col-lg-4">

                    <div className="sv-card">
                        <h6 className="tr-section-title mb-3">Approval Workflow</h6>

                        {[
                            { lbl: "Application Submitted", sub: "Oct 12, 10:30 AM • Rajesh K.", dot: "dot-blu" },
                            { lbl: "NDC Generated", sub: "Oct 13, 02:15 PM • System", dot: "dot-blu" },
                            { lbl: "Manager Review", sub: "Oct 14, 09:00 AM • James W.", dot: "dot-blu" },
                            { lbl: "Committee Approval", sub: "Pending • Awaiting Meeting", dot: "dot-org", pending: true },
                        ].map((w, i) => (
                            <div key={i} className="d-flex gap-3 align-items-start mb-3">

                                <span className={`dot ${w.dot} tr-dot`} />

                                <div>
                                    <div className={`tr-work-title ${w.pending ? "pending" : ""}`}>
                                        {w.lbl}
                                    </div>
                                    <div className="tr-muted">{w.sub}</div>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    );
}

export default FlatTransfer