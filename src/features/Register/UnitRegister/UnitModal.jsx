import Select from "react-select";
import { FiHome, FiUser } from "react-icons/fi";

const UnitModal = ({
    show,
    setShow,
    mode,
    errors,
    errorText,

    flatNo,
    setFlatNo,

    block,
    setBlock,
    allBlocks,

    floor,
    setFloor,
    allFloor,

    unitType,
    setUnitType,

    area,
    setArea,

    currentStatus,
    setCurrentStatus,

    fullName,
    setFullName,

    emailId,
    setEmailId,

    mobileNo,
    setMobileNo,

    handleSubmit,
}) => {
    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title fw-semibold">
                                <strong>
                                    {mode === "edit"
                                        ? "Edit Unit"
                                        : "Add New Unit"}
                                </strong>
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShow(false)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <label className="fw-semibold">
                                        <FiHome className="text-primary" /> Unit
                                        Details
                                    </label>

                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Unit Number{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.flatNo && (
                                                    <span className="text-danger mx-2">
                                                        {errors.flatNo}
                                                    </span>
                                                )}
                                            </div>

                                            <input
                                                className={`sv-in ${
                                                    errors.flatNo
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                placeholder="e.g., A-101"
                                                value={flatNo}
                                                onChange={(e) =>
                                                    setFlatNo(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Block / Tower{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.block && (
                                                    <span className="text-danger mx-2">
                                                        {errors.block}
                                                    </span>
                                                )}
                                            </div>

                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor:
                                                            errors.block
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                                placeholder="Select Block"
                                                options={allBlocks}
                                                value={block}
                                                onChange={setBlock}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Floor{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.floor && (
                                                    <span className="text-danger mx-2">
                                                        {errors.floor}
                                                    </span>
                                                )}
                                            </div>

                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor:
                                                            errors.floor
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                                placeholder="Select Floor"
                                                options={allFloor}
                                                value={floor}
                                                onChange={setFloor}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Unit Type{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.unitType && (
                                                    <span className="text-danger mx-2">
                                                        {errors.unitType}
                                                    </span>
                                                )}
                                            </div>

                                            <input
                                                className={`sv-in ${
                                                    errors.unitType
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                placeholder="Enter Unit Type"
                                                value={unitType}
                                                onChange={(e) =>
                                                    setUnitType(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Area (sqft)
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.area && (
                                                    <span className="text-danger mx-2">
                                                        {errors.area}
                                                    </span>
                                                )}
                                            </div>

                                            <input
                                                className={`sv-in ${
                                                    errors.area
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                placeholder="e.g., 1200"
                                                value={area}
                                                onChange={(e) =>
                                                    setArea(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Current Status
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.currentStatus && (
                                                    <span className="text-danger mx-2">
                                                        {errors.currentStatus}
                                                    </span>
                                                )}
                                            </div>

                                            <select
                                                className={`form-select form-control ${
                                                    errors.currentStatus
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                value={currentStatus}
                                                onChange={(e) =>
                                                    setCurrentStatus(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Type
                                                </option>

                                                {[
                                                    "Vacant",
                                                    "Occupied",
                                                    "Maintanance",
                                                ].map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <label className="fw-semibold">
                                        <FiUser className="text-primary" />
                                        {" "}Primary Owner
                                    </label>

                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Full Name
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.fullName && (
                                                    <span className="text-danger mx-2">
                                                        {errors.fullName}
                                                    </span>
                                                )}
                                            </div>

                                            <input
                                                className={`sv-in ${
                                                    errors.fullName
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                placeholder="Enter Owner Name"
                                                value={fullName}
                                                onChange={(e) =>
                                                    setFullName(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Email Address
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.emailId && (
                                                    <span className="text-danger mx-2">
                                                        {errors.emailId}
                                                    </span>
                                                )}
                                            </div>

                                            <input
                                                className={`sv-in ${
                                                    errors.emailId
                                                        ? "error-input"
                                                        : ""
                                                }`}
                                                placeholder="name@example.com"
                                                value={emailId}
                                                onChange={(e) =>
                                                    setEmailId(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Phone No.
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                {errors.mobileNo && (
                                                    <span className="text-danger mx-2">
                                                        {errors.mobileNo}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="d-flex">
                                                <span
                                                    className={`am-code ${
                                                        errors.mobileNo
                                                            ? "error-input"
                                                            : ""
                                                    }`}
                                                >
                                                    +91
                                                </span>

                                                <input
                                                    className={`sv-in am-phone ${
                                                        errors.mobileNo
                                                            ? "error-input"
                                                            : ""
                                                    }`}
                                                    maxLength={10}
                                                    placeholder="9876543210"
                                                    value={mobileNo}
                                                    onChange={(e) =>
                                                        setMobileNo(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {errorText && (
                                        <h6 className="text-danger">
                                            {errorText}
                                        </h6>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <div className="d-flex gap-2 justify-content-end">
                                <button
                                    className="btn-ol btn close"
                                    onClick={() => setShow(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn-ac px-4"
                                    onClick={handleSubmit}
                                >
                                    {mode === "edit"
                                        ? "Update Unit"
                                        : "Add Unit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UnitModal;