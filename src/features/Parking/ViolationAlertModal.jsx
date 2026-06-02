// MemberModal.jsx
import Select from "react-select";

const ViolationAlertModal = ({
    showViolationAlert,
    setShowViolationAlert,

    allBlocks = [],
    allFlats = [],
    addMemberType = [],

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

    startDate = "",
    setStartDate = () => { },

    endDate = "",
    setEndDate = () => { },

    // rentAgreement = null,
    setRentAgreement = () => { },

    // policeNoc = null,
    setPoliceNoc = () => { },

    errors = {},
    errorText = "",
    handleBlockChange = () => { },
    handleSubmit = () => { },
    mode,
}) => {
    if (!showViolationAlert) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                Create Violation Alert
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowViolationAlert(false)}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Slot no. <span className="text-danger">*</span>
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
                                                onChange={handleBlockChange}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle No. <span className="text-danger">*</span>
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
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle Type. <span className="text-danger">*</span>
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
                                           <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Penalty Amount <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Enter penalty amount"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Description (Optional){" "}

                                                </label>
                                                {errors.rentAgreement && (
                                                    <span className="text-danger mx-2">
                                                        {errors.rentAgreement}
                                                    </span>
                                                )}
                                            </div>
                                            <textarea className="form-control" rows={3} placeholder="" />
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                type="button"
                                className="btn btn-ac btn-ad grey-btn" onClick={() => {
                                    setShowViolationAlert(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button className="btn-ac px-4" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViolationAlertModal;
