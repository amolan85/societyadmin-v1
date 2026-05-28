// FilterRentalsModal.jsx
import Select from "react-select";

const FilterRentalsModal = ({
    showFilterRentals,
    setShowFilterRentals,
    filterData = [],
    allBlocks = [],
    allFlats = [],
    addMemberType = [],
    statusOptions = [],
    typeOptions = [],

    statusField = "",
    setStatusField = () => { },

    typeField = "",
    setTypeField = () => { },

    blocks = null,
    setBlocks = () => { },

    flat = null,
    setFlat = () => { },

    memType = "",
    setMemType = () => { },

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
    if (!showFilterRentals) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <div className="d-flex flex-column">
                                <h5 className="modal-title mb-1 text-start">
                                    Filter Rentals
                                </h5>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowFilterRentals(false)}
                            />
                        </div>
                        <div className="modal-body text-start">

                            {/* Blocks */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Filter Rentals
                                </label>

                                <div className="row">
                                    {filterData?.blocks?.map((item, index) => (
                                        <div className="col-6 mb-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`block-${index}`}
                                                    defaultChecked={item.checked}
                                                />

                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`block-${index}`}
                                                >
                                                    {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Filter Rentals
                                </label>

                                {filterData?.verificationStatus?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center mb-2"
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`status-${index}`}
                                                defaultChecked={item.checked}
                                            />

                                            <label
                                                className="form-check-label"
                                                htmlFor={`status-${index}`}
                                            >
                                                {item.name}
                                            </label>
                                        </div>

                                        <span className="text-muted">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Agreement Status */}
                            <div>
                                <label className="form-label fw-semibold">
                                    Agreement Status
                                </label>

                                {/* <select className="form-select">
                                    {filterData?.agreementStatus?.map((item, index) => (
                                        <option key={index}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select> */}
                                <Select
                                    options={filterData?.agreementStatus || []}
                                    // value={agreementStatus}
                                    // onChange={(selected) => setAgreementStatus(selected)}
                                    placeholder="All Statuses"
                                    isClearable
                                />
                            </div>

                        </div>
                        <div className="modal-footer bg-light justify-content-between">
                            <button
                                type="button"
                                className="btn btn-ol btn-link text-secondary text-decoration-none"
                            >
                                Clear All
                            </button>
                            
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary px-4"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterRentalsModal;
