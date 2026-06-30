import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import "../../styles/Parking.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import AllotVisitorParkingModal from "./AllotVisitorParkingModal";
import { ListVisitorsApi } from "../../services/VisitorApi";
import { TbCircleMinus, TbParking, TbMapPinOff, TbFileOff, TbAlertCircle, TbClockX, TbAlertTriangle, TbMotorbike, TbCar, TbTruck } from "react-icons/tb";

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

import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import { BiCar } from "react-icons/bi";
import { parkingDashboardApi, ListParkingSlotsApi } from "../../services/ParkingApi";
import { violationAlertsApi, createViolationAlertApi } from "../../services/ViolationAlertsApi";
import AllocateSlotModal from "./AllocateSlotModal";
import { visitorParkingApi, getVisitorParkingByIdApi, AllotVisitorParkingApi } from "../../services/VisitorParkingApi";
import ViolationAlertModal from "./ViolationAlertModal";
import { ListVehiclesApi, GetVehicleByIdApi } from "../../services/VehicleRegisterAPI";

const ParkingDashboard = ({ setActive, setViolationId, setVisitorParkingId, setVehicleId }) => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [allMembers, setAllMembers] = useState([]);
    const [allMembersWithoutPagination, setAllMembersWithoutPagination] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [mId, setMId] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");
    const [allVehicles, setAllVehicles] = useState([]);
    const [totalSlots, setTotalSlots] = useState("");
    const [occupanyRate, setOccupanyRate] = useState("");
    const [visitorSlots, setVisitorSlots] = useState("");
    const [activeViolation, setActiveViolation] = useState("");
    const [allVisitorParking, setAllVisitorParking] = useState([]);
    const [allViolationAlerts, setAllViolationAlerts] = useState([]);
    const [showAllocateSlot, setShowAllocateSlot] = useState(false);

    //visitor Parking
    const [showVisitorParkingModal, setShowVisitorParkingModal] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [allVisitors, setAllVisitors] = useState([]);
    const vehicleTypeOptions = [
        {
            value: "2_wheeler",
            label: "2 Wheeler",
        },
        {
            value: "4_wheeler",
            label: "4 Wheeler",
        },
    ];
    // ViolationAlertModal state
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [allBlocks, setAllBlocks] = useState([]);
    const [allFlats, setAllFlats] = useState([]);
    const [blocks, setBlocks] = useState("");
    const [flat, setFlat] = useState(null);

    // ✅ violationType replaces memType for violation_type field
    const [violationType, setViolationType] = useState(null);

    // ✅ vehicleType is now a separate state
    const [vehicleType, setVehicleType] = useState(null);
 
    const [firstName, setFirstName] = useState("");        
    const [lastName, setLastName] = useState("");       
    const [mobileNo, setMobileNo] = useState("");
    const [emailId, setEmailId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [mode, setMode] = useState("add");
    const [penaltyamount, setPenaltyAmount] = useState("");
    const [description, setDescription] = useState("");
    const [allSlots, setAllSlots] = useState([]);
    const [slot, setSlot] = useState(null);
    const [vehicleNo, setVehicleNo] = useState("");

    
   


    const getViolationIcon = (violationType) => {
        const icons = {
            unauthorized_parking: <TbAlertTriangle size={18} color="#ef4444" />,
            visitor_overstay: <TbClockX size={18} color="#ef4444" />,
            wrong_slot: <TbCircleMinus size={18} color="#ef4444" />,
            double_parking: <TbParking size={18} color="#ef4444" />,
            no_sticker: <TbFileOff size={18} color="#ef4444" />,
            other: <TbAlertCircle size={18} color="#ef4444" />,
        };
        return icons[violationType] ?? icons.other;
    };
    // const getVisitors = async (societyId) => {
    //     console.log("Fetching visitors for society:", societyId);
    //     try {
    //         const data = await ListVisitorsApi(
    //             societyId,
    //             1,
    //             100,
    //             "",
    //             "",
    //             "",
    //             "",
    //             "",
    //             ""
    //         );

    //         const visitorOptions = (data?.visitors || []).map((item) => ({
    //             value: item.id,
    //             label: item.visitor_name || item.name,
    //         }));

    //         setAllVisitors(visitorOptions);
    //     } catch (error) {
    //         console.error("Error fetching visitors:", error);
    //     }
    // };
    const handleVisitorParkingSubmit = async () => {
        try {
            const payload = {
                society_id: Number(societyId),
                visitor_entry_id: selectedVisitor?.value,
                slot_id: selectedSlot?.value,
                allotted_by: Number(userId),
                vehicle_number: vehicleNumber,
                vehicle_type: selectedVehicleType?.value,
                remarks: remarks || "",
            };

            console.log("Payload:", payload);

            await AllotVisitorParkingApi(payload);

            toast.success("Visitor parking allotted successfully");

            setShowVisitorParkingModal(false);
            visitorParking(societyId);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to allot parking");
        }
    };
    const getVehicles = async (societyId) => {
        try {
            const data = await ListVehiclesApi({
                societyId: societyId,
                currentPage: 1,
                pageSize: 10,
                search: "",
                vehicleType: "",
                flatId: null,
                userId: null
            });

            console.log("Vehicle List:", data);

            setAllVehicles(data?.vehicles || []);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };
    const getVisitors = async (societyId) => {
        console.log("Fetching visitors for society:", societyId);

        try {
            const data = await ListVisitorsApi({
                societyId: societyId,
                currentPage: 1,
                currentSearch: "",
                currentStatus: "",
                currentFromDate: null,
                currentToDate: null,
            });

            const visitorOptions = (data?.visitors || []).map((item) => ({
                value: item.id,
                label: item.visitor_name || item.name,
            }));

            setAllVisitors(visitorOptions);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
    };
    const getVehicleIcon = (vehicleType) => {
        const icons = {
            "2_wheeler": <TbMotorbike size={18} color="#6b7280" />,
            "4_wheeler": <TbCar size={18} color="#6b7280" />,
        };
        return icons[vehicleType] ?? <TbCar size={18} color="#6b7280" />;
    };
    // const handleVisitorParkingSubmit = async () => {
    //     try {
    //         const payload = {
    //             society_id: societyId,
    //             visitor_entry_id: selectedVisitor?.value,
    //             slot_id: selectedSlot?.value,
    //             allotted_by: userId,
    //             vehicle_number: vehicleNumber,
    //             vehicle_type: selectedVehicleType?.value,
    //             remarks: remarks,
    //         };

    //         await AllotVisitorParkingApi(payload);

    //         toast.success("Visitor parking allotted successfully");

    //         setShowVisitorParkingModal(false);

    //         visitorParking(societyId);

    //         resetForm();
    //     } catch (error) {
    //         toast.error(error?.message || "Failed to allot parking");
    //     }
    // };

    const handleVisitorClick = async (visitorParkingId) => {
        try {
            const data = await getVisitorParkingByIdApi(societyId, visitorParkingId);
            console.log("Visitor Detail:", data);
            setVisitorParkingId(visitorParkingId);
            setActive("visitorDetails");
        } catch (error) {
            console.error("Error fetching visitor detail:", error);
            toast.error("Failed to fetch visitor details");
        }
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

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        console.log("Session Data:", data);
        console.log("Flats:", data?.data?.flats);
        console.log(data.data);
        const flats = data.data.flats[0];
        console.log("society_id:", flats?.society_id);
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        parkingDashboard(flats.society_id);
        visitorParking(flats.society_id);
        violationAlerts(flats.society_id);
        getParkingSlots(flats.society_id);
        getVisitors(flats.society_id);
        getVehicles(flats.society_id);
    };

    const parkingDashboard = async (societyId) => {
        try {
            const data = await parkingDashboardApi(societyId);
            setTotalSlots(data.overview.total_slots);
            setOccupanyRate(data.overview.occupancy_rate_percent);
            setVisitorSlots(data.allocations.visitor_slots_available);
            setActiveViolation(data.violations.open_violations);
        } catch (error) {
            console.error("Error fetching parking dashboard:", error);
        }
    };

    const visitorParking = async (societyId) => {
        try {
            const data = await visitorParkingApi(societyId, page, limit);
            setAllVisitorParking(data.visitor_parking || []);
        } catch (error) {
            console.error("Error fetching visitor parking list:", error);
        }
    };

    const violationAlerts = async (societyId) => {
        try {
            const data = await violationAlertsApi(societyId, page, limit);
            setAllViolationAlerts(data.violations || []);
        } catch (error) {
            console.error("Error fetching violation alerts:", error);
        }
    };

    const getParkingSlots = async (societyId) => {
        try {
            console.log("Fetching slots for society:", societyId);
            const data = await ListParkingSlotsApi(societyId);
            const slotOptions = (data?.slots || []).map((item) => ({
                value: item.id,
                label: item.slot_number,
            }));
            setAllSlots(slotOptions);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };
    const getViolationDetails = (violationId) => {
        setActive("viewParkingDetails");
        setViolationId(violationId);
    };

    const handlePageChange = (value) => {
        setPage(value);
    };

     // ── MOVED INSIDE the component so it can access errors + setErrors ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleDelete = async (memberId) => {
        const confirmed = window.confirm("Are you sure you want to delete this Parking slot?");
        if (!confirmed) return;
        try {
            const data = await deleteMembersApi(memberId);
            console.log(data, "Delete response");
            toast.success("Member deleted successfully");
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error);
        }
    };

    const handleParkingList = async () => {
        setActive("parkingRegister");
    };

    const resetForm = () => {
        setSlot(null);
        setFlat(null);
        setViolationType(null);   // ✅ reset violation type
        setVehicleType(null);     // ✅ reset vehicle type
        setVehicleNo("");
        setPenaltyAmount("");
        setLastName("");
        setEmailId("");
        setMobileNo("");
        setStartDate("");
        setEndDate("");
        setBlocks("");
        setErrors({});
        setErrorText("");
    };

    // ✅ FIXED: pass args positionally to match API function signature
    // createViolationAlertApi(societyId, userId, slotId, vehicleNumber, violationType, description, photoUrl, penaltyAmount)
    const handleViolationSubmit = async () => {
        // Basic validation
        const newErrors = {};
        if (!vehicleNo.trim()) newErrors.vehicleNo = "Required";
        if (!violationType) newErrors.violationType = "Required";
        if (!vehicleType) newErrors.vehicleType = "Required";
        if (!penaltyamount.trim()) newErrors.penaltyamount = "Required";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        try {
            await createViolationAlertApi(
                societyId,              // society_id
                userId,                 // ✅ reported_by — was missing before
                slot?.value,            // slot_id
                vehicleNo,              // vehicle_number
                violationType?.value,   // ✅ violation_type (was sending vehicle_type here before)
                lastName,               // description
                null,                   // photo_url
                penaltyamount               // penalty_amount
            );

            toast.success("Violation Alert Added Successfully");
            setShowViolationAlert(false);
            resetForm();
            violationAlerts(societyId);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to add violation");
        }
    };

    const handleBlockChange = (selectedOption) => {
        setBlocks(selectedOption);
    };
    const handleVehicleClick = async (vehicleId) => {
        try {
            const data = await GetVehicleByIdApi(vehicleId, societyId);

            console.log("Vehicle Details:", data);

            // detail page par bhejna ho to
            setVehicleId(vehicleId);
            setActive("vehicleDetailsPage");

        } catch (error) {
            console.error("Error fetching vehicle details:", error);
            toast.error("Failed to fetch vehicle details");
        }
    };
    const exportData =
        selectedRange === "all"
            ? allMembersWithoutPagination
            : selectedRange === "search"
                ? allMembers
                : "";

    const downloadExcel = async () => {
        exportFile({ data: exportData, fileName: "Members", sheetName: "Members", type: "xlsx" });
    };

    const downloadCSV = async () => {
        exportFile({ data: exportData, fileName: "Members", sheetName: "Members", type: "csv" });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Members Report",
            fileName: "Members",
            columns: ["Member Name", "Unit No.", "Role", "Contact Info"],
            data: exportData.map((item) => [
                item.first_name + " " + item.last_name,
                item.flat_number,
                item.occupancy_type,
                item.mobile,
            ]),
        });
    };

    const handleExport = () => {
        if (activeTab === "excel") { downloadExcel(); setExportModal(false); }
        else if (activeTab === "csv") { downloadCSV(); setExportModal(false); }
        else if (activeTab === "pdf") { downloadPDF(); setExportModal(false); }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        try {
            if (!value.trim()) { setPage(1); return; }
            if (value.length < 3) return;
            const data = await getAllMembersWithoutPaginationApi(societyId, value);
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
                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setActive("parkingRules")}>
                            Parking Rules
                        </button>
                        {/* <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setShowAllocateSlot(true)}>
                            + Allocate Slot
                        </button> */}
                    </div>
                </div>

                {/* Stats Tiles */}
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
                                    <div className="text-start text-muted" style={{ fontSize: "13px", fontWeight: "500" }}>
                                        {l}
                                    </div>
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            background:
                                                l === "Total Slots" ? "#e8f1ff"
                                                    : l === "Occupancy Rate" ? "#fff1e7"
                                                        : l === "Visitor Slots Active" ? "#f5e8ff"
                                                            : "#ffe9e9",
                                            color:
                                                l === "Total Slots" ? "#3b82f6"
                                                    : l === "Occupancy Rate" ? "#fb923c"
                                                        : l === "Visitor Slots Active" ? "#d946ef"
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
                                <div
                                    className="text-start"
                                    style={{ fontSize: "35px", fontWeight: "700", lineHeight: "1", color: "#111", marginTop: "8px" }}
                                >
                                    {v}{l === "Occupancy Rate" && (
                                        <span style={{ fontSize: "28px", fontWeight: "600", color: "#555" }}>%</span>
                                    )}
                                </div>
                                {subText && (
                                    <div
                                        className="text-start"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            marginTop: "14px",
                                            color:
                                                l === "Occupancy Rate" ? "#22c55e"
                                                    : l === "Active Violations" ? "#ef4444"
                                                        : "#999"
                                        }}
                                    >
                                        {l === "Occupancy Rate" && <FiTrendingUp size={12} />}
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
                                    {[FiDownload, FiPlus].map((Icon, i) => (
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
                                            onClick={() => {
                                                if (Icon === FiPlus) {
                                                    resetForm();
                                                    //setShowVisitorParkingModal(true);
                                                }
                                            }}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {allVisitorParking.slice(0, 3).map((item) => (
                                <div key={item.id} className="vpd-row" style={{ cursor: "pointer" }} onClick={() => handleVisitorClick(item.id)}>
                                    <div className="d-flex align-items-center">
                                        <div className="vpd-icon-wrapper">
                                            {getVehicleIcon(item.vehicle_type)}
                                        </div>
                                        <div>
                                            <div className="vpd-name text-start">{item.vehicle_number}</div>
                                            <div className="vpd-subtitle text-start">
                                                {item.vehicle_type} {item.block}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="vpd-slot">{item.slot_number}</div>
                                        <div className="vpd-time" style={{ color: item.remainingColor }}>
                                            {item.remaining}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="vpd-footer" onClick={() => setActive("visitorParking")}>
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
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        style={{
                                            width: "36px", height: "36px", borderRadius: "10px",
                                            border: "1px solid #dde0ee", background: "#ffffff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", color: "#555", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        <FiDownload size={15} />
                                    </button>
                                    <button
                                        style={{
                                            width: "36px", height: "36px", borderRadius: "10px",
                                            border: "1px solid #dde0ee", background: "#ffffff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", color: "#555", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                        }}
                                        onClick={() => {
                                            resetForm();
                                            setMode("add");
                                            setShowViolationAlert(true);
                                        }}
                                    >
                                        <FiPlus size={15} />
                                    </button>
                                </div>
                            </div>

                            {allViolationAlerts.slice(0, 3).map((item) => (
                                <div key={item.id} className="vpd-row">
                                    <div className="d-flex align-items-center">
                                        <div className="vad-icon-wrapper">
                                            {getViolationIcon(item.violation_type)}
                                        </div>
                                        <div style={{ textAlign: "start", cursor: "pointer" }} onClick={() => getViolationDetails(item.id)}>
                                            <div className="vpd-name">{item.violation_type}</div>
                                            <div className="vpd-subtitle">Slot {item.slot_number}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="vpd-footer" onClick={() => setActive("violationAlerts")}>
                                View All Violations
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-3 mt-1">

                    {/* Visitor Parking */}
                    <div className="col-md-12">
                        <div className="vpd-card">
                            <div className="vpd-header">
                                <div className="vpd-title">
                                    <FiEye className="me-2 text-primary" />
                                    OWNER PARKING
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    {[FiDownload, FiPlus].map((Icon, i) => (
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
                                            onClick={() => {
                                                if (Icon === FiPlus) {
                                                    resetForm();
                                                    //  setShowVisitorParkingModal(true);
                                                }
                                            }}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {allVehicles.slice(0, 3).map((item) => (
                                <div
                                    key={item.vehicle_id}
                                    className="vpd-row"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleVehicleClick(item.vehicle_id)}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="vpd-icon-wrapper">
                                            {getVehicleIcon(item.vehicle_type)}
                                        </div>

                                        <div>
                                            <div className="vpd-name text-start">
                                                {item.vehicle_number}
                                                {item.vehicle_model && (
                                                    <span className="text-muted" style={{ fontWeight: 400, fontSize: 12 }}>
                                                        {" "}• {item.vehicle_model}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="vpd-subtitle text-start">
                                                {item.owner_name || "—"} • Unit {item.flat_number || "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <div className="vpd-slot">
                                            {item.sticker_id}
                                        </div>
                                        <div className="vpd-time text-muted" style={{ fontSize: 11 }}>
                                            {item.vehicle_type === "2_wheeler" ? "2 Wheeler" : item.vehicle_type === "4_wheeler" ? "4 Wheeler" : item.vehicle_type}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="vpd-footer" onClick={() => setActive("vehicleRegister")}>
                                View All Owners
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tenant Table */}
                {/* <div className="sv-card p-0 overflow-hidden mt-4">
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
                                        <td className="text-start">
                                            <div className="fw-bold">{item.unitNo}</div>
                                            <small className="text-muted">Owner: {item.owner}</small>
                                        </td>
                                        <td className="text-start">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={item.avatar} alt="" width="40" height="40" className="rounded-circle" />
                                                <div>
                                                    <div className="fw-semibold">{item.tenantName}</div>
                                                    <small className="text-muted">{item.tenantContact}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-start">
                                            <div className="text-start">{item.leaseStart} - {item.leaseEnd}</div>
                                            <small className={item.duration.includes("Expires") ? "text-danger" : "text-muted"}>
                                                {item.duration}
                                            </small>
                                        </td>
                                        <td className="text-start">
                                            <Badge
                                                label={item.kycStatus}
                                                c={
                                                    item.kycStatus === "Verified" ? "green"
                                                        : item.kycStatus === "Pending Verification" ? "yellow"
                                                            : item.kycStatus === "Pending KYC" ? "yellow"
                                                                : "gray"
                                                }
                                            />
                                        </td>
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
                                                            onClick={() => setActive("rentalsApplication")}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item member-action-item">
                                                            Edit Parking
                                                        </button>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => handleDelete(item.unitNo)}
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
                    <Pagination page={page} total={total} onChange={handlePageChange} />
                </div> */}
            </div>

            <AllocateSlotModal
                showAllocateSlot={showAllocateSlot}
                setShowAllocateSlot={setShowAllocateSlot}
            />

            <ViolationAlertModal
                showViolationAlert={showViolationAlert}
                setShowViolationAlert={setShowViolationAlert}
                allBlocks={allBlocks}
                allFlats={allFlats}
                allSlots={allSlots}
                vehicleNo={vehicleNo}
                setVehicleNo={setVehicleNo}
                blocks={blocks}
                setBlocks={setBlocks}
                flat={flat}
                setFlat={setFlat}
                slot={slot}
                setSlot={setSlot}
                // ✅ violationType for violation_type field
                violationType={violationType}
                setViolationType={setViolationType}
                // ✅ vehicleType for vehicle_type field (separate)
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                
                penaltyamount={penaltyamount}
                setPenaltyAmount={setPenaltyAmount}
                lastName={lastName}
                setLastName={setLastName}
                mobileNo={mobileNo}
                setMobileNo={setMobileNo}
                emailId={emailId}
                setEmailId={setEmailId}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                errors={errors}
                setErrors={setErrors}
                errorText={errorText}
                handleBlockChange={handleBlockChange}
                handleSubmit={handleViolationSubmit}
                resetForm={resetForm}
                mode={mode}
            />
            <AllotVisitorParkingModal
                show={showVisitorParkingModal}
                setShow={setShowVisitorParkingModal}

                allBlocks={allVisitors} // Visitor dropdown data
                allFlats={allSlots}     // Slot dropdown data

                blocks={selectedVisitor}
                setBlocks={setSelectedVisitor}

                flat={selectedSlot}
                setFlat={setSelectedSlot}

                firstName={vehicleNumber}
                setFirstName={setVehicleNumber}

                memType={selectedVehicleType}
                setMemType={setSelectedVehicleType}

                remarks={remarks}
                setRemarks={setRemarks}

                errors={errors}
                resetForm={resetForm}

                handleSubmit={handleVisitorParkingSubmit}
                mode="add"
            />
        </>
    );
};

export default ParkingDashboard;
