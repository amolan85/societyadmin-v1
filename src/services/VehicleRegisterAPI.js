import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";
import apiClient from "./apiClient";

// Create Vehicle
export const CreateVehicleApi = async (
    societyId, userId, flatId, vehicleNumber, vehicleType,
    vehicleModel, color, stickerId, rcDocument
) => {
    const url = UrlData + 'vehicle/CreateVehicle';

    const formData = new FormData();
    formData.append("society_id", societyId);
    formData.append("user_id", userId);
    formData.append("flat_id", flatId);
    formData.append("vehicle_number", vehicleNumber);
    formData.append("vehicle_type", vehicleType);
    formData.append("vehicle_model", vehicleModel || "");
    formData.append("color", color || "");
    formData.append("sticker_id", stickerId || "");
    if (rcDocument) formData.append("rc_document", rcDocument);

    return await apiClient({
        method: 'post',
        url,
        data: formData,
        timeout: 30000,
    })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

// List Vehicles
export const ListVehiclesApi = async ({
    societyId, currentPage = 1, pageSize = 10,
    search = "", vehicleType = "", flatId = null, userId = null
}) => {
    const url = UrlData + 'vehicle/ListVehicles';
    const payload = {
        society_id: societyId,
        page: currentPage,
        page_size: pageSize,
        search: search || "",
        vehicle_type: vehicleType || "",
        flat_id: flatId || null,
        user_id: userId || null,
    };
    return await apiClient({ method: 'post', url, data: payload, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

// Get Vehicle By ID
export const GetVehicleByIdApi = async (vehicleId) => {
    const url = UrlData + 'vehicle/GetVehicleById';
    return await apiClient({
        method: 'post', url,
        data: { vehicle_id: vehicleId },
        timeout: 30000
    })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

// Update Vehicle
export const UpdateVehicleApi = async (
    vehicleId, vehicleNumber, vehicleType,
    vehicleModel, color, stickerId, rcDocument
) => {
    const url = UrlData + 'vehicle/UpdateVehicle';

    const formData = new FormData();
    formData.append("vehicle_id", vehicleId);
    formData.append("vehicle_number", vehicleNumber);
    formData.append("vehicle_type", vehicleType);
    formData.append("vehicle_model", vehicleModel || "");
    formData.append("color", color || "");
    formData.append("sticker_id", stickerId || "");
    if (rcDocument) formData.append("rc_document", rcDocument);

    return await apiClient({ method: 'post', url, data: formData, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};

// Delete Vehicle
export const DeleteVehicleApi = async (vehicleId) => {
    const url = UrlData + 'vehicle/DeleteVehicle';
    return await apiClient({
        method: 'post', url,
        data: { vehicle_id: vehicleId },
        timeout: 30000
    })
        .then(res => res.data)
        .catch(error => { throw ErrorHandler(error); });
};
