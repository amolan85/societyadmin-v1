const ParkingSlotModal = ({
    show,
    isEdit,
    onClose,
    onSubmit,
    slotNo, setSlotNo,
    block, setBlock,
    floor, setFloor,
    zone, setZone,
    parkingType, setParkingType,
    vehicleSuitability, setVehicleSuitability,
    allocationStatus, setAllocationStatus,
    accessLevel, setAccessLevel,
    length, setLength,
    width, setWidth,
    isEvReady, setIsEvReady,
    errors,
    errorText,
}) => {
    if (!show) return null;

    const parkingTypeList = [
        { id: "Resident", value: "resident" },
        { id: "Visitor", value: "visitor" },
    ];

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal show d-block">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h1 className="modal-title fs-5">{isEdit ? "Edit Parking Slot" : "Add Parking Slot"}</h1>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="pg d-flex justify-content-center am-wrap">
                                <div className="text-start am-card">
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className='d-flex'>
                                                <label className="sv-lb">Slot Number <span className="text-danger">*</span></label>
                                                {errors.slotNo && !isEdit && <span className='text-danger mx-2'>{errors.slotNo}</span>}
                                            </div>
                                            <input className={`sv-in ${errors.slotNo && !isEdit ? "error-input" : ""}`}
                                                placeholder="Eg. A-110" value={slotNo}
                                                onChange={(e) => setSlotNo(e.target.value)}
                                                disabled={isEdit}
                                                style={isEdit ? { background: "#f8fafc", color: "#aaa" } : {}} />
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex'>
                                                <label className="sv-lb">Block <span className="text-danger">*</span></label>
                                                {errors.block && !isEdit && <span className='text-danger mx-2'>{errors.block}</span>}
                                            </div>
                                            <input className={`sv-in ${errors.block && !isEdit ? "error-input" : ""}`}
                                                placeholder="Eg. A" value={block}
                                                onChange={(e) => setBlock(e.target.value)}
                                                disabled={isEdit}
                                                style={isEdit ? { background: "#f8fafc", color: "#aaa" } : {}} />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <div className='d-flex'>
                                                <label className="sv-lb">Floor <span className="text-danger">*</span></label>
                                                {errors.floor && <span className='text-danger mx-2'>{errors.floor}</span>}
                                            </div>
                                            <input className={`sv-in ${errors.floor ? "error-input" : ""}`}
                                                placeholder="Eg. Ground" value={floor}
                                                onChange={(e) => setFloor(e.target.value)} />
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex'>
                                                <label className="sv-lb">Zone <span className="text-danger">*</span></label>
                                                {errors.zone && <span className='text-danger mx-2'>{errors.zone}</span>}
                                            </div>
                                            <input className={`sv-in ${errors.zone ? "error-input" : ""}`}
                                                placeholder="Eg. Basement 1" value={zone}
                                                onChange={(e) => setZone(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="d-flex mb-1">
                                        <label className="sv-lb">Parking Type <span className="text-danger">*</span></label>
                                        {errors.parkingType && !isEdit && <span className='text-danger mx-2'>{errors.parkingType}</span>}
                                    </div>
                                    <div className="ps-type-wrap mb-3">
                                        {parkingTypeList.map((t) => (
                                            <button type="button" key={t.value}
                                                onClick={() => !isEdit && setParkingType(t.value)}
                                                className={`ps-type-btn ${parkingType === t.value ? "active" : ""} ${errors.parkingType && !isEdit ? "error-btn" : ""}`}
                                                style={isEdit ? { opacity: 0.6, cursor: "not-allowed" } : {}}>
                                                {t.id}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="d-flex mb-1">
                                        <label className="sv-lb">Vehicle Suitability <span className="text-danger">*</span></label>
                                        {errors.vehicleSuitability && !isEdit && <span className='text-danger mx-2'>{errors.vehicleSuitability}</span>}
                                    </div>
                                    <div className="ps-type-wrap mb-3">
                                        {[{ id: "4 Wheeler", value: "4_wheeler" }, { id: "2 Wheeler", value: "2_wheeler" }].map((t) => (
                                            <button type="button" key={t.value}
                                                onClick={() => !isEdit && setVehicleSuitability(t.value)}
                                                className={`ps-type-btn ${vehicleSuitability === t.value ? "active" : ""} ${errors.vehicleSuitability && !isEdit ? "error-btn" : ""}`}
                                                style={isEdit ? { opacity: 0.6, cursor: "not-allowed" } : {}}>
                                                {t.id}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="sv-lb">Slot Status <span className="text-danger">*</span></label>
                                            <select className={`form-select ${errors.allocationStatus ? "error-input" : ""}`}
                                                value={allocationStatus} onChange={(e) => setAllocationStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="available">Available</option>
                                                <option value="allocated">Allocated</option>
                                                <option value="reserved">Reserved</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="sv-lb">Access Level</label>
                                            <select className="form-select" value={accessLevel}
                                                onChange={(e) => setAccessLevel(e.target.value)}
                                                disabled={isEdit}
                                                style={isEdit ? { background: "#f8fafc", color: "#aaa" } : {}}>
                                                <option value="resident_only">Resident Only</option>
                                                <option value="public">Public</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="sv-lb">Length (m)</label>
                                            <input className="sv-in" placeholder="Eg. 5.5" value={length}
                                                onChange={(e) => setLength(e.target.value)}
                                                disabled={isEdit}
                                                style={isEdit ? { background: "#f8fafc", color: "#aaa" } : {}} />
                                        </div>
                                        <div className="col-6">
                                            <label className="sv-lb">Width (m)</label>
                                            <input className="sv-in" placeholder="Eg. 2.5" value={width}
                                                onChange={(e) => setWidth(e.target.value)}
                                                disabled={isEdit}
                                                style={isEdit ? { background: "#f8fafc", color: "#aaa" } : {}} />
                                        </div>
                                    </div>

                                    <div className="d-flex mb-1">
                                        <label className="sv-lb">EV Ready</label>
                                    </div>
                                    <div className="ps-type-wrap mb-3">
                                        {[{ id: "Yes", value: true }, { id: "No", value: false }].map((t) => (
                                            <button type="button" key={String(t.value)}
                                                onClick={() => setIsEvReady(t.value)}
                                                className={`ps-type-btn ${isEvReady === t.value ? "active" : ""}`}>
                                                {t.id}
                                            </button>
                                        ))}
                                    </div>

                                    {errorText && <h6 className='text-danger'>{errorText}</h6>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
                            <div className="d-flex gap-2 justify-content-end">
                                <button className="btn-ol btn" onClick={onClose}>Cancel</button>
                                <button className="btn-ac px-4" onClick={onSubmit}>{isEdit ? "Update Slot" : "Add Slot"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParkingSlotModal;