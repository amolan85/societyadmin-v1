import { useState, useEffect } from 'react'
import Select from 'react-select';
import "../../styles/AddMember.css"
import { Badge, Pagination } from '../../components/Common/ReusableFunction';
import { GetSessionData } from '../../utils/SessionManagement';
import { AddMemberApi, getMembersApi, getAllMembersWithoutPaginationApi, getMembersByIdApi, UpdateMemberApi, deleteMembersApi } from '../../services/AddMemberApi';
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiFilter, FiSearch } from 'react-icons/fi';
import { getAllBlocksApi, getAllFlatsApi } from '../../services/UnitRegisterApi';
import { CgExport } from 'react-icons/cg';
import MemberModal from './MemberModal';


const AddMember = ({ setActive, setMemberId, setFlatId }) => {
    const [memType, setMemType] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailId, setEmailId] = useState("")
    const [mobileNo, setMobileNo] = useState("")
    const [allFlats, setAllFlats] = useState([])
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
    const [mode, setMode] = useState("add");

    const [allMembers, setAllMembers] = useState([])
    const [allMembersWithoutPagination, setAllMembersWithoutPagination] = useState([])
    const [blocks, setBlocks] = useState("");
    const [allBlocks, setAllBlocks] = useState([]);
    const [activeTab, setActiveTab] = useState("excel");
    const [exportModal, setExportModal] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [search, setSearch] = useState("");
    const [mId, setMId] = useState("");

    const addMemberType = [
        { id: "Owner", value: "owner" },
        { id: "Tenant", value: "tenant" },
        { id: "Family Member", value: "familyMember" },
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
        getAllFlats(flats.society_id)
        getAllBlocks(flats.society_id)
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

    const getAllMembersWithoutPagination = async (societyId, search) => {
        try {
            const data = await getAllMembersWithoutPaginationApi(societyId, search)
            console.log(data.members, "All members without pagination")
            setAllMembersWithoutPagination(data.members)
        }
        catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    const getAllFlats = async (societyId, page) => {
        try {
            const data = await getAllFlatsApi(societyId)
            console.log(data.flats, "All flats")
            setAllFlats(
                data.flats.map((item) => ({
                    value: item.flat_number,
                    label: item.flat_number,
                }))
            );
        }
        catch (error) {
            console.error("Error fetching members:", error)
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

    const getMembersById = async (memberId, flatId) => {
        setMemberId(memberId);
        setFlatId(flatId);
        setActive("memberDetails");
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

    //submit function for add member
    // const handleSubmit = async () => {
    //     try {
    //         const validationErrors = validateForm();

    //         if (Object.keys(validationErrors).length > 0) {
    //             setErrors(validationErrors);
    //             return;
    //         }

    //         await AddMemberApi(
    //             societyId,
    //             userId,
    //             firstName,
    //             lastName,
    //             mobileNo,
    //             emailId,
    //             blocks.value,
    //             flat.value,
    //             finalMemType,
    //             residency,
    //             moveInDate,
    //             moveOutDate,
    //             agreement,
    //             rentAgreement,
    //             policeNoc,
    //             idProof,
    //             familyPhoto,
    //             maintenanceReceipt,
    //             ownershipDocuments,
    //             nominationDetails
    //         );

    //         toast.success("Member created successfully!")
    //         setShow(false);

    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error);
    //         setErrorText(error)
    //     }
    // };

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

                toast.success("Member updated successfully!");

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

                toast.success("Member created successfully!");
            }

            setShow(false);

        } catch (error) {
            console.log(error);
            toast.error(error?.message || "Something went wrong");
            setErrorText(error);
        }
    };

    const GetMemberDetailsById = async (memberId) => {
        try {

            const data = await getMembersByIdApi(
                societyId,
                memberId
            );
            setMId(memberId)
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmailId(data.email);
            setMobileNo(data.mobile);
            // setBlocks(data.block);
            // setFlat(data.flat_number);
            setBlocks({
                value: data.block,
                label: data.block
            });

            setFlat({
                value: data.flat_number,
                label: data.flat_number
            });
            // memType(data.occupancy_type);
            setFamilyType(data.occupancy_type === "owner_relative" ? "Owner Family" : data.occupancy_type === "tenant_relative" ? "Tenant Family" : "");
            setMemType(data.occupancy_type);

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

        // Refresh member list if needed
        // GetAllMembers();

    } catch (error) {
        console.error("Delete Error:", error);

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete member"
        );
    }
};

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmailId("");
        setMobileNo("");
        // setBlocks(null);
        // setFlat("");
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
        if (allMembersWithoutPagination.length > 0) {
            worksheet.columns = Object.keys(allMembersWithoutPagination[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add rows
            allMembersWithoutPagination.forEach((item) => {
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
        if (allMembersWithoutPagination.length > 0) {

            worksheet.columns = Object.keys(allMembersWithoutPagination[0]).map((key) => ({
                header: key,
                key: key,
                width: 20,
            }));

            // add allMembers
            allMembersWithoutPagination.forEach((item) => {
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
            "First Name", "Last Name", "Mobile No.", "Email Id", "Block", "Flat", "Membership Type", "moveOutDate"
        ];

        // table rows
        const tableRows = rows.map((item) => [
            item.first_name,
            item.last_name,
            item.mobile,
            item.email,
            item.blocks?.label || item.blocks,
            item.flat,
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




    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        const data = await getAllMembersWithoutPaginationApi(societyId, value);
        console.log(data, "Search results");
        setAllMembers(data?.members || []);
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
                        [totalCount, "Total Members"],
                        [totalOwners, "Owners"],
                        [totalTenant, "Tenants"],
                        [totalFamilyMember, "New This Week", "tile-grn"]
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
                            placeholder="Search by name, unit, or email..."
                            value={search}
                            // onChange={(e) => setSearch(e.target.value)}
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
                        <button className="btn-ol ms-2" onClick={() => { getAllMembersWithoutPagination(societyId, search); setExportModal(true) }}><CgExport /> Export</button>
                        <button className='btn btn-sm btn-primary ms-2' onClick={() => setShow(true)}>+ Add Member</button>

                    </div>

                </div>

                {/* <div className='row'>
                    <div className='col-lg-7'>
                        <div className="NoticeBoardTabs mt-3 bg-white"
                        >
                            {memberType.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setMemberTypeTab(t.value)}
                                    className={`NoticeBoardTabs-btn ${memberTypeTab === t.value ? "active" : ""}`}
                                >
                                    {t.icon} {t.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div> */}

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {
                                        // ["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                                        ["MEMBER NAME", "UNIT NO.", "ROLE", "CONTACT INFO", "STATUS", "ACTIONS"]
                                            .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {(allMembers).map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        {/* <td className="sa-name">{s.first_name} {s.last_name}</td> */}
                                        <td>
                                            <div className="d-flex align-items-center gap-2">

                                                <img
                                                    src={s.profile_url || /* "https://i.pravatar.cc/60?img=32" */ "../src/assets/profile.png"}
                                                    alt="Profile"
                                                    width={38}
                                                    height={38}
                                                    className="rounded-circle object-fit-cover"
                                                />


                                                <div>
                                                    <div className="fw-semibold">
                                                        {s.first_name} {s.last_name}
                                                    </div>

                                                    <small className="text-muted">
                                                        {s.email}

                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="sa-name">{s.flat_number}</td>
                                        <td >{s.occupancy_type && <Badge label={
                                            s.occupancy_type
                                                ? s.occupancy_type === "tenant_relative"
                                                    ? "Tenant Family"
                                                    : s.occupancy_type === "owner_relative"
                                                        ? "Owner Family"
                                                        : s.occupancy_type
                                                            .replaceAll("_", " ")
                                                            .replace(/\b\w/g, (char) => char.toUpperCase())
                                                : ""
                                        }
                                            c={
                                                s.occupancy_type === "owner" ? "blue"
                                                    : s.occupancy_type === "tenant" ? "pink"
                                                        : s.occupancy_type === "tenant_relative" ? "lightpink"
                                                            : s.occupancy_type === "owner_relative" ? "lightblue"
                                                                : "grey"
                                            }
                                        />}</td>
                                        <td className="sa-name">{s.mobile}</td>
                                        <td><Badge label={s.status === "Approved" ? "Active" : s.status} c={
                                            s.status === "Approved" ? "green" : s.status === "Pending" ? "yellow" : s.status === "Inactive" ? "gray" : "gray"
                                        } /> </td>
                                        {/* <td className="sa-name">
                                            <button className="btn btn-light border-0"
                                                onClick={() => getMembersById(s.user_id)}
                                            > ⋮</button>
                                        </td> */}
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
                                                            onClick={() => getMembersById(s.user_id, s.flat_id)}
                                                        >
                                                            View Profile
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item"
                                                            onClick={() => { setMode("edit"); setShow(true); GetMemberDetailsById(s.user_id) }}
                                                        >
                                                            Edit Member
                                                        </button>
                                                    </li>

                                                    <li><hr className="dropdown-divider" /></li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item member-action-item member-action-delete"
                                                        onClick={() => handleDelete(s.user_id)}
                                                        >
                                                            Delete Member
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
            {/* 
            {show && (
                <>
                  
                    <div className="modal-backdrop fade show"></div>

                   
                    <div className="modal show d-block">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title">Add New Member</h5>

                                   
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
                                                        <label className="sv-lb" >Select Block <span className="text-danger">*</span></label>
                                                        {errors.blocks && <span className='text-danger mx-2 '>{errors.blocks}</span>}
                                                    </div>
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles) => ({
                                                                ...baseStyles,
                                                                borderColor: errors.blocks ? "red" : baseStyles.borderColor,
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                    borderColor: errors.blocks ? "red" : baseStyles.borderColor,
                                                                },
                                                            }),
                                                        }}
                                                        options={allBlocks}             
                                                        value={blocks}               
                                                        onChange={(selectedOption) => setBlocks(selectedOption)} 
                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Flat / Unit Number <span className="text-danger">*</span></label>
                                                        {errors.flat && <span className='text-danger mx-2 '>{errors.flat}</span>}
                                                    </div>

                                                    <Select
                                                        styles={{
                                                            control: (baseStyles) => ({
                                                                ...baseStyles,
                                                                borderColor: errors.flat ? "red" : baseStyles.borderColor,
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                    borderColor: errors.flat ? "red" : baseStyles.borderColor,
                                                                },
                                                            }),
                                                        }}
                                                        options={allFlats}             
                                                        value={flat}               
                                                        onChange={(selectedOption) => setFlat(selectedOption)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Membership Type <span className="text-danger">*</span>
                                                </label>

                                                {errors.memType && (
                                                    <span className="text-danger mx-2">
                                                        {errors.memType}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`am-type-wrap mb-3 ${errors.memType ? "border border-danger  p-1" : ""
                                                    }`}
                                            >
                                                {addMemberType.map((t) => (
                                                    <button
                                                        key={t.value}
                                                        onClick={() => {
                                                            setMemType(t.value);
                                                            resetForm();
                                                        }}
                                                        className={`am-type-btn ${memType === t.value ? "active" : ""
                                                            }`}
                                                    >
                                                        {t.id}
                                                    </button>
                                                ))}
                                            </div>


                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className='d-flex'><label className="sv-lb">First Name <span className="text-danger">*</span></label>
                                                        {errors.firstName && <span className='text-danger mx-2 '>{errors.firstName}</span>}</div>
                                                    <input className={`sv-in ${errors.firstName ? "error-input" : ""}`} placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Last Name <span className="text-danger">*</span></label>
                                                        {errors.lastName && <span className='text-danger mx-2 '>{errors.lastName}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.lastName ? "error-input" : ""}`} placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
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

                                                <div className="col-6">
                                                    <div className='d-flex'>
                                                        <label className="sv-lb">Email Address <span className="text-danger">*</span></label>
                                                        {errors.emailId && <span className='text-danger mx-2 '>{errors.emailId}</span>}
                                                    </div>
                                                    <input className={`sv-in ${errors.emailId ? "error-input" : ""}`} placeholder="Enter Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                                                </div>
                                            </div>




                                            {memType === "tenant" && (
                                                <>
                                                    <div className="row g-3 mb-3">
                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Move-in Date <span className="text-danger">*</span></label>
                                                                {errors.moveInDate && <span className='text-danger mx-2'>{errors.moveInDate}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.moveInDate ? "error-input" : ""}`} type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                                                        </div>

                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Move-out Date <span className="text-danger">*</span></label>
                                                                {errors.moveOutDate && <span className='text-danger mx-2'>{errors.moveOutDate}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.moveOutDate ? "error-input" : ""}`} type="date" value={moveOutDate} onChange={(e) => setMoveOutDate(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div className="row g-3 mb-3">
                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Rent Agreement <span className="text-danger">*</span></label>
                                                                {errors.rentAgreement && <span className='text-danger mx-2'>{errors.rentAgreement}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.rentAgreement ? "error-input" : ""}`} type="file" onChange={(e) => setRentAgreement(e.target.files[0])} />
                                                        </div>

                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Police Noc <span className="text-danger">*</span></label>
                                                                {errors.policeNoc && <span className='text-danger mx-2'>{errors.policeNoc}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.policeNoc ? "error-input" : ""}`} type="file" onChange={(e) => setPoliceNoc(e.target.files[0])} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {memType === "owner" && (
                                                <>
                                                    <div className="row g-3 mb-3">


                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Move-in Date <span className="text-danger">*</span></label>
                                                                {errors.moveInDate && <span className='text-danger mx-2'>{errors.moveInDate}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.moveInDate ? "error-input" : ""}`} type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div className="row g-3 mb-3">
                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Id Proof <span className="text-danger">*</span></label>
                                                                {errors.idProof && <span className='text-danger mx-2'>{errors.idProof}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.idProof ? "error-input" : ""}`} type="file" onChange={(e) => setIdProof(e.target.files[0])} />
                                                        </div>

                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Agreement <span className="text-danger">*</span></label>
                                                                {errors.agreement && <span className='text-danger mx-2'>{errors.agreement}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.agreement ? "error-input" : ""}`} type="file" onChange={(e) => setAgreement(e.target.files[0])} />
                                                        </div>
                                                    </div>

                                                    <div className="row g-3 mb-3">
                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Maintenance Receipt <span className="text-danger">*</span></label>
                                                                {errors.maintenanceReceipt && <span className='text-danger mx-2'>{errors.maintenanceReceipt}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.maintenanceReceipt ? "error-input" : ""}`} type="file" onChange={(e) => setMaintenanceReceipt(e.target.files[0])} />
                                                        </div>

                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Nomination Details <span className="text-danger">*</span></label>
                                                                {errors.nominationDetails && <span className='text-danger mx-2'>{errors.nominationDetails}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.nominationDetails ? "error-input" : ""}`} type="file" onChange={(e) => setNominationDetails(e.target.files[0])} />
                                                        </div>
                                                    </div>

                                                    <div className="row g-3 mb-3">
                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Family Photo <span className="text-danger">*</span></label>
                                                                {errors.familyPhoto && <span className='text-danger mx-2'>{errors.familyPhoto}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.familyPhoto ? "error-input" : ""}`} type="file" onChange={(e) => setFamilyPhoto(e.target.files[0])} />
                                                        </div>

                                                        <div className="col-6">
                                                            <div className='d-flex'>
                                                                <label className="sv-lb">Ownership <span className="text-danger">*</span></label>
                                                                {errors.ownershipDocuments && <span className='text-danger mx-2'>{errors.ownershipDocuments}</span>}
                                                            </div>
                                                            <input className={`sv-in ${errors.ownershipDocuments ? "error-input" : ""}`} type="file" onChange={(e) => setOwnershipDocuments(e.target.files[0])} />
                                                        </div>
                                                    </div>

                                                </>
                                            )}
                                            {
                                                memType === "familyMember" && (
                                                    <>
                                                        <div className="row g-3 mb-3">
                                                            <div className="col-6">
                                                                <div className='d-flex'>
                                                                    <label className="sv-lb">Move-in Date <span className="text-danger">*</span></label>
                                                                    {errors.moveInDate && <span className='text-danger mx-2'>{errors.moveInDate}</span>}
                                                                </div>
                                                                <input className={`sv-in ${errors.moveInDate ? "error-input" : ""}`} type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                                                            </div>

                                                        </div>
                                                        <div className="mb-2">

                                                            <div className="d-flex">
                                                                <label className="form-label fw-semibold d-block mb-2">
                                                                    Select Family Type <span className="text-danger">*</span>
                                                                </label>

                                                                {errors.familyType && (
                                                                    <span className="text-danger mx-2">
                                                                        {errors.familyType}
                                                                    </span>
                                                                )}
                                                            </div>

                                                     
                                                            <div

                                                            >

                                                                <div className="form-check form-check-inline">
                                                                    <input

                                                                        className={`form-check-input ${errors.familyType ? "border border-danger" : ""
                                                                            }`}
                                                                        type="radio"
                                                                        name="familyType"
                                                                        id="owner_relative"
                                                                        value="owner_relative"
                                                                        checked={familyType === "owner_relative"}
                                                                        onChange={(e) =>
                                                                            setFamilyType(e.target.value)
                                                                        }
                                                                    />

                                                                    <label
                                                                        className="form-check-label am-check"
                                                                        htmlFor="owner_relative"
                                                                    >
                                                                        Owner Family
                                                                    </label>
                                                                </div>

                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className={`form-check-input ${errors.familyType ? "border border-danger" : ""
                                                                            }`}
                                                                        type="radio"
                                                                        name="familyType"
                                                                        id="tenant_relative"
                                                                        value="tenant_relative"
                                                                        checked={familyType === "tenant_relative"}
                                                                        onChange={(e) =>
                                                                            setFamilyType(e.target.value)
                                                                        }
                                                                    />

                                                                    <label
                                                                        className="form-check-label am-check"
                                                                        htmlFor="tenant_relative"
                                                                    >
                                                                        Tenant Family
                                                                    </label>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </>



                                                )
                                            }

                                            {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">

                                    <div className="d-flex gap-2 justify-content-end">
                                        <button className="btn-ol btn close" onClick={() => setShow(false)}>Cancel</button>
                                        <button className="btn-ac px-4" onClick={handleSubmit}>Add Member</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )} */}

            <MemberModal
                show={show}
                setShow={setShow}

                allBlocks={allBlocks}
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

                moveInDate={moveInDate}
                setMoveInDate={setMoveInDate}

                mode={mode}

                moveOutDate={moveOutDate}
                setMoveOutDate={setMoveOutDate}

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

export default AddMember