import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for list occupancy requests
export const ListOccupancyRequestsApi = async (societyId, status, page, pageSize) => {
    const url = UrlData + 'flat/ListOccupancyRequests';
    const data = {
        status: status,
        flat_id: null,
        occupancy_type: "",
        page: page,
        page_size: pageSize,
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
        console.log(errors, "Errors list occupancy requests");
        throw errors;
    });
}

//api function for approve/reject flat occupancy
export const ApproveFlatOccupancyApi = async (occupantId, status, societyId, rejectionReason) => {
    const url = UrlData + 'flat/ApproveFlatOccupancy';
    const data = {
        occupant_id: occupantId,
        status: status,
        rejection_reason: rejectionReason || "",
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
        console.log(errors, "Errors approve flat occupancy");
        throw errors;
    });
}