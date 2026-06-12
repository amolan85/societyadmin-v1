import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for get violation alerts
export const violationAlertsApi = async (societyId, page, limit, search) => {
    const url = UrlData + 'parking_violation/ListViolationAlerts';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit,
         status: null,
        violation_type: null,
        search: search,
        date_from: null,
        date_to: null,
        slot_id: null,
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

//get violation alerts by id
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

//api function for resolve violation
export const resolveViolationApi = async (societyId, violationId, status, resolved_by, resolution_remarks) => {
    const url = UrlData + 'parking_violation/UpdateViolationAlert';
    const data = {
        society_id: societyId,
        violation_id: violationId,
        status: status,
        resolved_by: resolved_by,
        resolution_remarks: resolution_remarks
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
        console.log(errors, "Errors get resolveviolation alerts by id");
        throw errors;
    });
}

//api function for delete violation alerts
export const deleteViolationAlertsApi = async (societyId, violationId) => {
    const url = UrlData + 'parking_violation/DeleteViolationAlert';
    const data = {
        society_id: societyId,
        violation_id: violationId
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
        console.log(errors, "Errors delete violation alerts");
        throw errors;
    });
}
// api function for create violation alert
export const createViolationAlertApi = async (
    societyId,
    userId,         // reported_by
    slotId,
    vehicleNumber,
    violationType,  // violation_type — e.g. "unauthorized_parking"
    description,
    photoUrl,
    penaltyAmount
) => {
    const url = UrlData + "parking_violation/CreateViolationAlert";

    const data = {
        society_id: societyId,
        reported_by: userId,        // ✅ was missing — caused "reported_by is required" error
        slot_id: slotId,
        vehicle_number: vehicleNumber,
        violation_type: violationType, // ✅ now correctly mapped from violationType param
        description: description,
        photo_url: photoUrl,
        penalty_amount: penaltyAmount,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
        timeout: 30000,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors create violation alert");
            throw errors;
        });
};
// api function for get violation alert by id
export const getViolationAlertByIdApi = async (
    societyId,
    violationId
) => {
    const url = UrlData + "parking_violation/GetViolationAlert";

    const data = {
        society_id: societyId,
        violation_id: violationId,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
        timeout: 30000,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors get violation alert");
            throw errors;
        });
};