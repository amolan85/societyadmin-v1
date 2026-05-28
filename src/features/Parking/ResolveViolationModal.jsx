// ResolveViolationModal.jsx
import Select from "react-select";

const ResolveViolationModal = ({
    show,
    setShow,

    resolutionMethod = [],
    allFlats = [],
    addMemberType = [],
    statusOptions = [],
    typeOptions = [],

    resolutionMethodField = "",
    setResolutionMethodField = () => {},
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
    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <div className="d-flex flex-column">
                                <h5 className="modal-title mb-1 text-start">
                                    Resolve Violation
                                </h5>
                            </div>

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
                                        <div className="col-12">
                                            <div
                                                className="card bg-light d-flex justify-content-center  py-1"
                                                style={{ minHeight: "10px" }}
                                            >
                                                <p className="mb-0 ms-2">
                                                    You are marking violation <strong>#VIO-2023-889</strong> as resolved.
                                                    This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Resolution Method<span className="text-danger">*</span>
                                                </label>
                                                {errors.typeField && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.resolutionMethodField}
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.resolutionMethodField
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.resolutionMethodField
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={resolutionMethod}
                                                value={resolutionMethodField}
                                                onChange={(selectedOption) => setResolutionMethodField(selectedOption)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Remarks / Notes<span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <textarea
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Add any internal regarding this resolution"
                                                rows={4}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Notify owner about resolution
                                        </label>
                                    </div>
                                    {errorText && <h6 className="text-danger">{errorText}</h6>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                className="btn-ol btn close"
                                onClick={() => {
                                    setShow(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button className="btn-ac btn-success px-4" onClick={handleSubmit}>
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResolveViolationModal;
