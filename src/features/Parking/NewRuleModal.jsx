// NewRuleModal.jsx
import Select from "react-select";

const NewRuleModal = ({
    show,
    setShow,
    mode,
    allFlats = [],

    statusOptions = [],
    typeOptions = [],
    violationTypeOptions = [],

    statusField = "",
    setStatusField = () => { },

    typeField = "",
    setTypeField = () => { },

    violationTypeField = "",
    setViolationTypeField = () => { },

    ruleTitle = null,
    setRuleTitle = () => { },

    description = null,
    setDescription = () => { },

    frequency = null,
    setFrequency = () => { },

    penalty = null,
    setPenalty = () => { },

    resetForm = () => { },

    errors = {},
    errorText = "",
    handleSubmit = () => { },

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
                                    {mode === "add" ? "Create New Rule" : "Edit Rule"}
                                </h5>
                                <small className="text-muted">
                                    Define a new parking regulation or policy.
                                </small>
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
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Rule Title <span className="text-danger">*</span>
                                                </label>
                                                {errors.ruleTitle && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.ruleTitle}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.ruleTitle ? "error-input" : ""}`}
                                                placeholder="e.g. Wrong slot usage"
                                                value={ruleTitle}
                                                onChange={(e) => setRuleTitle(e.target.value)}
                                            />
                                        </div>


                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    By<span className="text-danger">*</span>
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
                                                    Status{" "}
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
                                                    Description<span className="text-danger">*</span>
                                                </label>
                                                {errors.description && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.description}
                                                    </span>
                                                )}
                                            </div>
                                            <textarea
                                                className={`sv-in ${errors.description ? "error-input" : ""}`}
                                                placeholder="Enter detailed description of the rule"
                                                rows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <label className="fw-bold" style={{ fontSize: "14px" }}>ENFORCEMENT & PENALTY</label>
                                    <div className="row g-3 mb-3 mt-1">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Violation Type<span className="text-danger">*</span>
                                                </label>
                                                {errors.violationTypeField && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.violationTypeField}
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.violationTypeField
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.violationTypeField
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={violationTypeOptions}
                                                value={violationTypeField}
                                                onChange={(selectedOption) => setViolationTypeField(selectedOption)}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Frequency {" "}
                                                    {/* <span className="text-danger">*</span> */}
                                                </label>
                                                {/* {errors.frequency && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.frequency}
                                                    </span>
                                                )} */}
                                            </div>

                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.frequency
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.frequency
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={allFlats}
                                                value={frequency}
                                                onChange={(selectedOption) => setFrequency(selectedOption)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Penalty Amount(₹)<span className="text-danger">*</span>
                                                </label>
                                                {errors.penalty && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.penalty}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.penalty ? "error-input" : ""}`}
                                                placeholder="00.00"

                                                value={penalty}
                                                onChange={(e) => setPenalty(e.target.value)}
                                            />
                                        </div>
                                    </div>

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
                               {mode === "add" ? "Create Rule" : "Update Rule"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewRuleModal;
