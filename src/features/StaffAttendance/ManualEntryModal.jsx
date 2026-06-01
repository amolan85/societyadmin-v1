// MemberModal.jsx
import Select from "react-select";

const ManualEntryModal = ({
    show,
    setShow,

    allStaffData = [],
    recordType = [],

    selectedStaff = null,
    setSelectedStaff = () => { },

    recordTypeTab = "",
    setRecordTypeTab = () => { },

    resetForm = () => { },

    attendanceDate = "",
    setAttendanceDate = () => { },

    attendanceTime = "",
    setAttendanceTime = () => { },

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
                            <h5 className="modal-title">
                                Manual Entry
                            </h5>

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
                                                    Staff Member <span className="text-danger">*</span>
                                                </label>
                                                {errors.selectedStaff && (
                                                    <span className="text-danger mx-2 ">
                                                        {errors.selectedStaff}
                                                    </span>
                                                )}
                                            </div>
                                            <Select
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderColor: errors.selectedStaff
                                                            ? "red"
                                                            : baseStyles.borderColor,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: errors.selectedStaff
                                                                ? "red"
                                                                : baseStyles.borderColor,
                                                        },
                                                    }),
                                                }}
                                                options={allStaffData}
                                                value={selectedStaff}
                                                onChange={(selectedOption) => setSelectedStaff(selectedOption)}
                                            />
                                        </div>

                                    </div>

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
                                                        {errors.attendanceDate && (
                                                            <span className="text-danger mx-2">
                                                                {errors.attendanceDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.attendanceDate ? "error-input" : ""}`}
                                                        type="date"
                                                        value={attendanceDate}
                                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <div className="d-flex">
                                                        <label className="sv-lb">
                                                             Time{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        {errors.attendanceTime && (
                                                            <span className="text-danger mx-2">
                                                                {errors.attendanceTime}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        className={`sv-in ${errors.attendanceTime ? "error-input" : ""}`}
                                                        type="time"
                                                        value={attendanceTime}
                                                        onChange={(e) => setAttendanceTime(e.target.value)}
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
                                                    <textarea className="form-control" rows={3} placeholder="Eg. Forgot ID Card, Biometric machiner Error, System override"/>
                                                </div> 
                                            </div>
                                        </>
                                
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
                                Save Record
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManualEntryModal;
