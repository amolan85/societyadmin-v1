import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/Complaints.css"
import { getComplaintsApi } from './ComplaintsApi';

const Complaints = () => {
  const [page, setPage] = useState(1);
  const [allComplaints, setAllComplaints] = useState([])
  const all = [
    { id: "#C-1042", title: "Lift B not working", unit: "A-201", cat: "Maintenance", pri: "High", st: "Open", sc: "red", time: "2h ago" },
    { id: "#C-1041", title: "Water leakage in corridor", unit: "B-305", cat: "Plumbing", pri: "Medium", st: "In Progress", sc: "orange", time: "5h ago" },
    { id: "#C-1040", title: "Gym AC not functioning", unit: "Common", cat: "Electrical", pri: "Low", st: "Open", sc: "red", time: "1d ago" },
    { id: "#C-1039", title: "Parking slot encroachment", unit: "B-101", cat: "Parking", pri: "Medium", st: "Resolved", sc: "green", time: "2d ago" },
    { id: "#C-1038", title: "Noisy neighbours after 10 PM", unit: "C-402", cat: "Noise", pri: "Medium", st: "Resolved", sc: "green", time: "3d ago" },
    { id: "#C-1037", title: "Broken gym equipment", unit: "Common", cat: "Maintenance", pri: "Low", st: "Open", sc: "red", time: "3d ago" },
    { id: "#C-1036", title: "Leaking water pipe – roof", unit: "D-501", cat: "Plumbing", pri: "High", st: "In Progress", sc: "orange", time: "4d ago" },
    { id: "#C-1035", title: "Gate door hinge broken", unit: "Gate 2", cat: "Maintenance", pri: "Low", st: "Resolved", sc: "green", time: "5d ago" },
  ];

  useEffect(() => {
    getComplaints()
  }, [])

  //function for get complaints
  const getComplaints = async () => {
    const data = await getComplaintsApi()
    setAllComplaints(data)
  }

  const per = 5, total = Math.ceil(all.length / per);
  const rows = all.slice((page - 1) * per, page * per);

  // const per = 5, total = Math.ceil(allComplaints.length / per);
  // const rows = allComplaints.slice((page - 1) * per, page * per);

  return (
    // <div className="pg">
    //     <div className="d-flex justify-content-between align-items-center mb-4 text-start">
    //         <div><h4 style={{ fontWeight: 800, marginBottom: 2 }}>Complaints</h4><p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 0 }}>Manage and track all society complaints</p></div>
    //         <button className="btn-ac">+ Log Complaint</button>
    //     </div>

    //     <div className="row g-3 mb-4">
    //         {[["14", "Total Open", "tile-red"], ["6", "In Progress", "tile-org"], ["3", "Resolved Today", "tile-grn"], ["2.4d", "Avg Resolution", "tile-blu"]].map(([v, l, cls]) => (
    //             <div className="col-6 col-md-3" key={l}>
    //                 <div className={`tile ${cls}`}><div className="tile-val">{v}</div><div className="tile-lbl">{l}</div></div>
    //             </div>
    //         ))}
    //     </div>

    //     <div className="sv-card p-0 overflow-hidden">
    //         <div style={{ overflowX: "auto" }}>
    //             <table className="sv-tbl">
    //                 <thead><tr>{["ID", "Title", "Unit", "Category", "Priority", "Status", "Time"].map(h => <th key={h}>{h}</th>)}</tr></thead>
    //                 <tbody>
    //                     {rows.map(c => (
    //                         <tr key={c.id} className='text-start'>
    //                             <td className="tx-accent" style={{ fontWeight: 600 }}>{c.id}</td>
    //                             <td style={{ fontWeight: 600 }}>{c.title}</td>
    //                             <td style={{ color: "var(--muted)" }}>{c.unit}</td>
    //                             <td><Badge label={c.cat} c="gray" /></td>
    //                             <td><Badge label={c.pri} c={c.pri === "High" ? "red" : c.pri === "Medium" ? "orange" : "gray"} /></td>
    //                             <td><Badge label={c.st} c={c.sc} /></td>
    //                             <td style={{ color: "var(--muted)" }}>{c.time}</td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //         <Pagination page={page} total={total} onChange={p => { setPage(p); }} />
    //     </div>
    // </div>
    <div className="pg cp-wrap">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 text-start">
        <div>
          <h4 className="cp-title">Complaints</h4>
          <p className="cp-sub">
            Manage and track all society complaints
          </p>
        </div>

        <button className="btn-ac">+ Log Complaint</button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          ["14", "Total Open", "tile-red"],
          ["6", "In Progress", "tile-org"],
          ["3", "Resolved Today", "tile-grn"],
          ["2.4d", "Avg Resolution", "tile-blu"]
        ].map(([v, l, cls]) => (
          <div className="col-6 col-md-3" key={l}>
            <div className={`tile ${cls}`}>
              <div className="tile-val">{v}</div>
              <div className="tile-lbl">{l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="sv-card p-0 overflow-hidden">
        <div className="cp-table-wrap">
          <table className="sv-tbl">
            <thead>
              <tr>
                {["ID", "Title", "Unit", "Category", "Priority", "Status", "Time"]
                  .map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>

            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="text-start">
                  <td className="tx-accent cp-id">{c.id}</td>
                  <td className="cp-title-cell">{c.title}</td>
                  <td className="cp-muted">{c.unit}</td>
                  <td>
                    <Badge label={c.cat} c="gray" />
                  </td>
                  <td>
                    <Badge
                      label={c.pri}
                      c={
                        c.pri === "High"
                          ? "red"
                          : c.pri === "Medium"
                            ? "orange"
                            : "gray"
                      }
                    />
                  </td>
                  <td>
                    <Badge label={c.st} c={c.sc} />
                  </td>
                  <td className="cp-muted">{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          total={total}
          onChange={(p) => setPage(p)}
        />

      </div>
    </div>
  );
}

export default Complaints