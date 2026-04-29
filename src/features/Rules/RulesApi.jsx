import apiClient from "../../services/apiClient";
import ErrorHandler from "../../utils/ErrorHandler";
import UrlData from "../../utils/Url";

//api function for get rules api
export const getRulesApi = async () => {
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
        console.log(errors, "Errors from rules api");
        throw errors;
    });
}