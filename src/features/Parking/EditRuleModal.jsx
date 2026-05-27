// EditRuleModal.jsx
import Select from "react-select";

const EditRuleModal = ({
    editRuleShow,
    setEditRuleShow,

    allBlocks = [],
    allFlats = [],
    addMemberType = [],
    statusOptions = [],
    typeOptions = [],

    statusField = "",
    setStatusField = () => { },

    typeField = "",
    setTypeField = () => { },

    blocks = null,
    setBlocks = () => { },

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
    handleSubmit = () => { },
    mode,
}) => {
    if (!editRuleShow) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <div className="d-flex flex-column">
                                <h5 className="modal-title mb-1 text-start">
                                    Edit Rule
                                </h5>
                                <small className="text-muted">
                                    Modity details for rule #RULE-P-01
                                </small>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setEditRuleShow(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Rule Id <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="#RULE-P-01"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Rule Title <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="e.g. Wrong slot usage"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>


                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Category<span className="text-danger">*</span>
                                                </label>
                                                {errors.typeField && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.typeField}
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.typeField
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.typeField
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={typeOptions}
                                                value={typeField}
                                                onChange={(selectedOption) => setTypeField(selectedOption)}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Type{" "}
                                                    <span className="text-danger">*</span>
                                                </label>
                                                {errors.statusField && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.statusField}
                                                    </span>
                                                )}
                                            </div>

                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.statusField
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.statusField
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={statusOptions}
                                                value={statusField}
                                                onChange={(selectedOption) => setStatusField(selectedOption)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Description
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <textarea
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Max 4 hours without extension"
                                                rows={4}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <label className="fw-bold" style={{ fontSize: "14px" }}>ENFORCEMENT & PENALTY</label>
                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Penalty Amount(₹)<span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="00.00"

                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Recurrence {" "}
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
                                                onChange={(selectedOption) => setFlat(selectedOption)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Status<span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                                <label className="form-check-label" for="inlineRadio1">Active </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                                <label className="form-check-label" for="inlineRadio2">Inactive</label>
                                            </div>
                                        </div>
                                    </div>

                                    {errorText && <h6 className="text-danger">{errorText}</h6>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                className="btn-ol btn close"
                                onClick={() => {
                                    setEditRuleShow(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button className="btn-ac px-4" onClick={handleSubmit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditRuleModal;
