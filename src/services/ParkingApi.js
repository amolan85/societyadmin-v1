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

export const ListParkingSlotsApi = async (societyId) => {
    const url = UrlData + 'parking_slot/ListParkingSlots';
    return await apiClient({
        method: 'post',
        url,
        data: {
            society_id: societyId,
            page: 1,
            limit: 100,
            search: "",
            slot_status: "available",  // only available slots
            parking_type: "",
            vehicle_type: "",
            block: "",
            floor: "",
            zone: "",
            is_ev_ready: false
        },
        timeout: 30000
    })
    .then(res => res.data.data)
    .catch(error => { throw ErrorHandler(error); });
};
