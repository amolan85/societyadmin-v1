import apiClient from "./apiClient";
import ErrorHandler from "../utils/ErrorHandler";
import UrlData from "../utils/Url";

// List all parking rules (with pagination, search, filters)
// NOTE: the backend stored procedure does NOT treat "" / null as "no filter" —
// it matches them literally (e.g. applies_to = ''), which returns 0 rows.
// So we only include a filter key in the request body when it actually has a value,
// same as the minimal { society_id, page, limit } request that works in Postman.
export const listParkingRulesApi = async (
    societyId,
    page = 1,
    limit = 10,
    search = "",
    appliesTo = "",
    violationType = "",
    isActive = null,
) => {
    const url = UrlData + "parking_violation/ListParkingRules";

    const data = {
        society_id: societyId,
        page,
        limit,
    };

    if (search) data.search = search;
    if (appliesTo) data.applies_to = appliesTo;
    if (violationType) data.violation_type = violationType;
    if (isActive !== null && isActive !== undefined) data.is_active = isActive;

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from ListParkingRules api");
            throw errors;
        });
};

// Create a new parking rule
export const createParkingRuleApi = async (
    societyId,
    ruleTitle,
    ruleDescription,
    appliesTo,
    by,
    status,
    violationType,
    penaltyAmount,
    penaltyDescription,
    isActive,
    createdBy,
) => {
    const url = UrlData + "parking_violation/CreateParkingRule";

    const data = {
        society_id: societyId,
        rule_title: ruleTitle,
        rule_description: ruleDescription,
        applies_to: appliesTo,
        by: by,
        status: status,
        violation_type: violationType,
        penalty_amount: penaltyAmount,
        penalty_description: penaltyDescription,
        is_active: isActive,
        created_by: createdBy,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from CreateParkingRule api");
            throw errors;
        });
};

// Get a single parking rule by id
export const getParkingRuleApi = async (societyId, ruleId) => {
    const url = UrlData + "parking_violation/GetParkingRule";

    const data = {
        society_id: societyId,
        rule_id: ruleId,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from GetParkingRule api");
            throw errors;
        });
};

// Toggle rule active/inactive — uses the same UpdateParkingRule endpoint
export const updateParkingRuleStatusApi = async (societyId, ruleId, isActive) => {
    const url = UrlData + 'parking_violation/UpdateParkingRule';
    const data = {
        society_id: societyId,
        rule_id: ruleId,
        is_active: isActive,
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
        console.log(errors, "Errors update parking rule status");
        throw errors;
    });
}

// Update a parking rule's title / description / applicability / violation type / penalty / status
export const updateParkingRuleApi = async (
    societyId,
    ruleId,
    ruleTitle,
    ruleDescription,
    appliesTo,
    violationType,
    penaltyAmount,
    penaltyDescription,
    isActive,
) => {
    const url = UrlData + "parking_violation/UpdateParkingRule";

    const data = {
        society_id: societyId,
        rule_id: ruleId,
        rule_title: ruleTitle,
        rule_description: ruleDescription,
        applies_to: appliesTo,
        violation_type: violationType,
        penalty_amount: penaltyAmount,
        penalty_description: penaltyDescription,
        is_active: isActive,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from UpdateParkingRule api");
            throw errors;
        });
};

// Activate / deactivate a parking rule (status toggle only)
export const toggleParkingRuleStatusApi = async (societyId, ruleId, isActive) => {
    const url = UrlData + "parking_violation/UpdateParkingRule";

    const data = {
        society_id: societyId,
        rule_id: ruleId,
        is_active: isActive,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from UpdateParkingRule (toggle) api");
            throw errors;
        });
};

// Delete a parking rule
export const deleteParkingRuleApi = async (societyId, ruleId) => {
    const url = UrlData + "parking_violation/DeleteParkingRule";

    const data = {
        society_id: societyId,
        rule_id: ruleId,
    };

    return await apiClient({
        method: "post",
        url: url,
        data: data,
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            const errors = ErrorHandler(error);
            console.log(errors, "Errors from DeleteParkingRule api");
            throw errors;
        });
};
