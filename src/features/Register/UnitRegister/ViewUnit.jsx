import { useState, useEffect } from "react";
import { FaCar } from "react-icons/fa";
import "../../../styles/Register.css";
import { getFlatByIdApi } from "../../../services/AddMemberApi";
import { GetSessionData } from "../../../utils/SessionManagement";
import { toast } from "react-toastify";
import {
  FiEdit,
  FiGrid,
  FiHome,
  FiMapPin,
  FiMessageSquare,
} from "react-icons/fi";
import { TbRulerMeasure } from "react-icons/tb";
import UnitModal from "./UnitModal";
import {
  getAllBlocksApi,
  getAllFloorsApi,
  UpdateUnitsApi,
} from "../../../services/UnitRegisterApi";

const ViewUnit = ({ setActive, flatId }) => {
  const [societyId, setSocietyId] = useState(null);
  const [area, setArea] = useState("");
  const [allBlocks, setAllBlocks] = useState([]);
  const [block, setBlock] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [allFloor, setAllFloor] = useState([]);
  const [floor, setFloor] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [intercom, setIntercom] = useState("");
  const [unitType, setUnitType] = useState("");
  const [members, setMembers] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [mode, setMode] = useState("add");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorText, setErrorText] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    SessionData();
  }, []);

  const SessionData = async () => {
    try {
      const data = await GetSessionData();
      console.log(data.data);
      const flats = data.data.flats[0];
      setSocietyId(flats.society_id);
      //getAllBlocks(flats.society_id);
      getAllFloor(flats.society_id);
    } catch (error) {
      console.log(error);
    }
  };

  // Call API only when both values are available
  useEffect(() => {
    if (flatId && societyId) {
      GetFlatDetailsById();
    }
  }, [flatId, societyId]);

  const GetFlatDetailsById = async () => {
    try {
      setPageLoading(true);
      const data = await getFlatByIdApi(societyId, flatId);
      console.log(data, "Flat Details by ID");
      //   setBlock(data.block);
      setFlatNo(data.flat_number);
      //   setFloor(data.floor);
      setBlock({
        value: data.block,
        label: data.block,
      });
      setFloor({
        value: data.floor,
        label: data.floor,
      });
      setArea(data.area_sqft);
      setConfiguration(data.unit_type);
      setIntercom(data.intercom);
      setUnitType(data.unit_type);
      setMembers(data.members);
      setCurrentStatus(data.current_status);
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
    finally {
      setPageLoading(false); // ✅
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

      await UpdateUnitsApi(
        flatId,
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
      GetFlatDetailsById();
    } catch (error) {
      console.log(error);
      toast.error(error);
      setErrorText(error);
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div className="d-flex align-items-center gap-3">
              <div className="home-icon-box">
                <FiHome size={70} className="text-secondary" />
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0 fw-bold">Unit {flatNo}</h5>

                  <span className="badge bg-primary-subtle text-primary">
                    {currentStatus}
                  </span>

                  <span className="badge bg-secondary-subtle text-secondary">
                    {
                      members?.find(
                        (member) => member.occupancy_type === "owner",
                      )?.occupancy_type
                    }
                  </span>
                </div>

                <div className="text-muted text-start small mt-2">
                  {/* <div className="mb-1">
                                        <i className="bi bi-envelope me-1"></i>
                                        sarah@example.com
                                    </div> */}

                  {/* <div>
                                       
                                        <BiLocationPlus className='me-1' />
                                        Block {block}, {floor} Floor
                                        <span className="mx-2">|</span>
                                        {area ? `${area} sq.ft` : ""}, {unitType}
                                    </div> */}
                  <div className="d-flex gap-5 text-secondary">
                    <div className="d-flex align-items-center gap-2">
                      <FiMapPin />
                      <span>
                        Block {block.label}, {floor.label} Floor
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <TbRulerMeasure />
                      <span>{area ? `${area} sq.ft` : ""}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <FiGrid />
                      <span>{unitType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <button className="btn btn-sm btn-ad grey-btn">
                <FiMessageSquare className="me-1" size={16} />
                Message
              </button>

              <button
                className="btn btn-sm btn-ac btn-primary"
                onClick={async () => {
                  setMode("edit");
                  await Promise.all([
                    getAllBlocks(societyId),
                    getAllFloor(societyId),
                  ]);
                  setShow(true); // ✅ blocks/floors load hone ke baad modal open
                }}
              >
                <FiEdit className="me-1" size={16} />
                Edit Unit
              </button>
              <button
                className="btn btn-sm btn-ac btn-primary"
                onClick={() => setActive("unitRegister")}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4 text-start">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold">
                Unit Specifications
              </div>

              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <small className="text-muted d-block">UNIT NUMBER</small>
                    <div className="fw-semibold">{flatNo}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">BLOCK / TOWER</small>
                    <div className="fw-semibold">Block {block.label}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">FLOOR</small>
                    <div className="fw-semibold">{floor.label} Floor</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">CONFIGURATION</small>
                    <div className="fw-semibold">{configuration}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      SUPER BUILT-UP AREA
                    </small>
                    <div className="fw-semibold">
                      {area ? `${area} sq.ft` : ""}{" "}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      INTERCOM NUMBER
                    </small>
                    <div className="fw-semibold">{intercom}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Primary Owner</span>

                <button
                  className="btn btn-sm btn-ad grey-btn"
                  onClick={() => setActive("memberDetails")}
                >
                  View Profile
                </button>
              </div>

              <div className="card-body">
                {members
                  ?.filter((m) => m.occupancy_type === "owner")
                  .map((m, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-3"
                    >
                      {/* Left Section */}
                      <div className="d-flex align-items-center gap-3">
                        <img
                          // src="https://i.pravatar.cc/60?img=12"
                          src={m.profile_url || "../src/assets/profile.png"}
                          alt="profile"
                          className="rounded-circle object-fit-cover"
                          width="55"
                          height="55"
                        />

                        <div>
                          <h6 className="text-start mb-1 fw-semibold">
                            {m.first_name} {m.last_name}
                          </h6>

                          <small className="text-start text-muted d-flex align-items-center gap-1">
                            <i className="bi bi-envelope"></i>
                            {m.occupancy_type}
                          </small>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="text-end">
                        <small className="text-muted d-block">Moved In</small>

                        <div className="fw-bold">{m.start_date}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold">
                Registered Residents
              </div>

              <div className="list-group list-group-flush">
                {members
                  ?.filter((m) => m.occupancy_type !== "owner")
                  .map((m, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex align-items-center gap-3"
                    >
                      <img
                        // src={`https://i.pravatar.cc/50?img=${index + 12}`}
                        src={m.profile_url || "../src/assets/profile.png"}
                        className="rounded-circle"
                        width="45"
                        height="45"
                        alt=""
                      />

                      <div>
                        <div className="fw-semibold">
                          {m.first_name} {m.last_name}
                        </div>

                        <small className="text-muted">
                          {m.occupancy_type === "tenant_relative"
                            ? "Tenant Family"
                            : m.occupancy_type === "owner_relative"
                              ? "Owner Family"
                              : m.occupancy_type
                                ?.replaceAll("_", " ")
                                .replace(/\b\w/g, (char) =>
                                  char.toUpperCase(),
                                )}
                        </small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold">
                Registered Vehicles
              </div>

              <div className="list-group list-group-flush ">
                <div className="list-group-item">
                  <div className="fw-semibold ">
                    <FaCar color="blue" className="me-2" />
                    Tesla Model Y
                  </div>

                  <small className="text-muted">ABC-1234 • Slot P-404</small>
                </div>

                <div className="list-group-item">
                  <div className="fw-semibold">
                    {/* <i className="bi bi-bicycle me-2"></i> */}
                    <FaCar color="blue" className="me-2" />
                    Trek Bicycle
                  </div>

                  <small className="text-muted">Unregistered • Bike Rack</small>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold">
                Recent Activity
              </div>

              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-start gap-3">
                  <div
                    className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center"
                    // style="width:40px;height:40px;"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <div>
                    <div className="fw-semibold">Tesla Model Y Added</div>

                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        mobileNo={mobileNo}
        setMobileNo={setMobileNo}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default ViewUnit;
