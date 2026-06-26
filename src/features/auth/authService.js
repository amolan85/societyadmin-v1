import ErrorHandler from "../../utils/ErrorHandler";
import { SessionDestroy, SetSession } from "../../utils/SessionManagement";
import UrlData from "../../utils/Url";
import apiClient from "../../services/apiClient";

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const LoginApi = async (emailId, password) => {
  try {
    const url = UrlData + "auth/loginwithemailAdmin";

    const data = {
      email: emailId,
      password: password,
    };

    const response = await apiClient({
      method: "post",
      url: url,
      data: data,
    });

    SetSession(response.data.data);

    return response.data.data;

  } catch (error) {

    const errors = ErrorHandler(error);

    throw errors;
  }
};

export const LogoutApi = async (societyId) => {
  try {
    const url = UrlData + "auth/logout";

    const response = await apiClient({
      method: "post",
      url: url,
      data: {
        society_id: societyId,
      },

    });
    await SessionDestroy()
    return response.data.data;

  } catch (error) {

    const errors = ErrorHandler(error);

    throw errors;
  }
};
