import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AllocateParkingSlotApi, ListParkingSlotsApi } from "../../services/ParkingApi";
import AllotVisitorParkingModal from "./AllotVisitorParkingModal";

const AllocateResidentParkingModal = ({ show, onClose, vehicle, societyId, userId, onSuccess }) => {

    const [slots, setSlots] = useState([]);
    const [slotId, setSlotId] = useState(null);  
    const [remarks, setRemarks] = useState("");
    const [setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    /* fetch available slots when modal opens */
    useEffect(() => {
        if (!show || !societyId) return;
        (async () => {
            try {
                const res = await ListParkingSlotsApi(societyId, 1, 100, "", "available");
                const options = (res?.data?.slots || res?.slots || []).map(s => ({
                    value: s.id,
                    label: `${s.slot_number}${s.zone ? " — " + s.zone : ""}${s.floor ? " — Floor " + s.floor : ""}`,
                }))
                setSlots(options);
            } catch {
                toast.error("Failed to load parking slots");
            }
        })();
    }, [show, societyId]);

    const resetLocal = () => {
        setSlotId(null);
        setRemarks("");
        setErrors({});
        setSlots([]);
    };

    const handleClose = () => {
        resetLocal();
        onClose();
    };

    const handleSubmit = async () => {
        const errs = {};
        if (!slotId) errs.flat = "required";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        console.log("Submitting:", {   // ← ye dekho
            societyId,
            slotId: slotId.value,
            flat_id: vehicle?.flat_id,
            user_id: vehicle?.user_id  || userId,
            allocated_by: userId,
            remarks,
        });
        setLoading(true);
        try {
            await AllocateParkingSlotApi(
                societyId,
                slotId.value,
                vehicle?.flat_id,
                vehicle?.user_id || userId,
                userId,
                remarks
            );
            toast.success("Parking slot allocated successfully!");
            handleClose();
            onSuccess?.();
        } catch (e) {
            toast.error(e?.message || "Allocation failed");
        } finally {
            setLoading(false);
        }
    };

    // vehicle_type label for display
    const vehicleTypeOption = vehicle?.vehicle_type === "2_wheeler"
        ? { value: "2_wheeler", label: "2 Wheeler" }
        : vehicle?.vehicle_type === "4_wheeler"
            ? { value: "4_wheeler", label: "4 Wheeler" }
            : vehicle?.vehicle_type
                ? { value: vehicle.vehicle_type, label: vehicle.vehicle_type }
                : null;

    return (
        <AllotVisitorParkingModal
            show={show}
            setShow={(val) => { if (!val) handleClose(); }}
            mode="add"

            /* slot dropdown */
            allFlats={slots}
            flat={slotId}
            setFlat={setSlotId}

            /* vehicle no — pre-filled, read-only via firstName field */
            firstName={vehicle?.vehicle_number || ""}
            setFirstName={() => { }}   // read-only

            /* vehicle type — pre-filled via memType */
            memType={vehicleTypeOption}
            setMemType={() => { }}     // read-only

            /* remarks */
            remarks={remarks}
            setRemarks={setRemarks}

            /* validation errors */
            errors={errors}
            errorText=""

            /* actions */
            handleSubmit={handleSubmit}
            resetForm={handleClose}

            /* unused props — pass empty defaults */
            allBlocks={[]}
            blocks={null}
            setBlocks={() => { }}
            addMemberType={[]}
            handleBlockChange={() => { }}
        />
    );
};

export default AllocateResidentParkingModal;
