// FilterAttendanceModal.jsx

const FilterAttendanceModal = ({
    showFilterAttendance,
    setShowFilterAttendance,
    filterData = [],
   
}) => {
    if (!showFilterAttendance) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>

            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <div className="d-flex flex-column">
                                <h5 className="modal-title mb-1 text-start">
                                    Filter Attendance
                                </h5>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowFilterAttendance(false)}
                            />
                        </div>
                        <div className="modal-body text-start">

                            {/* Date Range */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold small">
                                    Date Range
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={filterData.date}
                                    readOnly
                                />
                            </div>

                            {/* Status */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold small">
                                    Status
                                </label>

                                <div className="row">
                                    {filterData.status.map((item, index) => (
                                        <div className="col-6 mb-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`status-${index}`}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`status-${index}`}
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Department */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold small">
                                    Role / Department
                                </label>

                                <div className="row">
                                    {filterData.departments.map((item, index) => (
                                        <div className="col-6 mb-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`dept-${index}`}
                                                    defaultChecked
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`dept-${index}`}
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shift Type */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">
                                    Shift Type
                                </label>

                                <select className="form-select">
                                    <option value="">All Shifts</option>

                                    {filterData.shiftTypes.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Check In Method */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold small">
                                    Check In Method
                                </label>

                                <div className="row">
                                    {filterData.checkInMethods.map((item, index) => (
                                        <div className="col-6 mb-2" key={index}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`method-${index}`}
                                                    defaultChecked
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`method-${index}`}
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer bg-light justify-content-between">
                            <button
                                type="button"
                                className="btn btn-ol btn-link text-secondary text-decoration-none"
                            >
                                Reset Filters
                            </button>

                            <button
                                type="button"
                                className="btn btn-ac btn-primary px-4"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterAttendanceModal;
