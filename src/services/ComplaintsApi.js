import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get complaints
export const getComplaintsApi = async (societyId) => {
    const url = UrlData + 'complaint/GetAllComplaints';
    const data = {
        society_id: societyId,
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors all complaints");
        throw errors;
    });
}

export const createComplaintsApi = async (societyId, userId, category, unitId, title, description, unit, priority, file) => {
    const url = UrlData + 'complaint/CreateComplaint';
    const formData = new FormData();
    formData.append("society_id", societyId);
    formData.append("user_id", userId);
    formData.append("category_id", category);
    formData.append("flat_id", unitId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("file", file);

    return await apiClient({
        method: 'post',
        url: url,
        data: formData
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors complaints");
        throw errors;
    });
}

export const updateComplaintStatusApi = async (complaintId, status, comment) => {
    const url = UrlData + 'complaint/UpdateComplaintStatus';
    const data = {
        complaint_id: "2",
        status: status,
        comment: comment,
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors complaints status");
        throw errors;
    });
}

export const updateComplaintPriorityApi = async (complaintId, priority, comment) => {
    const url = UrlData + 'complaint/UpdateComplaintStatus';
    const data = {
        complaint_id: complaintId,
        priority: priority,
        comment: comment,
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors complaints status");
        throw errors;
    });
}


export const getFlatsAndCategoryApi = async (societyId) => {
    const url = UrlData + 'complaint/GetFlatsAndCategories';
    const data = {
        society_id: societyId,
    }
    return await apiClient({
        method: 'post',
        url: url,
        data: data
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors get flatd and category");
        throw errors;
    });
}