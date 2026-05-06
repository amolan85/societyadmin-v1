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

//api for create broadcast
export const CreateBroadcastApi = async (
    societyId, subject, content, channel, status, type, attachment, scheduleDateTime
) => {
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


export const getBroadcastByIdApi = async (broadcastId) => {
    const url = UrlData + 'broadcast/GetBroadcastById';
    const data = {
        broadcast_id: broadcastId,
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

export const UpdateBroadcastApi = async (
    broadcastId, subject, content, channel, status, type, attachment, scheduleDateTime
) => {
    try {
        const url = UrlData + "broadcast/UpdateBroadcast";
        const formData = new FormData();
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
