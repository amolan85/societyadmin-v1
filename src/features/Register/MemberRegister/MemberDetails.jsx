import { useState, useEffect } from "react";
import { FaCar } from "react-icons/fa";
import { toast } from "react-toastify";
import { getMembersByIdApi, UpdateMemberApi } from "../../../services/AddMemberApi";
import { GetSessionData } from "../../../utils/SessionManagement";
import {
  BiEdit,
  BiHistory,
  BiLocationPlus,
  BiMessage,
  BiPhoneOutgoing,
} from "react-icons/bi";
import { MdAttachEmail } from "react-icons/md";
import MemberModal from "../../AddMember/MemberModal";
import {
  getAllBlocksApi,
  getAllFlatsApi,
} from "../../../services/UnitRegisterApi";

const MemberDetails = ({
  active,
  setActive,
  previousTab,
  setPreviousTab,
  memberId,
  setFlatId,
  flatId,
}) => {
  const [societyId, setSocietyId] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [blocks, setBlocks] = useState("");
  const [flat, setFlat] = useState("");
  const [occupancyType, setOccupancyType] = useState("");
  const [status, setStatus] = useState("");
  const [area, setArea] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [flatIdNo, setFlatIdNo] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [unitType, setUnitType] = useState("");
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("edit");
  const [allBlocks, setAllBlocks] = useState([]);
  const [allFlats, setAllFlats] = useState([]);
  const [agreement, setAgreement] = useState("");
  const [rentAgreement, setRentAgreement] = useState("");
  const [policeNoc, setPoliceNoc] = useState("");
  const [idProof, setIdProof] = useState("");
  const [familyPhoto, setFamilyPhoto] = useState("");
  const [maintenanceReceipt, setMaintenanceReceipt] = useState("");
  const [ownershipDocuments, setOwnershipDocuments] = useState("");
  const [nominationDetails, setNominationDetails] = useState("");
  const [memType, setMemType] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [errors, setErrors] = useState({})
  const [errorText, setErrorText] = useState("")

    const addMemberType = [
    { id: "Owner", value: "owner" },
    { id: "Tenant", value: "tenant" },
    { id: "Family Member", value: "familyMember" },
  ];

  const finalMemType =
        familyType === "tenant_relative" || familyType === "owner_relative"
            ? familyType
            : memType;

  useEffect(() => {
    SessionData();
  }, []);

  const SessionData = async () => {
    try {
      const data = await GetSessionData();
      const flats = data.data.flats[0];
      setSocietyId(flats.society_id);
      setSocietyName(flats.society_name);
      getAllFlats(flats.society_id);
      getAllBlocks(flats.society_id);
    } catch (error) {
      console.log(error);
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

  // Call API only when both values are available
  useEffect(() => {
    if (memberId && societyId) {
      GetMemberDetailsById();
    }
  }, [memberId, societyId]);

  const GetMemberDetailsById = async () => {
    try {
      const data = await getMembersByIdApi(societyId, memberId);

      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmailId(data.email);
      setMobileNo(data.mobile);
      // setBlocks(data.block);
      // setFlat(data.flat_number);
      setBlocks({
        value: data.block,
        label: data.block,
      });

      setFlat({
        value: data.flat_id,
        label: data.flat_number,
      });
      // memType(data.occupancy_type);
      // setFamilyType(data.occupancy_type === "owner_relative" ? "Owner Family" : data.occupancy_type === "tenant_relative" ? "Tenant Family" : "");
      setOccupancyType(data.occupancy_type);
      setFamilyType(data.occupancy_type);
      setMemType(
        data.occupancy_type === "owner_relative"
          ? "familyMember"
          : data.occupancy_type === "tenant_relative"
            ? "familyMember"
            : data.occupancy_type,
      );
      setStatus(data.status);
      setArea(data.area_sqft);
      setMoveInDate(data.start_date);
      setMoveOutDate(data.end_date);
      setFlatIdNo(data.flat_id);
      setProfileUrl(data.profile_url);
      setUnitType(data.unit_type);
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
          await UpdateMemberApi(
            societyId,
            memberId,
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
        //   resetForm();
          GetMemberDetailsById();
        
        setShow(false);
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
              <img
                src={profileUrl || "../src/assets/profile.png"}
                className="rounded-circle border"
                width="70"
                height="70"
                alt="profile"
              />

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0 fw-bold">
                    {firstName} {lastName}
                  </h5>

                  <span className="badge bg-primary-subtle text-primary">
                    {occupancyType === "tenant_relative"
                      ? "Tenant Family"
                      : occupancyType === "owner_relative"
                        ? "Owner Family"
                        : occupancyType === "tenant"
                          ? "Tenant"
                          : occupancyType}
                  </span>

                  <span
                    className={`badge ${
                      status === "Pending"
                        ? "bg-warning-subtle text-warning"
                        : status === "Approved"
                          ? "bg-success-subtle text-success"
                          : "bg-secondary-subtle text-secondary"
                    }`}
                  >
                    {status === "Approved" ? "Active" : status}
                  </span>
                </div>

                <div className="text-muted text-start small mt-2">
                  <div className="mb-1">
                    {/* <i className="bi bi-envelope me-1"></i> */}
                    <MdAttachEmail className="me-1" />
                    {emailId}
                  </div>

                  <div>
                    {/* <i className="bi bi-telephone me-1"></i> */}
                    <BiPhoneOutgoing className="me-1" />
                    {mobileNo}
                    <span className="mx-2">|</span>
                    <BiLocationPlus className="me-1" />
                    Unit {blocks.label}-{flat.label}, {societyName}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setPreviousTab(active);
                  setActive("registerHistory");
                }}
              >
                {/* <i className="bi bi-clock-history me-1"></i> */}
                <BiHistory className="me-1" />
                History
              </button>

              <button className="btn btn-outline-secondary btn-sm">
                {/* <i className="bi bi-chat-left-text me-1"></i> */}
                <BiMessage className="me-1" />
                Message
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setMode("edit");
                  setShow(true);
                }}
              >
                {/* <i className="bi bi-pencil-square me-1"></i> */}
                <BiEdit className="me-1" />
                Edit Profile
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  // console.log(previousTab);
                  // setActive(previousTab)
                  setActive("addmember");
                }}
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
                Personal Information
              </div>

              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <small className="text-muted d-block">FULL NAME</small>
                    <div className="fw-semibold">
                      {firstName} {lastName}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">DATE OF BIRTH</small>
                    <div className="fw-semibold">-</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">OCCUPATION</small>
                    <div className="fw-semibold">-</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">EMPLOYER</small>
                    <div className="fw-semibold">-</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      EMERGENCY CONTACT
                    </small>
                    <div className="fw-semibold">-</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      EMERGENCY PHONE
                    </small>
                    <div className="fw-semibold">+91 {mobileNo}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">
                  Unit Details ({blocks.label}-{flat.label})
                </span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setFlatId(flatIdNo);
                    setActive("viewUnit");
                  }}
                >
                  View Unit
                </button>
              </div>

              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <small className="text-muted d-block">UNIT TYPE</small>
                    <div className="fw-semibold">{unitType}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">FLOOR AREA</small>
                    <div className="fw-semibold">
                      {area ? `${area} sqft` : ""}{" "}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">OWNERSHIP TYPE</small>
                    <div className="fw-semibold">
                      {occupancyType === "tenant_relative"
                        ? "Tenant Family"
                        : occupancyType === "owner_relative"
                          ? "Owner Family"
                          : occupancyType === "tenant"
                            ? "Tenant"
                            : occupancyType}
                    </div>
                    {/* {occupancyType === "owner" ? occupancyType : ""} */}
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted d-block">MOVE-IN DATE</small>
                    <div className="fw-semibold">{moveInDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold">
                Family Members
              </div>

              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src="../src/assets/profile.png"
                    className="rounded-circle"
                    width="45"
                    height="45"
                    alt=""
                  />

                  <div>
                    {/* <div className="fw-semibold">David Jenkins</div>
                                        <small className="text-muted">Spouse</small> */}
                    -
                  </div>
                </div>

                <div className="list-group-item d-flex align-items-center gap-3">
                  <img
                    // src="https://i.pravatar.cc/50?img=18"
                    src="../src/assets/profile.png"
                    className="rounded-circle"
                    width="45"
                    height="45"
                    alt=""
                  />

                  <div>
                    {/* <div className="fw-semibold">Lily Jenkins</div>
                                        <small className="text-muted">Daughter</small> */}
                    -
                  </div>
                </div>
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
        //   resetForm={resetForm}
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
    </>
  );
};

export default MemberDetails;
