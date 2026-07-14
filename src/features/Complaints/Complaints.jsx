import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/Complaints.css"
import { getComplaintsApi, updateComplaintPriorityApi, updateComplaintStatusApi, deleteComplaintApi,GetComplaintByIdApi } from '../../services/ComplaintsApi';
import { GetSessionData } from '../../utils/SessionManagement';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { CgExport } from "react-icons/cg";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import {
  FiTag,
  FiMapPin,
  FiUser,
  FiClock,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";
import AssignStaffModal from "./AssignStaffModal";

const Complaints = ({ setActive, setSelectedComplaintId }) => {

  const [tab, setTab] = useState("")
  const [societyId, setSocietyId] = useState("")
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteComplaintId, setDeleteComplaintId] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignComplaintId, setAssignComplaintId] = useState(null);

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
  // ── don't call getComplaints here — the effect below picks it up
  // as soon as societyId is set, avoiding a duplicate call ──
}

// Single source of truth for fetching — fires on mount (once societyId
// is set) and on every filter/page change after that
useEffect(() => {
  if (!societyId) return;

  getComplaints({
    sid: societyId,
    pg: page,
    status: tab,
    searchText: search,
    fromDate: startDate,
    toDate: endDate
  });
}, [societyId, tab, page, startDate, endDate, search]);

