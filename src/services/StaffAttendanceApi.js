import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

//api function for get staff attendance
export const getStaffAttendanceApi = async (societyId) => {
    const url = UrlData + 'staff/GetAllStaffAttendance';
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
        console.log(errors, "Errors from staff attendance");
        throw errors;
    });
}


export const createStaffApi = async (societyId, firstName, lastName, emailId, mobileNo, role) => {
    const url = UrlData + 'staff/CreateStaff';
    const data = {
        society_id: societyId,
        first_name: firstName,
        last_name: lastName,
        mobile: mobileNo,
        email: emailId,
        role: role,
        // "salary": 20000,
        // "joining_date": "2026-05-01"
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