import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";
import apiClient from "./apiClient";

//api function for get visitor parking
export const visitorParkingApi = async (societyId, page, limit, search, status) => {
    const url = UrlData + 'visitor_parking/ListVisitorParking';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit,
        search: search || "",
        status: status || "",
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
export const getVisitorParkingByIdApi = async (societyId, visitorParkingId) => {
    const url = UrlData + 'visitor_parking/GetVisitorParking';
    const data = {
        society_id: societyId,
        visitor_parking_id: visitorParkingId
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data,
        timeout: 30000,
    }).then((response) => {
        return response.data.data;

    }).catch((error) => {
        const errors = ErrorHandler(error);
        throw errors;
    });
}

export const deleteVisitorParkingApi = async (societyId, visitorParkingId) => {
    const url = UrlData + 'visitor_parking/DeleteVisitorParking';
    const data = {
        society_id: societyId,
        visitor_parking_id: visitorParkingId,

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
        console.log(errors, "Errors delete visitor parking");
        throw errors;
    });
}

export const releaseVisitorParkingApi = async (societyId, visitorParkingId) => {
    const url = UrlData + 'visitor_parking/ReleaseVisitorParking';
    return await apiClient({
        method: 'post',
        url: url,
        data: { visitor_parking_id: visitorParkingId, society_id: societyId },
        timeout: 30000,
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        const errors = ErrorHandler(error);
        throw errors;
    });
}

export const AllotVisitorParkingApi = async (payload) => {
    const url = UrlData + 'visitor_parking/AllotVisitorParking';

    return await apiClient({
        method: 'post',
        url: url,
        data: payload,
        timeout: 30000,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors allot visitor parking");
            throw errors;
        });
};