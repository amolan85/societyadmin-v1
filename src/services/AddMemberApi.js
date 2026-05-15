import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get members
export const getMembersApi = async (societyId, page) => {
    const url = UrlData + 'member/GetAllMembers';
    const data = {
        society_id: societyId,
        page: page
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
    finalMemType,
    residency,
    moveInDate,
    moveOutDate,
    agreement,
    rentAgreement,
    policeNoc,
    idProof,
    familyPhoto,
    maintenanceReceipt,
    ownershipDocuments,
    nominationDetails
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
        formData.append("occupancy_type", finalMemType);
        formData.append("start_date", moveInDate);
        formData.append("end_date", moveOutDate);
        formData.append("residency", residency);
        formData.append("id_proof", idProof);
        formData.append("agreement", agreement);
        formData.append("rent_agreement", rentAgreement);
        formData.append("police_noc", policeNoc);
        formData.append("family_photo", familyPhoto);
        formData.append("maintenance_receipt", maintenanceReceipt);
        formData.append("ownership", ownershipDocuments);
        formData.append("nomination_details", nominationDetails);

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

export const getMembersByIdApi = async (societyId, memberId) => {
    const url = UrlData + 'member/GetMemberById';
    const data = {
        society_id: societyId,
        user_id: memberId
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
        console.log(errors, "Errors get members by id");
        throw errors;
    });
}

export const getFlatByIdApi = async (societyId, flatId) => {
    const url = UrlData + 'flat/GetFlatDetailsById';
    const data = {
        society_id: societyId,
        flat_id: flatId
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
        console.log(errors, "Errors get flat by id");
        throw errors;
    });
}

export const getAllMembersWithoutPaginationApi = async (societyId, search) => {
    const url = UrlData + 'member/GetAllMemberswithoutpagination';
    const data = {
        society_id: societyId,
        search: search,
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
        console.log(errors, "Errors get members");
        throw errors;
    });
}



