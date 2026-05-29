import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import {
    AddMemberApi,
    getAllMembersWithoutPaginationApi,
    getMembersByIdApi,
    UpdateMemberApi,
    deleteMembersApi,
    getTenantsMembersApi,
} from "../../services/AddMemberApi";
import { toast } from "react-toastify";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
    getAllBlocksApi,
    getAllFlatsApi,
} from "../../services/UnitRegisterApi";
import { CgExport } from "react-icons/cg";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import RegisterTenantsModal from "./RegisterTenantsModal";
import FilterRentalsModal from "./FilterRentalsModal";
import UploadModal from "./UploadModal";
import ApproveModal from "./ApproveModal";
import ExportModal from "../../components/Common/ExportModal";

const RentalAndTenants = ({ setActive, setTenantId }) => {
    const [memType, setMemType] = useState("tenant");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [allFlats, setAllFlats] = useState([]);
    const [flat, setFlat] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
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

    const [allTenentsMember, setAllTenantsMember] = useState([]);
    const [allExportTenent, setAllExportTenent] = useState([]);
    const [blocks, setBlocks] = useState("");
    const [allBlocks, setAllBlocks] = useState([]);

    const [exportModal, setExportModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [search, setSearch] = useState("");
    const [mId, setMId] = useState("");
    const [activeTab, setActiveTab] = useState("excel");
    const [selectedRange, setSelectedRange] = useState("all");
    const [mangementTypeTab, setManagementTypeTab] = useState("");
    const [showFilterRentals, setShowFilterRentals] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [showApprove, setShowApprove] = useState(false)

    const filterData = {
        blocks: [
            { name: "Block A", checked: true },
            { name: "Block B", checked: false },
            { name: "Block C", checked: false },
            { name: "Block D", checked: false },
        ],

        verificationStatus: [
            { name: "Verified", count: 134, checked: true },
            { name: "Pending Verification", count: 8, checked: false },
            { name: "Unverified / Rejected", count: 4, checked: false },
        ],

        agreementStatus: [
            {
                value: "active",
                label: "Active",
            },
            {
                value: "expiringIn30Days",
                label: "Expiring in 30 days",
            },
            {
                value: "expired",
                label: "Expired",
            },
            {
                value: "notUploaded",
                label: "Not Uploaded",
            },
        ]
    };

    const addMemberType = [
        { id: "Tenant", value: "tenant" },
    ];

    const mangementType = [
        { id: "All Rentals", value: "" },
        { id: "Pending Registration", value: "Pending" },
        { id: "Expiring Soon", value: "expiry" },
        { id: "KYC Pending", value: 0 },

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
        getTenantMembers(flats.society_id, page);

        getAllBlocks(flats.society_id);
    };

    //function for get members
    const getTenantMembers = async (societyId, page) => {
        try {
            const data = await getTenantsMembersApi(societyId, page, limit);
            setAllTenantsMember(data.tenants);
            setPage(data.page);
            setLimit(data.per_page);
            setTotalCount(data.total_count);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    const getAllExportData = async (societyId) => {
        try {
            const data = await getTenantsMembersApi(societyId);

            setAllExportTenent(data.tenants);
        } catch (error) {
            console.error("Error fetching members:", error);
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

    const getViewDetails = async (tenentId) => {
        setTenantId(tenentId);
        setActive("rentalsApplication");
    };

    const handlePageChange = (value) => {
        setPage(value);
        getTenantMembers(societyId, value);
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
        if (!startDate) {
            errors.startDate = "required";
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
            if (!endDate) {
                errors.endDate = "required";
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

            if (mode === "edit" || mode === "upload") {
                await UpdateMemberApi(
                    societyId,
                    mId,
                    firstName,
                    lastName,
                    mobileNo,
                    emailId,
                    blocks?.value,
                    flat?.value,
                    memType,
                    startDate,
                    endDate,
                    agreement,
                    rentAgreement,
                    policeNoc,
                    idProof,
                    familyPhoto,
                    maintenanceReceipt,
                    ownershipDocuments,
                    nominationDetails,
                );
                {
                    mode === "upload" ? toast.success("Document uploaded successfully!") : toast.success("Tenant updated successfully!")
                }

                resetForm();
                setShow(false)
                setShowUpload(false)
                getTenantMembers(societyId, page);
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
                    memType,
                    startDate,
                    endDate,
                    agreement,
                    rentAgreement,
                    policeNoc,
                    idProof,
                    familyPhoto,
                    maintenanceReceipt,
                    ownershipDocuments,
                    nominationDetails,
                );

                toast.success("Tenant created successfully!");
                resetForm();
                setShow(false)
                getTenantMembers(societyId, page);
            }

            setShow(false);
        } catch (error) {
            console.log(error);
            toast.error(error);
            setErrorText(error);
        }
    };

    const GetTenantById = async (tenantId) => {
        try {
            const data = await getMembersByIdApi(societyId, tenantId);
            setMId(tenantId);
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
            setStartDate(data.start_date);
            setEndDate(data.end_date);
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

    // const handleDelete = async (tenantId) => {
    //     try {
    //         const data = await deleteMembersApi(tenantId);

    //         console.log(data, "Delete response");

    //         toast.success("Tenant deleted successfully");
    //         getTenantMembers(societyId, page);

    //     } catch (error) {
    //         console.error("Delete Error:", error);

    //         toast.error(error);
    //     }
    // };
    const handleDelete = async (tenantId) => {
        const confirmed = window.confirm("Are you sure you want to delete this tenant?");

        if (!confirmed) return;

        try {
            const data = await deleteMembersApi(tenantId);
            console.log(data, "Delete response");
            toast.success("Tenant deleted successfully");
            getTenantMembers(societyId, page);
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error(error);
        }
    };
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const getDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return "-";

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffDays = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        );

        // Less than 30 days
        if (diffDays <= 30) {
            return `Expiring in ${diffDays} Day${diffDays > 1 ? "s" : ""}`;
        }

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (end.getDate() < start.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years > 0 && months > 0) {
            return `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`;
        }

        if (years > 0) {
            return `${years} Year${years > 1 ? "s" : ""}`;
        }

        return `${months} Month${months > 1 ? "s" : ""}`;
    };

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmailId("");
        setMobileNo("");
        setBlocks(null);
        setFlat("");
        setStartDate("");
        setEndDate("");
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
        setMId("")
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);

        try {

            // if (value.length < 2) return;

            const data = await getTenantsMembersApi(societyId, page, limit, value);

            setAllTenantsMember(data?.tenants || []);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const exportData =
        selectedRange === "all"
            ? allExportTenent
            : selectedRange === "search"
                ? allTenentsMember
                : "";


    const downloadExcel = async () => {
        exportFile({
            data: exportData,
            fileName: "Tenants",
            sheetName: "Tenants",
            type: "xlsx",
        });
    };

    const downloadCSV = async () => {
        exportFile({
            data: exportData,
            fileName: "Tenants",
            sheetName: "Tenants",
            type: "csv",
        });
    };

    const downloadPDF = () => {
        exportToPDF({
            title: "Tenants Report",
            fileName: "Tenants",
            columns: [
                "Unit No.",
                "Tenant Name",
                "Email",
                "Lease Period",
                "KYC Status",
                "Agreement",
            ],
            data: exportData.map((item) => [
                item.flat_number,
                `${item.first_name || ""} ${item.last_name || ""}`,
                item.email || "",
                `${item.start_date ? formatDate(item.start_date) : ""}${item.end_date ? ` - ${formatDate(item.end_date)}` : ""
                }`,
                item.status || "",
                item.documents === 1 ? "Uploaded" : "Not Uploaded",
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

    const total = Math.ceil(totalCount / limit);

    const pendingApprovals = allTenentsMember.filter(
        item => item.status === "Pending"
    ).length;

    const activeRentals = allTenentsMember.filter(
        item => item.status === "Approved"
    ).length;

    const kycUnverified = allTenentsMember.filter(
        item => item.documents === 0
    ).length;

    const agreementsExpiring = allTenentsMember.filter(item => {
        if (!item.end_date) return false;

        const today = new Date();
        const endDate = new Date(item.end_date);

        const diffDays = Math.ceil(
            (endDate - today) / (1000 * 60 * 60 * 24)
        );

        return diffDays >= 0 && diffDays <= 30;
    }).length;

    const getRemainingDays = (endDate) => {
        if (!endDate) return -1;

        const today = new Date();
        const expiry = new Date(endDate);

        return Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );
    };

    const filteredData =
        mangementTypeTab === ""
            ? allTenentsMember
            : mangementTypeTab === "expiry"
                ? allTenentsMember.filter((item) => {
                    const remainingDays = getRemainingDays(item.end_date);
                    return remainingDays >= 0 && remainingDays <= 30;
                })
                : allTenentsMember.filter(
                    (item) =>
                        item.status === mangementTypeTab ||
                        item.document === mangementTypeTab
                );
    return (
        <>
            <div className="pg cp-wrap">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                    <div>
                        <h4 className="cp-title">Rental Flat Mangement</h4>
                        <p className="cp-sub">
                            Manage tenant registrations, verify KYC, and track rental agreements.
                        </p>
                    </div>

                    <div className='d-flex'>
                        <button
                            className="btn-ol ms-2"
                            onClick={() => {
                                getAllExportData(societyId);
                                setExportModal(true);
                            }}
                        >
                            <CgExport /> Export
                        </button>
                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() => { resetForm(); setShow(true); setMode("add") }
                        }>+ Register New Tenant</button>

                    </div>

                </div>
                {/* Stats */}
                <div className="row g-3 mb-4">
                    {[
                        [pendingApprovals, "Pending Approvals", "Action Required", "tile-yel"],
                        [agreementsExpiring, "Agreements Expiring", "In next 30 days", "tile-red"],
                        [kycUnverified, "KYC Unverified", "Pending review", "tile-blu"],
                        [activeRentals, "Active Rentals", "+3 this month", "tile-grn"],
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
                        <h4 className="cp-title">Tenants</h4>
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
                            data-bs-toggle="dropdown" onClick={() => setShowFilterRentals(true)}
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
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        {/* Unit */}
                                        <td className="text-start">
                                            <div className="fw-bold">{item.block} - {item.flat_number}</div>
                                            <small className="text-muted">
                                                Owner: {item.owner_name}
                                            </small>
                                        </td>

                                        {/* Tenant */}
                                        <td className="text-start">
                                            <div className="d-flex align-items-center gap-2">

                                                <img
                                                    src={
                                                        item.profile_url ||
                            /* "https://i.pravatar.cc/60?img=32" */ "../src/assets/profile.png"
                                                    }
                                                    alt="Profile"
                                                    width={38}
                                                    height={38}
                                                    className="rounded-circle object-fit-cover"
                                                />
                                                <div>
                                                    <div className="fw-semibold">
                                                        {item.first_name} {item.last_name}
                                                    </div>
                                                    <small className="text-muted">
                                                        {item.email}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Lease */}
                                        <td className="text-start">
                                            <div className="text-start">
                                                {item.start_date ? formatDate(item.start_date) : ""}

                                                {item.end_date && !isNaN(new Date(item.end_date))
                                                    ? ` - ${formatDate(item.end_date)}`
                                                    : ""}
                                            </div>

                                            <small>
                                                {item.start_date &&
                                                    item.end_date &&
                                                    !isNaN(new Date(item.start_date)) &&
                                                    !isNaN(new Date(item.end_date))
                                                    ? getDuration(item.start_date, item.end_date)
                                                    : ""}
                                            </small>
                                        </td>
                                        {/* KYC */}
                                        <td className="text-start">
                                            <Badge
                                                label={item.status}
                                                c={
                                                    item.status === "Approved"
                                                        ? "green"
                                                        : item.status === "Pending"
                                                            ? "yellow"
                                                            : item.status === "Rejected"
                                                                ? "red"
                                                                : "gray"
                                                }
                                            />{" "}

                                        </td>
                                        {/* Agreement */}
                                        <td className="text-start">

                                            <Badge
                                                label={item.documents === 1 ? "Uploaded" : "Not Uploaded"}
                                                c={
                                                    item.documents === 1
                                                        ? "blue"
                                                        : item.documents === 0
                                                            ? "red"

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
                                                            onClick={() => getViewDetails(item.user_id)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {
                                                                setMode("approve");
                                                                setShowApprove(true)
                                                                GetTenantById(item.user_id)
                                                            }}
                                                        >
                                                            Review & Approve
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {
                                                                setMode("upload");
                                                                setShowUpload(true)
                                                                GetTenantById(item.user_id)
                                                            }}
                                                        >
                                                            Upload
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {
                                                                setMode("edit");
                                                                setShow(true);
                                                                GetTenantById(item.user_id);
                                                            }}
                                                        >
                                                            Edit tenant
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                            onClick={() => handleDelete(item.user_id)}
                                                        >
                                                            Delete tenant
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

            <RegisterTenantsModal
                show={show}
                setShow={setShow}
                allBlocks={allBlocks}
                handleBlockChange={handleBlockChange}
                allFlats={allFlats}
                addMemberType={addMemberType}
                blocks={blocks}
                setBlocks={setBlocks}
                flat={flat}
                setFlat={setFlat}
                memType={memType}
                setMemType={setMemType}
                resetForm={resetForm}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                mobileNo={mobileNo}
                setMobileNo={setMobileNo}
                emailId={emailId}
                setEmailId={setEmailId}
                startDate={startDate}
                setStartDate={setStartDate}
                mode={mode}
                endDate={endDate}
                setEndDate={setEndDate}
                familyType={familyType}
                setFamilyType={setFamilyType}
                rentAgreement={rentAgreement}
                setRentAgreement={setRentAgreement}
                policeNoc={policeNoc}
                setPoliceNoc={setPoliceNoc}
                idProof={idProof}
                setIdProof={setIdProof}
                agreement={agreement}
                setAgreement={setAgreement}
                maintenanceReceipt={maintenanceReceipt}
                setMaintenanceReceipt={setMaintenanceReceipt}
                nominationDetails={nominationDetails}
                setNominationDetails={setNominationDetails}
                familyPhoto={familyPhoto}
                setFamilyPhoto={setFamilyPhoto}
                ownershipDocuments={ownershipDocuments}
                setOwnershipDocuments={setOwnershipDocuments}
                errors={errors}
                errorText={errorText}
                handleSubmit={handleSubmit}
            />

            <FilterRentalsModal
                showFilterRentals={showFilterRentals}
                setShowFilterRentals={setShowFilterRentals}
                filterData={filterData}
            />

            <UploadModal
                mode={mode}
                showUpload={showUpload}
                setShowUpload={setShowUpload}
                errors={errors}
                errorText={errorText}
                handleSubmit={handleSubmit}
            />

            <ApproveModal
                mode={mode}
                showApprove={showApprove}
                setShowApprove={setShowApprove}
                allBlocks={allBlocks}
                handleBlockChange={handleBlockChange}
                allFlats={allFlats}
                addMemberType={addMemberType}
                blocks={blocks}
                setBlocks={setBlocks}
                flat={flat}
                setFlat={setFlat}
                memType={memType}
                setMemType={setMemType}
                resetForm={resetForm}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                mobileNo={mobileNo}
                setMobileNo={setMobileNo}
                emailId={emailId}
                setEmailId={setEmailId}
                startDate={startDate}
                setStartDate={setStartDate}
                mode={mode}
                endDate={endDate}
                setEndDate={setEndDate}
                familyType={familyType}
                setFamilyType={setFamilyType}
                rentAgreement={rentAgreement}
                setRentAgreement={setRentAgreement}
                policeNoc={policeNoc}
                setPoliceNoc={setPoliceNoc}
                idProof={idProof}
                setIdProof={setIdProof}
                agreement={agreement}
                setAgreement={setAgreement}
                maintenanceReceipt={maintenanceReceipt}
                setMaintenanceReceipt={setMaintenanceReceipt}
                nominationDetails={nominationDetails}
                setNominationDetails={setNominationDetails}
                familyPhoto={familyPhoto}
                setFamilyPhoto={setFamilyPhoto}
                ownershipDocuments={ownershipDocuments}
                setOwnershipDocuments={setOwnershipDocuments}
                errors={errors}
                errorText={errorText}
            />
            <ExportModal
                show={exportModal}
                onClose={() => setExportModal(false)}
                onExport={handleExport}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                totalRecords={allExportTenent.length}
                currentRecords={allTenentsMember.length}
            />
        </>
    );
};

export default RentalAndTenants;
