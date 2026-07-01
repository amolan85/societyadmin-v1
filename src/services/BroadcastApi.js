import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


    //api function for get broadcast
    export const getBroadcastApi = async (societyId) => {
        const url = UrlData + 'broadcast/GetBroadcasts';
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
            console.log(errors, "Errors get broadcast");
            throw errors;
        });
    }
//api function for get broadcast list
export const getBroadcastListApi = async (data) => {
    const url = UrlData + 'broadcast/broadcast_list';

    const isValidDate = (date) => {
        return date && !isNaN(new Date(date).getTime());
    };
    const payload = {
        society_id: data.society_id,
        page: data.currentPage,
        limit: data.limit,
        search: data.currentSearch,
        type: data.currentType,
        status: data.currentStatus,
        start_date: isValidDate(data.currentStartDate)
            ? data.currentStartDate
            : null,

        end_date: isValidDate(data.currentEndDate)
            ? data.currentEndDate
            : null,
        get_all: data.getAll || false, // ← was hardcoded to false before
    }
    console.log("data")
    console.log(payload)

    return await apiClient({
        method: 'post',
        url: url,
        data: payload
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors get broadcast list");
        throw errors;
    });
}

//api for create broadcast
export const CreateBroadcastApi = async (societyId, subject, content, channel, status, type, attachment, scheduleDateTime) => {
    try {
        const url = UrlData + "broadcast/CreateBroadcast";
        const formData = new FormData();
        formData.append("society_id", societyId);
        formData.append("title", subject);
        formData.append("message", content);
        formData.append("channel", channel);
        formData.append("status", status);
        formData.append("type", type);
        formData.append("file", attachment);
        formData.append("scheduled_at", "2026-05-10 10:00:00")

        const response = await apiClient({
            method: "post",
            url: url,
            data: formData,
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors create broadcast");

        throw errors;
    }
};



//get broadcast by id api
export const getBroadcastByIdApi = async (broadcastId, societyId) => {
    const url = UrlData + 'broadcast/GetBroadcastById';
    const data = {
        broadcast_id: broadcastId,
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
        console.log(errors, "Errors get broadcast by id");
        throw errors;
    });
}

//update broadcast api
export const UpdateBroadcastApi = async (
    societyId,
    broadcastId,
    subject,
    content,
    channel,
    status,
    type,
    attachment,
    scheduleDateTime
) => {
    try {
        const url = UrlData + "broadcast/UpdateBroadcast";
        const formData = new FormData();
        formData.append("society_id", societyId);
        formData.append("broadcast_id", broadcastId);
        formData.append("title", subject);
        formData.append("message", content);
        formData.append("channel", channel);
        formData.append("status", status);
        formData.append("type", type);
        formData.append("file", attachment);
        formData.append("scheduled_at", scheduleDateTime)

        const response = await apiClient({
            method: "post",
            url: url,
            data: formData,
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors update broadcast");

        throw errors;
    }
};

export const deleteBroadcastApi = async (broadcastId,societyId) => {
    const url = UrlData + 'broadcast/DeleteBroadcast';
    const data = {
        broadcast_id: broadcastId,
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
        console.log(errors, "Errors delete broadcast");
        throw errors;
    });
}

