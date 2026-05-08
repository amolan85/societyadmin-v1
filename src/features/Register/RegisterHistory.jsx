import React, { useState, useEffect } from 'react'
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import "../../styles/StaffAttendance.css"
import "../../styles/Register.css"
import { getBroadcastApi } from '../../services/BroadcastApi';
import { GetSessionData } from '../../utils/SessionManagement';

import { FiEdit } from 'react-icons/fi';
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { useLoader } from "../../context/LoaderContext";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RegisterHistory = ({ setActive }) => {
    const [page, setPage] = useState(1);
    const [allBroadcast, setAllBroadcast] = useState([])
    const [showCreate, setShowCreate] = useState(false);
    const [societyId, setSocietyId] = useState("")
    const [pendingId, setPendingId] = useState(null)
    const [show, setShow] = useState(false)
    const { setLoading } = useLoader();
    const [activeTab, setActiveTab] = useState("excel");

      const all = [
    { dateTime: "Today, 6:45 PM", type: "Access Log", title: "vehicle tesla model y", status: "allowed"},
    { dateTime: "Oct 01,2025, 10:00 PM", type: "Payment", title: "vehicle tesla model y", status: "success"},
    { dateTime: "Today, 6:45 PM", type: "Complaint", title: "vehicle tesla model y", status: "pending"},
    { dateTime: "Today, 6:45 PM", type: "Profile Update", title: "vehicle tesla model y", status: "completed"},

  ];

    // Load session data on component mount for get session data
    useEffect(() => {
        SessionData()
    }, [])

    // Get session data and fetch broadcast list
    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)

        //call function for get broadcast
        getBroadcast(flats.society_id)
    }

    //function for get broadcast
    const getBroadcast = async (societyId) => {
        try {
            setLoading(true);
            const data = await getBroadcastApi(societyId)
            setAllBroadcast(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    //function for get broad cast by id
    const getBroadcastById = (id) => {
        setBroadcastId(id);
        setActive("createbroadcast");    // pehle ID set karo
    };

    const downloadExcel = () => {

        // convert json to worksheet
        const worksheet = XLSX.utils.json_to_sheet(allBroadcast);

        // create workbook
        const workbook = XLSX.utils.book_new();

        // append worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Broadcast");

        // download file
        XLSX.writeFile(workbook, "BroadcastData.xlsx");
    };

    const downloadCSV = () => {

        // convert json data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(allBroadcast);

        // convert worksheet to csv
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

        // create blob
        const blob = new Blob([csvOutput], {
            type: "text/csv;charset=utf-8;",
        });

        // create download link
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "BroadcastData.csv";

        link.click();
    };

    const downloadPDF = () => {

        // landscape mode
        const doc = new jsPDF("landscape");

        // PDF Heading
        doc.setFontSize(18);
        doc.text("Broadcast Report", 14, 15);

        // table columns
        const tableColumn = [
            "Subject",
            "Content",
            "Type",
            "Schedule Date",
            "Status",
        ];

        // table rows
        const tableRows = allBroadcast.map((item) => [
            item.title,
            item.message,
            item.type,
            item.scheduled_at,
            item.status,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,

            // table start after heading
            startY: 25,

            styles: {
                fontSize: 8,
                cellPadding: 3,
            },

            headStyles: {
                fillColor: [13, 110, 253],
            },

            theme: "grid",
        });

        doc.save("BroadcastData.pdf");
    };

    const handleExport = () => {

        if (activeTab === "excel") {
            downloadExcel();
            setShow(false)
        }

        else if (activeTab === "csv") {
            downloadCSV();
            setShow(false)
        }

        else if (activeTab === "pdf") {
            downloadPDF();
            setShow(false)
        }
    };

    //for pagination
    const per = 5, total = Math.ceil(all.length / per);
    const rows = all.slice((page - 1) * per, page * per);

    return (
        <>
            <div className="pg sa-wrap">

                {/* Header */}
                {/* <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="sa-title">Broadcast</h4>
                    <div className="d-flex gap-2">
                        <button className="btn-ol" onClick={() => setShow(true)}>⬇ Export</button>
                    </div>
                </div> */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">

                    {/* Left Section */}
                    <div className="d-flex flex-wrap align-items-center gap-3">

                        {/* Search */}
                        <div className="position-relative">

                            {/* <FiSearch className="re-search-icon" /> */}

                            <input
                                type="text"
                                className="form-control search-input "
                                placeholder="Search history..."
                            />

                        </div>

                        {/* Last 30 Days */}
                        <button className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white">

                            <FiCalendar size={14} />

                            Last 30 Days

                        </button>

                        {/* Filter Dropdown */}
                        <div className="dropdown">

                            <button
                                className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                                data-bs-toggle="dropdown"
                            >
                                <FiFilter size={14} />

                                All Types
                            </button>

                            <div className="dropdown-menu p-3 shadow border-0 rounded-4 re-filter-dropdown">

                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <small className="text-muted fw-semibold">
                                        Filter by Type
                                    </small>

                                    <button className="btn btn-link p-0 text-decoration-none small" style={{fontSize:"17px"}}>
                                        Select All
                                    </button>

                                </div>

                                {/* Checkbox List */}
                                <div className="d-flex flex-column gap-2">

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultChecked
                                        />

                                        <label className="form-check-label" style={{fontSize:"15px"}}>
                                            Access Log
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultChecked
                                        />

                                        <label className="form-check-label" style={{fontSize:"15px"}}>
                                            Payments
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultChecked
                                        />

                                        <label className="form-check-label" style={{fontSize:"15px"}}>
                                            Complaints
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultChecked
                                        />

                                        <label className="form-check-label" style={{fontSize:"15px"}}>
                                            System Updates
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                        />

                                        <label className="form-check-label" style={{fontSize:"15px"}}>
                                            Notices
                                        </label>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Export Button */}
                   
                        <button className="btn-ol" onClick={() => setShow(true)}>⬇ Export</button>
                </div>
                {/* Table */}
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["Date & Time", "Type", "Title", "Status"]
                                        .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s, i) => (
                                    <tr className="text-start" key={s.dateTime}>

                                        <td className="sa-name">{s.dateTime}</td>

                                        <td className="sa-muted">{s.type}</td>
                                       <td className="sa-muted">{s.title}</td>
                                        <td>
                                            <Badge label={s.status} 
                                                c={
                                                    s.status === "allowed"
                                                        ? "blue"
                                                        : s.status === "success"
                                                            ? "green"
                                                            : s.status === "pending"
                                                                ? "yellow"
                                                                : s.status === "completed"
                                                                    ? "grey"
                                                                    : "gray"
                                                }
                                            />
                                        </td>
                                       


                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        total={total}
                        onChange={setPage}
                    />

                </div>
            </div>
            {show && (
                <>

                    <div className="modal-backdrop fade show"></div>


                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Export Data</h1>


                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShow(false)}
                                    ></button>
                                </div>


                                <div className="modal-body">
                                    <h6 className=" text-start" style={{ fontWeight: "bold" }}>Select Format</h6>
                                    <div className="row mb-4">

                                        {/* Excel */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "excel" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("excel") }}
                                            >
                                                <BsFiletypeXls
                                                    className={
                                                        activeTab === "excel"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "excel"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    Excel
                                                </p>
                                            </div>
                                        </div>

                                        {/* CSV */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "csv" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("csv") }}
                                            >
                                                <BsFiletypeCsv
                                                    className={
                                                        activeTab === "csv"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "csv"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    CSV
                                                </p>
                                            </div>
                                        </div>

                                        {/* PDF */}
                                        <div className="col-md-4">
                                            <div
                                                className={`format-card text-center p-3 rounded-3 ${activeTab === "pdf" ? "active-format" : ""
                                                    }`}
                                                onClick={() => { setActiveTab("pdf") }}
                                            >
                                                <BsFiletypePdf
                                                    className={
                                                        activeTab === "pdf"
                                                            ? "text-primary"
                                                            : "text-secondary"
                                                    }
                                                    size={20}
                                                />

                                                <p
                                                    className={`fw-semibold mb-0 mt-1 ${activeTab === "pdf"
                                                        ? "text-primary"
                                                        : "text-secondary"
                                                        }`}
                                                >
                                                    PDF
                                                </p>
                                            </div>
                                        </div>

                                    </div>


                                    <h6 className=" text-start fw-bold">Data Range</h6>


                                    <div className="range-card active-range d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" checked />
                                            <h6 className='fw-bold mt-1'>All Data</h6>
                                        </div>

                                        <span className="text-muted mt-1"><h6>{allBroadcast.length} records</h6></span>
                                    </div>


                                    <div className="range-card d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" />
                                            <h6 className="fw-bold mt-1">Current Search results</h6>
                                        </div>

                                        <h6 className="text-muted mt-1">40 records</h6>
                                    </div>


                                    <div className="range-card d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <input className="form-check-input" type="radio" />
                                            <h6 className="fw-bold mt-1">Custom date range</h6>
                                        </div>

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button className="btn-sm btn btn-outline-secondary" onClick={() => setShow(false)}>
                                        Cancel
                                    </button>

                                    <button className="btn btn-sm btn-primary" onClick={handleExport}>
                                        <i className="bi bi-download me-2"></i>
                                        Export Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </>
            )}

        </>
    )
}

export default RegisterHistory