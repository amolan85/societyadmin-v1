import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get noticeboard
export const getNoticeBoardApi = async (societyId) => {
    const url = UrlData + 'notice/GetAllNotices';
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
        console.log(errors, "Errors get NoticeBoard");
        throw errors;
    });
}

//create notice board api
export const createNoticeApi = async (societyId, userId, title, description, noticeType, priority, status) => {
    const url = UrlData + 'notice/CreateNotice';
    const data = {
        society_id: societyId,
        created_by: userId,
        title: title,
        description: description,
        notice_type: noticeType,
        priority: priority,
        status: status,
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
        console.log(errors, "Errors create NoticeBoard");
        throw errors;
    });
}

//get notice board by id api
export const getNoticeBoardByIdApi = async (noticeId) => {
    const url = UrlData + 'notice/GetNoticebyId';
    const data = {
        notice_id: noticeId,
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
        console.log(errors, "Errors get NoticeBoard by id");
        throw errors;
    });
}

//update notice api
export const updateNoticeApi = async (noticeId, title, description, noticeType, priority, status) => {
    const url = UrlData + 'notice/UpdateNotice';
    const data = {
        notice_id: noticeId,
        title: title,
        description: description,
        notice_type: noticeType,
        priority: priority,
        status: status,
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
        console.log(errors, "Errors update NoticeBoard");
        throw errors;
    });
}

export const deleteNoticeApi = async (noticeId,societyId) => {
    const url = UrlData + 'notice/DeleteNotice';
    const data = {
        notice_id: noticeId,
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
        console.log(errors, "Errors delete notice");
        throw errors;
    });
}

