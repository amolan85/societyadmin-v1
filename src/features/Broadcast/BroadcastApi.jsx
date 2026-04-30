import apiClient from "../../services/apiClient";
import ErrorHandler from "../../utils/ErrorHandler";
import UrlData from "../../utils/Url";


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
        const data = {
            society_id: "1",
            first_name: firstName,
            last_name: lastName,
            email: emailId,
            mobile: mobileNo,
            block: wing,
            flat_number: flat,
            ownership_type: memType,
            start_date: date,
            residency: residency,
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
