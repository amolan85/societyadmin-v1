import React, { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
import parkingDetails from "../ParkingRegister/ParkingDetails";
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { GetSessionData } from '../../../utils/SessionManagement';
import { AddMemberApi, getMembersApi } from '../../../services/AddMemberApi';
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { all } from 'axios';
import { FiFilter, FiSearch } from 'react-icons/fi';


const ParkingRegister = ({ setActive }) => {
    const [memType, setMemType] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [wing, setWing] = useState("")
    const [flat, setFlat] = useState("")
    const [floor, setFloor] = useState("")
    const [residency, setResidency] = useState("")
    const [moveInDate, setMoveInDate] = useState("")
    const [moveOutDate, setMoveOutDate] = useState("")
    const [familyType, setFamilyType] = useState("")
    const [agreement, setAgreement] = useState("")
    const [rentAgreement, setRentAgreement] = useState("")
    const [policeNoc, setPoliceNoc] = useState("")
    const [idProof, setIdProof] = useState("")
    const [familyPhoto, setFamilyPhoto] = useState("")
    const [maintenanceReceipt, setMaintenanceReceipt] = useState("")
    const [ownershipDocuments, setOwnershipDocuments] = useState("")
    const [nominationDetails, setNominationDetails] = useState("")
    const [societyId, setSocietyId] = useState("")
    const [userId, setUserId] = useState("")
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const [allMembers, setAllMembers] = useState([])
    const [memberTypeTab, setMemberTypeTab] = useState("")
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [search, setSearch] = useState("");

    const memberType = [

        { id: "Resident", value: "owner" },
        { id: "Visitor", value: "tenant" },
        { id: "Handicap", value: "familyMember" },
        { id: "Service", value: "familyMember" },
    ];

    const addMemberType = [
        { id: "Resident", value: "owner" },
        { id: "Visitor", value: "tenant" },
        { id: "Handicap", value: "familyMember" },
        { id: "Service", value: "familyMember" },
    ];

    const vehicleType = [
        { id: "4 Wheeler", value: "owner" },
        { id: "2 Wheeler", value: "tenant" },
    ];

    const finalMemType =
        memType === "familyMember"
            ? familyType
            : memType;

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
    const getMembers = async (societyId, page) => {
        try {
            const data = await getMembersApi(societyId, page)
            setAllMembers(data.members)
            setPage(data.page)
            setLimit(data.per_page)
            setTotalCount(data.total_count)
        }
        catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    const getMembersById = async (memberId) => {
        // setMemberId(memberId);
        // setActive("memberDetails");
    }

    const handlePageChange = (value) => {
        setPage(value);
        getMembers(societyId, value);
    };

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
        // else {
        //     errors.emailId = ""
        // }
        if (!mobileNo) {
            errors.mobileNo = "required";
        } else if (!/^[0-9]{10}$/.test(mobileNo)) {
            errors.mobileNo = "Invalid mobile no.";
        }
        // else {
        //     errors.mobileNo = ""
        // }

        if (!wing) {
            errors.wing = "required";
        }

        if (!flat) {
            errors.flat = "required";
        }
        if (!moveInDate) {
            errors.moveInDate = "required";
        }
        if (memType === "owner") {

            if (!idProof) {
                errors.idProof = "required";
            }

            if (!agreement) {
                errors.agreement = "required";
            }

            if (!maintenanceReceipt) {
                errors.maintenanceReceipt = "required";
            }

            if (!nominationDetails) {
                errors.nominationDetails = "required";
            }

            if (!familyPhoto) {
                errors.familyPhoto = "required";
            }

            if (!ownershipDocuments) {
                errors.ownershipDocuments = "required";
            }


        }
        if (memType === "tenant") {

            if (!moveOutDate) {
                errors.moveOutDate = "required";
            }
            if (!rentAgreement) {
                errors.rentAgreement = "required";
            }
            if (!policeNoc) {
                errors.policeNoc = "required";
            }
        }
        return errors;
    };

    //submit function for add member
    const handleSubmit = async () => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const data = await AddMemberApi(
                societyId,
                userId,
                firstName,
                lastName,
                mobileNo,
                emailId,
                wing,
                flat,
                finalMemType,
                residency,
                moveInDate,
                moveOutDate,
                agreement,
                rentAgreement,
                policeNoc,
                idProof,
                familyPhoto,
                maintenanceReceipt,
                ownershipDocuments,
                nominationDetails
            );

            toast.success("Member created successfully!")
            setShow(false);

        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error)
        }
    };

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmailId("");
        setMobileNo("");
        setWing("");
        setFlat("");
        setFloor("");
        setResidency("");
        setMoveInDate("");
        setMoveOutDate("");
        setFamilyType("");
        setAgreement("");
        setRentAgreement("");
        setPoliceNoc("");
        setIdProof("");
        setFamilyPhoto("");
        setMaintenanceReceipt("");
        setOwnershipDocuments("");
        setNominationDetails("");

        setErrors({});
        setErrorText("");
    };

    const downloadExcel = async () => {
        // create workbook
        const workbook = new ExcelJS.Workbook();

        // add worksheet
        const worksheet = workbook.addWorksheet("Members");

        // add columns dynamically
        if (allMembers.length > 0) {
            worksheet.columns = Object.keys(allMembers[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add rows
            allMembers.forEach((item) => {
                worksheet.addRow(item);
            });
        }

        // header style
        worksheet.getRow(1).font = {
            bold: true,
        };

        // create buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // download file
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "Members.xlsx"
        );
    };

    const downloadCSV = async () => {

        // create workbook
        const workbook = new ExcelJS.Workbook();

        // add worksheet
        const worksheet = workbook.addWorksheet("Members");

        // add columns dynamically
        if (allMembers.length > 0) {

            worksheet.columns = Object.keys(allMembers[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add allMembers
            allMembers.forEach((item) => {
                worksheet.addRow(item);
            });
        }

        // header style
        worksheet.getRow(1).font = {
            bold: true,
        };

        // generate csv buffer
        const csvBuffer = await workbook.csv.writeBuffer();

        // create blob
        const blob = new Blob([csvBuffer], {
            type: "text/csv;charset=utf-8;",
        });

        // download file
        saveAs(blob, "Members.csv");
    };

    const downloadPDF = () => {

        // landscape mode
        const doc = new jsPDF("landscape");

        // PDF Heading
        doc.setFontSize(18);
        doc.text("Members Report", 14, 15);

        // table columns
        const tableColumn = [
            "First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "moveOutDate"
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
            item.moveOutDate
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

        else
            if (activeTab === "pdf") {
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

    const filteredBySearch = allMembers.filter((item) => {
        const searchText = search.trim().toLowerCase();

        return (
            item.first_name?.toLowerCase().includes(searchText) ||
            item.last_name?.toLowerCase().includes(searchText) ||
            item.flat_number?.toLowerCase().includes(searchText) ||
            item.block?.toLowerCase().includes(searchText) ||
            item.occupancy_type?.toLowerCase().includes(searchText)
        );
    });

    const total = Math.ceil(totalCount / limit);
    // const per = limit, total = Math.ceil(filteredData.length / per);
    // const rows = filteredData.slice((page - 1) * per, page * per);

    return (
        <>
            <div className="pg cp-wrap">

                {/* Header */}


                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [totalCount, "Total Slots"],
                        [totalOwners, "Allocated Slots",],
                        [totalTenant, "Guest Slots Open", "tile-org"],
                        [totalFamilyMember, "Reserved Slots", "tile-purple"]
                    ].map(([v, l, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className=" text-start text-muted">{l}</div>
                                <div className="tile-val text-start mt-1">{v}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    {/* <div>
                        <h4 className="cp-title">Members</h4>
                        <p className="cp-sub">
                            Manage and track all society members
                        </p>
                    </div> */}
                    <div className="col-12 col-md-4 col-lg-3 position-relative">
                        <span
                            style={{
                                position: "absolute",
                                left: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#aaa"
                            }}
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by slot no, vehicle or owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className='d-flex'>
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />

                            Filter
                        </button>
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}>⬇ Export</button>
                        <button className='btn btn-sm btn-primary ms-2' onClick={() => setShow(true)}>+ Add Slot</button>

                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {
                                        // ["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                                        ["SLOT NO.", "LOCATION", "ALLOCATED TO", "VEHICLE DETAILS", "STATUS", "ACTIONS"]
                                            .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBySearch.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.first_name} {s.last_name}</td>

                                        <td className="sa-name">{s.flat_number}</td>
                                        <td ><Badge label={
                                            s.occupancy_type
                                                ? s.occupancy_type
                                                    .replaceAll("_", " ")
                                                    .replace(/\b\w/g, (char) => char.toUpperCase())
                                                : ""
                                        }
                                            c={
                                                s.occupancy_type === "owner" ? "blue"
                                                    : s.occupancy_type === "tenant" ? "pink"
                                                        : s.occupancy_type === "family_member" ? "blue"
                                                            : "grey"
                                            }
                                        /></td>
                                        <td className="sa-name">{s.mobile}</td>
                                        <td><Badge label="Active" c="green" /> </td>
                                        <td className="sa-name"><button className="btn btn-sm btn-primary" onClick={() => {

                                            // getMembersById(s.user_id)
                                            setActive("parkingDetails")
                                        }}>View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        total={total}
                        onChange={handlePageChange}
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
                                    <h1 className="modal-title fs-5">Add Parking Slot</h1>

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
                                                        <label className="sv-lb" >Slot Number <span className="text-danger">*</span></label>
                                                        {errors.wing && <span className='text-danger mx-2 '>{errors.wing}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.firstName ? "error-input" : ""}`} placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Location / Zone <span className="text-danger">*</span></label>
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


                                            <label className="sv-lb">Parking Type <span className="text-danger">*</span></label>
                                            <div className="am-type-wrap mb-3">
                                                {addMemberType.map(t => (
                                                    <button
                                                        key={t.value}
                                                        onClick={() => { setMemType(t.value); resetForm() }}
                                                        className={`am-type-btn ${memType === t.value ? "active" : ""}`}
                                                    >
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <label className="sv-lb">Vehicle Suitability <span className="text-danger">*</span></label>
                                            <div className="am-type-wrap mb-3">
                                                {vehicleType.map(t => (
                                                    <button
                                                        key={t.value}
                                                        onClick={() => { setMemType(t.value); resetForm() }}
                                                        className={`am-type-btn ${memType === t.value ? "active" : ""}`}
                                                    >
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <div className='d-flex'><label className="sv-lb">Allocation Status <span className="text-danger">*</span></label>
                                                        {errors.firstName && <span className='text-danger mx-2 '>{errors.firstName}</span>}</div>
                                                    <select className={`form-select  ${errors.flat ? "error-input" : ""}`} value={flat} onChange={(e) => setFlat(e.target.value)}>
                                                        <option>Select Unit</option>
                                                        {["101", "102", "103"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>


                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Assign to Unit (Optional) <span className="text-danger">*</span></label>
                                                        {errors.mobileNo && <span className='text-danger mx-2 '>{errors.mobileNo}</span>}
                                                    </div>

                                                    <input className={`sv-in ${errors.emailId ? "error-input" : ""}`} placeholder="Search Unit" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                                </div>


                                            </div>


                                            {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Slot</button>
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

export default ParkingRegister