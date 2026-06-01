import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import "../../styles/Parking.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import { TbParking, TbMapPinOff, TbLayersIntersect, TbFileOff, TbClockX, TbAlertCircle, TbMotorbike, TbCar } from "react-icons/tb";

import {
    AddMemberApi,
    getAllMembersWithoutPaginationApi,
    UpdateMemberApi,
    deleteMembersApi,
} from "../../services/AddMemberApi";
import { toast } from "react-toastify";
import { FiAlertCircle, FiDownload, FiFilter, FiGrid, FiPlus, FiSearch, FiTrendingUp } from "react-icons/fi";
import {
    FiEye,
    FiTruck,
    FiAlertTriangle,
    FiClock,
    FiSlash,
} from "react-icons/fi";
import {
    FaFileUpload,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
} from "react-icons/fa";

// import MemberModal from "./MemberModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import { BiCar } from "react-icons/bi";
import { parkingDashboardApi, violationAlertsApi, visitorParkingApi } from "../../services/ParkingApi";
// import RegisterTenantsModal from "./RegisterTenantsModal";

const ParkingDashboard = ({ setActive }) => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const [allMembers, setAllMembers] = useState([]);
    const [allMembersWithoutPagination, setAllMembersWithoutPagination] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [mId, setMId] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");

    const [totalSlots, setTotalSlots] = useState("");
    const [occupanyRate, setOccupanyRate] = useState("");
    const [visitorSlots, setVisitorSlots] = useState("");
    const [activeViolation, setActiveViolation] = useState("");
    const [allVisitorParking, setAllVisitorParking] = useState([]);
    const [allViolationAlerts, setAllViolationAlerts] = useState([]);

    const getViolationIcon = (violationType) => {
        const icons = {
            unauthorized_parking: { icon: <TbParking size={18} />, color: "#ef4444" },
            wrong_slot: { icon: <TbMapPinOff size={18} />, color: "#f97316" },
            double_parking: { icon: <TbLayersIntersect size={18} />, color: "#eab308" },
            no_sticker: { icon: <TbFileOff size={18} />, color: "#8b5cf6" },
            visitor_overstay: { icon: <TbClockX size={18} />, color: "#3b82f6" },
            other: { icon: <TbAlertCircle size={18} />, color: "#6b7280" },
        };
        return icons[violationType] ?? icons.other;
    };
    const getVehicleIcon = (vehicleType) => {
        const icons = {
            "2_wheeler": { icon: <TbMotorbike size={18} />, color: "#f97316" },
            "4_wheeler": { icon: <TbCar size={18} />, color: "#3b82f6" },
        };
        return icons[vehicleType] ?? icons["4_wheeler"];
    };
    const tenantData = [
        {
            unitNo: "Unit B-402",
            owner: "Amit Patel",
            tenantName: "Rohan Sharma",
            tenantContact: "rohan.s@email.com",
            avatar: "https://i.pravatar.cc/40?img=1",

            leaseStart: "01 Mar 2024",
            leaseEnd: "28 Feb 2025",
            duration: "11 Months",

            kycStatus: "Pending Verification",
            kycColor: "warning",
            kycIcon: <FaClock />,

            agreementStatus: "Uploaded",
            agreementColor: "primary",
            agreementIcon: <FaFileUpload />,

            action: "Review & Approve",
            actionColor: "warning",
        },
        {
            unitNo: "Unit A-105",
            owner: "Rajesh Kumar",
            tenantName: "Sarah Jenkins",
            tenantContact: "+91 98765 43210",
            avatar: "https://i.pravatar.cc/40?img=2",

            leaseStart: "15 Nov 2023",
            leaseEnd: "14 Nov 2024",
            duration: "Expires in 12 Days",

            kycStatus: "Verified",
            kycColor: "success",
            kycIcon: <FaCheckCircle />,

            agreementStatus: "Expiring Soon",
            agreementColor: "danger",
            agreementIcon: <FaExclamationTriangle />,

            action: "View Details",
            actionColor: "primary",
        },
        {
            unitNo: "Unit C-301",
            owner: "Priya Singh",
            tenantName: "David Osei",
            tenantContact: "david.o@email.com",
            avatar: "https://i.pravatar.cc/40?img=3",

            leaseStart: "10 Jan 2024",
            leaseEnd: "09 Jan 2025",
            duration: "11 Months",

            kycStatus: "Verified",
            kycColor: "success",
            kycIcon: <FaCheckCircle />,

            agreementStatus: "Active",
            agreementColor: "success",
            agreementIcon: <FaCheckCircle />,

            action: "View Details",
            actionColor: "primary",
        },
        {
            unitNo: "Unit D-204",
            owner: "Vikram Reddy",
            tenantName: "Neha Gupta",
            tenantContact: "+91 98111 22233",
            avatar: "https://i.pravatar.cc/40?img=4",

            leaseStart: "--",
            leaseEnd: "--",
            duration: "Awaiting Draft",

            kycStatus: "Pending KYC",
            kycColor: "warning",
            kycIcon: <FaClock />,

            agreementStatus: "Not Uploaded",
            agreementColor: "secondary",
            agreementIcon: <FaFileUpload />,

            action: "Upload",
            actionColor: "secondary",
        },
    ];

    const visitorParkingData = [
        {
            id: 1,
            vehicleNo: "KA-05-MH-2023",
            description: "Visiting: Unit B-402",
            slot: "V-12",
            remaining: "2h 15m remaining",
            remainingColor: "#22c55e",
            icon: BiCar,
        },
        {
            id: 2,
            vehicleNo: "MH-12-AB-9988",
            description: "Visiting: Unit A-101",
            slot: "V-04",
            remaining: "15m remaining",
            remainingColor: "#f59e0b",
            icon: BiCar,
        },
        {
            id: 3,
            vehicleNo: "DL-3C-CC-1122",
            description: "Delivery: Maintenance",
            slot: "V-01",
            remaining: "4h remaining",
            remainingColor: "#22c55e",
            icon: FiTruck,
        },
    ];

    const violationAlertsData = [
        {
            id: 1,
            title: "Unauthorized Parking",
            description: "Slot P-102 (Reserved for A-302)",
            icon: FiAlertTriangle,
            iconColor: "#ef4444",
            bgColor: "#fee2e2",
        },
        {
            id: 2,
            title: "Visitor Overstay",
            description: "Slot V-05 (Visitor of C-101)",
            icon: FiClock,
            iconColor: "#ef4444",
            bgColor: "#fee2e2",
        },
        {
            id: 3,
            title: "Wrong Slot Usage",
            description: "Member parked in Visitor Zone",
            icon: FiSlash,
            iconColor: "#ef4444",
            bgColor: "#fee2e2",
        },
    ];

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        console.log(data.data);
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        parkingDashboard(flats.society_id);
        visitorParking(flats.society_id);
        violationAlerts(flats.society_id);

    };

    //function for get members
    const parkingDashboard = async (societyId) => {
        try {
            const data = await parkingDashboardApi(societyId);

            setTotalSlots(data.overview.total_slots);
            setOccupanyRate(data.overview.occupancy_rate_percent);
            setVisitorSlots(data.allocations.visitor_slots_available);
            setActiveViolation(data.violations.open_violations)
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    //function for get visitor parking details
    const visitorParking = async (societyId) => {
        try {
            const data = await visitorParkingApi(societyId, page, limit);
            setAllVisitorParking(data.visitor_parking || []);
        } catch (error) {
            console.error("Error fetching visitor parking list:", error);
        }
    };

    //function for get violation alerts details
    const violationAlerts = async (societyId) => {
        try {
            const data = await violationAlertsApi(societyId, page, limit);
            setAllViolationAlerts(data.violations || []);
        } catch (error) {
            console.error("Error fetching violation alerts:", error);
        }
    };

    const handlePageChange = (value) => {
        setPage(value);
        // getMembers(societyId, value);
    };

    const handleDelete = async (memberId) => {
        const confirmed = window.confirm("Are you sure you want to delete this Parking slot?");

        if (!confirmed) return;

        try {
            const data = await deleteMembersApi(memberId);
            console.log(data, "Delete response");
            toast.success("Member deleted successfully");
            // getMembers(societyId, page);
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error);
        }
    };

    const handleParkingList = async () => {
        setActive("parkingList")
    }

    const exportData =
        selectedRange === "all"
            ? allMembersWithoutPagination
            : selectedRange === "search"
                ? allMembers
                : "";


    const downloadExcel = async () => {
        exportFile({
            data: exportData,
            fileName: "Members",
            sheetName: "Members",
            type: "xlsx",
        });
    };

    const downloadCSV = async () => {
        exportFile({
            data: exportData,
            fileName: "Members",
            sheetName: "Members",
            type: "csv",
        });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Members Report",
            fileName: "Members",
            columns: [
                "Member Name",
                "Unit No.",
                "Role",
                "Contact Info",
            ],
            data: exportData.map((item) => [
                item.first_name + " " + item.last_name,
                item.flat_number,
                item.occupancy_type,
                item.mobile,
            ]),
        });
    };

    const handleExport = () => {
        if (activeTab === "excel") {
            downloadExcel();
            setExportModal(false);
        } else if (activeTab === "csv") {
            downloadCSV();
            setExportModal(false);
        } else if (activeTab === "pdf") {
            downloadPDF();
            setExportModal(false);
        }
    };


    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        try {
            if (!value.trim()) {
                setPage(1);
                // await getMembers(societyId, 1);
                return;
            }

            if (value.length < 3) return;

            const data = await getAllMembersWithoutPaginationApi(
                societyId,
                value
            );

            setAllMembers(data?.members || []);
        } catch (error) {
            console.error("Search error:", error);
        }
    };
    const total = Math.ceil(totalCount / limit);

    return (
        <>
            <div className="pg cp-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Parking Dashboard</h4>
                        <p className="cp-sub">
                            Monitor occupancy, manage visitor parking, and handle violations.
                        </p>
                    </div>
                    <div className='d-flex'>
                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() =>
                            setActive("parkingRules")}>Parking Rules</button>
                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() =>
                            setShow(true)}>+ Allocate Slot</button>

                    </div>

                </div>


                <div className="row g-3 mb-4">
                    {[
                        [totalSlots, "Total Slots", "Across 3 levels", "tile-black", <FiGrid />, handleParkingList],
                        [occupanyRate, "Occupancy Rate", "+ 2% this week", "tile-black", <FiTrendingUp />],
                        [visitorSlots, "Visitor Slots Active", "/ 25 Available", "tile-black", <FiClock />],
                        [activeViolation, "Active Violations", "Needs attention", "tile-black", <FiAlertTriangle />],
                    ].map(([v, l, subText, cls, icon, onClick]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div
                                className={`tile bg-white ${cls}`}
                                onClick={onClick}
                                style={{
                                    borderRadius: "10px",
                                    padding: "18px",
                                    minHeight: "120px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                    cursor: "pointer"
                                }}
                            >

                                <div className="d-flex justify-content-between align-items-start">

                                    <div
                                        className="text-start text-muted"
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        {l}
                                    </div>

                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            background:
                                                l === "Total Slots"
                                                    ? "#e8f1ff"
                                                    : l === "Occupancy Rate"
                                                        ? "#fff1e7"
                                                        : l === "Visitor Slots Active"
                                                            ? "#f5e8ff"
                                                            : "#ffe9e9",

                                            color:
                                                l === "Total Slots"
                                                    ? "#3b82f6"
                                                    : l === "Occupancy Rate"
                                                        ? "#fb923c"
                                                        : l === "Visitor Slots Active"
                                                            ? "#d946ef"
                                                            : "#ef4444",

                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "18px"
                                        }}
                                    >
                                        {icon}
                                    </div>

                                </div>

                                <div className="text-start"
                                    style={{
                                        fontSize: "35px",
                                        fontWeight: "700",
                                        lineHeight: "1",
                                        color: "#111",
                                        marginTop: "8px"
                                    }}
                                >
                                    {v}{l === "Occupancy Rate" && (
                                        <span style={{ fontSize: "28px", fontWeight: "600", color: "#555" }}>%</span>
                                    )}
                                </div>

                                {subText && (
                                    <div className="text-start"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            marginTop: "14px",
                                            color:
                                                l === "Occupancy Rate"
                                                    ? "#22c55e"
                                                    : l === "Active Violations"
                                                        ? "#ef4444"
                                                        : "#999"
                                        }}
                                    >{l === "Occupancy Rate" && <FiTrendingUp size={12} />}

                                        {subText}
                                    </div>
                                )}

                            </div>

                        </div>
                    ))}
                </div>

                <div className="row g-3">

                    {/* Visitor Parking */}
                    <div className="col-md-6">
                        <div className="vpd-card">

                            <div className="vpd-header">
                                <div className="vpd-title">
                                    <FiEye className="me-2 text-primary" />
                                    VISITOR PARKING
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    {[FiSearch, FiFilter, FiDownload, FiPlus].map((Icon, i) => (
                                        <button
                                            key={i}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "10px",
                                                border: "1px solid #dde0ee",
                                                background: "#ffffff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                color: "#555",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {allVisitorParking.map((item) => {
                                // const Icon = item.icon;

                                return (
                                    <div key={item.id} className="vpd-row" style={{ cursor: "pointer" }} onClick={() => setActive("visitorDetails")}>

                                        <div className="d-flex align-items-center" >
                                            <div className="vpd-icon-wrapper" style={{ color: getVehicleIcon(item.vehicle_type).color }}>
                                                {/* <Icon size={18} color="#6b7280" /> */}
                                                 {getVehicleIcon(item.vehicle_type).icon}
                                            </div>

                                            <div>
                                                <div className="vpd-name text-start">
                                                    {item.vehicle_number}
                                                </div>

                                                <div className="vpd-subtitle text-start">
                                                    {/* {item.description} */}
                                                    {item.vehicle_type} {item.block}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <div className="vpd-slot">
                                                {item.slot_number}
                                            </div>

                                            <div
                                                className="vpd-time"
                                                style={{ color: item.remainingColor }}
                                            >
                                                {item.remaining}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="vpd-footer">
                                View All Visitors
                            </div>
                        </div>
                    </div>

                    {/* Violation Alerts */}
                    <div className="col-md-6">
                        <div className="vpd-card">

                            <div className="vpd-header">
                                <div className="vpd-title text-danger">
                                    <FiAlertCircle className="me-2" />
                                    VIOLATION ALERTS
                                </div>

                                {/* <div className="d-flex gap-2">
                                    <FiFilter />
                                    <FiDownload />
                                    <FiPlus />
                                </div> */}
                                <div className="d-flex align-items-center gap-2">
                                    {[FiFilter, FiDownload, FiPlus].map((Icon, i) => (
                                        <button
                                            key={i}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "10px",
                                                border: "1px solid #dde0ee",
                                                background: "#ffffff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                color: "#555",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {allViolationAlerts.map((item) => {
                                // const Icon = item.icon;
                                const { icon, color } = getViolationIcon(item.violation_type);
                                return (
                                    <div key={item.id} className="vpd-row">

                                        <div className="d-flex align-items-center">

                                            <div
                                            // className="vpd-alert-icon"
                                            // style={{
                                            //     background: item.bgColor, textAlign: "start"
                                            // }}
                                            >  <div className="vpd-icon-wrapper" style={{ color }}>
                                                    {icon}
                                                </div>
                                                {/* <Icon
                                                    size={18}
                                                    color={item.iconColor}
                                                /> */}
                                            </div>

                                            <div style={{ textAlign: "start", cursor: "pointer" }} onClick={() => setActive("viewParkingDetails")}>
                                                <div className="vpd-name">
                                                    {item.violation_type}
                                                </div>

                                                <div className="vpd-subtitle">
                                                    {item.description}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                            <div className="vpd-footer">
                                View All Violations
                            </div>
                        </div>
                    </div>
                </div >


                <div className="sv-card p-0 overflow-hidden mt-4">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    <th>REQUEST ID.</th>
                                    <th>APPLICANT</th>
                                    <th>TYPE</th>
                                    <th>DURATION</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tenantData.map((item, index) => (
                                    <tr key={index}>
                                        {/* Unit */}
                                        <td className="text-start">
                                            <div className="fw-bold">{item.unitNo}</div>
                                            <small className="text-muted">
                                                Owner: {item.owner}
                                            </small>
                                        </td>

                                        {/* Tenant */}
                                        <td className="text-start">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={item.avatar}
                                                    alt=""
                                                    width="40"
                                                    height="40"
                                                    className="rounded-circle"
                                                />

                                                <div>
                                                    <div className="fw-semibold">
                                                        {item.tenantName}
                                                    </div>
                                                    <small className="text-muted">
                                                        {item.tenantContact}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Lease */}
                                        <td className="text-start">
                                            <div className="text-start">
                                                {item.leaseStart} - {item.leaseEnd}
                                            </div>

                                            <small
                                                className={
                                                    item.duration.includes("Expires")
                                                        ? "text-danger"
                                                        : "text-muted"
                                                }
                                            >
                                                {item.duration}
                                            </small>
                                        </td>

                                        {/* KYC */}
                                        <td className="text-start">
                                            {/* <span
                                                className={`badge rounded-pill bg-${item.kycColor}-subtle text-${item.kycColor}`}
                                            >
                                                {item.kycIcon} {item.kycStatus}
                                            </span> */}
                                            <Badge
                                                label={item.kycStatus}
                                                c={
                                                    item.kycStatus === "Verified"
                                                        ? "green"
                                                        : item.kycStatus === "Pending Verification"
                                                            ? "yellow"
                                                            : item.kycStatus === "Pending KYC"
                                                                ? "yellow"
                                                                : "gray"
                                                }
                                            />{" "}

                                        </td>
                                        {/* Action */}
                                        {/* <td className="text-start">
                                            <button
                                                className={`btn btn-sm btn-outline-${item.actionColor}`}
                                           onClick={()=>setActive("rentalsApplication")}
                                           >
                                                {item.action}
                                            </button>
                                        </td> */}
                                        <td className="text-start">
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
                                                            // onClick={() =>
                                                            //     getMembersById(s.user_id, s.flat_id)
                                                            // }
                                                            onClick={() => setActive("rentalsApplication")}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                        // onClick={() => {
                                                        //     setMode("edit");
                                                        //     setShow(true);
                                                        //     GetMemberDetailsById(s.user_id);
                                                        // }}
                                                        >
                                                            Edit Parking
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => handleDelete(s.user_id)}
                                                        >
                                                            Delete parking
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
                    <Pagination page={page} total={total} onChange={handlePageChange} />
                </div>
            </div >

        </>
    );
};

export default ParkingDashboard;
