import { useState, useEffect } from "react";
import "../../../styles/AddMember.css";
import { Badge, Pagination } from "../../../components/Common/ReusableFunction";
import { GetSessionData } from "../../../utils/SessionManagement";
import {
  getAllUnitsApi,
  AddUnitsApi,
  getAllBlocksApi,
  getAllFloorsApi,
  getAllUnitsBySearchApi,
  getFlatByIdApi,
  UpdateUnitsApi,
  deleteUnitApi,
  getSearchByUser,
} from "../../../services/UnitRegisterApi";
import { toast } from "react-toastify";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { FiFilter, FiSearch } from "react-icons/fi";
import { BiExport } from "react-icons/bi";
import UnitModal from "./UnitModal";
import { exportFile, exportToPDF } from "../../../components/Common/ExportFile";

const UnitRegister = ({ setActive, setFlatId }) => {
  const [societyId, setSocietyId] = useState("");
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [allUnits, setAllUnits] = useState([]);
  const [allUnitsWithoutPagination, setAllUnitsWithoutPagination] = useState([]);
  const [activeTab, setActiveTab] = useState("excel");
  const [exportModal, setExportModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [search, setSearch] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [block, setBlock] = useState("");
  const [allBlocks, setAllBlocks] = useState([]);
  const [floor, setFloor] = useState("");
  const [allFloor, setAllFloor] = useState([]);
  const [area, setArea] = useState("");
  const [unitType, setUnitType] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [occupiedUnits, setOccupiedUnits] = useState("");
  const [vacantUnits, setVacantUnits] = useState("");
  const [mode, setMode] = useState("mode");
  const [unitId, setUnitId] = useState("");
  const [selectedRange, setSelectedRange] = useState("all");

  useEffect(() => {
    SessionData();
  }, []);

  const SessionData = async () => {
    const data = await GetSessionData();
    console.log(data.data);
    const flats = data.data.flats[0];
    setSocietyId(flats.society_id);
    getAllBlocks(flats.society_id);
    getAllFloor(flats.society_id);
  };

  useEffect(() => {
    if (!societyId) return;
    getAllUnits(societyId, page);
  }, [societyId, page]);

  //function for get members
  const getAllUnits = async (societyId, page) => {
    try {
      const data = await getAllUnitsApi(societyId, page);
      console.log(data, "All units");
      setTotalUnits(data.total_units);
      setOccupiedUnits(data.occupied_units);
      setVacantUnits(data.vacant_units);
      setAllUnits(data.flats);
      setPage(data.page || 1);
      setLimit(data.per_page);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error("Error fetching units:", error);
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

  const getAllFloor = async (societyId) => {
    try {
      const data = await getAllFloorsApi(societyId);
      console.log(data.floors, "All floors");
      setAllFloor(
        data.floors.map((item) => ({
          value: item.floor,
          label: item.floor,
        })),
      );
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const getAllUnitsWithoutPagination = async (societyId) => {
    try {
      const data = await getAllUnitsBySearchApi(societyId);
      console.log(data.flats, "All units without pagination");
      setAllUnitsWithoutPagination(data.flats);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };
  const getFlatById = async (flatId) => {
    setFlatId(flatId);
    setActive("viewUnit");
  };

  const GetFlatDetailsById = async (flatId) => {
    try {
      const data = await getFlatByIdApi(societyId, flatId);
      console.log(data, "Flat Details by ID");

      setFlatNo(data.flat_number);
      setFloor(data.floor);
      setBlock({
        value: data.block,
        label: data.block,
      });

      setFloor({
        value: data.floor,
        label: data.floor,
      });
      setArea(data.area_sqft);
      setUnitType(data.unit_type);
      setCurrentStatus(data.current_status);
      setUnitId(data.flat_id);
      const ownerMember = data.members?.find(
        (member) => member.occupancy_type === "owner",
      );

      if (ownerMember) {
        setFullName(
          `${ownerMember.first_name || ""} ${ownerMember.last_name || ""}`.trim(),
        );
        setEmailId(ownerMember.email || "");
        setMobileNo(ownerMember.mobile || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (value) => {
    setPage(value);
    // getAllUnits(societyId, value);
  };

  const handleEmailChange = async (e) => {
    const value = e.target.value;
    setEmailId(value);

    // minimum 5 chars aur @ hona chahiye
    if (value.length >= 5 && value.includes("@")) {
      try {
        const response = await getSearchByUser(societyId, value);
        console.log(response);
        setEmailId(response[0].email)
        setFullName(response[0].full_name)
        setMobileNo(response[0].mobile)
        setUserId(response[0].user_id)
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMobileChange = async (e) => {
    const value = e.target.value;
    setMobileNo(
      value.replace(
        /\D/g,
        ""
      )
    )
    // 4 digits ke baad API call
    if (value.length >= 4) {
      try {
        const response = await getSearchByUser(societyId, value);
        console.log(response);

        if (response?.length > 0) {
          setEmailId(response[0].email || "");
          setFullName(response[0].full_name || "");
          setMobileNo(response[0].mobile || "");
          setUserId(response[0].user_id || "");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  //function for validation
  const validateForm = () => {
    let errors = {};

    if (!flatNo) {
      errors.flatNo = "required";
    }

    if (!block) {
      errors.block = "required";
    }

    if (!floor) {
      errors.floor = "required";
    }

    if (!area) {
      errors.area = "required";
    }
    if (!unitType) {
      errors.unitType = "required";
    }
    if (!currentStatus) {
      errors.currentStatus = "required";
    }
    if (!fullName) {
      errors.fullName = "required";
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

      if (mode === "edit") {
        await UpdateUnitsApi(
          unitId,
          block.value,
          flatNo,
          floor.value,
          area,
          unitType,
          currentStatus,
          fullName,
          emailId,
          mobileNo,
        );

        toast.success("Unit updated successfully!");
        setShow(false);
        getAllUnits(societyId, page);
      } else {
        await AddUnitsApi(
          societyId,
          block.value,
          flatNo,
          floor.value,
          area,
          unitType,
          currentStatus,
          fullName,
          emailId,
          mobileNo,
        );

        toast.success("Unit created successfully!");
        setShow(false);
        getAllUnits(societyId, page);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
      setErrorText(error);
    }
  };

  // const handleDelete = async (unitId) => {
  //   try {
  //     await deleteUnitApi(unitId);
  //     toast.success("Unit deleted successfully");
  //     getAllUnits(societyId, page);
  //   } catch (error) {
  //     console.error("Delete Error:", error);
  //     toast.error(error);
  //   }
  // };
  const handleDelete = async (unitId) => {
    const confirmed = window.confirm("Are you sure you want to delete this unit?");

    if (!confirmed) return;

    try {
      await deleteUnitApi(unitId);
      toast.success("Unit deleted successfully");
      getAllUnits(societyId, page);
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error);
    }
  };
  const exportData =
    selectedRange === "all"
      ? allUnitsWithoutPagination
      : selectedRange === "search"
        ? allUnits
        : "customData";

  const downloadExcel = async () => {
    exportFile({
      data: exportData,
      fileName: "Units",
      sheetName: "Units",
      type: "xlsx",
    });
  };

  const downloadCSV = async () => {
    exportFile({
      data: exportData,
      fileName: "Units",
      sheetName: "Units",
      type: "csv",
    });
  };

  const downloadPDF = () => {
    exportToPDF({
      title: "Units Report",
      fileName: "Units",
      columns: [
        "Unit No.",
        "Type & Area",
        "Block/Floor",
        "Owner",
        "Tenant"

      ],
      data: exportData.map((item) => [
        item.flat_number,
        `${item.unit_type || ""} (${item.area_sqft || ""} sq.ft)`,
        `${item.block || "-"} / ${item.floor || "-"} Flr`,
        item.members?.find((m) => m.occupancy_type === "owner")
          ? `${item.members.find((m) => m.occupancy_type === "owner")?.first_name || ""} ${item.members.find((m) => m.occupancy_type === "owner")?.last_name || ""}`
          : "-",
        item.members?.find((m) => m.occupancy_type === "tenant")
          ? `${item.members.find((m) => m.occupancy_type === "tenant")?.first_name || ""} ${item.members.find((m) => m.occupancy_type === "tenant")?.last_name || ""}`
          : "-",
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
        await getAllUnits(societyId, 1);
        return;
      }

      const data = await getAllUnitsBySearchApi(societyId, value);

      console.log(data, "Search results");

      setAllUnits(data?.flats || []);
    } catch (error) {
      console.error("Error searching units:", error);
      setAllUnits([]);
    }
  };
  const total = Math.ceil(totalCount / limit);
  // const per = limit, total = Math.ceil(filteredData.length / per);
  // const rows = filteredData.slice((page - 1) * per, page * per);

  const resetForm = () => {
    setFlatNo("");
    setBlock("");
    setFloor("");
    setArea("");
    setUnitType("");
    setCurrentStatus("");
    setFullName("");
    setEmailId("");
    setMobileNo("");
    setErrors({});
    setErrorText("");
  }

  return (
    <>
      <div className="pg cp-wrap">
        {/* Header */}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            [totalUnits, "Total Units"],
            [
              occupiedUnits &&
              `${Math.round((occupiedUnits / totalUnits) * 100)}%`
              ,
              "Occupancy Rate",
              "tile-grn",
            ],
            [occupiedUnits, "Occupied Units", "tile-org"],
            [vacantUnits, "Vacant Units", "tile-red"],
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
              placeholder="Search by unit no, floor or owner..."
              value={search}
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
              className="btn-ol ms-2"
              onClick={() => {
                getAllUnitsWithoutPagination(societyId);
                setExportModal(true)
              }}
            >
              <BiExport /> Export
            </button>
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={() => {
                setMode("add");
                setShow(true);
                resetForm();
              }}
            >
              + Add Unit
            </button>
          </div>
        </div>

        <div className="sv-card p-0 overflow-hidden">
          <div className="sa-table-wrap">
            <table className="sv-tbl">
              <thead>
                <tr>
                  {
                    // ["First Name", "Last Name", "Mobile No.", "Email Id", "Wing", "Flat", "Membership Type", "Residency Status", "Date"]
                    [
                      "UNIT NO.",
                      "TYPE & AREA",
                      "BLOCK/FLOOR",
                      "OWNER",
                      "TENANT",
                      "STATUS",
                      "ACTIONS",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {allUnits.map((s, i) => (
                  <tr className="text-start" key={i}>
                    <td className="sa-name">{s.flat_number} </td>

                    <td className="sa-name">
                      {s.unit_type} .{s.area_sqft} sqft
                    </td>
                    <td className="sa-name">
                      {`Block ${s.block} . ${s.floor === 1
                        ? "1st"
                        : s.floor === 2
                          ? "2nd"
                          : s.floor === 3
                            ? "3rd"
                            : `${s.floor}th`
                        } Flr`}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.profile_url || "../src/assets/profile.png"}
                          alt=""
                          width={38}
                          height={38}
                          className="rounded-circle object-fit-cover"
                        />

                        <div>
                          <div className="fw-semibold">
                            {s?.members?.find(
                              (m) => m.occupancy_type === "owner",
                            )
                              ? `${s.members.find((m) => m.occupancy_type === "owner")?.first_name || ""} ${s.members.find((m) => m.occupancy_type === "owner")?.last_name || ""}`
                              : "-"}
                          </div>

                          <small className="text-muted">
                            {s?.members?.find(
                              (m) => m.occupancy_type === "owner",
                            )
                              ? `${s.members.find((m) => m.occupancy_type === "owner")?.email || ""}`
                              : ""}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.profile_url || "../src/assets/profile.png"}
                          alt=""
                          width={38}
                          height={38}
                          className="rounded-circle object-fit-cover"
                        />

                        <div>
                          {/* <div className="fw-semibold">
                            {s?.members?.find((m) => m.occupancy_type === "tenant")
                              ? `${s.members.find((m) => m.occupancy_type === "tenant")?.first_name || ""} ${s.members.find((m) => m.occupancy_type === "tenant")?.last_name || ""} (Current Resident)`
                              : "-"}
                          </div> */}
                          <div className="fw-semibold">
                            {s?.members?.find((m) => m.occupancy_type === "tenant")
                              ? `${s.members.find((m) => m.occupancy_type === "tenant")?.first_name || ""} ${s.members.find((m) => m.occupancy_type === "tenant")?.last_name || ""}`
                              : "-"}
                          </div>
                          <small className="text-muted">
                            {s?.members?.find(
                              (m) => m.occupancy_type === "tenant",
                            )
                              ? `${s.members.find((m) => m.occupancy_type === "tenant")?.email || ""}`
                              : ""}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {s.current_status && (
                        <Badge
                          label={s.current_status}
                          c={
                            s.current_status === "Vacant"
                              ? "red"
                              : s.current_status === "Occupied"
                                ? "blue"
                                : s.current_status === "Maintanance"
                                  ? "orange"
                                  : "grey"
                          }
                        />
                      )}
                    </td>
                    {/* <td className="sa-name"><button className="btn btn-light border-0" onClick={() => {

                                            getFlatById(s.flat_id)
                                        }}> ⋮</button></td> */}
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
                              onClick={() => getFlatById(s.flat_id)}
                            >
                              View Unit
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item member-action-item"
                              // onClick={() => handleEdit(s)}
                              onClick={() => {
                                setMode("edit");
                                setShow(true);
                                GetFlatDetailsById(s.flat_id);
                              }}
                            >
                              Edit Unit
                            </button>
                          </li>

                          <li>
                            <hr className="dropdown-divider" />
                          </li>

                          <li>
                            <button
                              className="dropdown-item member-action-item member-action-delete"
                              onClick={() => handleDelete(s.flat_id)}
                            >
                              Delete Unit
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

      <UnitModal
        show={show}
        setShow={setShow}
        mode={mode}
        errors={errors}
        errorText={errorText}
        flatNo={flatNo}
        setFlatNo={setFlatNo}
        block={block}
        setBlock={setBlock}
        allBlocks={allBlocks}
        floor={floor}
        setFloor={setFloor}
        allFloor={allFloor}
        unitType={unitType}
        setUnitType={setUnitType}
        area={area}
        setArea={setArea}
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        fullName={fullName}
        setFullName={setFullName}
        emailId={emailId}
        setEmailId={setEmailId}
        handleEmailChange={handleEmailChange}
        handleMobileChange={handleMobileChange}
        mobileNo={mobileNo}
        setMobileNo={setMobileNo}
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
                  <h6 className=" text-start" style={{ fontWeight: "bold" }}>
                    Select Format
                  </h6>
                  <div className="row mb-4">
                    {/* Excel */}
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

                    {/* CSV */}
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

                    {/* PDF */}
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

                  <h6 className="text-start fw-bold">Data Range</h6>

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
                      {allUnitsWithoutPagination.length} records
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

                    <h6 className="text-muted mt-1">{allUnits.length} records</h6>
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

                <div className="modal-footer bg-light">
                  <button
                    className="btn-sm btn btn-outline-secondary"
                    onClick={() => setExportModal(false)}
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
      )}
    </>
  );
};

export default UnitRegister;
