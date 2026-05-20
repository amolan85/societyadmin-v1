import React, { useState, useEffect } from 'react'
import "../../../styles/AddMember.css"
// import memberDetails from './MemberDetails';
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
import { FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';
import { BiImport } from 'react-icons/bi';


const ParkingHistory = ({ setActive }) => {
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

    const parkingHistoryData = [
        {
            "id": 1,
            "activity": "Sticker Renewed",
            "activityId": "#EV-2024-001",
            "dateTime": "Jan 10, 2025 09:30 AM",
            "description": "Renewed annual parking sticker for Tesla Model 3",
            "performedBy": "Admin User",
            "status": "Completed"
        },
        {
            "id": 2,
            "activity": "Vehicle Updated",
            "activityId": "Plate Change",
            "dateTime": "Nov 05, 2025 02:15 PM",
            "description": "Updated vehicle details from BMW 3 Series to Tesla Model 3",
            "performedBy": "Sarah Williams",
            "status": "Approved"
        },
        {
            "id": 3,
            "activity": "Wrong Parking",
            "activityId": "Complaint #C-402",
            "dateTime": "Aug 12, 2025 06:45 PM",
            "description": "Guest vehicle parked in reserved slot P-B05",
            "performedBy": "Security",
            "status": "Resolved"
        },
        {
            "id": 4,
            "activity": "Allocation Created",
            "activityId": "New Allocation",
            "dateTime": "Jan 15, 2025 10:00 AM",
            "description": "Slot P-B05 allocated to Unit B-204 (Sarah Williams)",
            "performedBy": "Admin User",
            "status": "Completed"
        }
    ]

    const memberType = [
        { id: "All Items", value: "" },
        { id: "Owner", value: "owner" },
        { id: "Tenant", value: "tenant" },
        { id: "Family Member", value: "familyMember" },
    ];

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

        if (!wing) {
            errors.wing = "required";
        }

        if (!flat) {
            errors.flat = "required";
        }
        if (!moveInDate) {
            errors.moveInDate = "required";
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

            const data = await AddMemberApi(
                societyId,
                userId,
                firstName,
                lastName,
                mobileNo,
                emailId,
                wing,
                flat,
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

            toast.success("Member created successfully!")
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

    // const total = Math.ceil(totalCount / limit);
    const total = 1;
    // const per = limit, total = Math.ceil(filteredData.length / per);
    // const rows = filteredData.slice((page - 1) * per, page * per);

    return (
        <>
            {
                <style>
                    {`
                .ph-icon {
                 width: 42px;
                 height: 42px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
                 background: #f0f0f0;
}   `}
                </style>
            }
            <div className="pg cp-wrap">

                <div className="d-flex justify-content-between align-items-center mb-4 text-start">
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
                            <FiCalendar size={14} />

                            Date Range
                        </button>

                        <button
                            className="btn btn-sm filter-btn d-flex align-items-center gap-2 bg-white ms-2"
                            data-bs-toggle="dropdown"
                        >
                            <FiFilter size={14} />

                            Filter Type
                        </button>
                        <button className="btn-ol ms-2" onClick={() => setExportModal(true)}><BiImport /> Export</button>
                    </div>

                </div>

                <div className="sv-card p-0 overflow-hidden">
                    <div className="sa-table-wrap">
                        {/* <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {
                                        [" ACTIVITY", "DATE & TIME", "DESCRIPTION", "PERFORMED BY", "STATUS"]
                                            .map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {parkingHistoryData.map((s, i) => (
                                    <tr className="text-start" key={i}>
                                        <td className="sa-name">{s.activity}</td>
                                        <td className="sa-name">{s.dateTime}</td>
                                        <td className="sa-name">{s.description}</td>
                                        <td className="sa-name">{s.performedBy}</td>
                                        <td ><Badge label={s.status} c={s.status === "Completed" ? "green" : s.status === "Approved" ? "pink" : "blue"} /> </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                        <table className="sv-tbl">
                            <thead>
                                <tr>
                                    {["ACTIVITY", "DATE & TIME", "DESCRIPTION", "PERFORMED BY", "STATUS"]
                                        .map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                </tr>
                            </thead>

                            <tbody>
                                {parkingHistoryData.map((s, i) => (
                                    <tr className="text-start" key={i}>

                                        {/* ACTIVITY */}
                                        <td>
                                            <div className="d-flex align-items-start gap-3">

                                                <div
                                                    className={`ph-icon 
                                ${s.status === "Completed" ? "ph-green" : ""}
                                ${s.status === "Approved" ? "ph-pink" : ""}
                                ${s.status === "Resolved" ? "ph-blue" : ""}
                            `}
                                                >
                                                    {s.activity === "Sticker Renewed" && "⭐"}
                                                    {s.activity === "Vehicle Updated" && "🚗"}
                                                    {s.activity === "Wrong Parking" && "⚠️"}
                                                    {s.activity === "Allocation Created" && "✔️"}
                                                </div>

                                                <div>
                                                    <div className="fw-semibold text-dark">
                                                        {s.activity}
                                                    </div>

                                                    <small className="text-muted">
                                                        ID : {s.activityId}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DATE & TIME */}
                                        <td>
                                            <div className="fw-semibold text-dark">
                                                {s.dateTime.split(" ")[0]}{" "}
                                                {s.dateTime.split(" ")[1]}{" "}
                                                {s.dateTime.split(" ")[2]}
                                            </div>

                                            <small className="text-muted">
                                                {s.dateTime.split(" ").slice(3).join(" ")}
                                            </small>
                                        </td>

                                        {/* DESCRIPTION */}
                                        <td className="text-muted" style={{ maxWidth: "260px" }}>
                                            {s.description}
                                        </td>

                                        {/* PERFORMED BY */}
                                        <td>
                                            <div className="d-flex align-items-center gap-2">

                                                <img
                                                    src={`https://i.pravatar.cc/40?img=${i + 12}`}
                                                    alt=""
                                                    width={34}
                                                    height={34}
                                                    className="rounded-circle"
                                                />

                                                <span className="fw-semibold text-dark">
                                                    {s.performedBy}
                                                </span>
                                            </div>
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <Badge
                                                label={s.status}
                                                c={
                                                    s.status === "Completed"
                                                        ? "green"
                                                        : s.status === "Approved"
                                                            ? "pink"
                                                            : s.status === "Resolved"
                                                                ? "blue"
                                                                : "grey"
                                                }
                                            />
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


        </>
    );
}

export default ParkingHistory