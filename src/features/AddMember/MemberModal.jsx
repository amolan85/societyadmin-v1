// MemberModal.jsx
import Select from "react-select";

const MemberModal = ({
  show,
  setShow,

  allBlocks = [],
  allFlats = [],
  addMemberType = [],

  blocks = null,


  flat = null,
  setFlat = () => { },

  memType = "",
  setMemType = () => { },

  resetForm = () => { },

  firstName = "",
  setFirstName = () => { },

  lastName = "",
  setLastName = () => { },

  mobileNo = "",
  setMobileNo = () => { },

  emailId = "",
  setEmailId = () => { },

  moveInDate = "",
  setMoveInDate = () => { },

  moveOutDate = "",
  setMoveOutDate = () => { },

  familyType = "",
  setFamilyType = () => { },

  // rentAgreement = null,
  setRentAgreement = () => { },

  // policeNoc = null,
  setPoliceNoc = () => { },

  // idProof = null,
  setIdProof = () => { },

  // agreement = null,
  setAgreement = () => { },

  // maintenanceReceipt = null,
  setMaintenanceReceipt = () => { },

  // nominationDetails = null,
  setNominationDetails = () => { },

  // familyPhoto = null,
  setFamilyPhoto = () => { },

  // ownershipDocuments = null,
  setOwnershipDocuments = () => { },

  errors = {},
  errorText = "",
  handleBlockChange = () => { },
  setErrors = () => {},
  handleSubmit = () => { },
  mode,
}) => {
  if (!show) return null;

   // ── clears a single field error as soon as user fills it ──
    const clearError = (field) => {
    setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
    });
};

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal show d-block">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                {mode === "edit" ? "Edit Member" : "Add New Member"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShow(false)}
              />
            </div>

            <div className="modal-body">
              <div className="pg d-flex justify-content-center am-wrap">
                <div className="text-start am-card">
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Select Block <span className="text-danger">*</span>
                        </label>
                        {errors.blocks && (
                          <span className="text-danger mx-2 ">
                            {errors.blocks}
                          </span>
                        )}
                      </div>
                      <Select
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.blocks
                              ? "red"
                              : baseStyles.borderColor,
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: errors.blocks
                                ? "red"
                                : baseStyles.borderColor,
                            },
                          }),
                        }}
                        options={allBlocks}
                        value={blocks}
                        onChange={(selected) => {
    handleBlockChange(selected);
    clearError("blocks");
}}
                      />
                    </div>

                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Flat / Unit Number{" "}
                          <span className="text-danger">*</span>
                        </label>
                        {errors.flat && (
                          <span className="text-danger mx-2 ">
                            {errors.flat}
                          </span>
                        )}
                      </div>

                      <Select
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.flat
                              ? "red"
                              : baseStyles.borderColor,
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: errors.flat
                                ? "red"
                                : baseStyles.borderColor,
                            },
                          }),
                        }}
                        options={allFlats}
                        value={flat}
                        onChange={(selectedOption) => {
    setFlat(selectedOption);
    clearError("flat");
}}
                      />
                    </div>
                  </div>

                  <div className="d-flex">
                    <label className="sv-lb">
                      Membership Type <span className="text-danger">*</span>
                    </label>

                    {errors.memType && (
                      <span className="text-danger mx-2">{errors.memType}</span>
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
                          clearError("memType");
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
                      <div className="d-flex">
                        <label className="sv-lb">
                          First Name <span className="text-danger">*</span>
                        </label>
                        {errors.firstName && (
                          <span className="text-danger mx-2 ">
                            {errors.firstName}
                          </span>
                        )}
                      </div>
                      <input
                        className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e)=>{
    setFirstName(e.target.value);
    clearError("firstName");
}}
                      />
                    </div>

                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        {errors.lastName && (
                          <span className="text-danger mx-2 ">
                            {errors.lastName}
                          </span>
                        )}
                      </div>
                      <input
                        className={`sv-in ${errors.lastName ? "error-input" : ""}`}
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChange={(e)=>{
    setLastName(e.target.value);
    clearError("lastName");
}}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Phone No. <span className="text-danger">*</span>
                        </label>
                        {errors.mobileNo && (
                          <span className="text-danger mx-2 ">
                            {errors.mobileNo}
                          </span>
                        )}
                      </div>

                      <div className="d-flex">
                        <span
                          className={`am-code ${errors.mobileNo ? "error-input" : ""}`}
                        >
                          +91
                        </span>
                        <input
                          className={`sv-in am-phone ${errors.mobileNo ? "error-input" : ""}`}
                          // className={`form-control ${errors.mobileNo ? "is-invalid" : ""}`}
                          type="text"
                          maxLength={10}
                          placeholder="98765 43210"
                          value={mobileNo}
                          onChange={(e)=>{
    setMobileNo(e.target.value.replace(/\D/g,""));
    clearError("mobileNo");
}}
                        />
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="d-flex">
                        <label className="sv-lb">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        {errors.emailId && (
                          <span className="text-danger mx-2 ">
                            {errors.emailId}
                          </span>
                        )}
                      </div>
                      <input
                        className={`sv-in ${errors.emailId ? "error-input" : ""}`}
                        placeholder="Enter Email Address"
                        value={emailId}
                        onChange={(e)=>{
    setEmailId(e.target.value);
    clearError("emailId");
}}
                      />
                    </div>
                  </div>

                  {memType === "tenant" && (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Move-in Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.moveInDate && (
                              <span className="text-danger mx-2">
                                {errors.moveInDate}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.moveInDate ? "error-input" : ""}`}
                            type="date"
                            value={moveInDate}
                            onChange={(e)=>{
    setMoveInDate(e.target.value);
    clearError("moveInDate");
}}
                          />
                        </div>

                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Move-out Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.moveOutDate && (
                              <span className="text-danger mx-2">
                                {errors.moveOutDate}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.moveOutDate ? "error-input" : ""}`}
                            type="date"
                            value={moveOutDate}
                            onChange={(e)=>{
    setMoveOutDate(e.target.value);
    clearError("moveOutDate");
}}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Rent Agreement{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.rentAgreement && (
                              <span className="text-danger mx-2">
                                {errors.rentAgreement}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.rentAgreement ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setRentAgreement(e.target.files[0]);
    clearError("rentAgreement");
}}
                          />
                        </div>

                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Police Noc <span className="text-danger">*</span>
                            </label>
                            {errors.policeNoc && (
                              <span className="text-danger mx-2">
                                {errors.policeNoc}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.policeNoc ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setPoliceNoc(e.target.files[0]);
    clearError("policeNoc");
}}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {memType === "owner" && (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Move-in Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.moveInDate && (
                              <span className="text-danger mx-2">
                                {errors.moveInDate}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.moveInDate ? "error-input" : ""}`}
                            type="date"
                            value={moveInDate}
                             onChange={(e)=>{
    setMoveInDate(e.target.value);
    clearError("moveInDate");
}}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Id Proof <span className="text-danger">*</span>
                            </label>
                            {errors.idProof && (
                              <span className="text-danger mx-2">
                                {errors.idProof}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.idProof ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setIdProof(e.target.files[0]);
    clearError("idProof");
}}
                          />
                        </div>

                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Agreement <span className="text-danger">*</span>
                            </label>
                            {errors.agreement && (
                              <span className="text-danger mx-2">
                                {errors.agreement}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.agreement ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setAgreement(e.target.files[0]);
    clearError("agreement");
}}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Maintenance Receipt{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.maintenanceReceipt && (
                              <span className="text-danger mx-2">
                                {errors.maintenanceReceipt}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.maintenanceReceipt ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setMaintenanceReceipt(e.target.files[0]);
    clearError("maintenanceReceipt");
}}
                          />
                        </div>

                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Nomination Details{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.nominationDetails && (
                              <span className="text-danger mx-2">
                                {errors.nominationDetails}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.nominationDetails ? "error-input" : ""}`}
                            type="file"
                           onChange={(e)=>{
    setNominationDetails(e.target.files[0]);
    clearError("nominationDetails");
}}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Family Photo{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.familyPhoto && (
                              <span className="text-danger mx-2">
                                {errors.familyPhoto}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.familyPhoto ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setFamilyPhoto(e.target.files[0]);
    clearError("familyPhoto");
}}
                          />
                        </div>

                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Ownership <span className="text-danger">*</span>
                            </label>
                            {errors.ownershipDocuments && (
                              <span className="text-danger mx-2">
                                {errors.ownershipDocuments}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.ownershipDocuments ? "error-input" : ""}`}
                            type="file"
                            onChange={(e)=>{
    setOwnershipDocuments(e.target.files[0]);
    clearError("ownershipDocuments");
}}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {memType === "familyMember" && (
                    <>
                      <div className="row g-3 mb-3">
                        <div className="col-6">
                          <div className="d-flex">
                            <label className="sv-lb">
                              Move-in Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            {errors.moveInDate && (
                              <span className="text-danger mx-2">
                                {errors.moveInDate}
                              </span>
                            )}
                          </div>
                          <input
                            className={`sv-in ${errors.moveInDate ? "error-input" : ""}`}
                            type="date"
                            value={moveInDate}
                            onChange={(e) => setMoveInDate(e.target.value)}
                          />
                        </div>
                        {
                          familyType === "tenant_relative" &&
                          (
                            <div className="col-6">
                              <div className="d-flex">
                                <label className="sv-lb">
                                  Move-out Date{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                {errors.moveOutDate && (
                                  <span className="text-danger mx-2">
                                    {errors.moveOutDate}
                                  </span>
                                )}
                              </div>
                              <input
                                className={`sv-in ${errors.moveOutDate ? "error-input" : ""}`}
                                type="date"
                                value={moveOutDate}
                                onChange={(e) => setMoveOutDate(e.target.value)}
                              />
                            </div>
                          )
                        }
                      </div>
                      <div className="mb-2">
                        <div className="d-flex">
                          <label className="form-label fw-semibold d-block mb-2">
                            Select Family Type{" "}
                            <span className="text-danger">*</span>
                          </label>

                          {errors.familyType && (
                            <span className="text-danger mx-2">
                              {errors.familyType}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              className={`form-check-input ${errors.familyType ? "border border-danger" : ""
                                }`}
                              type="radio"
                              name="familyType"
                              id="owner_relative"
                              value="owner_relative"
                              checked={familyType === "owner_relative"}
                              onChange={(e)=>{
    setFamilyType(e.target.value);
    clearError("familyType");
}}
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
                              onChange={(e) => setFamilyType(e.target.value)}
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
                  )}

                  {errorText && <h6 className="text-danger">{errorText}</h6>}
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button
                className="btn btn-sm cov-btn-cancel" data-bs-dismiss="modal"
                onClick={() => {
                  setShow(false);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button className="btn-ac px-4" onClick={handleSubmit}>
                {mode === "edit" ? "Update Member" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberModal;
