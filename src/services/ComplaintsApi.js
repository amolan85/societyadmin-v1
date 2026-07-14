import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get complaints
// api function for get complaints
export const getComplaintsApi = async ({
    societyId,
    status = "",
    priority = "",
    categoryId = null,
    flatId = null,
    assignedTo = null,
    search = "",
    dateFrom = "",
    dateTo = "",
    page = 1,
    pageSize = 10
}) => {
    const url = UrlData + 'complaint/GetAllComplaints';
    const data = {
        society_id: societyId,
        status: status,
        priority: priority,
        category_id: categoryId,
        flat_id: flatId,
        assigned_to: assignedTo,
        search: search,
        date_from: dateFrom,
        date_to: dateTo,
        page: page,
        page_size: pageSize
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
//api Get complaints by Id
export const GetComplaintByIdApi = async ({
    societyId,
    complaintId  
}) => {
    const url = UrlData + 'complaint/GetComplaintById';
    const data = {
        society_id: societyId,
        complaint_id: complaintId 
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

//create complaint api
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

//update complaint status api
export const updateComplaintStatusApi = async (complaintId,societyId, status, comment) => {
    const url = UrlData + 'complaint/UpdateComplaintStatus';
    const data = {
        complaint_id: complaintId,
        society_id: societyId,
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

//update complaint priority api
export const updateComplaintPriorityApi = async (complaintId,societyId, priority, comment) => {
    const url = UrlData + 'complaint/UpdateComplaintStatus';
    const data = {
        complaint_id: complaintId,
        society_id: societyId,
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


export const deleteComplaintApi = async (complaintId, societyId) =>{
    const url = UrlData + 'complaint/DeleteComplaint';
    const data = {
        complaint_id: complaintId,
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
//get flats and categories api
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

//api function for create complaint category
export const CreateComplaintCategoryApi = async (societyId, name, description) => {
    const url = UrlData + 'complaint/CreateComplaintCategory'; // ← confirm actual endpoint path

    const payload = {
        society_id: societyId,
        name: name,
        description: description,
    };

    return await apiClient({
        method: 'post',
        url: url,
        data: payload
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors create complaint category");
        throw errors;
    });
}

//api function for get complaint categories
export const GetComplaintCategoriesApi = async (societyId) => {
    const url = UrlData + 'complaint/GetComplaintCategories'; // ← confirm actual endpoint path

    const payload = {
        society_id: societyId,
    };

    return await apiClient({
        method: 'post',
        url: url,
        data: payload
    }).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
        const errors = ErrorHandler(error);
        console.log(errors, "Errors get complaint categories");
        throw errors;
    });
}