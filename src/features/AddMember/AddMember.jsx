import React, { useState, useEffect } from 'react'
import "../../styles/AddMember.css"
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import { GetSessionData } from '../../utils/SessionManagement';
import { AddMemberApi, getMembersApi } from '../../services/AddMemberApi';

import { useLoader } from "../../context/LoaderContext";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { all } from 'axios';


const AddMember = () => {
    const [memType, setMemType] = useState("Owner");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [wing, setWing] = useState("")
    const [flat, setFlat] = useState("")
    const [floor, setFloor] = useState("")
    const [residency, setResidency] = useState("")
    const [date, setDate] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [allMembers, setAllMembers] = useState([])
    const [memberTypeTab, setMemberTypeTab] = useState("")
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false)

    const memberType = [
        { id: "All Items", value: "" },
        { id: "Owner", value: "owner" },
        { id: "Tenant", value: "tenant" },
        { id: "Family Member", value: "familyMember" },
    ];

    useEffect(() => {
        SessionData()

    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(flats.user_id)
        setFloor(flats.floor)
        getMembers(flats.society_id)
    }

    //function for get members
    const getMembers = async (societyId) => {

        try{
            const data = await getMembersApi(societyId)
            setAllMembers(data.members)
        }
        catch (error) {
            console.error("Error fetching members:", error)
        }
    }




    //function for validation
    const validateForm = () => {
        let errors = {};

        if (!firstName) {
            errors.firstName = "required";
        }

        if (!lastName) {
            errors.lastName = "required";
        }

        if (!emailId) {
            errors.emailId = "required";
        } else if (!/\S+@\S+\.\S+/.test(emailId)) {
            errors.emailId = "Invalid email";
        }
        else {
            errors.emailId = ""
        }

        if (!mobileNo) {
            errors.mobileNo = "required";
        } else if (!/^[0-9]{10}$/.test(mobileNo)) {
            errors.mobileNo = "Invalid mobile no.";
        }
        else {
            errors.mobileNo = ""
        }

        if (!wing) {
            errors.wing = "required";
        }

        if (!flat) {
            errors.flat = "required";
        }
        if (!date) {
            errors.date = "required";
        }
        return errors;
    };

    //submit function for add member
    const handleSubmit = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const data = await AddMemberApi(societyId, userId, firstName, lastName, mobileNo, emailId, wing, flat, floor, memType, residency, date)
            console.log("Form Submitted ✅");
            setShow(false)
        }
    };

    const downloadExcel = () => {

        // convert json to worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // create workbook
        const workbook = XLSX.utils.book_new();

        // append worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

        // download file
        XLSX.writeFile(workbook, "Members.xlsx");
    };

    const downloadCSV = () => {

        // convert json data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // convert worksheet to csv
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

        // create blob
        const blob = new Blob([csvOutput], {
            type: "text/csv;charset=utf-8;",
        });

        // create download link
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "Members.csv";

        link.click();
    };

    const downloadPDF = () => {

        // landscape mode
        const doc = new jsPDF("landscape");

        // PDF Heading
        doc.setFontSize(18);
        doc.text("Members Report", 14, 15);

        // table columns
        const tableColumn = [
            "First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Date"
        ];

        // table rows
        const tableRows = rows.map((item) => [
            item.first_name,
            item.last_name,
            item.mobile,
            item.email,
            item.block,
            item.floor,
            item.occupancy_type,
            item.start_date
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

        doc.save("Members.pdf");
    };

    const handleExport = () => {

        if (activeTab === "excel") {
            downloadExcel();
            setExportModal(false)
        }

        else if (activeTab === "csv") {
            downloadCSV();
            setExportModal(false)
        }

        else if (activeTab === "pdf") {
            downloadPDF();
            setExportModal(false)
        }
    };

    const totalOwners = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "owner"
    ).length;

    const totalTenant = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "tenant"
    ).length;

    const totalFamilyMember = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "familyMember"
    ).length;

    const filteredData = memberTypeTab === ""
        ? allMembers
        : allMembers.filter((item) => item.occupancy_type === memberTypeTab);

    const per = 5, total = Math.ceil(filteredData.length / per);
    const rows = filteredData.slice((page - 1) * per, page * per);

    return (
        <>
            <div className="pg cp-wrap">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Members</h4>
                        <p className="cp-sub">
                            Manage and track all society members
                        </p>
                    </div>
                    <div className='d-flex'>
                        <button className='btn btn-sm btn-primary' onClick={() => setShow(true)}>Add Member</button>
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}>⬇ Export</button>

                    </div>

                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [allMembers.length, "Total Member", "tile-red"],
                        [totalOwners, "Total Owner", "tile-org"],
                        [totalTenant, "Total Tenant", "tile-grn"],
                        [totalFamilyMember, "Total Family Member", "tile-blu"]
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile ${cls}`}>
                                <div className="tile-val">{v}</div>
                                <div className="tile-lbl">{l}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='row'>
                    <div className='col-lg-7'>
                        <div className="NoticeBoardTabs mt-3 bg-white"
                        >
                            {memberType.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setMemberTypeTab(t.value)}
                                    className={`NoticeBoardTabs-btn ${memberTypeTab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} {t.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                                        .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.first_name}</td>
                                        <td className="sa-name">{s.last_name}</td>
                                        <td className="sa-name">{s.mobile}</td>
                                        <td className="sa-name">{s.email}</td>
                                        <td className="sa-name">{s.block}</td>
                                        <td className="sa-name">{s.flat_number}</td>
                                        <td ><Badge label={s.occupancy_type} c="gray" /></td>
                                        <td><Badge label={s.residencyStatus} c="orange" /></td>
                                        <td className="sa-name">{s.start_date}</td>
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
                    {/* ✅ Backdrop (THIS IS IMPORTANT) */}
                    <div className="modal-backdrop fade show"></div>

                    {/* ✅ Modal */}
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Add New Member</h1>

                                    {/* ❌ remove data-bs-dismiss */}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShow(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="pg d-flex justify-content-center am-wrap">
                                        <div className="text-start am-card">

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb" >Select Wing</label>
                                                        {errors.wing && <span className='text-danger mx-2 '>{errors.wing}</span>}
                                                    </div>
                                                    <select className={`form-select ${errors.wing ? "error-input" : ""}`}
                                                        value={wing}
                                                        onChange={(e) => setWing(e.target.value)}>
                                                        <option>Select Wing</option>
                                                        {["Wing A", "Wing B", "Wing C"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Flat / Unit Number</label>
                                                        {errors.flat && <span className='text-danger mx-2 '>{errors.flat}</span>}
                                                    </div>
                                                    <select className={`form-select  ${errors.flat ? "error-input" : ""}`} value={flat} onChange={(e) => setFlat(e.target.value)}>
                                                        <option>Select Unit</option>
                                                        {["101", "102", "103"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>


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


                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'><label className="sv-lb">First Name</label>
                                                        {errors.firstName && <span className='text-danger mx-2 '>{errors.firstName}</span>}</div>
                                                    <input className={`sv-in ${errors.firstName ? "error-input" : ""}`} placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Last Name</label>
                                                        {errors.lastName && <span className='text-danger mx-2 '>{errors.lastName}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.lastName ? "error-input" : ""}`} placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Phone Number</label>
                                                        {errors.mobileNo && <span className='text-danger mx-2 '>{errors.mobileNo}</span>}
                                                    </div>

                                                    <div className="d-flex">
                                                        <span className={`am-code ${errors.mobileNo ? "error-input" : ""}`}>+91</span>
                                                        <input
                                                            className={`sv-in am-phone ${errors.mobileNo ? "error-input" : ""}`}
                                                            // className={`form-control ${errors.mobileNo ? "is-invalid" : ""}`}
                                                            type='text'
                                                            maxLength={10}
                                                            placeholder="98765 43210"
                                                            value={mobileNo}
                                                            onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Email Address</label>
                                                        {errors.emailId && <span className='text-danger mx-2 '>{errors.emailId}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.emailId ? "error-input" : ""}`} placeholder="Enter Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                                </div>
                                            </div>


                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Residency Status</label>
                                                    <select className="form-select"
                                                        value={residency}
                                                        onChange={(e) => setResidency(e.target.value)}>
                                                        <option>Select Status</option>
                                                        <option>Resident</option>
                                                        <option>Non-Resident</option>
                                                    </select>
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Move-in Date</label>
                                                        {errors.date && <span className='text-danger mx-2'>{errors.date}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.date ? "error-input" : ""}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                                </div>
                                            </div>


                                            <div className="form-check mb-4">
                                                <input className="form-check-input" type="checkbox" defaultChecked />
                                                <label className="form-check-label am-check">
                                                    Mark as Primary Member for this unit
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Member</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {exportModal && (
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
                                        onClick={() => setExportModal(false)}
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

                                        <span className="text-muted mt-1"><h6>{allMembers.length} records</h6></span>
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

                                    <button className="btn-sm btn btn-outline-secondary" onClick={() => setExportModal(false)}>
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
    );
}

export default AddMember