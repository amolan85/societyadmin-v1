import React from 'react'
import "../../styles/Rules.css"
import { Badge } from '../../components/Common/ReusableFunction';

const Rules = () => {
    const rules = [
        { title: "Quiet Hours Policy", sub: "10:00 PM to 6:00 AM daily", scope: "Entire Society", penalty: "₹500 / Offense", type: "BY-LAW" },
        { title: "Visitor Parking Limit", sub: "Max 4 hours without permit", scope: "Visitor Lot A & B", penalty: "Tow + ₹1500", type: "RULE" },
        { title: "Balcony Guidelines", sub: "No hanging clothes, BBQ grills", scope: "Block C, Wing 1", penalty: "Warning", type: "BY-LAW" },
        { title: "Pet Clean-up Policy", sub: "Immediate removal required", scope: "Entire Society", penalty: "₹150 Fine", type: "BY-LAW" },
        { title: "Renovation Hours", sub: "Mon-Fri 9AM-5PM only", scope: "Entire Society", penalty: "Stop Work Order", type: "RULE" },
    ];
    return (
        // <div className="pg row g-4">
        //     <div className="col-12 col-lg-8">
        //         <div className="row g-3 mb-4">
        //             {[["Total Slots", "512", "↑ 2 added this month", "tx-success"], ["Violation Notices", "18", "Pending review: 5", "tx-danger"], ["Penalty Collection", "₹21,250", "Avg. penalty: ₹500", "tx-muted"]].map(([l, v, m, mc]) => (
        //                 <div className="col-4" key={l}>
        //                     <div className="stat-card">
        //                         <div className="s-label">{l}</div>
        //                         <div className="s-val">{v}</div>
        //                         <div className={`${mc} mt-1`} style={{ fontSize: 12 }}>{m}</div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>

        //         <div className="sv-card p-0 overflow-hidden text-start">
        //             <div className="d-flex justify-content-between align-items-center px-4 py-3">
        //                 <h6 style={{ fontWeight: 800, marginBottom: 0 }}>Active Rules &amp; By-laws</h6>
        //                 <div className="d-flex gap-2">
        //                     <button className="btn-ol py-1 px-3" style={{ fontSize: 12 }}>🔽 Filter</button>
        //                     <button className="btn-ol py-1 px-3" style={{ fontSize: 12 }}>⬇ Export</button>
        //                 </div>
        //             </div>
        //             <div style={{ overflowX: "auto" }}>
        //                 <table className="sv-tbl">
        //                     <thead><tr><th>RULE TITLE</th><th>APPLICABILITY</th><th>PENALTY</th><th>TYPE</th></tr></thead>
        //                     <tbody>
        //                         {rules.map((r, i) => (
        //                             <tr key={i}>
        //                                 <td><div style={{ fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{r.sub}</div></td>
        //                                 <td style={{ color: "var(--muted)" }}>📍 {r.scope}</td>
        //                                 <td style={{ fontWeight: 500 }}>{r.penalty}</td>
        //                                 <td><Badge label={r.type} c={r.type === "BY-LAW" ? "blue" : "gray"} /></td>
        //                             </tr>
        //                         ))}
        //                     </tbody>
        //                 </table>
        //             </div>
        //             <div style={{ textAlign: "center", padding: "12px 0" }}>
        //                 <a href="#!" className="tx-accent" style={{ fontWeight: 600, fontSize: 13, textDecoration: "none" }}>View All Rules →</a>
        //             </div>
        //         </div>
        //     </div>

        //     <div className="col-12 col-lg-4">
        //         <div className="sv-card mb-3">
        //             <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Management Actions</h6>
        //             {[["➕", "#dbeafe", "Create By-law", "Draft new regulation"], ["🗺", "#dcfce7", "Attach to Block/Wing", "Assign rules to areas"], ["⚠️", "#fee2e2", "Define Penalties", "Set fines & consequences"]].map(([ic, bg, lb, sub]) => (
        //                 <button key={lb} className="qa mb-2">
        //                     <div className="qa-ico" style={{ background: bg }}>{ic}</div>
        //                     <div style={{ flex: 1 }}>
        //                         <div style={{ fontWeight: 600, fontSize: 13 }}>{lb}</div>
        //                         <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
        //                     </div>
        //                     <span style={{ color: "var(--muted)" }}>›</span>
        //                 </button>
        //             ))}
        //         </div>
        //         <div className="sv-card">
        //             <div className="d-flex justify-content-between mb-3">
        //                 <h6 style={{ fontWeight: 700, marginBottom: 0 }}>Recent Violations</h6>
        //                 <a href="#!" className="tx-accent" style={{ fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View All</a>
        //             </div>
        //             {[["dot-red", "Noise Complaint", "Unit 402 • 2 hours ago"], ["dot-org", "Improper Parking", "Guest Lot • 5 hours ago"], ["dot-grn", "Trash Disposal", "Resolved • Yesterday"]].map(([d, l, s]) => (
        //                 <div key={l} className="d-flex align-items-center gap-2 mb-2 text-start">
        //                     <span className={`dot ${d}`} />
        //                     <div>
        //                         <div style={{ fontWeight: 600, fontSize: 13 }}>{l}</div>
        //                         <div style={{ fontSize: 11, color: "var(--muted)" }}>{s}</div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </div>
            <div className="pg row g-4 rl-wrap">

      {/* LEFT */}
      <div className="col-12 col-lg-8">

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            ["Total Slots", "512", "↑ 2 added this month", "tx-success"],
            ["Violation Notices", "18", "Pending review: 5", "tx-danger"],
            ["Penalty Collection", "₹21,250", "Avg. penalty: ₹500", "tx-muted"]
          ].map(([l, v, m, mc]) => (
            <div className="col-4" key={l}>
              <div className="stat-card">
                <div className="s-label">{l}</div>
                <div className="s-val">{v}</div>
                <div className={`rl-meta ${mc}`}>{m}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="sv-card p-0 overflow-hidden text-start">

          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <h6 className="rl-title">Active Rules & By-laws</h6>

            <div className="d-flex gap-2">
              <button className="btn-ol rl-btn">🔽 Filter</button>
              <button className="btn-ol rl-btn">⬇ Export</button>
            </div>
          </div>

          <div className="rl-table-wrap">
            <table className="sv-tbl">
              <thead>
                <tr>
                  <th>RULE TITLE</th>
                  <th>APPLICABILITY</th>
                  <th>PENALTY</th>
                  <th>TYPE</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((r, i) => (
                  <tr key={i}>

                    <td>
                      <div className="rl-rule-title">{r.title}</div>
                      <div className="rl-sub">{r.sub}</div>
                    </td>

                    <td className="rl-muted">
                      📍 {r.scope}
                    </td>

                    <td className="rl-penalty">
                      {r.penalty}
                    </td>

                    <td>
                      <Badge
                        label={r.type}
                        c={r.type === "BY-LAW" ? "blue" : "gray"}
                      />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rl-footer">
            <a href="#!" className="rl-link">
              View All Rules →
            </a>
          </div>

        </div>
      </div>

      {/* RIGHT */}
      <div className="col-12 col-lg-4">

        {/* Actions */}
        <div className="sv-card mb-3">
          <h6 className="rl-side-title">Management Actions</h6>

          {[
            ["➕", "#dbeafe", "Create By-law", "Draft new regulation"],
            ["🗺", "#dcfce7", "Attach to Block/Wing", "Assign rules to areas"],
            ["⚠️", "#fee2e2", "Define Penalties", "Set fines & consequences"]
          ].map(([ic, bg, lb, sub]) => (
            <button key={lb} className="qa mb-2">

              <div className="qa-ico rl-qa-ico" style={{ background: bg }}>
                {ic}
              </div>

              <div className="rl-qa-text">
                <div className="rl-qa-title">{lb}</div>
                <div className="rl-qa-sub">{sub}</div>
              </div>

              <span className="rl-arrow">›</span>

            </button>
          ))}
        </div>

        {/* Violations */}
        <div className="sv-card">
          <div className="d-flex justify-content-between mb-3">
            <h6 className="rl-side-title">Recent Violations</h6>
            <a href="#!" className="rl-link">View All</a>
          </div>

          {[
            ["dot-red", "Noise Complaint", "Unit 402 • 2 hours ago"],
            ["dot-org", "Improper Parking", "Guest Lot • 5 hours ago"],
            ["dot-grn", "Trash Disposal", "Resolved • Yesterday"]
          ].map(([d, l, s]) => (
            <div key={l} className="d-flex align-items-center gap-2 mb-2 text-start">

              <span className={`dot ${d}`} />

              <div>
                <div className="rl-violation-title">{l}</div>
                <div className="rl-sub">{s}</div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
    );
}

export default Rules