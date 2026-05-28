// MemberModal.jsx
import { FiTruck } from "react-icons/fi";
import Select from "react-select";

const ExtendTimeModal = ({
    showExtendTime,
    setShowExtendTime,

    extendDurationType = [],
    allBlocks = [],
    allFlats = [],
    recordType = [],

    extendDuration = null,
    setExtendDuration = () => { },

    flat = null,
    setFlat = () => { },

    recordTypeTab = "",
    setRecordTypeTab = () => { },

    resetForm = () => { },

    firstName = "",
    setFirstName = () => { },

    lastName = "",
    setLastName = () => { },

    mobileNo = "",
    setMobileNo = () => { },

    emailId = "",
    setEmailId = () => { },

    moveInDate = "",
    setMoveInDate = () => { },

    moveOutDate = "",
    setMoveOutDate = () => { },

    familyType = "",
    setFamilyType = () => { },

    // rentAgreement = null,
    setRentAgreement = () => { },

    // policeNoc = null,
    setPoliceNoc = () => { },

    // idProof = null,
    setIdProof = () => { },

    // agreement = null,
    setAgreement = () => { },

    // maintenanceReceipt = null,
    setMaintenanceReceipt = () => { },

    // nominationDetails = null,
    setNominationDetails = () => { },

    // familyPhoto = null,
    setFamilyPhoto = () => { },

    // ownershipDocuments = null,
    setOwnershipDocuments = () => { },

    errors = {},
    errorText = "",
    handleSubmit = () => { },
    mode,
}) => {
    if (!showExtendTime) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                Extend Parking Session
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowExtendTime(false)}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-12">
                                            <div
                                                className="card border-0 shadow-sm px-2 py-2"
                                                style={{
                                                    borderRadius: "10px",
                                                    backgroundColor: "#f8f9fa",
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">

                                                    {/* Left Section */}
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            <FiTruck size={24} className="text-secondary" />
                                                        </div>

                                                        <div>
                                                            <h6 className="mb-1 fw-semibold">KA-05-MH-2023</h6>
                                                            <small className="text-muted">
                                                                Rahul Kumar · Visitor
                                                            </small>
                                                        </div>
                                                    </div>

                                                    {/* Right Section */}
                                                    <div className="text-end">
                                                        <small className="text-muted d-block">
                                                            Current End Time
                                                        </small>
                                                        <h6 className="mb-0 fw-bold">4:00 PM</h6>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <label className="sv-lb">
                                            Extend duration by <span className="text-danger">*</span>
                                        </label>

                                        {errors.extendDuration && (
                                            <span className="text-danger mx-2">{errors.extendDuration}</span>
                                        )}
                                    </div>
                                    <div
                                        className={`am-type-wrap mb-3  ${errors.extendDuration ? "border border-danger  p-1" : ""
                                            }`}
                                    >
                                        {extendDurationType.map((t) => (
                                            <button
                                                key={t.value}
                                                onClick={() => {
                                                    setExtendDuration(t.value);
                                                    resetForm();
                                                }}
                                                className={`am-type-btn ${extendDuration === t.value ? "active" : ""
                                                    }`}
                                            >
                                                {t.id}
                                            </button>
                                        ))}
                                    </div>

                                    <>
                                        <div className="row g-3 mb-3">

                                            <div className="col-12">
                                                <div className="d-flex">
                                                    <label className="sv-lb">
                                                        New End Time{" "}
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    {errors.moveOutDate && (
                                                        <span className="text-danger mx-2">
                                                            {errors.moveOutDate}
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    className={`sv-in ${errors.moveOutDate ? "error-input" : ""}`}
                                                    type="time"
                                                    value={moveOutDate}
                                                    onChange={(e) => setMoveOutDate(e.target.value)}
                                                />
                                                <small className="text-muted">Original Expiry was 4:00 PM today.</small>
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-12">
                                                <div className="d-flex">
                                                    <label className="sv-lb">
                                                        Reson for Extension (Optional){" "}

                                                    </label>
                                                    {errors.rentAgreement && (
                                                        <span className="text-danger mx-2">
                                                            {errors.rentAgreement}
                                                        </span>
                                                    )}
                                                </div>
                                                <textarea className="form-control" rows={3} placeholder="Eg. Dinner plans, Meeting extended.." />
                                            </div>
                                        </div>
                                    </>

                                    {errorText && <h6 className="text-danger">{errorText}</h6>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                className="btn-ol btn close"
                                onClick={() => {
                                    setShowExtendTime(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button className="btn-ac px-4" onClick={handleSubmit}>
                                Confirm Extension
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExtendTimeModal;
