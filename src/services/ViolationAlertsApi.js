import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for get violation alerts
export const violationAlertsApi = async (societyId, page, limit, search, status, dateFrom, dateTo) => {
    const url = UrlData + 'parking_violation/ListViolationAlerts';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit,
        status: status || null,
        violation_type: null,
        search: search || null,
        date_from: dateFrom || null,
        date_to: dateTo || null,
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

//api function for resolve violation
export const resolveViolationApi = async (societyId, violationId, status, resolved_by, resolution_remarks) => {
    const url = UrlData + 'parking_violation/UpdateViolationAlert';
    const data = {
        society_id: societyId,
        violation_id: violationId,
        status: status,
        resolved_by: resolved_by,
        resolution_remarks: resolution_remarks,
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
// Params: societyId, userId, slotId, vehicleNumber, violationType, description, penaltyAmount, uploadPhoto
export const createViolationAlertApi = async (
    societyId,
    userId,
    slotId,
    vehicleNumber,
    violationType,
    description,
    penaltyAmount,
    uploadPhoto
) => {
    const url = UrlData + "parking_violation/CreateViolationAlert";

    const formData = new FormData();
    formData.append("society_id", societyId);
    formData.append("reported_by", userId);
    formData.append("slot_id", slotId?.value ?? slotId);                     // handle both object and raw value
    formData.append("vehicle_number", vehicleNumber);
    formData.append("violation_type", violationType?.value ?? violationType); // handle both object and raw value
    formData.append("description", description || "");
    formData.append("penalty_amount", penaltyAmount || "");

    if (uploadPhoto) {
        formData.append("photo", uploadPhoto);
    }

    return await apiClient({
        method: "post",
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        throw errors;
    });
};

// api function for get violation alert by id
export const getViolationAlertByIdApi = async (societyId, violationId) => {
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
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors get violation alert");
        throw errors;
    });
};

// api function for update violation alert
// Params: societyId, violationId, slotId, vehicleNumber, violationType, description,
//         penaltyAmount, vehicleType, status, uploadPhoto, resolutionRemarks, resolvedAt, resolvedBy
export const updateViolationAlertApi = async (
    societyId,
    violationId,
    slotId,
    vehicleNumber,
    violationType,
    description,
    penaltyAmount,
    vehicleType,
    status,
    uploadPhoto,
    resolutionRemarks,
    resolvedAt,
    resolvedBy
) => {
    const url = UrlData + "parking_violation/UpdateViolationAlert";

    const formData = new FormData();
    formData.append("society_id", societyId);
    formData.append("violation_id", violationId);
    formData.append("slot_id", slotId?.value ?? slotId ?? "");
    formData.append("vehicle_number", vehicleNumber || "");
    formData.append("violation_type", violationType?.value ?? violationType ?? "");
    formData.append("description", description || "");
    formData.append("penalty_amount", penaltyAmount || "");
    formData.append("vehicle_type", vehicleType?.value ?? vehicleType ?? "");
    formData.append("status", status?.value ?? status ?? "");
    formData.append("resolution_remarks", resolutionRemarks || "");
    formData.append("resolved_at", resolvedAt || "");
    formData.append("resolved_by", resolvedBy || "");

    if (uploadPhoto) {
        formData.append("photo", uploadPhoto);
    }

    return await apiClient({
        method: "post",
        url: url,
        data: formData,
        timeout: 30000,
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        throw errors;
    });
};

// api function for delete violation alert
export const deleteViolationAlertApi = async (violationId) => {
    const url = UrlData + "parking_violation/DeleteViolationAlert";
    const data = { violation_id: violationId };
    return await apiClient({
        method: "post",
        url: url,
        data: data,
        timeout: 30000,
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors delete violation alert");
        throw errors;
    });
};