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

export const visitorParkingApi = async (societyId, page, limit) => {
    const url = UrlData + 'visitor_parking/ListVisitorParking';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit,
        status: "",
        search: "",
        visitor_entry_id: "",
        date_from: "",
        date_to: ""

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
        console.log(errors, "Errors get visitor parking");
        throw errors;
    });
}

export const violationAlertsApi = async (societyId, page, limit) => {
    const url = UrlData + 'parking_violation/ListViolationAlerts';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit, status: "",
        violation_type: "",
        search: "",
        date_from: "",
        date_to: "",
        slot_id: "",
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
        console.log(errors, "Errors get violation alerts");
        throw errors;
    });
}

