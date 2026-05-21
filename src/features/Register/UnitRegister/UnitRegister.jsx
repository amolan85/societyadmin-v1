import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import "../../../styles/AddMember.css"
// import memberDetails from './MemberDetails';
import viewUnit from './ViewUnit';
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { GetSessionData } from '../../../utils/SessionManagement';
import { AddMemberApi, getMembersApi } from '../../../services/AddMemberApi';
import { getAllUnitsApi, AddUnitsApi, getAllBlocksApi, getAllFloorsApi, getAllUnitsBySearchApi } from '../../../services/UnitRegisterApi';
import { toast } from "react-toastify";
import { useLoader } from "../../../context/LoaderContext";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { all } from 'axios';
import { FiFilter, FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { BiExport } from 'react-icons/bi';


const UnitRegister = ({ setActive, setFlatId }) => {
    const [memType, setMemType] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const [wing, setWing] = useState("")

    const [flat, setFlat] = useState("")

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

    const [allUnits, setAllUnits] = useState([])
    const [memberTypeTab, setMemberTypeTab] = useState("")
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [search, setSearch] = useState("");

    const [flatNo, setFlatNo] = useState("");
    const [block, setBlock] = useState("");
    const [allBlocks, setAllBlocks] = useState([]);
    const [floor, setFloor] = useState("")
    const [allFloor, setAllFloor] = useState([])
    const [area, setArea] = useState("");
    const [unitType, setUnitType] = useState("");
    const [currentStatus, setCurrentStatus] = useState("")
    const [fullName, setFullName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")

    const [totalUnits, setTotalUnits] = useState("");
    const [occupancyRate, setOccupancyRate] = useState("");
    const [occupiedUnits, setOccupiedUnits] = useState("");
    const [vacantUnits, setVacantUnits] = useState("");
    const [allMemberDetails, setAllMemberDetails] = useState([]);



    useEffect(() => {
        SessionData()

    }, [])

    const SessionData = async () => {
        const data = await GetSessionData()
        console.log(data.data)
        const flats = data.data.flats[0]
        setSocietyId(flats.society_id)
        setUserId(flats.user_id)
        // setFloor(flats.floor)
        getAllUnits(flats.society_id)
        getAllBlocks(flats.society_id)
        getAllFloor(flats.society_id)
    }

    //function for get members
    const getAllUnits = async (societyId, page) => {
        try {
            const data = await getAllUnitsApi(societyId, page)
            setTotalUnits(data.total_units)
            // setOccupancyRate(data.occupancy_rate)
            setOccupiedUnits(data.occupied_units)
            setVacantUnits(data.vacant_units)

            setAllUnits(data.flats)
            setAllMemberDetails(data.flats)
            setPage(data.page)
            setLimit(data.per_page)
            setTotalCount(data.total_count)
        }
        catch (error) {
            console.error("Error fetching units:", error)
        }
    }

    const getAllBlocks = async (societyId, page) => {
        try {
            const data = await getAllBlocksApi(societyId)
            console.log(data.blocks, "All blocks")
            setAllBlocks(
                data.blocks.map((item) => ({
                    value: item.block,
                    label: item.block,
                }))
            );
        }
        catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    const getAllFloor = async (societyId, page) => {
        try {
            const data = await getAllFloorsApi(societyId)
            console.log(data.floors, "All floors")
            setAllFloor(
                data.floors.map((item) => ({
                    value: item.floor,
                    label: item.floor,
                }))
            );
        }
        catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    const getFlatById = async (flatId) => {
        setFlatId(flatId);
        setActive("viewUnit");
    }

    const handlePageChange = (value) => {
        setPage(value);
        getAllUnits(societyId, value);
    };

    //function for validation
    const validateForm = () => {
        let errors = {};

        if (!flatNo) {
            errors.flatNo = "required";
        }

        if (!block) {
            errors.block = "required";
        }

        if (!floor) {
            errors.floor = "required";
        }

        if (!area) {
            errors.area = "required";
        }
        if (!unitType) {
            errors.unitType = "required";
        }
        if (!currentStatus) {
            errors.currentStatus = "required";
        }
        if (!fullName) {
            errors.fullName = "required";
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

            const data = await AddUnitsApi(
                societyId, block.value, flatNo, floor.value, area, unitType, currentStatus, fullName, emailId, mobileNo
            );

            toast.success("Unit created successfully!")
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
        const worksheet = workbook.addWorksheet("Units");

        // add columns dynamically
        if (allUnits.length > 0) {
            worksheet.columns = Object.keys(allUnits[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add rows
            allUnits.forEach((item) => {
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
            "Units.xlsx"
        );
    };

    const downloadCSV = async () => {

        // create workbook
        const workbook = new ExcelJS.Workbook();

        // add worksheet
        const worksheet = workbook.addWorksheet("Units");

        // add columns dynamically
        if (allUnits.length > 0) {

            worksheet.columns = Object.keys(allUnits[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add allUnits
            allUnits.forEach((item) => {
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
        saveAs(blob, "Units.csv");
    };

    const downloadPDF = () => {

        // landscape mode
        const doc = new jsPDF("landscape");

        // PDF Heading
        doc.setFontSize(18);
        doc.text("Units Report", 14, 15);

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

        doc.save("Units.pdf");
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

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        const data = await getAllUnitsBySearchApi(societyId, value);
        console.log(data, "Search results");
        setAllUnits(data?.flats || []);
    }

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
                        [totalUnits, "Total Units"],
                        [occupiedUnits, "Occupancy Rate", "tile-grn"],
                        [occupiedUnits, "Occupied Units", "tile-org"],
                        [vacantUnits, "Vacant Units", "tile-pink"]
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
                            placeholder="Search by unit no, floor or owner..."
                            value={search}
                            onChange={handleSearch}
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
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}><BiExport /> Export</button>
                        <button className='btn btn-sm btn-primary ms-2' onClick={() => setShow(true)}>+ Add Unit</button>

                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {
                                        // ["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                                        ["UNIT NO.", "TYPE & AREA", "BLOCK/FLOOR", "CURRENT RESIDENT", "STATUS", "ACTIONS"]
                                            .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {allUnits.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.flat_number} </td>

                                        <td className="sa-name">{s.unit_type} .{s.area_sqft} sqft</td>
                                        <td className="sa-name">
                                            {`Block ${s.block} . ${s.floor === 1
                                                ? "1st"
                                                : s.floor === 2
                                                    ? "2nd"
                                                    : s.floor === 3
                                                        ? "3rd"
                                                        : `${s.floor}th`
                                                } Flr`}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">

                                                <img
                                                    src={s.profile_url || "../src/assets/profile.png"}
                                                    alt=""
                                                    width={38}
                                                    height={38}
                                                    className="rounded-circle object-fit-cover"
                                                />


                                                <div>
                                                    <div className="fw-semibold">
                                                        {
                                                            s?.members?.find((m) => m.occupancy_type === "owner")
                                                                ? `${s.members.find((m) => m.occupancy_type === "owner")?.first_name || ""} ${s.members.find((m) => m.occupancy_type === "owner")?.last_name || ""}`
                                                                : "-"
                                                        }
                                                    </div>

                                                    <small className="text-muted">
                                                        {
                                                            s?.members?.find((m) => m.occupancy_type === "owner")
                                                                ? `${s.members.find((m) => m.occupancy_type === "owner")?.email || ""}`
                                                                : ""
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {s.current_status && (
                                                <Badge
                                                    label={s.current_status}
                                                    c={
                                                        s.current_status === "Vacant"
                                                            ? "pink"
                                                            : s.current_status === "Occupied"
                                                                ? "blue"
                                                                : s.current_status === "Maintanance"
                                                                    ? "orange"
                                                                    : "grey"
                                                    }
                                                />
                                            )}
                                        </td>
                                        {/* <td className="sa-name"><button className="btn btn-light border-0" onClick={() => {

                                            getFlatById(s.flat_id)
                                        }}> ⋮</button></td> */}
                                        <td>
                                            <div className="member-action-dropdown dropdown">
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
                                                            onClick={() => getFlatById(s.flat_id)}
                                                        >
                                                            View Unit
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                        // onClick={() => handleEdit(s)}
                                                        >
                                                            Edit Unit
                                                        </button>
                                                    </li>

                                                    <li><hr className="dropdown-divider" /></li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                        // onClick={() => handleDelete(s.flat_id)}
                                                        >
                                                            Delete Unit
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
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
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title fw-semibold"><strong>Add New Unit</strong></h5>

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
                                            <label className='fw-semibold'><FiHome /> Unit Details</label>
                                            <div className="row g-3 mb-3 mt-1">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb" >Unit Number <span className="text-danger">*</span></label>
                                                        {errors.flatNo && <span className='text-danger mx-2 '>{errors.flatNo}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.flatNo ? "error-input" : ""}`} placeholder="Enter Unit Number" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Block / Tower <span className="text-danger">*</span></label>
                                                        {errors.block && <span className='text-danger mx-2 '>{errors.block}</span>}
                                                    </div>
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles) => ({
                                                                ...baseStyles,
                                                                borderColor: errors.block ? "red" : baseStyles.borderColor,
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                    borderColor: errors.block ? "red" : baseStyles.borderColor,
                                                                },
                                                            }),
                                                        }}
                                                        options={allBlocks}              // 👈 array of objects with value and label
                                                        value={block}                  // 👈 poora object
                                                        onChange={(selectedOption) => setBlock(selectedOption)} // 👈 direct object
                                                    />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'><label className="sv-lb">Floor <span className="text-danger">*</span></label>
                                                        {errors.floor && <span className='text-danger mx-2 '>{errors.floor}</span>}
                                                    </div>
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles) => ({
                                                                ...baseStyles,
                                                                borderColor: errors.floor ? "red" : baseStyles.borderColor,
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                    borderColor: errors.floor ? "red" : baseStyles.borderColor,
                                                                },
                                                            }),
                                                        }}
                                                        options={allFloor}              // 👈 array of objects with value and label
                                                        value={floor}                  // 👈 poora object
                                                        onChange={(selectedOption) => setFloor(selectedOption)} // 👈 direct object
                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Unit Type <span className="text-danger">*</span></label>
                                                        {errors.unitType && <span className='text-danger mx-2 '>{errors.unitType}</span>}
                                                    </div>
                                                    {/* <select className={`form-select form-control ${errors.unitType ? "error-input" : ""}`} value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                                                        <option>Select  Type</option>
                                                        {["101", "102", "103"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select> */}
                                                    <input className={`sv-in ${errors.unitType ? "error-input" : ""}`} placeholder="Enter Unit Type" value={unitType} onChange={(e) => setUnitType(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Area (sqft) <span className="text-danger">*</span></label>
                                                        {errors.area && <span className='text-danger mx-2 '>{errors.area}</span>}
                                                    </div>

                                                    <input className={`sv-in ${errors.area ? "error-input" : ""}`} placeholder="Enter Area" value={area} onChange={(e) => setArea(e.target.value)} />

                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Current Status <span className="text-danger">*</span></label>
                                                        {errors.currentStatus && <span className='text-danger mx-2 '>{errors.currentStatus}</span>}
                                                    </div>
                                                    <select className={`form-select form-control ${errors.currentStatus ? "error-input" : ""}`} value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
                                                        <option>Select  Type</option>
                                                        {["Vacant", "Occupied", "Maintanance"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <label className='fw-semibold'><FiUser /> Primary Owner</label>
                                            <div className="row g-3 mb-3 mt-1">
                                                <div className="col-12">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Full Name <span className="text-danger">*</span></label>
                                                        {errors.fullName && <span className='text-danger mx-2 '>{errors.fullName}</span>}
                                                    </div>

                                                    <input className={`sv-in ${errors.fullName ? "error-input" : ""}`} placeholder="Enter Owner Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />

                                                </div>

                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Email Address <span className="text-danger">*</span></label>
                                                        {errors.emailId && <span className='text-danger mx-2 '>{errors.emailId}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.emailId ? "error-input" : ""}`} placeholder="Enter Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Phone No. <span className="text-danger">*</span></label>
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
                                            </div>


                                            {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Unit</button>
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

                                        <span className="text-muted mt-1"><h6>{allUnits.length} records</h6></span>
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


                                <div className="modal-footer bg-light">

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

export default UnitRegister