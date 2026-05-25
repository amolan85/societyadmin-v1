import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get members
export const getAllUnitsApi = async (societyId, page, search) => {
    const url = UrlData + 'flat/GetAllFlatDetails';
    const data = {
        society_id: societyId,
        page: page,
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
        console.log(errors, "Errors get all units");
        throw errors;
    });
}

export const getAllUnitsBySearchApi = async (societyId, search) => {
    const url = UrlData + 'flat/GetAllFlatDetails';
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
        console.log(errors, "Errors get all units");
        throw errors;
    });
}

//api for add member
export const AddUnitsApi = async (societyId, block, flatNo, floor, areaSqft, unitType, currentStatus, fullName, email, mobile) => {
    const url = UrlData + 'flat/AddUnit';
    const data = {
        society_id: societyId,
        block: block,
        flat_number: flatNo,
        floor: floor,
        area_sqft: areaSqft,
        unit_type: unitType,
        current_status: currentStatus,
        full_name: fullName,
        email: email,
        mobile: mobile
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
        console.log(errors, "Errors adding units");
        throw errors;
    });
}

export const UpdateUnitsApi = async (unitId, block, flatNo, floor, areaSqft, unitType, currentStatus, fullName, email, mobile) => {
    const url = UrlData + 'flat/UpdateUnit';
    const data = {
        flat_id: unitId,
        block: block,
        flat_number: flatNo,
        floor: floor,
        area_sqft: areaSqft,
        unit_type: unitType,
        current_status: currentStatus,
        full_name: fullName,
        email: email,
        mobile: mobile
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
        console.log(errors, "Errors adding units");
        throw errors;
    });
}

export const getAllFlatsApi = async (societyId, page) => {
    const url = UrlData + 'flat/GetFlatNumberList';
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
        console.log(errors, "Errors get all flats");
        throw errors;
    });
}

export const getAllBlocksApi = async (societyId) => {
    const url = UrlData + 'flat/GetAllBlocks';
    const data = {
        society_id: societyId,

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
        console.log(errors, "Errors get all blocks");
        throw errors;
    });
}

export const getAllFloorsApi = async (societyId) => {
    const url = UrlData + 'flat/GetAllFloorList';
    const data = {
        society_id: societyId,

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
        console.log(errors, "Errors get all floors");
        throw errors;
    });
}

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

export const deleteUnitApi = async (unitId) => {
    const url = UrlData + 'flat/DeleteFlat';
    const data = {
        flat_id: unitId,

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
        console.log(errors, "Errors delete unit");
        throw errors;
    });
}



