import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get all poll
// Get Poll List
export const getPollApi = async (
    societyId,
    userId,
    status = "",
    category = "",
    search = "",
    dateFrom = "",
    dateTo = "",
    pageNo = 1,
    pageSize = 10
) => {

    const url = UrlData + "poll/GetPollsDataAdmin";

    const data = {
        society_id: societyId,
        user_id: userId,
        status: status,
        category: category,
        search: search,
        date_from: dateFrom,
        date_to: dateTo,
        page_no: pageNo,
        page_size: pageSize
    };

    console.log("Request", data);

    return await apiClient({
        method: "post",
        url,
        data
    })
    .then((response) => response.data.data)
    .catch((error) => {
        throw ErrorHandler(error);
    });
};

//api for create poll
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

//get poll overview api
export const getPollOverviewApi = async (societyId) => {
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

export const getPollByIdApi = async (societyId, pollId) => {
    const url = UrlData + 'poll/GetPollById';
    const data = {
         society_id : societyId,
        poll_id: pollId,
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
        console.log(errors, "Errors get polls by id");
        throw errors;
    });
}

//api for create poll
export const UpdatePollApi = async (
    pollId,societyId, userId, title, description, options, startDate, endDate
) => {
    try {
        const url = UrlData + "poll/UpdatePoll";
        const data = {
            poll_id: pollId,
            society_id:societyId,
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
        console.log("Polls updated successfully!")
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors update poll");

        throw errors;
    }
};

export const deletePollApi = async ( pollId,societyId) => {
    const url = UrlData + 'poll/DeletePoll';
    const data = {
       
        poll_id: pollId,
        society_id:societyId,
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
        console.log(errors, "Errors delete poll");
        throw errors;
    });
}


