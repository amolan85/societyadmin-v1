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
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  getAllBlocksApi,
  getAllFlatsApi,
} from "../../services/UnitRegisterApi";
import { CgExport } from "react-icons/cg";
import MemberModal from "./MemberModal";
import { exportFile, exportToPDF } from "../../components/Common/ExportFile";
import ExportModal from "../../components/Common/ExportModal";

const AddMember = ({ setActive, setMemberId, setFlatId }) => {
  const [memType, setMemType] = useState("");
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

  const addMemberType = [
    { id: "Owner", value: "owner" },
    { id: "Tenant", value: "tenant" },
    { id: "Family Member", value: "familyMember" },
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

    setFirstName(data.first_name || "");
    setLastName(data.last_name || "");
    setEmailId(data.email || "");
    setMobileNo(data.mobile || "");

    const flatDetails = data.flats?.[0];

    if (flatDetails) {
      setBlocks({
        value: flatDetails.block,
        label: flatDetails.block,
      });

      setFlat({
        value: flatDetails.flat_id,
        label: flatDetails.flat_number,
      });

      setFamilyType(flatDetails.occupancy_type);

      setMemType(
        flatDetails.occupancy_type === "owner_relative"
          ? "familyMember"
          : flatDetails.occupancy_type === "tenant_relative"
          ? "familyMember"
          : flatDetails.occupancy_type
      );

      setMoveInDate(flatDetails.start_date || "");
      setMoveOutDate(flatDetails.end_date || "");
    }

    data.flats?.[0]?.documents?.forEach((doc) => {
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
  // const handleDelete = async (memberId) => {
  //   try {
  //     const data = await deleteMembersApi(memberId);

  //     console.log(data, "Delete response");

  //     toast.success("Member deleted successfully");
  //     getMembers(societyId, page);
  //     // Refresh member list if needed
  //     // GetAllMembers();
  //   } catch (error) {
  //     console.error("Delete Error:", error);

  //     toast.error(error);
  //   }
  // };
  const handleDelete = async (memberId) => {
    const confirmed = window.confirm("Are you sure you want to delete this member?");

    if (!confirmed) return;

    try {
      const data = await deleteMembersApi(memberId);
      console.log(data, "Delete response");
      toast.success("Member deleted successfully");
      getMembers(societyId, page);
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
    setBlocks("");
    setFlat("");
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
        const data = await getMembers(societyId, 1);
        setAllMembers(data?.members || []);
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

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            [totalCount, "Total Members"],
            [totalOwners, "Owners"],
            [totalTenant, "Tenants"],
            [totalFamilyMember, "New This Week", "tile-grn"],
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
                color: "#aaa",
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
          <div className="d-flex">
            <button
              className="btn-ol ms-2"
              data-bs-toggle="dropdown"
            >
              <FiFilter size={14} />
              Filter
            </button>
            <button
              className="btn-ol ms-2"
              onClick={() => {
                getAllMembersWithoutPagination(societyId, "");
                setExportModal(true);
              }}
            >
              <CgExport /> Export
            </button>
            <button
              className="btn btn-sm btn-ac ms-2 btn-primary"
              onClick={() => {
                setMode("add");
                setShow(true);
                resetForm();
                setBlocks(null);
                setFlat(null);
              }}
            >
              + Add Member
            </button>
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
                    [
                      "MEMBER NAME",
                      "UNIT NO.",
                      "ROLE",
                      "CONTACT INFO",
                      "STATUS",
                      "ACTIONS",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {allMembers.map((s, i) => (
                  <tr className="text-start" key={i}>
                    {/* <td className="sa-name">{s.first_name} {s.last_name}</td> */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            s.profile_url ||
                            /* "https://i.pravatar.cc/60?img=32" */ "../src/assets/profile.png"
                          }
                          alt="Profile"
                          width={38}
                          height={38}
                          className="rounded-circle object-fit-cover"
                        />

                        <div>
                          <div className="fw-semibold">
                            {s.first_name} {s.last_name}
                          </div>

                          <small className="text-muted">{s.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="sa-name">{s.flat_number}</td>
                    <td>
                      {s.occupancy_type && (
                        <Badge
                          label={
                            s.occupancy_type
                              ? s.occupancy_type === "tenant_relative"
                                ? "Tenant Family"
                                : s.occupancy_type === "owner_relative"
                                  ? "Owner Family"
                                  : s.occupancy_type
                                    .replaceAll("_", " ")
                                    .replace(/\b\w/g, (char) =>
                                      char.toUpperCase(),
                                    )
                              : ""
                          }
                          c={
                            s.occupancy_type === "owner"
                              ? "blue"
                              : s.occupancy_type === "tenant"
                                ? "pink"
                                : s.occupancy_type === "tenant_relative"
                                  ? "lightpink"
                                  : s.occupancy_type === "owner_relative"
                                    ? "lightblue"
                                    : "grey"
                          }
                        />
                      )}
                    </td>
                    <td className="sa-name">{s.mobile}</td>
                    <td>
                      <Badge
                        label={s.status === "Approved" ? "Active" : s.status}
                        c={
                          s.status === "Approved"
                            ? "green"
                            : s.status === "Pending"
                              ? "yellow"
                              : s.status === "Inactive"
                                ? "gray"
                                : "gray"
                        }
                      />{" "}
                    </td>
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
                              onClick={() =>
                                getMembersById(s.user_id, s.flat_id)
                              }
                            >
                              View Profile
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item member-action-item"
                              onClick={() => {
                                setMode("edit");
                                setShow(true);
                                GetMemberDetailsById(s.user_id);
                              }}
                            >
                              Edit Member
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
          <Pagination page={page} total={total} onChange={handlePageChange} />
        </div>
      </div>
      <MemberModal
        show={show}
        setShow={setShow}
        allBlocks={allBlocks}
        allFlats={allFlats}
        addMemberType={addMemberType}
        blocks={blocks}
        setBlocks={setBlocks}
        handleBlockChange={handleBlockChange}
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
      <ExportModal
        show={exportModal}
        onClose={() => setExportModal(false)}
        onExport={handleExport}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        totalRecords={allMembersWithoutPagination.length}
        currentRecords={allMembers.length}
      />
      {/* {exportModal && (
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
                  <h6 className=" text-start" style={{ fontWeight: "bold" }}>
                    Select Format
                  </h6>
                  <div className="row mb-4">
                   
                    <div className="col-md-4">
                      <div
                        className={`format-card text-center p-3 rounded-3 ${activeTab === "excel" ? "active-format" : ""
                          }`}
                        onClick={() => {
                          setActiveTab("excel");
                        }}
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

                  
                    <div className="col-md-4">
                      <div
                        className={`format-card text-center p-3 rounded-3 ${activeTab === "csv" ? "active-format" : ""
                          }`}
                        onClick={() => {
                          setActiveTab("csv");
                        }}
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

                    
                    <div className="col-md-4">
                      <div
                        className={`format-card text-center p-3 rounded-3 ${activeTab === "pdf" ? "active-format" : ""
                          }`}
                        onClick={() => {
                          setActiveTab("pdf");
                        }}
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

                  <div
                    className={`range-card d-flex justify-content-between align-items-center mb-3 ${selectedRange === "all" ? "active-range" : ""
                      }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exportRange"
                        checked={selectedRange === "all"}
                        onChange={() => setSelectedRange("all")}
                      />
                      <h6 className="fw-bold mt-1">All Data</h6>
                    </div>

                    <h6 className="text-muted mt-1">
                      {allMembersWithoutPagination.length} records
                    </h6>
                  </div>

                  <div
                    className={`range-card d-flex justify-content-between align-items-center mb-3 ${selectedRange === "search" ? "active-range" : ""
                      }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exportRange"
                        checked={selectedRange === "search"}
                        onChange={() => setSelectedRange("search")}
                      />
                      <h6 className="fw-bold mt-1">Current Search Results</h6>
                    </div>

                    <h6 className="text-muted mt-1">{allMembers.length} records</h6>
                  </div>

                  <div
                    className={`range-card d-flex align-items-center gap-3 ${selectedRange === "custom" ? "active-range" : ""
                      }`}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exportRange"
                      checked={selectedRange === "custom"}
                      onChange={() => setSelectedRange("custom")}
                    />
                    <h6 className="fw-bold mt-1">Custom Date Range</h6>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-sm btn btn-outline-secondary"
                    onClick={() => {
                      setExportModal(false);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleExport}
                  >
                    <i className="bi bi-download me-2"></i>
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
    </>

  );
};

export default AddMember;
