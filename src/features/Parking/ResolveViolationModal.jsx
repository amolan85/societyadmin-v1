// ResolveViolationModal.jsx
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Select from "react-select";
import { toast } from "react-toastify";
import { resolveViolationApi } from "../../services/ViolationAlertsApi";
import "../../styles/Parking.css";

const ResolveViolationModal = ({
    show,
    setShow,
    violationId,
    societyId,
    userId,
    resolutionMethod = [],
    resolutionMethodField = "",
    setResolutionMethodField = () => {},
    resetForm = () => {},
    onResolved = () => {},
}) => {
    const [notifyOwner, setNotifyOwner] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!show) return null;

    const handleClose = () => {
        setShow(false);
        setErrors({});
        setResolutionMethodField("");
        setRemarks("");
        setNotifyOwner(false);
        resetForm();
    };

    const handleMarkAsResolved = async () => {
        // Validate resolution method
        if (!resolutionMethodField) {
            setErrors({ resolutionMethodField: "Required" });
            return;
        }
        setErrors({});

        try {
            setLoading(true);

            // Only send what the API needs for resolving
            await resolveViolationApi(
                societyId,                      // society_id
                violationId,                    // violation_id
                "resolved",                     // status — enum: "open" | "resolved" | "dismissed"
                userId,                         // resolved_by
                resolutionMethodField?.label    // resolution_remarks (selected method label)
            );

            toast.success("Violation marked as resolved successfully");
            handleClose();
            onResolved(); // refresh parent details / list
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to resolve violation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header bg-light">
                            <h5 className="modal-title mb-0 text-start fw-bold">
                                Resolve Violation
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                disabled={loading}
                            />
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card w-100">

                                    {/* Warning Banner */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="card bg-light border-0 p-3 d-flex flex-row align-items-start violation-warning-card">
                                                <FiAlertCircle size={40} className="text-dark mt-1 flex-shrink-0" />
                                                <p className="violation-warning-text ms-2 mb-0">
                                                    You are marking violation{" "}
                                                    <strong>
                                                        #{violationId ? `VIO-${violationId}` : ""}
                                                    </strong>{" "}
                                                    as resolved. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resolution Method */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center mb-1">
                                                <label className="sv-lb mb-0">
                                                    Resolution Method
                                                    <span className="text-danger">*</span>
                                                </label>
                                                {errors.resolutionMethodField && (
                                                    <span className="text-danger mx-2 small">
                                                        {errors.resolutionMethodField}
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.resolutionMethodField
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.resolutionMethodField
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={resolutionMethod}
                                                value={resolutionMethodField}
                                                onChange={(selectedOption) => {
                                                    setResolutionMethodField(selectedOption);
                                                    setErrors({});
                                                }}
                                                placeholder="Select resolution method..."
                                                isDisabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Remarks / Notes */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <label className="sv-lb">Remarks / Notes</label>
                                            <textarea
                                                className="sv-in"
                                                placeholder="Add any internal notes regarding this resolution"
                                                rows={3}
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Notify Owner */}
                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notifyOwner"
                                            checked={notifyOwner}
                                            onChange={(e) => setNotifyOwner(e.target.checked)}
                                            disabled={loading}
                                        />
                                        <label className="form-check-label" htmlFor="notifyOwner">
                                            Notify owner about resolution
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer bg-light">
                            <button
                                className="btn btn-sm cov-btn-cancel"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-ac btn-success px-4"
                                onClick={handleMarkAsResolved}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Resolving...
                                    </>
                                ) : (
                                    "Mark as Resolved"
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ResolveViolationModal;