import { useState, useEffect } from "react";
import "../../styles/AddMember.css";
import { Badge, Pagination } from "../../components/Common/ReusableFunction";
import { GetSessionData } from "../../utils/SessionManagement";
import { useLoader } from "../../context/LoaderContext";
import {
  AddMemberApi,
  getMembersApi,
  getAllMembersWithoutPaginationApi,
  getMembersByIdApi,
  UpdateMemberApi,
  deleteMembersApi,
} from "../../services/AddMemberApi";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
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
  const [tableLoading, setTableLoading] = useState(true);
  //filter
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("")

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

  //loader
  const { setLoading } = useLoader(); 


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
    const flats = data.data.flats[0];
    setSocietyId(flats.society_id);
    setUserId(flats.user_id);

    // ✅ Dono ek saath, loading tab tak rahe jab tak dono complete na ho
    setLoading(true);
    try {
      await Promise.all([
        getMembers(flats.society_id),
        // getAllBlocks(flats.society_id),
      ]);
    } finally {
      setLoading(false);
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
      console.log(data, "All flats response");

      // ✅ To get flats from data
      const flats = data?.flats || data?.data?.flats || [];

      setAllFlats(
        flats.map((item) => ({
          value: item.flat_id,
          label: item.flat_number,
          flat_id: item.flat_id,
          flat_number: item.flat_number,
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
  
    if (!mobileNo) {
      errors.mobileNo = "required";
    } else if (!/^[0-9]{10}$/.test(mobileNo)) {
      errors.mobileNo = "Invalid mobile no.";
    }
  
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
      setLoading(true);
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
          //flat?.flat_id,
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
          //flat?.flat_id,
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
    finally {
      setLoading(false);
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
          flat_id: flatDetails.flat_id,
        });

        // ✅ occupancy object ke andar se nikalo
        const occupancy = flatDetails.occupancy;

        setFamilyType(occupancy?.occupancy_type || "");

        setMemType(
          occupancy?.occupancy_type === "owner_relative"
            ? "familyMember"
            : occupancy?.occupancy_type === "tenant_relative"
              ? "familyMember"
              : occupancy?.occupancy_type || ""
        );

        setMoveInDate(occupancy?.start_date || "");
        setMoveOutDate(occupancy?.end_date || "");
      }

      flatDetails?.documents?.forEach((doc) => {
        switch (doc.document_type) {
          case "id_proof": setIdProof(doc.url); break;
          case "family_photo": setFamilyPhoto(doc.url); break;
          case "agreement": setAgreement(doc.url); break;
          case "ownership": setOwnershipDocuments(doc.url); break;
          case "maintenance_receipt": setMaintenanceReceipt(doc.url); break;
          case "rent_agreement": setRentAgreement(doc.url); break;
          case "police_noc": setPoliceNoc(doc.url); break;
          default: break;
        }
      });

    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDelete = async (memberId, societyId) => {
    const confirmed = window.confirm("Are you sure you want to delete this member?");

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteMembersApi(memberId, societyId);
      toast.success("Member deleted successfully");
      await getMembers(societyId, page);

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmailId("");
    setMobileNo("");
    //setBlocks("");
    //setFlat("");
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

  const getMembers = async (
    societyId,
    page = 1,
    occupancyType = "",
    startDate = "",
    endDate = ""
  ) => {
    try {
      setTableLoading(true);
      const data = await getMembersApi(
        societyId,
        page,
        occupancyType,
        startDate,
        endDate
      );

      setAllMembers(data?.members || []);
      setPage(data?.pagination?.page || 1);
      setLimit(data?.pagination?.page_size || 10);
      setTotalCount(data?.pagination?.total || 0);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    finally {
      setTableLoading(false); // ✅ local
    }
  };
  
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

  const totalFamilyMember = allMembers.filter(item =>
    item.occupancy_type === "owner_relative" ||
    item.occupancy_type === "tenant_relative"
  ).length;


  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      getMembers(societyId, 1, filterStatus, filterDateFrom, filterDateTo);
      return;
    }

    if (value.length < 3) return;

    try {
      setTableLoading(true);

      const response = await getAllMembersWithoutPaginationApi(
        societyId,
        value
      );

      setAllMembers(response?.members || []);
    } catch (error) {
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };
  const total = limit > 0 ? Math.ceil(totalCount / limit) : 1;

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

        <div className="member-toolbar mb-4">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

            <div className="d-flex align-items-center gap-2">

              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {          // ✅ async add karo
                  setMode("add");
                  setShow(true);
                  resetForm();
                  setBlocks(null);
                  setFlat(null);
                  await getAllBlocks(societyId);
                }}
              >
                + Add Member
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  getAllMembersWithoutPagination(societyId, "");
                  setExportModal(true);
                }}
              >
                <CgExport className="me-1" />
                Export
              </button>

            </div>

            {/* SEARCH */}

            <div className="d-flex gap-2">

              <input
                type="text"
                className="form-control member-search"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
              />

              <button className="btn btn-primary">
                <FiSearch />
              </button>

            </div>

          </div>

          {/* FILTERS */}

          <div className="row g-2">

            <div className="col-md-4">

              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => {

                  const value = e.target.value;
                  setFilterStatus(value);

                  getMembers(
                    societyId,
                    1,
                    value,
                    filterDateFrom,
                    filterDateTo
                  );

                }}
              >

                <option value="">All Types</option>
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
                <option value="owner_relative">Owner Family</option>
                <option value="tenant_relative">Tenant Family</option>

              </select>

            </div>

            <div className="col-md-4">

              <input
                type="date"
                className="form-control"
                value={filterDateFrom}
                onChange={(e) => {

                  const value = e.target.value;

                  setFilterDateFrom(value);

                  getMembers(
                    societyId,
                    1,
                    filterStatus,
                    value,
                    filterDateTo
                  );

                }}
              />

            </div>

            <div className="col-md-4">

              <input
                type="date"
                className="form-control"
                value={filterDateTo}
                onChange={(e) => {

                  const value = e.target.value;

                  setFilterDateTo(value);

                  getMembers(
                    societyId,
                    1,
                    filterStatus,
                    filterDateFrom,
                    value
                  );

                }}
              />

            </div>

          </div>

        </div>
        

        <div className="sv-card p-0 overflow-hidden">
          <div className="sa-table-wrap">
            <table className="sv-tbl">
              <thead>
                <tr>
                  {
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
                {tableLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="skeleton-box rounded-circle" style={{ width: 38, height: 38, flexShrink: 0 }} />
                          <div>
                            <div className="skeleton-box mb-1" style={{ width: 120, height: 13 }} />
                            <div className="skeleton-box" style={{ width: 80, height: 11 }} />
                          </div>
                        </div>
                      </td>
                      <td><div className="skeleton-box" style={{ width: 50, height: 13 }} /></td>
                      <td><div className="skeleton-box" style={{ width: 65, height: 22, borderRadius: 12 }} /></td>
                      <td><div className="skeleton-box" style={{ width: 100, height: 13 }} /></td>
                      <td><div className="skeleton-box" style={{ width: 65, height: 22, borderRadius: 12 }} /></td>
                      <td><div className="skeleton-box" style={{ width: 28, height: 28, borderRadius: 6 }} /></td>
                    </tr>
                  ))
                ) : (
                  allMembers.map((s, i) => (
                    <tr className="text-start" key={i}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={s.profile_url || "../src/assets/profile.png"}
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
                              s.occupancy_type === "tenant_relative"
                                ? "Tenant Family"
                                : s.occupancy_type === "owner_relative"
                                  ? "Owner Family"
                                  : s.occupancy_type
                                    .replaceAll("_", " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase())
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
                          label={s.occupant_status === "Approved" ? "Active" : s.occupant_status}
                          c={
                            s.occupant_status === "Approved"
                              ? "green"
                              : s.occupant_status === "Pending"
                                ? "yellow"
                                : "gray"
                          }
                        />
                      </td>
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
                                onClick={() => {
                                  setMode("edit");
                                  setShow(true);
                                  GetMemberDetailsById(s.user_id);
                                }}
                              >
                                Edit Member
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item member-action-item member-action-delete"
                                onClick={() => handleDelete(s.user_id, societyId)}
                              >
                                Delete Member
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination page={page} total={total} onChange={handlePageChange} />
        </div>
      </div>

      {/* member modal */}
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

      {/* export modal */}
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
    </>

  );
};

export default AddMember;
