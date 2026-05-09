import ErrorHandler from "../../utils/ErrorHandler";
import { SetSession } from "../../utils/SessionManagement";
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
    const url = UrlData + "auth/loginwithemail";

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
    console.log("API Error:", error);

    // API 401 message
    if (error.response) {
      throw error.response.data.message || "Invalid email or password";
    }

    // Network error
    throw "Something went wrong";
  }
};
