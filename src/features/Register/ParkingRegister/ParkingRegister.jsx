import  { useState } from 'react'
import "../../../styles/AddMember.css"
import "../../../styles/ParkingRegister.css"
import { Badge, Pagination } from '../../../components/Common/ReusableFunction';
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";

import { BiExport } from 'react-icons/bi';
import { FiFilter, FiSearch } from 'react-icons/fi';


const ParkingRegister = ({ setActive }) => {

    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
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


    const slotsList = [
        {
            "slot_no": "P-A01",
            "location": "Basement 1",
            "allocated_to": {
                "name": "Elena Gilbert",
                "unit": "Unit A-101",
                "role": "Owner",
                "avatar":  "../src/assets/profile.png"
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
                "avatar":  "../src/assets/profile.png"
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
                "avatar":  "../src/assets/profile.png"
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
                "avatar":  "../src/assets/profile.png"
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





    const handlePageChange = (value) => {
        setPage(value);
    
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
            setShow(false);

        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error)
        }
    };

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
                                                            onClick={() => {
                                                    setActive("parkingDetails");
                                                }}
                                                        >
                                                            View Slot
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                        // onClick={() => handleEdit(s)}
                                                        >
                                                            Edit Slot
                                                        </button>
                                                    </li>

                                                    <li><hr className="dropdown-divider" /></li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                        // onClick={() => handleDelete(s.flat_id)}
                                                        >
                                                            Delete Slot
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

                                        <span className="text-muted mt-1"><h6> records</h6></span>
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