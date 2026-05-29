// UploadModal.jsx

const UploadModal = ({
    showUpload,
    setShowUpload,

    resetForm = () => { },
    // rentAgreement = null,
    setRentAgreement = () => { },

    // policeNoc = null,
    setPoliceNoc = () => { },

    errors = {},
    errorText = "",
    handleSubmit = () => { },
}) => {
    if (!showUpload) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title">
                                Upload document
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowUpload(false)}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Rent Agreement{" "}
                                                    <span className="text-danger">*</span>
                                                </label>
                                                {errors.rentAgreement && (
                                                    <span className="text-danger mx-2">
                                                        {errors.rentAgreement}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.rentAgreement ? "error-input" : ""}`}
                                                type="file"
                                                onChange={(e) =>
                                                    setRentAgreement(e.target.files[0])
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <div className="d-flex">
                                                <label className="sv-lb">
                                                    Police Noc <span className="text-danger">*</span>
                                                </label>
                                                {errors.policeNoc && (
                                                    <span className="text-danger mx-2">
                                                        {errors.policeNoc}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                className={`sv-in ${errors.policeNoc ? "error-input" : ""}`}
                                                type="file"
                                                onChange={(e) => setPoliceNoc(e.target.files[0])}
                                            />
                                        </div>
                                    </div>

                                    {errorText && <h6 className="text-danger">{errorText}</h6>}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button
                                type="button"
                                className="btn btn-outline-secondary" onClick={() => {
                                    setShowUpload(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button className="btn-ac px-4" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadModal;
