// WarningNotificationModal.jsx
import Select from "react-select";

const WarningNotificationModal = ({
    notificationShow,
    setNotificationShow,

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
    if (!notificationShow) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <div className="d-flex flex-column">
                                <h5 className="modal-title mb-1 text-start">
                                    Send Warning Notification
                                </h5>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setNotificationShow(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div
                                                className="card bg-light d-flex justify-content-center  py-2"
                                                style={{ minHeight: "15px" }}
                                            >
                                                <p className="mb-0 ms-2">
                                                    Violation #VIO-2023-889
                                                </p>
                                                <small className="text-muted ms-2">Unauthorized Parking at Slot P-102 (Basement 1)</small>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Recipient<span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Unit A-302"

                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Warning Template<span className="text-danger">*</span>
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
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Reason for extension(Optional)
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <textarea
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="reason for extension"
                                                rows={4}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Reason for extension (Optional)
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                                                <label className="form-check-label" htmlFor="inlineCheckbox1">In-App</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                                                <label className="form-check-label" htmlFor="inlineCheckbox2">Email</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                                                <label className="form-check-label" htmlFor="inlineCheckbox2">SMS</label>
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
                                    setNotificationShow(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button className="btn-ac btn-success px-4" onClick={handleSubmit}>
                                Send Warning
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WarningNotificationModal;
