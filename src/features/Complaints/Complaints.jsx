import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/Complaints.css"
import createComplaints from './CreateComplaints';
import { getComplaintsApi, updateComplaintPriorityApi, updateComplaintStatusApi } from '../../services/ComplaintsApi';
import { GetSessionData } from '../../utils/SessionManagement';

const Complaints = ({ setActive }) => {
  const [societyId, setSocietyId] = useState("")
  const [page, setPage] = useState(1);
  const [allComplaints, setAllComplaints] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [priority, setPriority] = useState("")
  const [modalType, setModalType] = useState("");
  const [status, setStatus] = useState("")
  const [comments, setComments] = useState("")
  const [totalOpen, setTotalOpen] = useState("")
  const [totalProgress, setTotalProgress] = useState("")
  const [totalResolved, setTotalResolved] = useState("")
  const [avgResolution, setAvgResolution] = useState("")
  const [complaintId, setComplaintId] = useState("")
  // const all = [
  //   { id: "#C-1042", title: "Lift B not working", unit: "A-201", cat: "Maintenance", pri: "High", st: "Open", sc: "red", time: "2h ago" },
  //   { id: "#C-1041", title: "Water leakage in corridor", unit: "B-305", cat: "Plumbing", pri: "Medium", st: "In Progress", sc: "orange", time: "5h ago" },
  //   { id: "#C-1040", title: "Gym AC not functioning", unit: "Common", cat: "Electrical", pri: "Low", st: "Open", sc: "red", time: "1d ago" },
  //   { id: "#C-1039", title: "Parking slot encroachment", unit: "B-101", cat: "Parking", pri: "Medium", st: "Resolved", sc: "green", time: "2d ago" },
  //   { id: "#C-1038", title: "Noisy neighbours after 10 PM", unit: "C-402", cat: "Noise", pri: "Medium", st: "Resolved", sc: "green", time: "3d ago" },
  //   { id: "#C-1037", title: "Broken gym equipment", unit: "Common", cat: "Maintenance", pri: "Low", st: "Open", sc: "red", time: "3d ago" },
  //   { id: "#C-1036", title: "Leaking water pipe – roof", unit: "D-501", cat: "Plumbing", pri: "High", st: "In Progress", sc: "orange", time: "4d ago" },
  //   { id: "#C-1035", title: "Gate door hinge broken", unit: "Gate 2", cat: "Maintenance", pri: "Low", st: "Resolved", sc: "green", time: "5d ago" },
  // ];

  useEffect(() => {
    SessionData()
  }, [])

  const SessionData = async () => {
    const data = await GetSessionData()
    console.log(data.data)
    const flats = data.data.flats[0]
    setSocietyId(flats.society_id)
    getComplaints(flats.society_id)

  }


  //function for get complaints
  const getComplaints = async (societyId) => {
    const data = await getComplaintsApi(societyId)
    setAllComplaints(data.list)
    setTotalOpen(data.status_counts.open)
    console.log(data.status_counts.open)
    setTotalProgress(data.status_counts.in_progress)
    setTotalResolved(data.status_counts.resolved)
    setAvgResolution(data.avg_resolution_hours)
  }

  // Priority
  const openPriorityModal = () => {
    setModalType("priority");
    setShowModal(true);
  };

  // Status
  const openStatusModal = () => {
    setModalType("status");
    setShowModal(true);
  };

  const modalConfig = {
    priority: {
      title: "Update Priority",
      label: "Priority",
      value: priority,
      setValue: setPriority,
      options: [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
        { label: "Urgent", value: "urgent" },
      ],
      commentLabel: "Comments",
      commentValue: comments,
      setCommentValue: setComments,
    },
    status: {
      title: "Update Status",
      label: "Status",
      value: status,
      setValue: setStatus,
      options: [
        { label: "Open", value: "open" },
        { label: "In Progress", value: "in_progress" },
        { label: "Closed", value: "closed" },
        { label: "Resolved", value: "resolved" },
        { label: "Rejected", value: "rejected" },
      ],
      commentLabel: "Comments",
      commentValue: comments,
      setCommentValue: setComments,
    },
  };

  const UpdateData = async () => {

    if (modalType === "priority") {
      const data = await updateComplaintPriorityApi(complaintId, priority, comments)
      getComplaints(societyId)
    }

    if (modalType === "status") {
      const data = await updateComplaintStatusApi(complaintId, status, comments)
      getComplaints(societyId)
    }


  }
  const per = 5, total = Math.ceil(allComplaints.length / per);
  const rows = allComplaints.slice((page - 1) * per, page * per);

  return (
    <>
      <div className="pg cp-wrap">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-start">
          <div>
            <h4 className="cp-title">Complaints</h4>
            <p className="cp-sub">
              Manage and track all society complaints
            </p>
          </div>

          <button className="btn-ac" onClick={() => setActive("createComplaints")}>+ Log Complaint</button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            [totalOpen, "Total Open", "tile-red"],
            [totalProgress,"Total Progress", "tile-org"],
            [totalResolved, "Resolved Today", "tile-grn"],
            [avgResolution, "Avg Resolution", "tile-blu"]
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
                  {["ID", "Title", "Description", "Unit", "Category", "Priority", "Status", "Time"]
                    .map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>

              <tbody>
                {rows.map(c => (
                  <tr key={c.complaint_id} className="text-start">
                    <td className="tx-accent cp-id">{c.complaint_id}</td>
                    <td className="cp-title-cell">{c.title}</td>
                    <td className="cp-title-cell">{c.description}</td>
                    <td className="cp-muted">{c.unit}</td>
                    <td>
                      <Badge label={c.category_name} c="gray" />
                    </td>
                    <td style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedData(c);
                        setPriority(c.priority);   // 👈 yeh add karo
                        setComments("");           // 👈 optional: reset comments
                        setModalType("priority");
                        setComplaintId(c.complaint_id)
                        setShowModal(true);
                      }}>
                      <Badge
                        label={c.priority}
                        c={
                          c.priority === "high"
                            ? "red"
                            : c.priority === "medium"
                              ? "orange"
                              : "gray"
                        }


                      />

                    </td>
                    <td style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedData(c);
                        setStatus(c.status);       // 👈 yeh already sahi hai
                        setComments("");           // 👈 optional: reset comments
                        setModalType("status");
                        setComplaintId(c.complaint_id)
                        setShowModal(true);
                      }}>
                      <Badge label={c.status} c={
                        c.status === "open"
                          ? "red"
                          : c.status === "resolved"
                            ? "green"
                            : "orange"
                      } />
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


      {showModal && modalConfig[modalType] && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal show d-block">
            <div className="modal-dialog modal-md">
              <div className="modal-content">

                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalConfig[modalType].title}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <div className="container-fluid">

                    <div className="row align-items-center mb-1">
                      <div className="col-md-3 text-start">
                        <label className="fw-semibold">
                          {modalConfig[modalType].label}
                        </label>
                      </div>

                    </div>
                    <div className='row'>
                      <div className="col-md-12">
                        <div className="d-flex gap-4 flex-wrap">

                          {modalConfig[modalType].options.map((opt) => (
                            <label
                              key={opt.value}
                              className="form-check d-flex align-items-center gap-2"
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                name={modalType}
                                value={opt.value}
                                checked={modalConfig[modalType].value === opt.value}
                                onChange={(e) =>
                                  modalConfig[modalType].setValue(e.target.value)
                                }
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}

                        </div>
                      </div>
                    </div>

                    <div className="row align-items-center mb-1 mt-3">
                      <div className="col-md-3 text-start">
                        <label className="fw-semibold">
                          {modalConfig[modalType].commentLabel}
                        </label>
                      </div>

                    </div>
                    <div className='row'>
                      <div className="col-md-12">
                        <div className="d-flex gap-4 flex-wrap">

                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter comments..."
                            value={modalConfig[modalType].commentValue || ""}
                            onChange={(e) =>
                              modalConfig[modalType].setCommentValue(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className="btn-ol"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn-ac px-4"
                      onClick={() => {
                        console.log("Updated:", modalConfig[modalType].value);
                        UpdateData()
                        setShowModal(false);

                      }}
                    >
                      Update
                    </button>
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

export default Complaints