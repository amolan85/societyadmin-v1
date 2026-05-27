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
    FaFileImport,
} from "react-icons/fa";

import {
    getAllBlocksApi,
    getAllFlatsApi,
} from "../../services/UnitRegisterApi";
import { CgExport } from "react-icons/cg";
// import MemberModal from "./MemberModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import { BiImport } from "react-icons/bi";
import NewRuleModal from "./NewRuleModal";
import EditRuleModal from "./EditRuleModal";


const ParkingRules = ({ setActive, setMemberId, setFlatId }) => {
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
    const [editRuleShow, setEditRuleShow] = useState(false);
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

    const [statusField, setStatusField] = useState("");
    const [typeField, setTypeField] = useState("");

    const parkingRulesData = [
        {
            ruleId: "#RULE-P-01",
            ruleTitle: "Visitor Parking Time Limit",
            description: "Max 4 hours without extension",
            type: "BY - LAW",
            typeBg: "#dbeafe",
            typeColor: "#3b82f6",
            penalty: "₹200 / hr overdue",
            status: "Active",
            statusBg: "#dcfce7",
            statusColor: "#22c55e",
        },
        {
            ruleId: "#RULE-P-02",
            ruleTitle: "Wrong Slot Usage Gilbert",
            description: "Parking in unassigned or reserved slot",
            type: "BY - LAW",
            typeBg: "#dbeafe",
            typeColor: "#3b82f6",
            penalty: "₹500 / hr overdue",
            status: "Active",
            statusBg: "#dcfce7",
            statusColor: "#22c55e",
        },
        {
            ruleId: "#RULE-P-03",
            ruleTitle: "Basement Speed Limit",
            description: "Maximum speed of 10 km/h",
            type: "Policy",
            typeBg: "#f3f4f6",
            typeColor: "#6b7280",
            penalty: "Warning Only",
            status: "Active",
            statusBg: "#dcfce7",
            statusColor: "#22c55e",
        },
        {
            ruleId: "#RULE-P-04",
            ruleTitle: "Overnight Guest Parking",
            description: "Requires prior approval from Admin",
            type: "Policy",
            typeBg: "#f3f4f6",
            typeColor: "#6b7280",
            penalty: "Towing (If unapproved)",
            status: "Reviewing",
            statusBg: "#ffedd5",
            statusColor: "#f97316",
        },
        {
            ruleId: "#RULE-P-05",
            ruleTitle: "EV Charging Station Usage",
            description: "EV Charging Station Usage",
            type: "Policy",
            typeBg: "#f3f4f6",
            typeColor: "#6b7280",
            penalty: "₹100 / hr overdue",
            status: "Active",
            statusBg: "#dcfce7",
            statusColor: "#22c55e",
        },
    ];

    const statusOptions = [
        {
            value: "draft",
            label: "Draft",
        },
        {
            value: "underReview",
            label: "Under Review",
        },
    ]

    const typeOptions = [
        {
            value: "policy",
            label: "Policy",
        },
        {
            value: "byLaw",
            label: "By-law",
        },
    ]

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
                        <h4 className="cp-title">Parking Rules & Regulations</h4>
                        <p className="cp-sub">
                            Manage enforcement policies, penalties, and parking by-laws.
                        </p>
                    </div>
                    <div className='d-flex'>

                        <button className="btn btn-sm btn-ac ms-2 btn-primary" onClick={() =>
                            setShow(true)}>+ Create Rule</button>

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
                            placeholder="Search history"
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
                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white ms-2"
                            data-bs-toggle="dropdown"
                        >
                            <BiImport size={14} />
                            Export
                        </button>
                    </div>
                </div>
                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    <th>RULE ID</th>
                                    <th>RULE TITLE</th>
                                    <th>TYPE</th>
                                    <th>PENALTY</th>
                                    <th>STATUS</th>
                                    <th className="text-center">ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {parkingRulesData.map((item, index) => (
                                    <tr key={index}>
                                        {/* Unit */}
                                        <td className="text-start">
                                            <div className="fw-bold">{item.ruleId}</div>

                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.ruleTitle}</div>
                                            <small className="text-muted">
                                                {item.description}
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
                                                label={item.type}
                                                c={
                                                    item.type === "BY - LAW"
                                                        ? "blue"
                                                        : item.type === "Policy"
                                                            ? "gray"

                                                            : "gray"
                                                }
                                            />{" "}

                                        </td>
                                        <td className="text-start">
                                            <div className="fw-bold">{item.penalty}</div>

                                        </td>
                                        {/* Agreement */}
                                        <td className="text-start">
                                            {/* <span
                                                className={`badge rounded-pill bg-${item.agreementColor}-subtle text-${item.agreementColor}`}
                                            >
                                                {item.agreementIcon} {item.status}
                                            </span> */}
                                            <Badge
                                                label={item.status}
                                                c={
                                                    item.status === "Active"
                                                        ? "green"
                                                        : item.status === "Reviewing"
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
                                                            // onClick={() =>
                                                            //     getMembersById(s.user_id, s.flat_id)
                                                            // }
                                                            onClick={() => setActive("viewParkingDetails")}
                                                        >
                                                            View Details
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => {

                                                                setEditRuleShow(true);
                                                                // GetMemberDetailsById(s.user_id);
                                                            }}
                                                        >
                                                            Edit Rules
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
                                                            Delete Rules
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
            <NewRuleModal
                show={show}
                setShow={setShow}

                statusOptions={statusOptions}
                statusField={statusField}
                setStatusField={setStatusField}

                typeOptions={typeOptions}
                typeField={typeField}
                setTypeField={setTypeField}
            />

            <EditRuleModal
                editRuleShow={editRuleShow}
                setEditRuleShow={setEditRuleShow}

                statusOptions={statusOptions}
                statusField={statusField}
                setStatusField={setStatusField}

                typeOptions={typeOptions}
                typeField={typeField}
                setTypeField={setTypeField}
            />
        </>
    );
};

export default ParkingRules;
