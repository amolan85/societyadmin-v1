// src/features/auth/authService.js

import ErrorHandler from "../../utils/ErrorHandler";
import { SetSession } from "../../utils/SessionManagement";
import axios from "axios";
import UrlData from "../../utils/Url";

export const login = async (email, password) => {
  // FAKE LOGIN (replace with API)
  if (email === "admin@test.com" && password === "123456") {
    const user = { email };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } else {
    throw new Error("Invalid credentials");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const LoginApi = async (emailId, password,) => {
  try {
    const response = await axios.post(
      UrlData + "auth/loginwithemail",
      {
        email: emailId,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    SetSession(response.data.data);
    return response.data;

  } catch (error) {
    const errors = ErrorHandler(error)
    console.log(errors);
    throw errors;
  }
};
