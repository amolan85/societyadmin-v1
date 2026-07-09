import { useState, useEffect, useRef } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import { toast } from "react-toastify";
import { FiFilter, FiSearch, FiGrid, FiCheckCircle, FiLogOut, FiUsers, FiClock } from "react-icons/fi";
import { ListVisitorsApi } from "../../services/VisitorApi";
import {
    getAllBlocksApi,
    getAllFlatsApi,
} from "../../services/UnitRegisterApi";
import { CgExport, CgImport } from "react-icons/cg";
// import MemberModal from "./MemberModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import { TbCar, TbMotorbike } from "react-icons/tb";

import { visitorParkingApi, deleteVisitorParkingApi, getVisitorParkingByIdApi, AllotVisitorParkingApi, UpdateVisitorParkingApi, releaseVisitorParkingApi } from "../../services/VisitorParkingApi";
import ExportModal from "../../components/Common/ExportModal";
import AllotVisitorParkingModal from "./AllotVisitorParkingModal";
import CreateVisitorParkingModal from "./CreateVisitorParkingModal";
import { ListParkingSlotsApi } from "../../services/ParkingApi";
import CheckOutVisitorModal from "./CheckOutVisitorModal";


const VisitorParkingList = ({ setActive, setMemberId, setFlatId, setVisitorParkingId }) => {
    const [memType, setMemType] = useState("tenant");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [allFlats, setAllFlats] = useState([]);
    const [flat, setFlat] = useState("");
    const [moveInDate, setMoveInDate] = useState("");
    const [moveOutDate, setMoveOutDate] = useState("");
    const [familyType, setFamilyType] = useState("");
    const [agreement, setAgreement] = useState("");
    const [rentAgreement, setRentAgreement] = useState("");
    const [policeNoc, setPoliceNoc] = useState("");
    const [idProof, setIdProof] = useState("");
    const [familyPhoto, setFamilyPhoto] = useState("");
    const [maintenanceReceipt, setMaintenanceReceipt] = useState("");
    const [ownershipDocuments, setOwnershipDocuments] = useState("");
    const [nominationDetails, setNominationDetails] = useState("");
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedVisitorParkingId, setSelectedVisitorParkingId] = useState(null);
    const [show, setShow] = useState(false);
    const [createvisitorparkingshow, createvisitorparkingsetShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [mode, setMode] = useState("add");
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);
    const [allMembers, setAllMembers] = useState([]);
    const [allMembersWithoutPagination, setAllMembersWithoutPagination] = useState([]);
    const [blocks, setBlocks] = useState("");
    const [allBlocks, setAllBlocks] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [mId, setMId] = useState("");
    const [selectedRange, setSelectedRange] = useState("all");
    const searchTimeout = useRef(null);
    const [allocationStatusTab, setAllocationStatusTab] = useState("");
    const [allVisitorParking, setAllVisitorParking] = useState([]);
    const [allExportVisitorParking, setAllExportVisitorParking] = useState([]);
    const [visitorName, setVisitorName] = useState("");
    const [visitorMobile, setVisitorMobile] = useState("");
    const [visitorEmail, setVisitorEmail] = useState("");
    const [visitorGender, setVisitorGender] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [purpose, setPurpose] = useState("");
    const [allVisitors, setAllVisitors] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [allSlots, setAllSlots] = useState([]);
    const [releaseShow, setReleaseShow] = useState(false);
    const [selectedParkingItem, setSelectedParkingItem] = useState(null);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const getVehicleIcon = (vehicleType) => {
        const icons = {
            "2_wheeler": { icon: <TbMotorbike size={18} />, color: "#f97316" },
            "4_wheeler": { icon: <TbCar size={18} />, color: "#3b82f6" },
        };
        return icons[vehicleType] ?? icons["4_wheeler"];
    };
    const allocationStatus = [
        { id: "All Visitor", value: "", icon: <FiGrid size={15} /> },
        { id: "Active", value: "active", icon: <FiCheckCircle size={15} /> },
        { id: "Released", value: "released", icon: <FiLogOut size={15} /> },
    ];
    const handleViewDetails = async (visitorParkingId) => {
        try {
            const data = await getVisitorParkingByIdApi(societyId, visitorParkingId);
            console.log("Visitor Detail:", data);
            setVisitorParkingId(visitorParkingId);   // parent me ID save
            setActive("visitorDetails");              // detail page pe navigate
        } catch (error) {
            console.error("Error fetching visitor detail:", error);
            toast.error("Failed to fetch visitor details");
        }
    };
    const handleConfirmRelease = async () => {
        try {
            await releaseVisitorParkingApi(societyId, selectedParkingItem.id);
            toast.success("Parking released successfully");
            visitorParking(societyId, page);
        } catch (e) {
            toast.error(e?.message || "Failed to release parking");
        }
    };
    const handleReleaseParking = async (item) => {
        try {
            const fullData = await getVisitorParkingByIdApi(societyId, item.id);
            setSelectedParkingItem({ ...fullData, id: fullData?.id || item.id }); // ✅ fallback id
            setReleaseShow(true);
        } catch (e) {
            toast.error("Failed to load visitor details");
        }
    };
    const handleEditParking = async (item) => {
        setSelectedSlot({
            value: item.slot_id || item.id,
            label: item.slot_number
        });
        setVehicleNumber(item.vehicle_number || "");
        setSelectedVehicleType(
            item.vehicle_type === "2_wheeler"
                ? { value: "2_wheeler", label: "2 Wheeler" }
                : { value: "4_wheeler", label: "4 Wheeler" }
        );
        setRemarks(item.remarks || "");
        setSelectedVisitorId(item.visitor_entry_id || item.id);
        setSelectedVisitorParkingId(item.id); // ← visitor_parking_id ke liye
        setMode("edit");

        await getParkingSlots(societyId);
        setShow(true);
    };
    // const handleEditParking = async (item) => {
    //     // Existing data prefill karo
    //     setSelectedSlot({ value: item.slot_id, label: item.slot_number });
    //     setVehicleNumber(item.vehicle_number || "");
    //     setSelectedVehicleType(
    //         item.vehicle_type === "2_wheeler"
    //             ? { value: "2_wheeler", label: "2 Wheeler" }
    //             : { value: "4_wheeler", label: "4 Wheeler" }
    //     );
    //     setRemarks(item.remarks || "");
    //     setSelectedVisitorId(item.visitor_entry_id || item.id);
    //     setMode("edit");

    //     await getParkingSlots(societyId);
    //     setShow(true);
    // };
    const getParkingSlots = async (societyId) => {
        try {
            const data = await ListParkingSlotsApi(
                societyId,      // societyId
                1,              // page
                100,            // limit
                "",             // search
                "available",    // slot_status
                "visitor",      // parking_type
                ""              // vehicle_type
            );

            const slotOptions = (data?.slots || []).map((item) => ({
                value: item.id,
                label: item.slot_number,
            }));

            setAllSlots(slotOptions);
        } catch (error) {
            console.error(error);
        }
    };
    const getVisitors = async (societyId) => {
        try {
            const data = await ListVisitorsApi({
                societyId,
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
    const handleVisitorParkingSubmit = async () => {
        try {
            const payload = {
                society_id: Number(societyId),
                visitor_entry_id: selectedVisitorId,
                slot_id: selectedSlot?.value,
                allotted_by: Number(userId),
                vehicle_number: vehicleNumber,
                vehicle_type: selectedVehicleType?.value,
                remarks: remarks || "",
            };

            await AllotVisitorParkingApi(payload);

            toast.success("Visitor parking allotted successfully");

            setShow(false);

            visitorParking(societyId, page);

            resetForm();
        } catch (error) {
            toast.error(error?.message || "Failed to allot parking");
        }
    };
    const handleEditParkingSubmit = async () => {
        try {
            const payload = {
                society_id: Number(societyId),
                visitor_parking_id: selectedVisitorParkingId,
                slot_id: selectedSlot?.value,
                vehicle_number: vehicleNumber,
                vehicle_type: selectedVehicleType?.value,
                remarks: remarks || "",
            };

            await UpdateVisitorParkingApi(payload);
            toast.success("Visitor parking updated successfully");
            setShow(false);
            setMode("add");
            visitorParking(societyId, page);
            resetForm();
        } catch (error) {
            toast.error(error?.message || "Failed to update parking");
        }
    };
    const vehicleTypeOptions = [
        {
            value: "2_wheeler",
            label: "2 Wheeler",
        },
        {
            value: "4_wheeler",
            label: "4 Wheeler",
        },
    ]

    const genderOptions = [
        {
            value: "male",
            label: "Male",
        },
        {
            value: "female",
            label: "Female",
        },
        {
            value: "other",
            label: "Other",
        },
    ]

    // const allocationStatus = [
    //     { id: "All Visitor", value: "" },
    //     { id: "Active", value: "active" },
    //     { id: "Released", value: "released" },

    // ];

    const finalMemType = memType === "familyMember" ? familyType : memType;

    useEffect(() => {
        SessionData();
    }, []);

    const SessionData = async () => {
        const data = await GetSessionData();
        console.log(data.data);
        const flats = data.data.flats[0];
        setSocietyId(flats.society_id);
        setUserId(flats.user_id);
        visitorParking(flats.society_id, 1);
        // getAllBlocks(flats.society_id);
        // getVisitors(flats.society_id);
        // getParkingSlots(flats.society_id);

    };

    //function for get visitor parking details
    const visitorParking = async (societyId, page, status = allocationStatusTab, from = dateFrom, to = dateTo) => {
        try {
            const data = await visitorParkingApi(societyId, page, limit, search, status, from, to);
            setAllVisitorParking(data.visitor_parking || []);
            setPage(data.page);
            setLimit(data.limit);
            setTotalCount(data.total);
        } catch (error) {
            console.error("Error fetching visitor parking list:", error);
        }
    };

    const getAllExportParking = async (societyId) => {
        try {
            const data = await visitorParkingApi(societyId);
            setAllExportVisitorParking(data.visitor_parking || []);
        } catch (error) {
            console.error("Error fetching visitor parking list:", error);
        }
    };

    const getAllBlocks = async (societyId) => {
        try {
            const data = await getAllBlocksApi(societyId);

            const blockOptions = data.blocks.map((item) => ({
                value: item.block,
                label: item.block,
            }));

            setAllBlocks(blockOptions);


        } catch (error) {
            console.error("Error fetching blocks:", error);
        }
    };

    const handleBlockChange = async (selectedOption) => {
        setBlocks(selectedOption);

        if (selectedOption?.value) {
            await getAllFlats(societyId, selectedOption.value);
        }
    };

    const getAllFlats = async (societyId, block) => {
        try {
            const data = await getAllFlatsApi(societyId, block);

            console.log(data.flats, "All flats");

            setAllFlats(
                data.flats.map((item) => ({
                    value: item.flat_number,
                    label: item.flat_number,
                }))
            );
        } catch (error) {
            console.error("Error fetching flats:", error);
        }
    };


    const handlePageChange = (value) => {
        setPage(value);
        visitorParking(societyId, value, allocationStatusTab, dateFrom, dateTo);
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

        if (!blocks) {
            errors.blocks = "required";
        }

        if (!flat) {
            errors.flat = "required";
        }
        if (!moveInDate) {
            errors.moveInDate = "required";
        }
        if (!memType) {
            errors.memType = "required";
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
        if (memType === "familyMember") {
            if (!familyType) {
                errors.familyType = "required";
            }
        }
        return errors;
    };

    const handleSubmit = async () => {
        try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            if (mode === "edit") {
                await UpdateMemberApi(
                    societyId,
                    mId,
                    firstName,
                    lastName,
                    mobileNo,
                    emailId,
                    blocks?.value,
                    flat?.value,
                    finalMemType,
                    moveInDate,
                    moveOutDate,
                    agreement,
                    rentAgreement,
                    policeNoc,
                    idProof,
                    familyPhoto,
                    maintenanceReceipt,
                    ownershipDocuments,
                    nominationDetails,
                );

                toast.success("Member updated successfully!");
                resetForm();
                getMembers(societyId, page);
            } else {
                await AddMemberApi(
                    societyId, flat?.value, visitorName, mobileNo, emailId, visitorGender?.value, vehicleNumber, purpose
                );

                toast.success("Member created successfully!");
                resetForm();
                getMembers(societyId, page);
            }

            setShow(false);
        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error);
        }
    };

    const GetMemberDetailsById = async (memberId) => {
        try {
            const data = await getMembersByIdApi(societyId, memberId);
            setMId(memberId);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmailId(data.email);
            setMobileNo(data.mobile);
            setBlocks({
                value: data.block,
                label: data.block,
            });
            setFlat({
                value: data.flat_number,
                label: data.flat_number,
            });
            setFamilyType(data.occupancy_type);
            setMemType(
                data.occupancy_type === "owner_relative"
                    ? "familyMember"
                    : data.occupancy_type === "tenant_relative"
                        ? "familyMember"
                        : data.occupancy_type,
            );
            setMoveInDate(data.start_date);
            setMoveOutDate(data.end_date);
            data.documents?.forEach((doc) => {
                switch (doc.document_type) {
                    case "id_proof":
                        setIdProof(doc.url);
                        break;

                    case "family_photo":
                        setFamilyPhoto(doc.url);
                        break;

                    case "agreement":
                        setAgreement(doc.url);
                        break;

                    case "ownership":
                        setOwnershipDocuments(doc.url);
                        break;

                    case "maintenance_receipt":
                        setMaintenanceReceipt(doc.url);
                        break;

                    case "rent_agreement":
                        setRentAgreement(doc.url);
                        break;

                    case "police_noc":
                        setPoliceNoc(doc.url);
                        break;

                    default:
                        break;
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (visitorParkingId) => {
        const confirmed = window.confirm("Are you sure you want to delete this Visitor Parking?");

        if (!confirmed) return;

        try {
            const data = await deleteVisitorParkingApi(societyId, visitorParkingId);

            console.log(data, "Delete response");

            toast.success("Visitor parking deleted successfully");
            visitorParking(societyId, page);
            // Refresh member list if needed
            // GetAllMembers();
        } catch (error) {
            console.error("Delete Error:", error);

            toast.error(error);
        }
    };

    const totalVisitorParking = allVisitorParking.length;

    const totalActive = allVisitorParking.filter(
        (item) => item.status?.toLowerCase() === "active",
    ).length;

    const totalReleased = allVisitorParking.filter(
        (item) => item.status?.toLowerCase() === "released",
    ).length;

    const totalPending = allVisitorParking.filter(
        (item) => item.status?.toLowerCase() === "pending",
    ).length;

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmailId("");
        setMobileNo("");
        // setBlocks(null);
        // setFlat("");
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

    const exportData =
        selectedRange === "all"
            ? allExportVisitorParking
            : selectedRange === "search"
                ? allVisitorParking
                : "";


    const downloadExcel = async () => {
        exportFile({
            data: exportData,
            fileName: "VisitorParking",
            sheetName: "VisitorParking",
            type: "xlsx",
        });
    };

    const downloadCSV = async () => {
        exportFile({
            data: exportData,
            fileName: "VisitorParking",
            sheetName: "VisitorParking",
            type: "csv",
        });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Visitor Parking Report",
            fileName: "VisitorParking",
            columns: [
                "Visitor Name",
                "Visitor Mobile",
                "Vehicle No",
                "Vehicle Type",
                "Slot No",
            ],
            data: exportData.map((item) => [
                item.visitor_name,
                item.visitor_mobile,
                item.vehicle_number,
                item.vehicle_type,
                item.slot_number,
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

    // const totalOwners = allMembers.filter(
    //     (item) => item.occupancy_type?.toLowerCase() === "owner",
    // ).length;

    // const totalTenant = allMembers.filter(
    //     (item) => item.occupancy_type?.toLowerCase() === "tenant",
    // ).length;

    // const totalFamilyMember = allMembers.filter(
    //     (item) => item.occupancy_type?.toLowerCase() === "familyMember",
    // ).length;
    const handleOpenAllotModal = async (item) => {
        console.log(item);
        setSelectedVisitorId(item.visitor_entry_id || item.visitor_id || item.id);

        await getParkingSlots(societyId);

        setShow(true);
    };

    const handleApplyFilter = () => {
        setPage(1);
        setShowFilter(false);
        visitorParking(societyId, 1, allocationStatusTab, dateFrom, dateTo);
    };

    const handleClearFilter = () => {
        setDateFrom("");
        setDateTo("");
        setAllocationStatusTab("");
        setPage(1);
        setShowFilter(false);
        visitorParking(societyId, 1, "", "", "");
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Purana pending call cancel karo
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Naya call 500ms baad schedule karo
        searchTimeout.current = setTimeout(async () => {
            try {
                setPage(1);
                const data = await visitorParkingApi(societyId, 1, limit, value.trim(), allocationStatusTab, dateFrom, dateTo);
                setAllVisitorParking(data.visitor_parking || []);
                setTotalCount(data.total);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 500);
    };
    const total = Math.ceil(totalCount / limit);

    return (
        <>
            <div className="pg cp-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title mb-1" style={{ fontWeight: 700 }}>Visitor Parking</h4>
                        <p className="cp-sub mb-0 text-muted">
                            Monitor, manage, and track visitor parking with ease.
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-ac btn-primary"
                            style={{ borderRadius: 10, fontSize: 13 }}
                            onClick={() => {
                                getAllExportParking(societyId);
                                setExportModal(true);
                            }}
                        >
                            <CgImport /> Export
                        </button>
                        <button
                            className="btn btn-sm btn-ac btn-primary"
                            style={{ borderRadius: 10, fontWeight: 500 }}
                            onClick={() => setActive("parkingDashboard")}
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        {
                            value: totalVisitorParking,
                            label: "All Visitors",
                            sub: "Total visitor entries",
                            bg: "#eff6ff",
                            color: "#3b82f6",
                            icon: "👥"
                        },
                        {
                            value: totalActive,
                            label: "Active Visitor Parking",
                            sub: "Currently parked",
                            bg: "#ecfdf5",
                            color: "#22c55e",
                            icon: "✓"
                        },
                        {
                            value: totalReleased,
                            label: "Released Visitor Parking",
                            sub: "Exited today",
                            bg: "#fef2f2",
                            color: "#ef4444",
                            icon: "🚗"
                        },
                    ].map((s) => (
                        <div className="col-6 col-md-4" key={s.label}>
                            <div
                                className="p-3 bg-white h-100"
                                style={{
                                    borderRadius: 14,
                                    border: "1px solid #f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        background: s.bg,
                                        color: s.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        flexShrink: 0
                                    }}
                                >
                                    {s.icon}
                                </div>
                                <div className="text-start">
                                    <div className="text-muted" style={{ fontSize: 13 }}>{s.label}</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                                        {s.value}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 11 }}>{s.sub}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                    {/* Tabs */}
                    <div
                        className="d-inline-flex align-items-center gap-1"
                        style={{
                            background: "white",
                            borderRadius: 999,
                            padding: 6,
                        }}
                    >
                        {allocationStatus.map((t) => {
                            const isActive = allocationStatusTab === t.value;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setAllocationStatusTab(t.value);
                                        setPage(1);
                                        visitorParking(societyId, 1, t.value, dateFrom, dateTo);
                                    }}
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                        background: isActive ? "#0f172a" : "transparent",
                                        color: isActive ? "#fff" : "#475569",
                                        border: "none",
                                        borderRadius: 999,
                                        padding: "8px 18px",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {t.icon}
                                    {t.id === "All Visitor" ? "All" : t.id}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right side: Date Filter + Search */}
                    <div className="d-flex align-items-center gap-2">
                        {/* Date Filter Button + Popover */}
                        <div className="position-relative">
                            <button
                                onClick={() => setShowFilter((prev) => !prev)}
                                className="d-flex align-items-center gap-2"
                                style={{
                                    background: (dateFrom || dateTo) ? "#eff6ff" : "#fff",
                                    color: (dateFrom || dateTo) ? "#2563eb" : "#475569",
                                    border: `1px solid ${(dateFrom || dateTo) ? "#2563eb" : "#cbd5e1"}`,
                                    borderRadius: 8,
                                    padding: "9px 16px",
                                    fontWeight: 500,
                                    fontSize: 14,
                                }}
                            >
                                <FiFilter size={15} />
                                Filter
                                {(dateFrom || dateTo) && (
                                    <span
                                        style={{
                                            width: 7, height: 7, borderRadius: "50%",
                                            background: "#2563eb", display: "inline-block"
                                        }}
                                    />
                                )}
                            </button>

                            {showFilter && (
                                <>
                                    {/* Backdrop to close on outside click */}
                                    <div
                                        onClick={() => setShowFilter(false)}
                                        style={{ position: "fixed", inset: 0, zIndex: 15 }}
                                    />
                                    <div
                                        className="bg-white shadow"
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 10px)",
                                            right: 0,
                                            zIndex: 20,
                                            width: 300,
                                            borderRadius: 14,
                                            border: "1px solid #e5e7eb",
                                            padding: 18,
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Filter by Date</span>
                                            {(dateFrom || dateTo) && (
                                                <button
                                                    onClick={handleClearFilter}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#ef4444",
                                                        fontSize: 12,
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        <div className="mb-3 text-start">
                                            <label className="d-block mb-1" style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                                                From Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dateFrom}
                                                max={dateTo || undefined}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                style={{ border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
                                            />
                                        </div>

                                        <div className="mb-3 text-start">
                                            <label className="d-block mb-1" style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                                                To Date
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dateTo}
                                                min={dateFrom || undefined}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                style={{ border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 }}
                                            />
                                        </div>

                                        <button
                                            className="btn text-white w-100"
                                            style={{ background: "#2563eb", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, padding: "9px 0" }}
                                            onClick={handleApplyFilter}
                                        >
                                            Apply Filter
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Search */}
                        <div className="d-flex" style={{ width: 260 }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearch}
                                style={{
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px 0 0 8px",
                                    borderRight: "none"
                                }}
                            />
                            <button
                                className="btn text-white d-flex align-items-center justify-content-center"
                                style={{ background: "#2563eb", borderRadius: "0 8px 8px 0", width: 44, border: "none" }}
                                onClick={() => visitorParking(societyId, 1, allocationStatusTab, dateFrom, dateTo)}
                            >
                                <FiSearch size={16} />
                            </button>
                        </div>
                    </div>
                </div>


                {/* Table */}
                <div className="sv-card p-0 overflow-hidden" style={{ borderRadius: 14 }}>
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    <th>VISITOR NAME</th>
                                    <th>MOBILE</th>
                                    <th>VEHICLE NO.</th>
                                    <th>VEHICLE TYPE</th>
                                    <th>SLOT / ZONE</th>
                                    <th>ALLOTTED AT</th>
                                    <th>RELEASED AT</th>
                                    <th>STATUS</th>
                                    <th>RELEASE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allVisitorParking.map((item, index) => {
                                    const fmtDateTime = (dt) => {
                                        if (!dt) return { time: "—", date: "" };
                                        const normalized = dt.includes("T") ? dt : dt.replace(" ", "T");
                                        const withZ = normalized.includes("Z") || normalized.includes("+") ? normalized : normalized + "Z";
                                        const d = new Date(withZ);
                                        if (isNaN(d)) return { time: "—", date: "" };
                                        return {
                                            time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
                                            date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                        };
                                    };

                                    const allotted = fmtDateTime(item.allotted_at);
                                    const released = fmtDateTime(item.released_at);

                                    return (
                                        <tr key={index}>
                                            <td className="text-start">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        style={{
                                                            width: 34,
                                                            height: 34,
                                                            borderRadius: "50%",
                                                            background: "#e0e7ff",
                                                            color: "#4f46e5",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: 700,
                                                            fontSize: 13,
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {(item.visitor_name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="fw-semibold">{item.visitor_name || "-"}</div>
                                                </div>
                                            </td>

                                            <td className="text-start">{item.visitor_mobile || "-"}</td>

                                            <td className="text-start">{item.vehicle_number || "-"}</td>

                                            <td className="text-start">
                                                <Badge
                                                    label={item.vehicle_type == "4_wheeler" ? "4 Wheeler" : item.vehicle_type == "2_wheeler" ? "2 Wheeler" : ""}
                                                    c={
                                                        item.vehicle_type === "4_wheeler"
                                                            ? "blue"
                                                            : item.vehicle_type === "2_wheeler"
                                                                ? "green"
                                                                : "gray"
                                                    }
                                                />
                                            </td>

                                            <td className="text-start">
                                                <div className="fw-semibold">{item.slot_number || "-"}</div>
                                                <small className="text-muted">
                                                    {item.block ? `Block ${item.block}` : ""}{item.floor ? `, Floor ${item.floor}` : ""}
                                                </small>
                                            </td>

                                            <td className="text-start">
                                                <div>{allotted.time}</div>
                                                {allotted.date && <small className="text-muted">{allotted.date}</small>}
                                            </td>

                                            <td className="text-start">
                                                <div>{released.time}</div>
                                                {released.date && <small className="text-muted">{released.date}</small>}
                                            </td>

                                            <td className="text-start">
                                                <Badge
                                                    label={item.status == "active" ? "Active" : item.status == "released" ? "Released" : ""}
                                                    c={
                                                        item.status === "active"
                                                            ? "green"
                                                            : item.status === "released"
                                                                ? "red"
                                                                : "gray"
                                                    }
                                                />
                                            </td>

                                            <td className="text-start">
                                                {item.status === "active" ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                        style={{ fontSize: 12, fontWeight: 500 }}
                                                        onClick={() => handleReleaseParking(item)}
                                                    >
                                                        Release
                                                    </button>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: 13 }}>—</span>
                                                )}
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
                                                                onClick={() => handleViewDetails(item.id)}
                                                            >
                                                                View Details
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item member-action-item"
                                                                onClick={() => item.status === "active" && handleEditParking(item)}
                                                                disabled={item.status !== "active"}
                                                                style={item.status !== "active" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                Delete Parking
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination page={page} total={total} onChange={handlePageChange} />
                </div>
            </div>
            <CheckOutVisitorModal
                checkoutShow={releaseShow}
                setCheckoutShow={setReleaseShow}
                visitorData={selectedParkingItem}
                onConfirm={handleConfirmRelease}
                mode="release"
            />

            <AllotVisitorParkingModal
                show={show}
                setShow={setShow}
                allFlats={allSlots}
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
                handleSubmit={mode === "edit" ? handleEditParkingSubmit : handleVisitorParkingSubmit}
                mode={mode}
            />

            <CreateVisitorParkingModal
                createvisitorparkingshow={createvisitorparkingshow}
                createvisitorparkingsetShow={createvisitorparkingsetShow}
                allBlocks={allBlocks}
                handleBlockChange={handleBlockChange}
                blocks={blocks}
                allFlats={allFlats}
                flat={flat}
                setFlat={setFlat}
                visitorName={visitorName}
                setVisitorName={setVisitorName}
                visitorMobile={visitorMobile}
                setVisitorMobile={setVisitorMobile}
                visitorEmail={visitorEmail}
                setVisitorEmail={setVisitorEmail}
                vehicleNumber={vehicleNumber}
                setVehicleNumber={setVehicleNumber}
                genderOptions={genderOptions}
                visitorGender={visitorGender}
                setVisitorGender={setVisitorGender}
                vehicleTypeOptions={vehicleTypeOptions}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                purpose={purpose}
                setPurpose={setPurpose}
            />

            <ExportModal
                show={exportModal}
                onClose={() => setExportModal(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportVisitorParking.length}
                currentRecords={allVisitorParking.length}
            />
        </>
    );
};

export default VisitorParkingList;
