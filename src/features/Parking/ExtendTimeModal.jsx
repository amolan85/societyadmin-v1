// MemberModal.jsx
import Select from "react-select";

const ExtendTimeModal = ({
    showExtendTime,
    setShowExtendTime,

    allBlocks = [],
    allFlats = [],
    recordType = [],

    blocks = null,
    setBlocks = () => { },

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
    handleSubmit = () => {},
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
                           
                                    <div className="d-flex">
                                        <label className="sv-lb">
                                            Record Type <span className="text-danger">*</span>
                                        </label>

                                        {errors.memType && (
                                            <span className="text-danger mx-2">{errors.memType}</span>
                                        )}
                                    </div>
                                    <div
                                        className={`am-type-wrap mb-3  ${errors.recordTypeTab ? "border border-danger  p-1" : ""
                                            }`}
                                    >
                                        {recordType.map((t) => (
                                            <button
                                                key={t.value}
                                                onClick={() => {
                                                    setRecordTypeTab(t.value);
                                                    resetForm();
                                                }}
                                                className={`am-type-btn ${recordTypeTab === t.value ? "active" : ""
                                                    }`}
                                            >
                                                {t.id}
                                            </button>
                                        ))}
                                    </div>

                                    <>
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <div className="d-flex">
                                                    <label className="sv-lb">
                                                        Date{" "}
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    {errors.moveInDate && (
                                                        <span className="text-danger mx-2">
                                                            {errors.moveInDate}
                                                        </span>
                                                    )}
                                                </div>
                                                <input
                                                    className={`sv-in ${errors.moveInDate ? "error-input" : ""}`}
                                                    type="date"
                                                    value={moveInDate}
                                                    onChange={(e) => setMoveInDate(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-6">
                                                <div className="d-flex">
                                                    <label className="sv-lb">
                                                        Time{" "}
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
                                                <textarea className="form-control" rows={3} placeholder="Eg. Forgot ID Card, Biometric machiner Error, System override" />
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
                                Save Record
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExtendTimeModal;