const getComplaints = async ({ sid, pg, status, searchText, fromDate, toDate }) => {
  try {
    const data = await getComplaintsApi({
      societyId: sid,
      status: status,
      search: searchText,
      dateFrom: fromDate,
      dateTo: toDate,
      page: pg,
      pageSize: 5
    })

    const list = data?.list || [];
    const pagination = data?.pagination || {};
    const analytics = data?.analytics || {};
    const statusCounts = analytics?.status_counts || {};

    setAllComplaints(list)
    setTotalOpen(statusCounts.open || 0)
    setTotalProgress(statusCounts.in_progress || 0)
    setTotalResolved(statusCounts.resolved || 0)
    setAvgResolution(analytics?.avg_resolution_hours || 0)

    setTotalCount(pagination.total || 0)
    setTotalPages(pagination.total_pages || 1)
    setPage(pagination.page || pg)

  } catch (error) {
    console.error("Error fetching complaints:", error)
  }
}

  const confirmDelete = async () => {
    try {
      await deleteComplaintApi(deleteComplaintId, societyId);
      toast.success("Complaint deleted successfully");
      setShowDeleteModal(false);
      getComplaints({ sid: societyId, pg: page, status: tab, searchText: search, fromDate: startDate, toDate: endDate });
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
    }
    if (modalType === "status") {
      await updateComplaintStatusApi(complaintId, status, comments)
    }
    getComplaints({ sid: societyId, pg: page, status: tab, searchText: search, fromDate: startDate, toDate: endDate });
  }

  // Export still needs the full unfiltered/filtered list — fetch a large page separately
  const getAllExportComplaints = async () => {
    try {
      const data = await getComplaintsApi({
        societyId,
        status: tab,
        search: search,
        dateFrom: startDate,
        dateTo: endDate,
        page: 1,
        pageSize: 10000
      });
      return data?.list || [];
    } catch (error) {
      console.error("Error fetching export complaints:", error);
      return [];
    }
  };

  const downloadExcel = async () => {
    const exportData = await getAllExportComplaints();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Complaints");
    if (exportData.length > 0) {
      worksheet.columns = Object.keys(exportData[0]).map((key) => ({ header: key, key, width: 20 }));
      exportData.forEach((item) => worksheet.addRow(item));
    }
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Complaints.xlsx");
  };

  const downloadCSV = async () => {
    const exportData = await getAllExportComplaints();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Complaints");
    if (exportData.length > 0) {
      worksheet.columns = Object.keys(exportData[0]).map((key) => ({ header: key, key, width: 20 }));
      exportData.forEach((item) => worksheet.addRow(item));
    }
    worksheet.getRow(1).font = { bold: true };
    const csvBuffer = await workbook.csv.writeBuffer();
    saveAs(new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" }), "Complaints.csv");
  };

  const downloadPDF = async () => {
    const exportData = await getAllExportComplaints();
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("Complaints Report", 14, 15);
    const tableColumn = ["ID", "Title", "Description", "Unit", "Category", "Priority", "Status", "Time"];
    const tableRows = exportData.map((item) => [item.complaint_id, item.title, item.description, item.unit, item.category_name, item.priority, item.status, item.created_at]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25, styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [13, 110, 253] }, theme: "grid" });
    doc.save("ComplaintsData.pdf");
  };

  const handleExport = () => {
    if (activeTab === "excel") { downloadExcel(); setShow(false) }
    else if (activeTab === "csv") { downloadCSV(); setShow(false) }
    else if (activeTab === "pdf") { downloadPDF(); setShow(false) }
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

  // No more client-side filtering — allComplaints is already the current page from the server
  const rows = allComplaints;

  const handleTabChange = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <div className="pg cp-wrap">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="bc-header-icon">
              <FiAlertCircle size={20} color="#2563eb" />
            </div>

            <div className="text-start">
              <h4 className="cp-title mb-1">Complaints</h4>
              <p className="cp-sub mb-0">Manage and track all society complaints</p>
            </div>
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
                <div className="text-start text-muted">{l}</div>
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
                  onClick={() => handleTabChange(t.value)}
                  className={`NoticeBoardTabs-btn ${tab === t.value ? "active" : ""}`}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="visitor-toolbar mb-4 mt-3">
          <div className="row align-items-center g-2">

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              />
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              />
            </div>

            <div className="col-md-8">
              <div className="d-flex justify-content-end">
                <div className="position-relative" style={{ width: "320px" }}>
                  <FiSearch
                    className="position-absolute"
                    style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}
                  />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search by title, unit..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

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
            <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
          </div>
        }

        {/* Card view for all/open/in_progress */}
        {(tab === "" || tab === "open" || tab === "in_progress") &&
          <>
            {rows.map((data) => (
              <div
  key={data.complaint_id}
  className="card border-0 shadow-sm rounded-3"
  style={{ padding: "10px 14px", marginTop: 8, cursor: "pointer" }}
  onClick={() => {
    setSelectedComplaintId(data.complaint_id);
    setActive("viewComplaintDetails");
  }}
>
                <div className="d-flex justify-content-between align-items-start gap-2">

                  <div className="text-start flex-grow-2 min-w-0">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{data.title}</span>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-3 text-secondary" style={{ fontSize: 13 }}>
                      <div className="d-flex align-items-center gap-1"><FiTag size={12} /><span>{data.category_name}</span></div>
                      <div className="d-flex align-items-center gap-1"><FiMapPin size={12} /><span>{data.unit}</span></div>
                      <div className="d-flex align-items-center gap-1"><FiUser size={12} /><span>Rahul Sharma (A-401)</span></div>
                      <div className="d-flex align-items-center gap-1"><FiClock size={12} /><span>{timeAgo(data.created_at)}</span></div>
                      <div className="d-flex align-items-center gap-1 text-danger"><FiAlertCircle size={12} /><span>{data.priority}</span></div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <Badge
                      label={data.status}
                      c={data.status === "open" ? "red" : data.status === "resolved" ? "green" : data.status === "in_progress" ? "orange" : "grey"}
                    />

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
                            onClick={(e) => {
                              e.stopPropagation();
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignComplaintId(data.complaint_id);
                              setShowAssignModal(true);
                            }}
                          >
                            Assign Staff
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item member-action-item member-action-delete"
                            onClick={(e) => {
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
              </div>
            ))}
            <div className="sv-card p-0 mt-2">
              <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
            </div>
          </>
        }

      </div>

      <AssignStaffModal
        show={showAssignModal}
        setShow={setShowAssignModal}
        complaintId={assignComplaintId}
        onAssigned={() => getComplaints({ sid: societyId, pg: page, status: tab, searchText: search, fromDate: startDate, toDate: endDate })}
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
                      <h6 className='fw-bold mt-1'>All Data (current filters)</h6>
                    </div>
                    <span className="text-muted mt-1"><h6>{totalCount} records</h6></span>
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