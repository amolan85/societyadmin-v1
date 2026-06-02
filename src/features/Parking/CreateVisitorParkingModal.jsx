// MemberModal.jsx
import Select from "react-select";

const CreateVisitorParkingModal = ({
    createvisitorparkingshow,
    createvisitorparkingsetShow,

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
    if (!createvisitorparkingshow) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                {mode === "edit" ? "Edit Tenant" : "Create Visitor"}
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => createvisitorparkingsetShow(false)}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Block <span className="text-danger">*</span>
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
                                                placeholder="Select block.."
                                                options={allBlocks}
                                                value={blocks}
                                                onChange={handleBlockChange}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Flat{" "}
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
                                                placeholder="Select Flat.."
                                                options={allFlats}
                                                value={flat}
                                                onChange={(selectedOption) => setFlat(selectedOption)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Visitor Name <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Enter Visitor Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

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
                                                    onChange={(e) =>
                                                        setMobileNo(e.target.value.replace(/\D/g, ""))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
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
                                                onChange={(e) => setEmailId(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Gender <span className="text-danger">*</span>
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
                                                placeholder="Select Gender.."
                                                options={allFlats}
                                                value={flat}
                                                onChange={(selectedOption) => setFlat(selectedOption)}
                                            />
                                        </div>



                                    </div>
                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle no. <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Enter Vehicle no"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle Type <span className="text-danger">*</span>
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
                                                placeholder="Select Vehicle Type.."
                                                options={allFlats}
                                                value={flat}
                                                onChange={(selectedOption) => setFlat(selectedOption)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Purpose <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.firstName}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder=""
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                type="button"
                                className="btn btn-ac btn-ad grey-btn" onClick={() => {
                                    createvisitorparkingsetShow(false);
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

export default CreateVisitorParkingModal;
