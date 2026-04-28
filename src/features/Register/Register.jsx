import React from 'react'
import "../../styles/Register.css"

const Register = () => {
      const regs = [
    { icon: "👥", title: "Member Register", val: "1,245", sub: "Total active members", meta: "↑ 12 this week", mc: "tx-success", bg: "#dbeafe" },
    { icon: "🏠", title: "Unit Register", val: "420", sub: "95% Occupancy", meta: "20 Vacant", mc: "", bg: "#f3e8ff" },
    { icon: "🚗", title: "Parking Register", val: "512", sub: "Slots allocated", meta: "14 Guest slots open", mc: "", bg: "#ffedd5" },
    { icon: "🎪", title: "Vendor Register", val: "28", sub: "Active service providers", meta: "3 Pending approval", mc: "", bg: "#dcfce7" },
    { icon: "📦", title: "Asset Register", val: "$1.2M", sub: "Total Asset Value", meta: "85 Items Tracked", mc: "", bg: "#fef9c3" },
    { icon: "😟", title: "Complaint Register", val: "12", sub: "Open issues", meta: "3 High Priority", mc: "tx-danger", bg: "#fee2e2" },
  ];
 return (
    // <div className="pg">
    //   <div className="d-flex justify-content-between align-items-center mb-4">
    //     <div>
    //       <h4 style={{ fontWeight: 800, marginBottom: 2 }}>Registers Overview</h4>
    //       <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 0 }}>Quick access to all management modules</p>
    //     </div>
    //     <button className="btn-ac">+ New Entry</button>
    //   </div>
    //   <div className="row g-3">
    //     {regs.map((r, i) => (
    //       <div className="col-12 col-md-6 col-lg-4" key={i}>
    //         <div className="sv-card">
    //           <div className="d-flex justify-content-between align-items-start mb-3">
    //             <div style={{ width: 52, height: 52, background: r.bg, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 24 }}>{r.icon}</div>
    //             <span style={{ cursor: "pointer", color: "var(--muted)" }}>⋯</span>
    //           </div>
    //           <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
    //           <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4 }}>{r.val}</div>
    //           <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{r.sub}</div>
    //           <hr className="divider" />
    //           <div className="d-flex justify-content-between align-items-center">
    //             <span className={`${r.mc}`} style={{ fontSize: 12, fontWeight: 600 }}>{r.meta}</span>
    //             <a href="#!" className="tx-accent" style={{ fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View All →</a>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
       <div className="pg rg-wrap">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h4 className="rg-title">Registers Overview</h4>
          <p className="rg-sub">
            Quick access to all management modules
          </p>
        </div>

        <button className="btn-ac">+ New Entry</button>
      </div>

      {/* Cards */}
      <div className="row g-3">

        {regs.map((r, i) => (
          <div className="col-12 col-md-6 col-lg-4" key={i}>

            <div className="sv-card">

              {/* Top */}
              <div className="d-flex justify-content-between align-items-start mb-3">

                <div className="rg-icon" style={{ background: r.bg }}>
                  {r.icon}
                </div>

                <span className="rg-menu">⋯</span>
              </div>

              {/* Content */}
              <div className="rg-card-title">{r.title}</div>
              <div className="rg-value">{r.val}</div>
              <div className="rg-desc">{r.sub}</div>

              <hr className="divider" />

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center">
                <span className={`rg-meta ${r.mc}`}>{r.meta}</span>

                <a href="#!" className="rg-link">
                  View All →
                </a>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Register