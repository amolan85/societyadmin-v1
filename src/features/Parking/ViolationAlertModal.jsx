// ViolationAlertModal.jsx
import Select from "react-select";

const ViolationAlertModal = ({
    showViolationAlert,
    setShowViolationAlert,

    allBlocks = [],
    allFlats = [],
    allSlots = [],

    blocks = null,
    setBlocks = () => {},

    flat = null,
    setFlat = () => {},

    // ✅ violationType — drives the violation_type field sent to the API
    violationType = null,
    setViolationType = () => {},

    // ✅ vehicleType — drives the vehicle_type field (separate from violation type)
    vehicleType = null,
    setVehicleType = () => {},

    slot = null,
    setSlot = () => {},

    vehicleNo = "",
    setVehicleNo = () => {},

    resetForm = () => {},

    firstName = "",       // penalty_amount
    setFirstName = () => {},

    lastName = "",        // description
    setLastName = () => {},

    mobileNo = "",
    setMobileNo = () => {},

    emailId = "",
    setEmailId = () => {},

    startDate = "",
    setStartDate = () => {},

    endDate = "",
    setEndDate = () => {},

    errors = {},
    errorText = "",
    handleBlockChange = () => {},
    handleSubmit = () => {},
    mode,
}) => {
    if (!showViolationAlert) return null;

    // ✅ Violation type options — these are the actual violation_type values the API accepts
    const violationTypeOptions = [
        { value: "unauthorized_parking", label: "Unauthorized Parking" },
        { value: "visitor_overstay",     label: "Visitor Overstay" },
        { value: "wrong_slot",           label: "Wrong Slot" },
        { value: "double_parking",       label: "Double Parking" },
        { value: "no_sticker",           label: "No Sticker" },
        { value: "other",                label: "Other" },
    ];

    // ✅ Vehicle type options — 2-wheeler or 4-wheeler
    const vehicleTypeOptions = [
        { value: "2_wheeler", label: "2 Wheeler" },
        { value: "4_wheeler", label: "4 Wheeler" },
    ];

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

                                    {/* Row 1 — Slot No. & Vehicle No. */}
                                    <div className="row g-3 mb-3">

                                        {/* Slot No. */}
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Slot No. <span className="text-danger">*</span>
                                                </label>
                                                {errors.slot && (
                                                    <span className="text-danger mx-2">{errors.slot}</span>
                                                )}
                                            </div>
                                            <Select
                                                options={allSlots}
                                                value={slot}
                                                onChange={(selectedOption) => setSlot(selectedOption)}
                                                placeholder="Select Slot"
                                                isClearable
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.slot ? "red" : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>

                                        {/* Vehicle No. */}
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle No. <span className="text-danger">*</span>
                                                </label>
                                                {errors.vehicleNo && (
                                                    <span className="text-danger mx-2">{errors.vehicleNo}</span>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                className={`sv-in ${errors.vehicleNo ? "error-input" : ""}`}
                                                placeholder="Enter Vehicle Number"
                                                value={vehicleNo}
                                                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2 — Violation Type & Vehicle Type */}
                                    <div className="row g-3 mb-3">

                                        {/* ✅ Violation Type — sends violation_type to API */}
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Violation Type <span className="text-danger">*</span>
                                                </label>
                                                {errors.violationType && (
                                                    <span className="text-danger mx-2">{errors.violationType}</span>
                                                )}
                                            </div>
                                            <Select
                                                options={violationTypeOptions}
                                                value={violationType}
                                                onChange={(selectedOption) => setViolationType(selectedOption)}
                                                placeholder="Select Type"
                                                isClearable
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.violationType ? "red" : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>

                                        {/* ✅ Vehicle Type — separate field */}
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Vehicle Type <span className="text-danger">*</span>
                                                </label>
                                                {errors.vehicleType && (
                                                    <span className="text-danger mx-2">{errors.vehicleType}</span>
                                                )}
                                            </div>
                                            <Select
                                                options={vehicleTypeOptions}
                                                value={vehicleType}
                                                onChange={(selectedOption) => setVehicleType(selectedOption)}
                                                placeholder="Select Type"
                                                isClearable
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.vehicleType ? "red" : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3 — Penalty Amount */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Penalty Amount <span className="text-danger">*</span>
                                                </label>
                                                {errors.firstName && (
                                                    <span className="text-danger mx-2">{errors.firstName}</span>
                                                )}
                                            </div>
                                            <input
                                                type="number"
                                                className={`sv-in ${errors.firstName ? "error-input" : ""}`}
                                                placeholder="Enter penalty amount"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4 — Description */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Description (Optional)
                                                </label>
                                            </div>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Enter description"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                type="button"
                                className="btn btn-ac btn-ad grey-btn"
                                onClick={() => {
                                    setShowViolationAlert(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-ac px-4"
                                onClick={handleSubmit}
                            >
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
