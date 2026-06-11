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
        id_number: "",
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
// Guest ke liye
export const CreateGuestVisitorApi = async (societyId, flatId, visitorName, mobile, email, gender, visitorType, comingFrom, vehicleNumber, purpose, idType, idNumber) => {
    const url = UrlData + 'visitor/CreateVisitor';
    const data = {
        society_id: societyId,
        flat_id: flatId,
        visitor_name: visitorName,
        mobile: mobile,
        email: email || null,
        gender: gender?.toLowerCase() || null,
        visitor_type: visitorType,
        coming_from: comingFrom || null,
        vehicle_number: vehicleNumber || null,
        purpose: purpose,
        id_type: idType?.toLowerCase() || null,
        id_number: idNumber || null,
        photo_url: null,
        parcel_description: null,
        parcel_company: null,
        parcel_delivery_type: null,
        approval_status: "pending"
    }
    return await apiClient({ method: 'post', url, data, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
}

// Delivery ke liye
export const CreateDeliveryApi = async (societyId, flatId, visitorName, mobile, vehicleNumber, parcelDescription, parcelCompany, parcelDeliveryType) => {
    const url = UrlData + 'visitor/CreateVisitor';
    const data = {
        society_id: societyId,
        flat_id: flatId,
        visitor_name: visitorName,
        mobile: mobile,
        visitor_type: "delivery",
        vehicle_number: vehicleNumber || null,
        parcel_description: parcelDescription || null,
        parcel_company: parcelCompany,
        parcel_delivery_type: parcelDeliveryType?.toLowerCase(),
        approval_status: "pending"
    }
    return await apiClient({ method: 'post', url, data, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const ListVisitorsApi = async (data) => {
    const url = UrlData + 'visitor/ListVisitors';
    const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

    const payload = {
        society_id: data.societyId,
        page: data.currentPage,
        limit: 10,
        search: data.currentSearch,
        visitor_type: "",
        entry_status: "",
        approval_status: data.currentStatus,
        flat_id: "",
        date_from: isValidDate(data.currentFromDate) ? data.currentFromDate : null,
        date_to: isValidDate(data.currentToDate) ? data.currentToDate : null,
    };

    return await apiClient({ method: 'post', url, data: payload, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
};
export const GetVisitorApi = async (visitorId, societyId) => {
    const url = UrlData + 'visitor/GetVisitor';
    return await apiClient({ method: 'post', url, data: { visitor_id: visitorId, society_id: societyId }, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const DeleteVisitorApi = async (visitorId, societyId) => {
    const url = UrlData + 'visitor/DeleteVisitor';
    return await apiClient({ method: 'post', url, data: { visitor_id: visitorId, society_id: societyId }, timeout: 30000 })
        .then(res => res.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const VisitorCheckoutApi = async (visitorId, societyId) => {
    const url = UrlData + 'visitor/VisitorCheckout';
    return await apiClient({ method: 'post', url, data: { visitor_id: visitorId, society_id: societyId }, timeout: 30000 })
        .then(res => res.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const UpdateVisitorApprovalApi = async (visitorId, societyId, approvalStatus, rejectionReason, approvedBy) => {
    const url = UrlData + 'visitor/UpdateVisitorApproval';
    return await apiClient({
        method: 'post', url,
        data: {
            visitor_id: visitorId,
            society_id: societyId,
            approval_status: approvalStatus,
            approved_by: approvedBy,
            rejection_reason: approvalStatus === "rejected" ? (rejectionReason || null) : null
        },
        timeout: 30000
    })
        .then(res => res.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const GetMonthlyVisitorSummaryApi = async (societyId) => {
    const url = UrlData + 'visitor/GetMonthlyVisitorSummary';
    return await apiClient({ method: 'post', url, data: { society_id: societyId }, timeout: 30000 })
        .then(res => res.data.data)
        .catch(error => { throw ErrorHandler(error); });
}

export const UpdateVisitorApi = async (
    visitorId,
    visitorName,
    mobile,
    purpose,
    vehicleNumber
) => {
    try {
        const url = UrlData + "visitor/UpdateVisitor";

        const body = {
            visitor_id: visitorId,
            visitor_name: visitorName,
            mobile: mobile,
            purpose: purpose,
            vehicle_number: vehicleNumber
        };

        const response = await apiClient({
            method: "post", // ya "put" agar API PUT use karti hai
            url: url,
            data: body
        });

        return response?.data?.data;
    } catch (error) {
        const errors = ErrorHandler(error);
        throw errors;
    }
};

export const AllotVisitorParkingApi = async (societyId, visitorEntryId, slotId, allottedBy, vehicleNumber, vehicleType, remarks) => {
    const url = UrlData + 'visitor_parking/AllotVisitorParking';
    return await apiClient({
        method: 'post',
        url,
        data: {
            society_id: societyId,
            visitor_entry_id: visitorEntryId,
            slot_id: slotId,
            allotted_by: allottedBy,
            vehicle_number: vehicleNumber,
            vehicle_type: vehicleType,
            remarks: remarks || ""
        },
        timeout: 30000
    })
    .then(res => res.data)
    .catch(error => { throw ErrorHandler(error); });
};