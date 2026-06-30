// VehicleModal.jsx
const VehicleModal = ({
    show,
    setShow,
    mode = "add",
    errors = {},
    setErrors,
    errorText = "",

    allBlocks = [],
    allFlats = [],
    selectedBlock = "",
    setSelectedBlock,
    selectedFlat = "",
    setSelectedFlat,
    onBlockChange,

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

    flatId = "",

    handleSubmit,
    onClose,
    onFlatChange,
    selectedOwnerName = "",
    rcDocumentUrl = "",
}) => {
    if (!show) return null;

    const isEdit = mode === "edit";

    const handleClose = () => {
        setShow(false);
        onClose && onClose();
    };

    // ── clear a single field error as soon as user fills it ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const VEHICLE_TYPES = [
        { value: "2_wheeler", label: "2 Wheeler" },
        { value: "4_wheeler", label: "4 Wheeler" },
        { value: "other",     label: "Other" },
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
                                                    onChange={(e) => {
                                                        onBlockChange(e);
                                                        clearError("block");
                                                    }}
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
                                                    onChange={(e) => {
                                                        onFlatChange ? onFlatChange(e.target.value) : setSelectedFlat(e.target.value);
                                                        clearError("flatId");
                                                    }}
                                                >
                                                    <option value="">Select Flat</option>
                                                    {allFlats.map(f => (
                                                        <option key={f.flat_id} value={f.flat_id}>{f.flat_number}</option>
                                                    ))}
                                                </select>
                                                {selectedFlat && selectedOwnerName && (
                                                    <small className="d-block mt-1">
                                                        Owner: <span className="fw-bold">{selectedOwnerName}</span>
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Edit mode: flat + owner display */}
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
                                            <div className="col-6">
                                                <label className="sv-lb">Owner</label>
                                                <input
                                                    className="sv-in"
                                                    value={selectedOwnerName}
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
                                                onChange={(e) => {
                                                    setVehicleNumber(e.target.value.toUpperCase());
                                                    clearError("vehicleNumber");
                                                }}
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
                                                onChange={(e) => {
                                                    setVehicleType(e.target.value);
                                                    clearError("vehicleType");
                                                }}
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
                                            <div className="d-flex">
                                                <label className="sv-lb">Vehicle Model <span className="text-danger">*</span></label>
                                                {errors.vehicleModel && <span className="text-danger mx-2">{errors.vehicleModel}</span>}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.vehicleModel ? "error-input" : ""}`}
                                                placeholder="Eg. Honda City"
                                                value={vehicleModel}
                                                onChange={(e) => {
                                                    setVehicleModel(e.target.value);
                                                    clearError("vehicleModel");
                                                }}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Color <span className="text-danger">*</span></label>
                                                {errors.color && <span className="text-danger mx-2">{errors.color}</span>}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.color ? "error-input" : ""}`}
                                                placeholder="Eg. White"
                                                value={color}
                                                onChange={(e) => {
                                                    setColor(e.target.value);
                                                    clearError("color");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Sticker ID */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Sticker ID  </label>
                                                 
                                            </div>
                                            <input
                                                className={`sv-in ${errors.stickerId ? "error-input" : ""}`}
                                                placeholder="Auto-generated"
                                                value={stickerId}
                                                readOnly={!isEdit}
                                                onChange={(e) => {
                                                    setStickerId(e.target.value);
                                                    clearError("stickerId");
                                                }}
                                                style={!isEdit ? { background: "#f8fafc", color: "#64748b" } : {}}
                                            />
                                        </div>
                                    </div>

                                    {/* RC Document */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    RC Document {!isEdit && <span className="text-danger">*</span>}
                                                </label>
                                                {errors.rcDocument && (
                                                    <span className="text-danger mx-2">{errors.rcDocument}</span>
                                                )}
                                            </div>

                                            {isEdit && rcDocumentUrl && (
                                                <div className="mb-2">
                                                    <a href={rcDocumentUrl} target="_blank" rel="noopener noreferrer">
                                                        View current RC document
                                                    </a>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                className={`form-control ${errors.rcDocument ? "error-input" : ""}`}
                                                accept="image/*,.pdf"
                                                onChange={(e) => {
                                                    setRcDocument && setRcDocument(e.target.files[0]);
                                                    clearError("rcDocument");
                                                }}
                                            />

                                            {isEdit && (
                                                <small className="text-muted d-block mt-1">
                                                    Leave empty to keep the existing document.
                                                </small>
                                            )}
                                        </div>
                                    </div>

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