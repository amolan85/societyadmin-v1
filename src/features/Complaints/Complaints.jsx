import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/Complaints.css"
import { getComplaintsApi, updateComplaintPriorityApi, updateComplaintStatusApi, deleteComplaintApi } from '../../services/ComplaintsApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { CgExport } from "react-icons/cg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiTag,
  FiMapPin,
  FiUser,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import AssignStaffModal from "./AssignStaffModal";   // ← ADDED

const Complaints = ({ setActive, setSelectedComplaintId }) => {

  const [tab, setTab] = useState("")
  const [societyId, setSocietyId] = useState("")
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  const [show, setShow] = useState(false)
  const [activeTab, setActiveTab] = useState("excel");
  const [allExportcomplaints, setAllExportcomplaints] = useState([]);
  const [selectedRange, setSelectedRange] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteComplaintId, setDeleteComplaintId] = useState(null);

  // ── Assign Staff Modal ────────────────────────────────
  const [showAssignModal, setShowAssignModal] = useState(false);   // ← ADDED
  const [assignComplaintId, setAssignComplaintId] = useState(null); // ← ADDED

  const tabs = [
    { id: "All Items", value: "" },
    { id: "Open", value: "open" },
    { id: "In Progress", value: "in_progress" },
    { id: "Resolved", value: "resolved" },
    { id: "Closed", value: "closed" },
  ];

  useEffect(() => {
    SessionData()
  }, [])

  const SessionData = async () => {
    const data = await GetSessionData()
    const flats = data.data.flats[0]
    setSocietyId(flats.society_id)
    getComplaints(flats.society_id)
  }

  const getComplaints = async (societyId) => {
    try {
      const data = await getComplaintsApi(societyId)
      setAllComplaints(data.list)
      setTotalOpen(data.status_counts.open)
      setTotalProgress(data.status_counts.in_progress)
      setTotalResolved(data.status_counts.resolved)
      setAvgResolution(data.avg_resolution_hours)
    } catch (error) {
      console.error("Error fetching complaints:", error)
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteComplaintApi(deleteComplaintId, societyId);
      toast.success("Complaint deleted successfully");
      setShowDeleteModal(false);
      getComplaints(societyId);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete complaint");
    }
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
      await updateComplaintPriorityApi(complaintId, priority, comments)
      getComplaints(societyId)
    }
    if (modalType === "status") {
      await updateComplaintStatusApi(complaintId, status, comments)
      getComplaints(societyId)
    }
  }

  const getAllExportcomplaints = async (sid) => {
    try {
      const data = await getComplaintsApi(sid);
      setAllExportcomplaints(data.list || []);
    } catch (error) {
      console.error("Error fetching export complaints:", error);
    }
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Complaints");
    if (allComplaints.length > 0) {
      worksheet.columns = Object.keys(allComplaints[0]).map((key) => ({ header: key, key, width: 20 }));
      allComplaints.forEach((item) => worksheet.addRow(item));
    }
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Complaints.xlsx");
  };

  const downloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Complaints");
    if (allComplaints.length > 0) {
      worksheet.columns = Object.keys(allComplaints[0]).map((key) => ({ header: key, key, width: 20 }));
      allComplaints.forEach((item) => worksheet.addRow(item));
    }
    worksheet.getRow(1).font = { bold: true };
    const csvBuffer = await workbook.csv.writeBuffer();
    saveAs(new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" }), "Complaints.csv");
  };

  const downloadPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("Complaints Report", 14, 15);
    const tableColumn = ["ID", "Title", "Description", "Unit", "Category", "Priority", "Status", "Time"];
    const tableRows = allComplaints.map((item) => [item.complaint_id, item.title, item.description, item.unit, item.category_name, item.priority, item.status, item.created_at]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25, styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [13, 110, 253] }, theme: "grid" });
    doc.save("ComplaintsData.pdf");
  };

  const handleExport = () => {
    if (activeTab === "excel") { downloadExcel(); setShowModal(false) }
    else if (activeTab === "csv") { downloadCSV(); setShowModal(false) }
    else if (activeTab === "pdf") { downloadPDF(); setShowModal(false) }
  };

  const timeAgo = (utcDate) => {
    const past = new Date(utcDate);
    const now = new Date();
    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return "Just now";
  };

  const filteredData = allComplaints.filter((item) => {
    const matchesTab = tab === "" || item.status === tab;
    const matchesStatus = filterStatus === "" || item.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()) || item.unit?.toLowerCase().includes(search.toLowerCase());
    const complaintDate = item.created_at ? new Date(item.created_at) : null;
    const matchesStartDate = !startDate || (complaintDate && complaintDate >= new Date(startDate));
    const matchesEndDate = !endDate || (complaintDate && complaintDate <= new Date(endDate + "T23:59:59"));
    return matchesTab && matchesStatus && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const per = 5;
  const total = Math.ceil(filteredData.length / per);
  const rows = filteredData.slice((page - 1) * per, page * per);

  const handleStatusChange = (value) => {
    setFilterStatus(value);
    setPage(1);
  };

  return (
    <>
      <div className="pg cp-wrap">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-start">
          <div>
            <h4 className="cp-title">Complaints</h4>
            <p className="cp-sub">Manage and track all society complaints</p>
          </div>
          <div className='d-flex'>
            <button className="btn-ol ms-2" onClick={() => setShow(true)}>
              <CgExport /> Export
            </button>
            <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setActive("createComplaints")}>
              + Log Complaint
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            [totalOpen, "Total Open", "tile-red"],
            [totalProgress, "In Progress", "tile-blu"],
            [totalResolved, "Resolved (This Month)", "tile-grn"],
            [avgResolution, "Avg Resolve Time", "dark"],
          ].map(([v, l, cls]) => (
            <div className="col-6 col-md-3" key={l}>
              <div className={`tile bg-white ${cls}`}>
                <div className="text-start fw-bold">{l}</div>
                <div className="tile-val text-start mt-1">{v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='row'>
          <div className='col-lg-7'>
            <div className="NoticeBoardTabs mt-3 bg-white">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.value); setPage(1) }}
                  className={`NoticeBoardTabs-btn ${tab === t.value ? "active" : ""}`}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row g-2 mt-3 mb-3 align-items-center">
          <div className="col-md-3">
            <input type="date" className="form-control" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Search by title, unit..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="col-md-3">
            <button className="btn-ol ms-2" onClick={() => setShow(true)}>
              <CgExport /> Export
            </button>
          </div>
        </div>

        {/* Table view for resolved/closed */}
        {(tab !== "" && tab !== "open" && tab !== "in_progress") &&
          <div className="sv-card p-0 overflow-hidden">
            <div className="cp-table-wrap">
              <table className="sv-tbl">
                <thead>
                  <tr>
                    {["ID", "Title", "Description", "Unit", "Category", "Priority", "Status", "Time"].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(c => (
                    <tr key={c.complaint_id} className="text-start">
                      <td className="tx-accent cp-id">{c.complaint_id}</td>
                      <td className="cp-title-cell">{c.title}</td>
                      <td className="cp-title-cell">{c.description}</td>
                      <td className="cp-muted">{c.unit}</td>
                      <td><Badge label={c.category_name} /></td>
                      <td>
                        <Badge label={c.priority} c={c.priority === "high" ? "red" : c.priority === "medium" ? "orange" : "gray"} />
                      </td>
                      <td style={{ cursor: "pointer" }} onClick={() => { setSelectedData(c); setStatus(c.status); setComments(""); setModalType("status"); setComplaintId(c.complaint_id); setShowModal(true); }}>
                        <Badge label={c.status} c={c.status === "open" ? "red" : c.status === "resolved" ? "green" : c.status === "in_progress" ? "orange" : "gray"} />
                      </td>
                      <td className="cp-muted">{(c.created_at).split("T")[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={total} onChange={(p) => setPage(p)} />
          </div>
        }

        {/* Card view for all/open/in_progress */}
        {(tab === "" || tab === "open" || tab === "in_progress") &&
          rows.map((data) => (
            <div className="card border-0 shadow-sm rounded-4 p-3 mt-2" key={data.complaint_id}>

              {/* Top */}
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-secondary fw-semibold mb-1 text-start">
                    #{data.complaint_id}
                  </p>
                  <h5 className="fw-bold mb-2">{data.title}</h5>
                </div>
                <Badge
                  label={data.status}
                  c={data.status === "open" ? "red" : data.status === "resolved" ? "green" : data.status === "in_progress" ? "orange" : "grey"}
                />
              </div>

              {/* Details */}
              <div className="d-flex flex-wrap gap-4 text-secondary small">
                <div className="d-flex align-items-center gap-2"><FiTag /><span>{data.category_name}</span></div>
                <div className="d-flex align-items-center gap-2"><FiMapPin /><span>{data.unit}</span></div>
                <div className="d-flex align-items-center gap-2"><FiUser /><span>Rahul Sharma (A-401)</span></div>
                <div className="d-flex align-items-center gap-2"><FiClock /><span>{timeAgo(data.created_at)}</span></div>
                <div className="d-flex align-items-center gap-2 text-danger"><FiAlertCircle /><span>{data.priority}</span></div>
              </div>

              <hr style={{ height: "2px" }} />

              {/* Buttons */}
              <div className="d-flex justify-content-end align-items-center gap-3">
                <button
                  className="btn btn-sm btn-ad grey-btn"
                  onClick={() => {
                    setSelectedComplaintId(data.complaint_id);
                    setActive("viewComplaintDetails");
                  }}
                >
                  View Details
                </button>

                <button
                  className="btn btn-sm btn-ac btn-primary"
                  onClick={() => {
                    setAssignComplaintId(data.complaint_id);
                    setShowAssignModal(true);
                  }}
                >
                  Assign Staff
                </button>

                {/* ── 3-DOT DROPDOWN ── */}
                <div
                  className="member-action-dropdown dropdown flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="member-action-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ⋮
                  </button>
                  <ul className="dropdown-menu member-action-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item member-action-item"
                        onClick={() => {
                          setSelectedComplaintId(data.complaint_id);
                          setActive("viewComplaintDetails");
                        }}
                      >
                        View Details
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item member-action-item"
                        onClick={() => {
                          setAssignComplaintId(data.complaint_id);
                          setShowAssignModal(true);
                        }}
                      >
                        Assign Staff
                      </button>
                    </li>
                    {/* <li>
                      <button
                        className="dropdown-item member-action-item"
                        onClick={() => {
                          setStatus(data.status);
                          setComments("");
                          setModalType("status");
                          setComplaintId(data.complaint_id);
                          setShowModal(true);
                        }}
                      >
                        Update Status
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item member-action-item"
                        onClick={() => {
                          setPriority(data.priority);
                          setComments("");
                          setModalType("priority");
                          setComplaintId(data.complaint_id);
                          setShowModal(true);
                        }}
                      >
                        Update Priority
                      </button>
                    </li> */}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item member-action-item member-action-delete"
                        onClick={() => {
                          setDeleteComplaintId(data.complaint_id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete Complaint
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          ))
        }

      </div>

      {/* ── ASSIGN STAFF MODAL ── */}
      <AssignStaffModal
        show={showAssignModal}
        setShow={setShowAssignModal}
        complaintId={assignComplaintId}
        onAssigned={() => getComplaints(societyId)}
      />

      {/* Status/Priority Modal */}
      {showModal && modalConfig[modalType] && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalConfig[modalType].title}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <div className="row align-items-center mb-1">
                      <div className="col-md-3 text-start">
                        <label className="fw-semibold">{modalConfig[modalType].label}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-md-12">
                        <div className="d-flex gap-4 flex-wrap">
                          {modalConfig[modalType].options.map((opt) => (
                            <label key={opt.value} className="form-check d-flex align-items-center gap-2">
                              <input className="form-check-input" type="radio" name={modalType} value={opt.value} checked={modalConfig[modalType].value === opt.value} onChange={(e) => modalConfig[modalType].setValue(e.target.value)} />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center mb-1 mt-3">
                      <div className="col-md-3 text-start">
                        <label className="fw-semibold">{modalConfig[modalType].commentLabel}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-md-12">
                        <textarea className="form-control" rows={3} placeholder="Enter comments..." value={modalConfig[modalType].commentValue || ""} onChange={(e) => modalConfig[modalType].setCommentValue(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn-ol" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn-ac px-4" onClick={() => { UpdateData(); setShowModal(false); }}>Update</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Export Modal */}
      {show && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Export Data</h1>
                  <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                </div>
                <div className="modal-body">
                  <h6 className="text-start" style={{ fontWeight: "bold" }}>Select Format</h6>
                  <div className="row mb-4">
                    {[
                      { key: "excel", Icon: BsFiletypeXls, label: "Excel" },
                      { key: "csv", Icon: BsFiletypeCsv, label: "CSV" },
                      { key: "pdf", Icon: BsFiletypePdf, label: "PDF" },
                    ].map(({ key, Icon, label }) => (
                      <div className="col-md-4" key={key}>
                        <div className={`format-card text-center p-3 rounded-3 ${activeTab === key ? "active-format" : ""}`} onClick={() => setActiveTab(key)}>
                          <Icon className={activeTab === key ? "text-primary" : "text-secondary"} size={20} />
                          <p className={`fw-semibold mb-0 mt-1 ${activeTab === key ? "text-primary" : "text-secondary"}`}>{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h6 className="text-start fw-bold">Data Range</h6>
                  <div className="range-card active-range d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <input className="form-check-input" type="radio" defaultChecked />
                      <h6 className='fw-bold mt-1'>All Data</h6>
                    </div>
                    <span className="text-muted mt-1"><h6>{allComplaints.length} records</h6></span>
                  </div>
                  <div className="range-card d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <input className="form-check-input" type="radio" />
                      <h6 className="fw-bold mt-1">Current Search results</h6>
                    </div>
                    <h6 className="text-muted mt-1">{filteredData.length} records</h6>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-sm btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button className="btn btn-sm btn-primary" onClick={handleExport}>
                    <i className="bi bi-download me-2"></i>Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ── DELETE CONFIRM MODAL ── */}
          <div
            className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowDeleteModal(false)}
                  />
                </div>
                <div className="modal-body text-start">
                  <p className="mb-1">
                    Are you sure you want to delete complaint{" "}
                    <strong>#{deleteComplaintId}</strong>?
                  </p>
                  <p className="text-muted small mb-0">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Complaints;
