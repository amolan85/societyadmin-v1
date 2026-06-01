// MemberModal.jsx
import Select from "react-select";

const RegisterTenantsModal = ({
    show,
    setShow,

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
    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                {mode === "edit" ? "Edit Tenant" : "Register New Tenant"}
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
                                                onChange={handleBlockChange}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Select Unit{" "}
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
                                                placeholder="Select unit.."
                                                options={allFlats}
                                                value={flat}
                                                onChange={(selectedOption) => setFlat(selectedOption)}
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

                                    <div className="row">

                                        <div
                                            className={`am-type-wrap mb-3 col-lg-5 col-4 mx-2 ${errors.memType ? "border border-danger  p-1" : ""
                                                }`}
                                        >
                                            {addMemberType.map((t) => (
                                                <button
                                                    key={t.value}
                                                    onClick={() => {
                                                        setMemType(t.value);
                                                        resetForm();
                                                    }}
                                                    className={`am-type-btn ${memType === t.value ? "active" : ""
                                                        }`}
                                                >
                                                    {t.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <label className="fw-bold">TENANT INFORMATION</label>

                                    <div className="row g-3 mb-3 mt-1">
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
                                                onChange={(e) => setFirstName(e.target.value)}
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
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
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

                                    {memType === "tenant" && (
                                        <>
                                            <label className="fw-bold">LEASE PERIOD</label>
                                            <div className="row g-3 mb-3 mt-1">
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">
                                                            Start Date{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        {errors.startDate && (
                                                            <span className="text-danger mx-2">
                                                                {errors.startDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.startDate ? "error-input" : ""}`}
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">
                                                            End Date{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        {errors.endDate && (
                                                            <span className="text-danger mx-2">
                                                                {errors.endDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.endDate ? "error-input" : ""}`}
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
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
                                                        onChange={(e) =>
                                                            setRentAgreement(e.target.files[0])
                                                        }
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
                                                        onChange={(e) => setPoliceNoc(e.target.files[0])}
                                                    />
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
                                type="button"
                                className="btn btn-ad grey-btn"  onClick={() => {
                                    setShow(false);
                                    resetForm();
                                }}  
                            >
                                Cancel
                            </button>
                            <button className="btn-ac px-4" onClick={handleSubmit}>
                                Submit Registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterTenantsModal;
