// VehicleModal.jsx
// Reusable modal for Add Vehicle and Edit Vehicle
// Props:
//   show, setShow          — open/close
//   mode                   — "add" | "edit"
//   errors, setErrors      — validation error map
//   errorText              — server-side error string
//   handleSubmit           — submit handler
//   All form field value + setter pairs

const VehicleModal = ({
    show,
    setShow,
    mode = "add",
    errors = {},
    setErrors,
    errorText = "",

    // Block / Flat (add mode only)
    allBlocks = [],
    allFlats = [],
    selectedBlock = "",
    setSelectedBlock,
    selectedFlat = "",
    setSelectedFlat,
    onBlockChange,

    // Fields
    vehicleNumber,
    setVehicleNumber,

    vehicleType,
    setVehicleType,

    vehicleModel,
    setVehicleModel,

    color,
    setColor,

    stickerId,
    setStickerId,

    rcDocument,
    setRcDocument,

    // Display only in edit mode
    flatId = "",

    handleSubmit,
    onClose,
}) => {
    if (!show) return null;

    const isEdit = mode === "edit";

    const handleClose = () => {
        setShow(false);
        onClose && onClose();
    };

    const VEHICLE_TYPES = [
        { value: "2_wheeler", label: "2 Wheeler" },
        { value: "4_wheeler", label: "4 Wheeler" },
        { value: "other", label: "Other" },
    ];

    return (
        <>
            <div className="modal-backdrop fade show" />
            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header bg-light">
                            <h1 className="modal-title fs-5">
                                {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
                            </h1>
                            <button type="button" className="btn-close" onClick={handleClose} />
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card w-100">

                                    {/* Block + Flat (add only) */}
                                    {!isEdit && (
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <div className="d-flex">
                                                    <label className="sv-lb">Block <span className="text-danger">*</span></label>
                                                    {errors.block && <span className="text-danger mx-2">{errors.block}</span>}
                                                </div>
                                                <select
                                                    className={`form-select ${errors.block ? "error-input" : ""}`}
                                                    value={selectedBlock}
                                                    onChange={onBlockChange}
                                                >
                                                    <option value="">Select Block</option>
                                                    {allBlocks.map((item, i) => (
                                                        <option key={i} value={item.block}>{item.block}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <div className="d-flex">
                                                    <label className="sv-lb">Flat / Unit <span className="text-danger">*</span></label>
                                                    {errors.flatId && <span className="text-danger mx-2">{errors.flatId}</span>}
                                                </div>
                                                <select
                                                    className={`form-select ${errors.flatId ? "error-input" : ""}`}
                                                    value={selectedFlat}
                                                    onChange={e => setSelectedFlat(e.target.value)}
                                                >
                                                    <option value="">Select Flat</option>
                                                    {allFlats.map(f => (
                                                        <option key={f.flat_id} value={f.flat_id}>{f.flat_number}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {/* In edit mode: show flat as disabled */}
                                    {isEdit && (
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <label className="sv-lb">Flat / Unit</label>
                                                <input
                                                    className="sv-in"
                                                    value={flatId}
                                                    disabled
                                                    style={{ background: "#f8fafc", color: "#64748b" }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Vehicle Number + Type */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Vehicle Number <span className="text-danger">*</span></label>
                                                {errors.vehicleNumber && <span className="text-danger mx-2">{errors.vehicleNumber}</span>}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.vehicleNumber ? "error-input" : ""}`}
                                                placeholder="Eg. MH12AB1234"
                                                value={vehicleNumber}
                                                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Vehicle Type <span className="text-danger">*</span></label>
                                                {errors.vehicleType && <span className="text-danger mx-2">{errors.vehicleType}</span>}
                                            </div>
                                            <select
                                                className={`form-select ${errors.vehicleType ? "error-input" : ""}`}
                                                value={vehicleType}
                                                onChange={e => setVehicleType(e.target.value)}
                                            >
                                                <option value="">Select type</option>
                                                {VEHICLE_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Model + Color */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="sv-lb">Vehicle Model (Optional)</label>
                                            <input
                                                className="sv-in"
                                                placeholder="Eg. Honda City"
                                                value={vehicleModel}
                                                onChange={e => setVehicleModel(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="sv-lb">Color (Optional)</label>
                                            <input
                                                className="sv-in"
                                                placeholder="Eg. White"
                                                value={color}
                                                onChange={e => setColor(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Sticker ID */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="sv-lb">Sticker ID (Optional)</label>
                                            <input
                                                className="sv-in"
                                                placeholder="Eg. STK001"
                                                value={stickerId}
                                                onChange={e => setStickerId(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* RC Document */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <label className="sv-lb">RC Document (Optional)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*,.pdf"
                                                onChange={e => setRcDocument && setRcDocument(e.target.files[0])}
                                            />
                                        </div>
                                    </div>

                                    {isEdit && (
                                        <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                                            * Flat / Unit cannot be changed after registration.
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
                                    {isEdit ? "Update Vehicle" : "Add Vehicle"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default VehicleModal;
