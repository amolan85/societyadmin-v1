import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import {
    AddMemberApi,
    getMembersApi,
    getAllMembersWithoutPaginationApi,
    getMembersByIdApi,
    UpdateMemberApi,
    deleteMembersApi,
} from "../../services/AddMemberApi";
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
    FaUserCircle,
    FaFileUpload,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
} from "react-icons/fa";

import {
    getAllBlocksApi,
    getAllFlatsApi,
} from "../../services/UnitRegisterApi";
import { CgExport } from "react-icons/cg";
// import MemberModal from "./MemberModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";


const ParkingList = ({ setActive, setMemberId, setFlatId }) => {
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
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [mode, setMode] = useState("add");

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

    const [mangementTypeTab, setManagementTypeTab] = useState("");

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

    const addMemberType = [
        { id: "Tenant", value: "tenant" },
    ];

    const mangementType = [
        { id: "All Rentals", value: "" },
        { id: "Pending Registration", value: "pendingResitration" },
        { id: "Expiring Soon", value: "emergency" },
        { id: "KYC Pending", value: "circular" },

    ];

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
        getMembers(flats.society_id);
        getAllFlats(flats.society_id);
        getAllBlocks(flats.society_id);
    };

    //function for get members
    const getMembers = async (societyId, page) => {
        try {
            const data = await getMembersApi(societyId, page);
            setAllMembers(data.members);
            setPage(data.page);
            setLimit(data.per_page);
            setTotalCount(data.total_count);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getAllMembersWithoutPagination = async (societyId, search) => {
        try {
            const data = await getAllMembersWithoutPaginationApi(societyId, search);
            console.log(data.members, "All members without pagination");

            setAllMembersWithoutPagination(data.members);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getAllFlats = async (societyId) => {
        try {
            const data = await getAllFlatsApi(societyId);
            console.log(data.flats, "All flats");
            setAllFlats(
                data.flats.map((item) => ({
                    value: item.flat_number,
                    label: item.flat_number,
                })),
            );
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getAllBlocks = async (societyId) => {
        try {
            const data = await getAllBlocksApi(societyId);
            console.log(data.blocks, "All blocks");
            setAllBlocks(
                data.blocks.map((item) => ({
                    value: item.block,
                    label: item.block,
                })),
            );
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getMembersById = async (memberId, flatId) => {
        setMemberId(memberId);
        setFlatId(flatId);
        setActive("memberDetails");
    };

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
                    societyId,
                    userId,
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

    const handleDelete = async (memberId) => {
        try {
            const data = await deleteMembersApi(memberId);

            console.log(data, "Delete response");

            toast.success("Member deleted successfully");
            getMembers(societyId, page);
            // Refresh member list if needed
            // GetAllMembers();
        } catch (error) {
            console.error("Delete Error:", error);

            toast.error(error);
        }
    };

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

    const totalOwners = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "owner",
    ).length;

    const totalTenant = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "tenant",
    ).length;

    const totalFamilyMember = allMembers.filter(
        (item) => item.occupancy_type?.toLowerCase() === "familyMember",
    ).length;


    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        try {
            if (!value.trim()) {
                setPage(1);
                await getMembers(societyId, 1);
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
                        <h4 className="cp-title">Parking</h4>
                        <p className="cp-sub">
                            Monitor occupancy, manage visitor parking, and handle violations.
                        </p>
                    </div>
                    <div className='d-flex'>

                        {/* <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() =>
                            setShow(true)}>+ Register New Tenant</button> */}
                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => setActive("parkingDashboard")}>Back</button>
                    </div>

                </div>
                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [totalCount, "Pending Approvals", "Action Required", "tile-yel"],
                        [totalOwners, "Agreements Expiring", "In next 30 days", "tile-red"],
                        [totalTenant, "KYC Unverified", "Pending review", "tile-blu"],
                        [totalFamilyMember, "Active Rentals", "+3 this month", "tile-grn"],
                    ].map(([v, l, subText, cls]) => (
                        <div className="col-6 col-md-3" key={l}>
                            <div className={`tile bg-white ${cls}`}>
                                <div className="text-start text-muted">
                                    {l}
                                </div>

                                <div className="tile-val text-start mt-1" style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}>
                                    {v}

                                    {subText && (
                                        <span
                                            style={{
                                                fontSize: "10px",
                                                fontWeight: "500",
                                                marginLeft: "6px",
                                                color: "#000"
                                            }}
                                        >
                                            {subText}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col-lg-8'>
                        <div className="NoticeBoardTabs mt-3 bg-white"
                        >
                            {mangementType.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { setManagementTypeTab(t.value); setPage(1); }}
                                    className={`NoticeBoardTabs-btn ${mangementTypeTab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} &nbsp;{t.id}
                                </button>
                            ))}
                        </div>
                    </div>
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
                                color: "#aaa",
                            }}
                        >
                            <FiSearch size={16} />
                        </span>

                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search by unit no.,tenant name..."
                            value={search}
                            // onChange={(e) => setSearch(e.target.value)}
                            onChange={handleSearch}
                            style={{ paddingLeft: "35px" }}
                        />
                    </div>
                    <div className="d-flex">
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />
                            Filter
                        </button>

                    </div>
                </div>
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    <th>UNIT NO.</th>
                                    <th>TENANT INFORMATION</th>
                                    <th>LEASE PERIOD</th>
                                    <th>KYC STATUS</th>
                                    <th>AGREEMENT</th>
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
                                        {/* Agreement */}
                                        <td className="text-start">
                                            {/* <span
                                                className={`badge rounded-pill bg-${item.agreementColor}-subtle text-${item.agreementColor}`}
                                            >
                                                {item.agreementIcon} {item.agreementStatus}
                                            </span> */}
                                            <Badge
                                                label={item.agreementStatus}
                                                c={
                                                    item.agreementStatus === "Uploaded"
                                                        ? "blue"
                                                        : item.agreementStatus === "Expiring Soon"
                                                            ? "red"
                                                            : item.agreementStatus === "Active"
                                                                ? "green"
                                                                : item.agreementStatus === "Not Uploaded"
                                                                    ? "gray"
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
                                                            Delete Parking
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
            </div>

        </>
    );
};

export default ParkingList;
