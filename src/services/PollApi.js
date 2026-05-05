import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get broadcast
export const getPollApi = async (societyId, userId) => {
    const url = UrlData + 'poll/GetPollsDataAdmin';
    const data = {
        society_id: societyId,
        user_id: userId
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
export const CreatePollApi = async (
    societyId, userId, title, description, options, startDate, endDate
) => {
    try {
        const url = UrlData + "poll/CreatePoll";
        const data = {
            society_id: societyId,
            user_id: userId,
            question: title,
            options: options,
            start_datetime: startDate,
            end_datetime: endDate
        };

        const response = await apiClient({
            method: "post",
            url: url,
            data: data,
        });
        console.log("Polls created successfully!")
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors create poll");

        throw errors;
    }
};

export const getPollOverviewApi = async (societyId, userId) => {
    const url = UrlData + 'poll/GetPollAnalytics';
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
        console.log(errors, "Errors get overview");
        throw errors;
    });
}
