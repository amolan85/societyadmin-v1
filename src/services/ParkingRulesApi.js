import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";


//api function for get list parking rules
export const listParkingRulesApi = async (societyId, page, limit, search) => {
    const url = UrlData + 'parking_violation/ListParkingRules';
    const data = {
        society_id: societyId,
        page: page,
        limit: limit,
        search: search,
        applies_to: "",
        violation_type: "",
        //"is_active": true
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
        console.log(errors, "Errors get list parking rules");
        throw errors;
    });
}

//api function for create parking rule
export const createParkingRuleApi = async (societyId, ruleTitle, ruleDescription, byType, status, violationType, penalty, userId) => {
    const url = UrlData + 'parking_violation/CreateParkingRule';
    const data = {
        society_id: societyId,
        rule_title: ruleTitle,
        rule_description: ruleDescription,
        applies_to: "",
        by: byType,
        status: status,
        violation_type: violationType,
        penalty_amount: penalty,
        penalty_description: "",
        is_active: true,
        created_by: userId
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
        console.log(errors, "Errors create parking rule");
        throw errors;
    });
}

//api function for get parking rule details
export const getParkingRuleByIdApi = async (societyId, ruleId) => {
    const url = UrlData + 'parking_violation/GetParkingRule';
    const data = {
        society_id: societyId,
        rule_id: ruleId

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
        console.log(errors, "Errors get parking rule");
        throw errors;
    });
}

//api function for update parking rule
export const updateParkingRuleApi = async (societyId, ruleId, ruleTitle, ruleDescription, byType, status, violationType, penalty, userId) => {
    const url = UrlData + 'parking_violation/UpdateParkingRule';
    const data = {
        society_id: societyId,
        rule_id: ruleId,
        rule_title: ruleTitle,
        rule_description: ruleDescription,
        applies_to: "",
        violation_type: violationType,
        penalty_amount: penalty,
        penalty_description: "",
        is_active: true
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
        console.log(errors, "Errors update parking rule");
        throw errors;
    });
}

//api function for delete parking rule
export const deleteParkingRuleApi = async (societyId, ruleId) => {
    const url = UrlData + 'parking_violation/DeleteParkingRule';
    const data = {
        society_id: societyId,
        rule_id: ruleId
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
        console.log(errors, "Errors delete parking rule");
        throw errors;
    });
}
