import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for get violation alerts
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

export const getViolationAlertsByIdApi = async (societyId, violationId) => {
    const url = UrlData + 'parking_violation/GetViolationAlert';
    const data = {
        society_id: societyId,
       violation_id: violationId,
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
        console.log(errors, "Errors get violation alerts by id");
        throw errors;
    });
}
