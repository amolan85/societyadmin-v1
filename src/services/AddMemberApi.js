import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get members
export const getMembersApi = async (societyId) => {
    const url = UrlData + 'member/GetAllMembers';
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
        console.log(errors, "Errors get members"); 
        throw errors;
    });
}


//api for add member
export const AddMemberApi = async (
    societyId,
    userId,
    firstName,
    lastName,
    mobileNo,
    emailId,
    wing,
    flat,
    memType,
    residency,
    date
) => {
    try {
        const url = UrlData + "member/AddMembers";
        const formData = new FormData();
        formData.append("society_id", societyId);
        formData.append("user_id", userId);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("email", emailId);
        formData.append("mobile", mobileNo);
        formData.append("block", wing);
        formData.append("floor", "1");
        formData.append("flat_number", flat);
        formData.append("occupancy_type", memType);
        formData.append("start_date", date);
        formData.append("residency", residency);

        const response = await apiClient({
            method: "post",
            url: url,
            data: formData,
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error);

        const errors = ErrorHandler(error);
        console.log(errors, "Errors add member");

        throw errors;
    }
};