import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get broadcast
export const getBroadcastApi = async () => {
    const url = UrlData + 'visitor/GetMonthlyVisitorSummary';
    const data = {
        society_id: "1",
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
    societyId, subject, content, channel
) => {
    try {
        const url = UrlData + "broadcast/CreateBroadcast";
        const data = {
            society_id: societyId,
            title: subject,
            message: content,
            channel: channel,
        };

        const response = await apiClient({
            method: "post",
            url: url,
            data: data,
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors create broadcast");

        throw errors;
    }
};
