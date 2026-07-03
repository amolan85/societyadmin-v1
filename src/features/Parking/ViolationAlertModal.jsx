import { useState } from "react";
import Select from "react-select";
const ViolationAlertModal = ({
    showViolationAlert,
    setShowViolationAlert,
    allSlots = [],
    slot = null,
    setSlot = () => {},
    violationType = null,
    setViolationType = () => {},
    vehicleType = null,
    setVehicleType = () => {},
    status = null,
    setStatus = () => {},
    vehicleNo = "",
    setVehicleNo = () => {},
    penaltyamount = "",
    setPenaltyAmount = () => {},
    descrioption = "",
    setDescrioption = () => {},
    uploadPhoto = null,
    setUploadPhoto = () => {},
    existingPhotoUrl = null,
    errors = {},
    setErrors = () => {},   // ← make sure this is received as a prop
    resetForm = () => {},
    handleSubmit = () => {},
    mode,
}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    if (!showViolationAlert) return null;

    // ── MOVED INSIDE the component so it can access errors + setErrors ──
    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const violationTypeOptions = [
        { value: "unauthorized_parking", label: "Unauthorized Parking" },
        { value: "visitor_overstay",     label: "Visitor Overstay" },
        { value: "wrong_slot",           label: "Wrong Slot" },
        { value: "double_parking",       label: "Double Parking" },
        { value: "no_sticker",           label: "No Sticker" },
        { value: "other",                label: "Other" },
    ];

    const vehicleTypeOptions = [
        { value: "2_wheeler", label: "2 Wheeler" },
        { value: "4_wheeler", label: "4 Wheeler" },
    ];

    const statusOptions = [
        { value: "open",      label: "Open" },
        { value: "resolved",  label: "Resolved" },
        { value: "dismissed", label: "Dismissed" },
    ];


    const handleConfirmSubmit = () => {
    setShowConfirmModal(true);
};

const handleProceed = () => {
    setShowConfirmModal(false);

    if (handleSubmit) {
        handleSubmit();
    }
};
    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">

                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                {mode === "edit" ? "Edit Violation Alert" : "Create Violation Alert"}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowViolationAlert(false)} />
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">

                                    {/* Row 1 — Slot No. & Vehicle No. */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Slot No.</label>
                                                {errors.slot && <span className="text-danger mx-2">{errors.slot}</span>}
                                            </div>
                                            <Select
                                                options={allSlots}
                                                value={slot}
                                                onChange={(v) => {
                                                    setSlot(v);
                                                    clearError("slot");
                                                }}
                                                placeholder="Select Slot"
                                                isClearable
                                                styles={{
                                                    control: (b) => ({
                                                        ...b,
                                                        borderColor: errors.slot ? "red" : b.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Vehicle No. <span className="text-danger">*</span></label>
                                                {errors.vehicleNo && <span className="text-danger mx-2">{errors.vehicleNo}</span>}
                                            </div>
                                            <input
                                                type="text"
                                                className={`sv-in ${errors.vehicleNo ? "error-input" : ""}`}
                                                placeholder="Enter Vehicle Number"
                                                value={vehicleNo}
                                                onChange={(e) => {
                                                    setVehicleNo(e.target.value.toUpperCase());
                                                    clearError("vehicleNo");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2 — Violation Type & Vehicle Type */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Violation Type <span className="text-danger">*</span></label>
                                                {errors.violationType && <span className="text-danger mx-2">{errors.violationType}</span>}
                                            </div>
                                            <Select
                                                options={violationTypeOptions}
                                                value={violationType}
                                                onChange={(v) => {
                                                    setViolationType(v);
                                                    clearError("violationType");
                                                }}
                                                placeholder="Select Type"
                                                isClearable
                                                styles={{
                                                    control: (b) => ({
                                                        ...b,
                                                        borderColor: errors.violationType ? "red" : b.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">Vehicle Type <span className="text-danger">*</span></label>
                                                {errors.vehicleType && <span className="text-danger mx-2">{errors.vehicleType}</span>}
                                            </div>
                                            <Select
                                                options={vehicleTypeOptions}
                                                value={vehicleType}
                                                onChange={(v) => {
                                                    setVehicleType(v);
                                                    clearError("vehicleType");
                                                }}
                                                placeholder="Select Type"
                                                isClearable
                                                styles={{
                                                    control: (b) => ({
                                                        ...b,
                                                        borderColor: errors.vehicleType ? "red" : b.borderColor,
                                                        boxShadow: "none",
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4 — Upload Photo */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">Upload Photo</label>
                                                {errors.uploadPhoto && <span className="text-danger mx-2">{errors.uploadPhoto}</span>}
                                            </div>

                                            {mode === "edit" && existingPhotoUrl && !uploadPhoto && (
                                                <div className="mb-2">
                                                    <img
                                                        src={existingPhotoUrl}
                                                        alt="Current photo"
                                                        style={{ height: 80, borderRadius: 6, objectFit: "cover", border: "1px solid #ddd" }}
                                                    />
                                                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                                                        Current photo — upload a new one to replace it
                                                    </div>
                                                </div>
                                            )}

                                            {uploadPhoto && (
                                                <div className="mb-2" style={{ fontSize: 12, color: "#555" }}>
                                                    New file: <strong>{uploadPhoto.name}</strong>
                                                    <span
                                                        className="text-danger ms-2"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setUploadPhoto(null)}
                                                    >
                                                        ✕ Remove
                                                    </span>
                                                </div>
                                            )}

                                            <input
                                                className={`sv-in ${errors.uploadPhoto ? "error-input" : ""}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setUploadPhoto(e.target.files[0] || null);
                                                    clearError("uploadPhoto");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 5 — Penalty Amount */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                <label className="sv-lb">Penalty Amount <span className="text-danger">*</span></label>
                                                {errors.penaltyamount && <span className="text-danger mx-2">{errors.penaltyamount}</span>}
                                            </div>
                                            <input
                                                type="number"
                                                className={`sv-in ${errors.penaltyamount ? "error-input" : ""}`}
                                                placeholder="Enter penalty amount"
                                                value={penaltyamount}
                                                onChange={(e) => {
                                                    setPenaltyAmount(e.target.value);
                                                    clearError("penaltyamount");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Row 6 — Description */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <label className="sv-lb">Description (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Enter description"
                                                value={descrioption}
                                                onChange={(e) => setDescrioption(e.target.value)}
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
                                onClick={() => { setShowViolationAlert(false); resetForm(); }}
                            >
                                Cancel
                            </button>
                            <button
    className="btn-ac px-4"
    onClick={handleConfirmSubmit}
>
    {mode === "edit" ? "Update" : "Submit"}
</button>
                        </div>

                    </div>
                </div>
            </div>

            <div
    className={`modal fade ${showConfirmModal ? "show d-block" : ""}`}
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title">
                    {mode === "edit"
                        ? "Confirm Update"
                        : "Confirm Create"}
                </h5>

                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirmModal(false)}
                />
            </div>

            <div className="modal-body text-start">

                <p className="mb-0">
                    {mode === "edit"
                        ? `Are you sure you want to update violation for vehicle "${vehicleNo}"?`
                        : `Are you sure you want to create a violation for vehicle "${vehicleNo}"?`}
                </p>

            </div>

            <div className="modal-footer">

                <button
                    className="btn btn-secondary"
                    onClick={() => setShowConfirmModal(false)}
                >
                    Cancel
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleProceed}
                >
                    {mode === "edit"
                        ? "Yes, Update"
                        : "Yes, Create"}
                </button>

            </div>

        </div>
    </div>
</div>
        </>
    );
};

export default ViolationAlertModal;