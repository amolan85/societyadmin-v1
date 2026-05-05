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
    societyId, subject, content, channel, status, type, attachment,scheduleDateTime 
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
        console.log(errors, "Errors create broadcast");

        throw errors;
    }
};
