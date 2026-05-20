import React, { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
import "../../../styles/ParkingRegister.css"
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
import { BiExport } from 'react-icons/bi';


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


    const [slotNo, setSlotNo] = useState("");
    const [location, setLocation] = useState("");
    const [allLocation, setAllLocation] = useState("");
    const [parkingType, setParkingType] = useState("");
    const [vehicleSuitability, setVehicleSuitability] = useState("");
    const [allocationStatus, setAllocationStatus] = useState("");
    const [assignUnit, setAssignUnit] = useState("");

    const parkingTypeList = [
        { id: "Resident", value: "resident" },
        { id: "Visitor", value: "visitor" },
        { id: "Handicap", value: "handicap" },
        { id: "Service", value: "service" },
    ];

    const vehicleType = [
        { id: "4 Wheeler", value: "4wheeler" },
        { id: "2 Wheeler", value: "2wheeler" },
    ];

    const finalMemType =
        memType === "familyMember"
            ? familyType
            : memType;

    const slotsList = [
        {
            "slot_no": "P-A01",
            "location": "Basement 1",
            "allocated_to": {
                "name": "Elena Gilbert",
                "unit": "Unit A-101",
                "role": "Owner",
                "avatar": "https://i.pravatar.cc/60?img=32"
            },
            "vehicle_details": {
                "vehicle_name": "Honda City",
                "vehicle_number": "MH-12-AB-1234",

            },
            "status": {
                "label": "Allocated",
                "color": "#38bdf8",
                "bg_color": "#e0f2fe",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        },
        {
            "slot_no": "P-A02",
            "location": "Basement 1",
            "allocated_to": {
                "name": "Vikram Singh",
                "unit": "Unit A-102",
                "role": "Tenant",
                "avatar": "https://i.pravatar.cc/60?img=15"
            },
            "vehicle_details": {
                "vehicle_name": "Toyota Innova",
                "vehicle_number": "MH-14-XY-9876",

            },
            "status": {
                "label": "Allocated",
                "color": "#38bdf8",
                "bg_color": "#e0f2fe",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        },
        {
            "slot_no": "P-G01",
            "location": "Ground (Open)",
            "allocated_to": {
                "name": "Guest Parking",
                "unit": "",
                "role": "",
                "avatar": ""
            },
            "vehicle_details": {
                "vehicle_name": "",
                "vehicle_number": "",

            },
            "status": {
                "label": "Available",
                "color": "#22c55e",
                "bg_color": "#dcfce7",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        },
        {
            "slot_no": "P-B05",
            "location": "Basement 2",
            "allocated_to": {
                "name": "Sarah Williams",
                "unit": "Unit B-204",
                "role": "Owner",
                "avatar": "https://i.pravatar.cc/60?img=25"
            },
            "vehicle_details": {
                "vehicle_name": "Tesla Model 3",
                "vehicle_number": "EV-22-ZZ-5555",

            },
            "status": {
                "label": "Allocated",
                "color": "#38bdf8",
                "bg_color": "#e0f2fe",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        },
        {
            "slot_no": "P-V01",
            "location": "Podium",
            "allocated_to": {
                "name": "Management Reserved",
                "unit": "",
                "role": "",
                "avatar": ""
            },
            "vehicle_details": {
                "vehicle_name": "",
                "vehicle_number": "",

            },
            "status": {
                "label": "Reserved",
                "color": "#d946ef",
                "bg_color": "#fae8ff",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        },
        {
            "slot_no": "P-C12",
            "location": "Basement 1",
            "allocated_to": {
                "name": "Hiroshi Tanaka",
                "unit": "Unit C-501",
                "role": "Owner",
                "avatar": "https://i.pravatar.cc/60?img=41"
            },
            "vehicle_details": {
                "vehicle_name": "Tesla Model 3",
                "vehicle_number": "EV-22-ZZ-5555",

            },
            "status": {
                "label": "Allocated",
                "color": "#38bdf8",
                "bg_color": "#e0f2fe",

            },
            "actions": {
                "menu_icon": "⋮"
            }
        }
    ]
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

        if (!slotNo) {
            errors.slotNo = "required";
        }

        if (!location) {
            errors.location = "required";
        }

        if (!parkingType) {
            errors.parkingType = "required";
        }

        if (!vehicleSuitability) {
            errors.vehicleSuitability = "required";
        }
        if (!allocationStatus) {
            errors.allocationStatus = "required";
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

            // const data = await AddMemberApi(
            //     societyId,
            //     userId,
            //     firstName,
            //     lastName,
            //     mobileNo,
            //     emailId,
            //     wing,
            //     flat,
            //     finalMemType,
            //     residency,
            //     moveInDate,
            //     moveOutDate,
            //     agreement,
            //     rentAgreement,
            //     policeNoc,
            //     idProof,
            //     familyPhoto,
            //     maintenanceReceipt,
            //     ownershipDocuments,
            //     nominationDetails
            // );

            // toast.success("Member created successfully!")
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
                        ["512", "Total Slots"],
                        ["450", "Allocated Slots",],
                        ["14", "Guest Slots Open", "tile-grn"],
                        ["48", "Reserved Slots", "tile-purple"]
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
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}><BiExport /> Export</button>
                        <button className='btn btn-sm btn-primary ms-2' onClick={() => setShow(true)}>+ Add Slot</button>

                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["SLOT NO.", "LOCATION", "ALLOCATED TO", "VEHICLE DETAILS", "STATUS", "ACTIONS"]
                                        .map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                </tr>
                            </thead>

                            <tbody>
                                {slotsList.map((s, i) => (
                                    <tr className="text-start" key={i}>

                                        {/* SLOT NO */}
                                        <td className="fw-semibold">{s.slot_no}</td>

                                        {/* LOCATION */}
                                        <td>{s.location}</td>

                                        {/* ALLOCATED TO */}
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {s.allocated_to?.avatar && (
                                                    <img
                                                        src={s.allocated_to.avatar}
                                                        alt=""
                                                        width={38}
                                                        height={38}
                                                        className="rounded-circle object-fit-cover"
                                                    />
                                                )}

                                                <div>
                                                    <div className="fw-semibold">
                                                        {s.allocated_to?.name}
                                                    </div>

                                                    <small className="text-muted">
                                                        {s.allocated_to?.unit}{" "}
                                                        {s.allocated_to?.role &&
                                                            `- ${s.allocated_to.role}`}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* VEHICLE DETAILS */}
                                        <td>
                                            <div className="fw-semibold">
                                                {s.vehicle_details?.icon}{" "}
                                                {s.vehicle_details?.vehicle_name}
                                            </div>

                                            <small className="text-muted">
                                                {s.vehicle_details?.vehicle_number}
                                            </small>
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <Badge
                                                label={`${s.status?.label}`}
                                                c={
                                                    s.status?.label === "Allocated"
                                                        ? "blue"
                                                        : s.status?.label === "Available"
                                                            ? "green"
                                                            : s.status?.label === "Reserved"
                                                                ? "purple"
                                                                : "grey"
                                                }
                                                style={{
                                                    padding: "6px 14px",
                                                    borderRadius: "30px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            />
                                        </td>

                                        {/* ACTIONS */}
                                        <td>
                                            <button
                                                className="btn btn-light border-0"
                                                onClick={() => {
                                                    setActive("parkingDetails");
                                                }}
                                            >
                                                ⋮
                                            </button>
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
                                                        {errors.slotNo && <span className='text-danger mx-2 '>{errors.slotNo}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.slotNo ? "error-input" : ""}`} placeholder="Eg. P-101" value={slotNo} onChange={(e) => setSlotNo(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Location / Zone <span className="text-danger">*</span></label>
                                                        {errors.location && <span className='text-danger mx-2 '>{errors.location}</span>}
                                                    </div>
                                                    <select className={`form-select  ${errors.location ? "error-input" : ""}`} value={location} onChange={(e) => setLocation(e.target.value)}>
                                                        <option>Select zone</option>
                                                        {["Zone A", "Zone B", "Zone C"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Parking Type <span className="text-danger">*</span>
                                                </label>
                                                {errors.parkingType && <span className='text-danger mx-2 '>{errors.parkingType}</span>}
                                            </div>
                                            <div className="ps-type-wrap mb-3">
                                                {parkingTypeList.map((t) => (
                                                    <button
                                                        type="button"
                                                        key={t.value}
                                                        onClick={() => setParkingType(t.value)}
                                                        className={`ps-type-btn 
                                                         ${parkingType === t.value ? "active" : ""}
                                                         ${errors.parkingType ? "error-btn" : ""}
                                                          `}
                                                    >
                                                        {t.icon && <span className="me-2">{t.icon}</span>}
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <label className="sv-lb">
                                                Vehicle Suitability <span className="text-danger">*</span>
                                            </label>

                                            <div className="ps-type-wrap mb-3">
                                                {vehicleType.map((t) => (
                                                    <button
                                                        type="button"
                                                        key={t.value}
                                                        onClick={() => setVehicleSuitability(t.value)}
                                                        className={`ps-type-btn ${vehicleSuitability === t.value ? "active" : ""} ${errors.vehicleSuitability ? "error-btn" : ""}`}
                                                    >
                                                        {t.icon && <span className="me-2">{t.icon}</span>}
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <div className='d-flex'><label className="sv-lb">Allocation Status <span className="text-danger">*</span></label>
                                                        {errors.allocationStatus && <span className='text-danger mx-2 '>{errors.allocationStatus}</span>}</div>
                                                    <select className={`form-select  ${errors.allocationStatus ? "error-input" : ""}`} value={allocationStatus} onChange={(e) => setAllocationStatus(e.target.value)}>
                                                        <option>Select Status</option>
                                                        {["Available", "Allocated", "Reserved"].map(w => (
                                                            <option key={w} >{w}</option>
                                                        ))}
                                                    </select>
                                                </div>


                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <div className='d-flex'>
                                                        <label className='sv-lb'>Assign to Unit (Optional)</label>
                                                        {/* {errors.mobileNo && <span className='text-danger mx-2 '>{errors.mobileNo}</span>} */}
                                                    </div>

                                                    <input className={`sv-in ${errors.assignUnit ? "error-input" : ""}`} placeholder="Search Unit (eg-C-501)" value={assignUnit} onChange={(e) => setAssignUnit(e.target.value)} />
                                                </div>


                                            </div>


                                            {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">

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