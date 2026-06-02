import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";
import apiClient from "./apiClient";

//api function for create visitor
export const CreateVisitorApi = async (societyId, flatId, visitorName, mobileNo, emailId, visitorGender, visitorType, vehicleNumber, purpose) => {
    const url = UrlData + 'visitor/CreateVisitor';
    const data = {
        society_id: societyId,
        flat_id: flatId,
        visitor_name: visitorName,
        mobile: mobileNo,
        email: emailId,
        gender: visitorGender,
        visitor_type: visitorType,
        coming_from: "",
        vehicle_number: vehicleNumber,
        purpose: purpose,
        id_type: "",
        id_number:"",
        photo_url: "",
        parcel_description: null,
        parcel_company: null,
        parcel_delivery_type: null,
        approval_status: "pending"

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
        console.log(errors, "Errors get visitor parking");
        throw errors;
    });
}
