import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for get staff attendance
export const getStaffAttendanceApi = async (societyId, page, limit, date, search, status, dateFrom, dateTo) => {
    const url = UrlData + 'staff/GetAllStaffAttendance';
    const data = {
        society_id: societyId,
        page: page,
        per_page: limit,
        date: date,
        search: search || null,
        status: status || null,
        date_from: dateFrom || null,
        date_to: dateTo || null,
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
        console.log(errors, "Errors from staff attendance");
        throw errors;
    });
}


export const GetAllStaffApi = async (societyId, search, role, isactive) => {
    const url = UrlData + 'staff/GetAllStaff';
    const data = {
        society_id: societyId,
        search: search || null,
        role: role || null,
        is_active: true, 
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
        console.log(errors, "Errors from staff attendance");
        throw errors;
    });
}
//create staff api
export const createStaffApi = async (societyId, firstName, lastName, emailId, mobileNo, role, salary, joiningDate) => {
    const url = UrlData + 'staff/CreateStaff';
    const data = {
        society_id: societyId,
        first_name: firstName,
        last_name: lastName,
        mobile: mobileNo,
        email: emailId,
        role: role,
        salary: salary,
        joining_date: joiningDate
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
        console.log(errors, "Errors create staff");
        throw errors;
    });
}

//update staff api
export const UpdateStaffApi = async (societyId,staffId, firstName, lastName, emailId, mobileNo, role, salary, joiningDate) => {
    const url = UrlData + 'staff/UpdateStaff';
    const data = {
        society_id: societyId,
        staff_id: staffId,
        first_name: firstName,
        last_name: lastName,
        mobile: mobileNo,
        email: emailId,
        role: role,
        salary: salary,
        joining_date: joiningDate
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
        console.log(errors, "Errors update staff");
        throw errors;
    });
}

//mark attendance staff api
export const markAttendanceStaffApi = async (staffId, attendanceId, societyId, attendanceDate, attendanceTime, status, recordTypeTab) => {
    const url = UrlData + 'staff/mark_attendance';
    const data = {
        staff_id: staffId,
        attendance_id: attendanceId,
        society_id: societyId,
        date: attendanceDate,
        status: status,
        check_in: recordTypeTab === "checkIn" && attendanceTime,
        check_out: recordTypeTab === "checkOut" && attendanceTime
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
        console.log(errors, "Errors mark attendance staff");
        throw errors;
    });
}

export const getStaffByIdApi = async (staffId,societyId) => {
    const url = UrlData + 'staff/GetStaffById';
    const data = {
        
        staff_id: staffId,
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
        console.log(errors, "Errors from staff by id");
        throw errors;
    });
}

export const deleteStaffApi = async (staffId,societyId) => {
    const url = UrlData + 'staff/DeleteStaff';
    const data = {
        staff_id: staffId,
        society_id:societyId,
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
        console.log(errors, "Errors from delete staff");
        throw errors;
    });
}
