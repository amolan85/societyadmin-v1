// VisitorModal.jsx
// Reusable modal for both Add Visitor and Edit Visitor
// Props:
//   show, setShow          — open/close
//   mode                   — "add" | "edit"
//   flatsList              — array of flat objects (only used in add mode)
//   errors, setErrors      — validation error map
//   errorText              — server-side error string
//   handleSubmit           — submit handler (called on Add/Update click)
//   All form field value + setter pairs (see prop list below)

const Visitormodal = ({
    show,
    setShow,

    mode = "add",           // "add" | "edit"

    errors = {},
    setErrors,
    errorText = "",

    visitorType,
    setVisitorType,

    visitorName,
    setVisitorName,

    mobile,
    setMobile,

    flatId,
    setFlatId,
    flatsList = [],

    vehicleNumber,
    setVehicleNumber,

    email,
    setEmail,

    gender,
    setGender,

    comingFrom,
    setComingFrom,

    purpose,
    setPurpose,

    idType,
    setIdType,

    idNumber,
    setIdNumber,

    parcelCompany,
    setParcelCompany,

    parcelDeliveryType,
    setParcelDeliveryType,

    parcelDescription,
    setParcelDescription,

    handleSubmit,
    onClose,                // optional extra callback when modal is closed/cancelled
}) => {
    if (!show) return null;

    const isEdit = mode === "edit";

    const handleClose = () => {
        setShow(false);
        onClose && onClose();
    };

    return (
        <>
            <div className="modal-backdrop fade show" />
            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header bg-light">
                            <h1 className="modal-title fs-5">
                                {isEdit ? "Edit Visitor" : "Add New Visitor"}
                            </h1>
                            <button type="button" className="btn-close" onClick={handleClose} />
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">

                                    {/* ── Visitor Type Toggle ── */}
                                    <div className="mb-3">
                                        <label className="sv-lb">
                                            Visitor Type <span className="text-danger">*</span>
                                        </label>
                                        <div style={{
                                            background: "#f1f5f9", borderRadius: "30px",
                                            padding: "4px", display: "flex", width: "100%", marginTop: "6px",
                                            // disable toggle in edit mode — type cannot change after creation
                                            opacity: isEdit ? 0.6 : 1,
                                            pointerEvents: isEdit ? "none" : "auto",
                                        }}>
                                            {[{ value: "guest", label: "Guest" }, { value: "delivery", label: "Delivery" }].map(t => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    onClick={() => { setVisitorType(t.value); setErrors({}); }}
                                                    style={{
                                                        flex: 1, padding: "8px 0", borderRadius: "26px", border: "none",
                                                        background: visitorType === t.value ? "#3b82f6" : "transparent",
                                                        color: visitorType === t.value ? "#fff" : "#64748b",
                                                        fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                                                    }}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Name + Mobile ── */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Visitor Name <span className="text-danger">*</span></label>
                                                {errors.visitorName && <span className="text-danger mx-2">{errors.visitorName}</span>}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.visitorName ? "error-input" : ""}`}
                                                placeholder="Enter visitor name"
                                                value={visitorName}
                                                onChange={e => setVisitorName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Phone No. <span className="text-danger">*</span></label>
                                                {errors.mobile && <span className="text-danger mx-2">{errors.mobile}</span>}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <span style={{
                                                    padding: "8px 12px", border: "1px solid #e2e8f0",
                                                    borderRadius: "8px", background: "#f8fafc",
                                                    color: "#64748b", fontSize: 14, whiteSpace: "nowrap",
                                                }}>+91</span>
                                                <input
                                                    className={`sv-in ${errors.mobile ? "error-input" : ""}`}
                                                    placeholder="98765 43210"
                                                    value={mobile}
                                                    onChange={e => setMobile(e.target.value)}
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Flat + Vehicle ── */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Flat / Unit <span className="text-danger">*</span></label>
                                                {errors.flatId && <span className="text-danger mx-2">{errors.flatId}</span>}
                                            </div>
                                            {isEdit ? (
                                                // In edit mode flat cannot be changed — show as read-only
                                                <input
                                                    className="sv-in"
                                                    value={flatId}
                                                    disabled
                                                    style={{ background: "#f8fafc", color: "#64748b" }}
                                                />
                                            ) : (
                                                <select
                                                    className={`form-select ${errors.flatId ? "error-input" : ""}`}
                                                    value={flatId}
                                                    onChange={e => setFlatId(e.target.value)}
                                                >
                                                    <option value="">Select Flat</option>
                                                    {flatsList.map(f => (
                                                        <option key={f.flat_id} value={f.flat_id}>{f.flat_number}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <div className="col-6">
                                            <label className="sv-lb">Vehicle Number (Optional)</label>
                                            <input
                                                className="sv-in"
                                                placeholder="Eg. MH12AB1234"
                                                value={vehicleNumber}
                                                onChange={e => setVehicleNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* ── Guest-only Fields ── */}
                                    {visitorType === "guest" && (
                                        <>
                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Email Address (Optional)</label>
                                                    <input
                                                        className="sv-in"
                                                        placeholder="Enter email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        disabled={isEdit}
                                                        style={isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="sv-lb">Gender</label>
                                                    <select
                                                        className="form-select"
                                                        value={gender}
                                                        onChange={e => setGender(e.target.value)}
                                                        disabled={isEdit}
                                                        style={isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                                    >
                                                        <option value="">Select gender</option>
                                                        {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <label className="sv-lb">Coming From</label>
                                                    <input
                                                        className="sv-in"
                                                        placeholder="Eg. Mumbai"
                                                        value={comingFrom}
                                                        onChange={e => setComingFrom(e.target.value)}
                                                        disabled={isEdit}
                                                        style={isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">Purpose <span className="text-danger">*</span></label>
                                                        {errors.purpose && <span className="text-danger mx-2">{errors.purpose}</span>}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.purpose ? "error-input" : ""}`}
                                                        placeholder="Eg. Birthday celebration"
                                                        value={purpose}
                                                        onChange={e => setPurpose(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">ID Type <span className="text-danger">*</span></label>
                                                        {errors.idType && <span className="text-danger mx-2">{errors.idType}</span>}
                                                    </div>
                                                    <select
                                                        className={`form-select ${errors.idType ? "error-input" : ""}`}
                                                        value={idType}
                                                        onChange={e => setIdType(e.target.value)}
                                                        disabled={isEdit}
                                                        style={isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                                    >
                                                        <option value="">Select ID type</option>
                                                        {["Aadhaar", "PAN", "Passport", "Driving License"].map(id => (
                                                            <option key={id}>{id}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">ID Number <span className="text-danger">*</span></label>
                                                        {errors.idNumber && <span className="text-danger mx-2">{errors.idNumber}</span>}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.idNumber ? "error-input" : ""}`}
                                                        placeholder="Eg. 1234-5678-9012"
                                                        value={idNumber}
                                                        onChange={e => setIdNumber(e.target.value)}
                                                        disabled={isEdit}
                                                        style={isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ── Delivery-only Fields ── */}
                                    {visitorType === "delivery" && (
                                        <>
                                            <div className="row g-3 mb-3">
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">Company / App <span className="text-danger">*</span></label>
                                                        {errors.parcelCompany && <span className="text-danger mx-2">{errors.parcelCompany}</span>}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.parcelCompany ? "error-input" : ""}`}
                                                        placeholder="Eg. Swiggy, Amazon"
                                                        value={parcelCompany}
                                                        onChange={e => setParcelCompany(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">Delivery Type <span className="text-danger">*</span></label>
                                                        {errors.parcelDeliveryType && <span className="text-danger mx-2">{errors.parcelDeliveryType}</span>}
                                                    </div>
                                                    <select
                                                        className={`form-select ${errors.parcelDeliveryType ? "error-input" : ""}`}
                                                        value={parcelDeliveryType}
                                                        onChange={e => setParcelDeliveryType(e.target.value)}
                                                    >
                                                        <option value="">Select type</option>
                                                        {["Door", "Lobby", "Security"].map(t => <option key={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <label className="sv-lb">Parcel Description (Optional)</label>
                                                    <input
                                                        className="sv-in"
                                                        placeholder="Eg. Food order #12345"
                                                        value={parcelDescription}
                                                        onChange={e => setParcelDescription(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Edit-mode helper text */}
                                    {isEdit && (
                                        <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                                            * Greyed fields (flat, ID, email, gender, coming from) cannot be changed after registration.
                                        </p>
                                    )}

                                    {errorText && <h6 className="text-danger mt-2">{errorText}</h6>}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer bg-light">
                            <div className="d-flex gap-2 justify-content-end">
                                <button className="btn btn-outline-secondary" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    {isEdit ? "Update Visitor" : "Add Visitor"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Visitormodal;
