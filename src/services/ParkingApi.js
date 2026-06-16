import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get members
export const parkingDashboardApi = async (societyId) => {
    const url = UrlData + 'parking_dashboard/ParkingDashboard';
    const data = {
        society_id: societyId,
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data,
        timeout: 30000,
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors get parking");
        throw errors;
    });
}

// export const ListParkingSlotsApi = async (societyId) => {
//     const url = UrlData + 'parking_slot/ListParkingSlots';
//     return await apiClient({
//         method: 'post',
//         url,
//         data: {
//             society_id: societyId,
//             page: 1,
//             limit: 100,
//             search: "",
//             slot_status: "available",  // only available slots
//             parking_type: "",
//             vehicle_type: "",
//             block: "",
//             floor: "",
//             zone: "",
//             is_ev_ready: false
//         },
//         timeout: 30000
//     })
//     .then(res => res.data.data)
//     .catch(error => { throw ErrorHandler(error); });
// };

export const ListParkingSlotsApi = async (societyId, page, limit) => {
    const url = UrlData + 'parking_slot/ListParkingSlots';

    return await apiClient({
        method: 'post',
        url,
        data: {
 
            society_id: societyId,   // ✅ societyId is now a plain string
            page: 1,
            limit: 100,
            search: "",
            slot_status: "",          // ✅ empty = all slots (available + occupied)
            parking_type: "",
            vehicle_type: "",
            block: "",
            floor: "",
            zone: "",
            society_id: societyId,
            page: page,
            limit: limit,
            search: "",
            slot_status: "",  // ← all slots
            parking_type: "", vehicle_type: "",
            block: "", floor: "", zone: "",
 
            is_ev_ready: false
        },
        timeout: 30000
    })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

 
export const CreateParkingSlotApi = async (societyId, slotNumber, block, floor, zone, parkingType, vehicleType, slotStatus, length, width, isEvReady, accessLevel) => {
    const url = UrlData + 'parking_slot/CreateParkingSlot';
    return await apiClient({
        method: 'post', url,
        data: {
            society_id: societyId,
            slot_number: slotNumber,
            block: block,
            floor: floor,
            zone: zone,
            parking_type: parkingType,
            vehicle_type: vehicleType,
            slot_status: slotStatus || "available",
            length: length || null,
            width: width || null,
            is_ev_ready: isEvReady || false,
            access_level: accessLevel || "resident_only"
        },
        timeout: 30000
    })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

export const UpdateParkingSlotApi = async (slotId, zone, floor, isEvReady, slotStatus, updatedBy) => {
    const url = UrlData + 'parking_slot/UpdateParkingSlot';
    return await apiClient({
        method: 'post', url,
        data: {
            slot_id: slotId,
            zone: zone,
            floor: floor,
            is_ev_ready: isEvReady || false,
            slot_status: slotStatus,
            updated_by: updatedBy
        },
        timeout: 30000
    })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};
export const GetParkingSlotApi = async (slotId) => {
    const url = UrlData + 'parking_slot/GetParkingSlot';
    return await apiClient({
        method: 'post', url,
        data: { slot_id: slotId },
        timeout: 30000
    })
        .then(res => res.data)
        .catch(error => { throw ErrorHandler(error); });
};
export const DeallocateParkingSlotApi = async (allocationId) => {
    const url = UrlData + 'parking_slot/DeallocateParkingSlot';

    return await apiClient({
        method: 'post',
        url,
        data: {
            allocation_id: allocationId
        },
        timeout: 30000
    })
        .then(res => res.data.data)
        .catch(error => {
            console.log(error);
            const errors = ErrorHandler(error);
            throw errors;
        });
};
 
