import React from 'react'
import "../../styles/Documents.css"

const Documents = () => {
    const docs = [
        { icon: "✈️", title: "NOC for Passport", desc: "Address proof and residency confirmation for passport application or renewal.", meta: "Validity: 6 Months", bg: "#dbeafe" },
        { icon: "🏦", title: "NOC for Bank Loan", desc: "Clearance certificate stating no outstanding society dues for loan processing.", meta: "Processing: 2 Days", bg: "#dbeafe" },
        { icon: "🔎", title: "Tenant Verification NOC", desc: "Approval for renting out flat to new tenants after police verification check.", meta: "Requires: Lease Agreement", bg: "#dcfce7" },
        { icon: "🔄", title: "Ownership Transfer NOC", desc: "Kindly provide required documentation for the official ownership transfer.", meta: "Validity: 6 Months", bg: "#ede9fe" },
    ];
    return (
        // <div className="pg row g-4">
        //   <div className="col-12 col-lg-8">
        //     <div className="sv-card text-start">
        //       <h5 style={{ fontWeight: 800, marginBottom: 4 }}>Letters &amp; Certificates</h5>
        //       <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Issue No Objection Certificates (NOC) and other official documents.</p>
        //       <h6 style={{ fontWeight: 700, marginBottom: 14 }}>📄 Issue New Document</h6>
        //       <div className="row g-3 mb-4">
        //         {docs.map((d, i) => (
        //           <div className="col-6" key={i}>
        //             <div className="noc-card">
        //               <div className="noc-ico" style={{ background: d.bg }}>{d.icon}</div>
        //               <div style={{ fontWeight: 700, marginBottom: 6 }}>{d.title}</div>
        //               <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{d.desc}</div>
        //               <hr className="divider" />
        //               <div className="d-flex justify-content-between align-items-center">
        //                 <span className="tx-accent" style={{ fontSize: 12, fontWeight: 600 }}>{d.meta}</span>
        //                 <span className="tx-accent">→</span>
        //               </div>
        //             </div>
        //           </div>
        //         ))}
        //       </div>
        //       <h6 style={{ fontWeight: 700, marginBottom: 10 }}>🕐 Recently Issued</h6>
        //       <p style={{ fontSize: 13, color: "var(--muted)" }}>No recent documents issued.</p>
        //     </div>
        //   </div>

        //   <div className="col-12 col-lg-4">
        //     <div className="sv-card text-start">
        //       <h6 style={{ fontWeight: 700, marginBottom: 4 }}>Latest Generated</h6>
        //       <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Automatic letterhead &amp; signature applied.</p>
        //       <div className="letter-box mb-3">
        //         <div style={{ textAlign: "center", fontWeight: 800, fontSize: 12, marginBottom: 4 }}>GREEN VALLEY CO-OP SOCIETY</div>
        //         <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 10, marginBottom: 12 }}>Reg No. BOM/HSG/1234 • Palm Beach Road, CA</div>
        //         <div>To: The Branch Manager<br />State Bank of India<br /><br /><strong>Subject:</strong> No Objection Certificate for Loan<br /><br /><span style={{ color: "var(--muted)" }}>This is to certify that Mr. Michael Chen is the registered owner of Flat No. A-501 in our society...</span><br /><br /><span style={{ color: "var(--muted)" }}>The society has no objection to the bank granting a loan against the said flat.</span></div>
        //         <div style={{ textAlign: "right", fontStyle: "italic", fontWeight: 700, marginTop: 12 }}>Approved</div>
        //         <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 10 }}>Secretary Signature</div>
        //       </div>
        //       <div className="bx bx-green w-100 justify-content-center py-2 mb-3" style={{ fontSize: 13 }}>✅ Digitally Signed &amp; Verified</div>
        //       <div className="d-flex gap-2">
        //         <button className="btn-ac flex-grow-1">🖨 Print / PDF</button>
        //         <button className="btn-ol flex-grow-1">Email</button>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div className="pg row g-4 dc-wrap">

            {/* LEFT */}
            <div className="col-12 col-lg-8">
                <div className="sv-card text-start">

                    <h5 className="dc-title">Letters & Certificates</h5>
                    <p className="dc-sub">
                        Issue No Objection Certificates (NOC) and other official documents.
                    </p>

                    <h6 className="dc-section">📄 Issue New Document</h6>

                    <div className="row g-3 mb-4">
                        {docs.map((d, i) => (
                            <div className="col-6" key={i}>
                                <div className="noc-card">

                                    <div className="noc-ico dc-ico" style={{ background: d.bg }}>
                                        {d.icon}
                                    </div>

                                    <div className="dc-card-title">{d.title}</div>
                                    <div className="dc-card-desc">{d.desc}</div>

                                    <hr className="divider" />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="tx-accent dc-meta">{d.meta}</span>
                                        <span className="tx-accent">→</span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <h6 className="dc-section">🕐 Recently Issued</h6>
                    <p className="dc-empty">No recent documents issued.</p>

                </div>
            </div>

            {/* RIGHT */}
            <div className="col-12 col-lg-4">
                <div className="sv-card text-start">

                    <h6 className="dc-side-title">Latest Generated</h6>
                    <p className="dc-side-sub">
                        Automatic letterhead & signature applied.
                    </p>

                    {/* Letter Preview */}
                    <div className="letter-box mb-3">

                        <div className="dc-letter-head">
                            GREEN VALLEY CO-OP SOCIETY
                        </div>

                        <div className="dc-letter-sub">
                            Reg No. BOM/HSG/1234 • Palm Beach Road, CA
                        </div>

                        <div className="dc-letter-body">
                            To: The Branch Manager<br />
                            State Bank of India<br /><br />

                            <strong>Subject:</strong> No Objection Certificate for Loan<br /><br />

                            <span className="dc-muted">
                                This is to certify that Mr. Michael Chen is the registered owner of Flat No. A-501 in our society...
                            </span>
                            <br /><br />

                            <span className="dc-muted">
                                The society has no objection to the bank granting a loan against the said flat.
                            </span>
                        </div>

                        <div className="dc-approved">Approved</div>
                        <div className="dc-sign">Secretary Signature</div>

                    </div>

                    <div className="bx bx-green w-100 justify-content-center py-2 mb-3 dc-verified">
                        ✅ Digitally Signed & Verified
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn-ac flex-grow-1">🖨 Print / PDF</button>
                        <button className="btn-ol flex-grow-1">Email</button>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default Documents