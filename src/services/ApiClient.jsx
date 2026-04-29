import axios from "axios";
import UrlData from "../utils/Url";


// import { GetToken, SessionDestroy } from "./SessionManagement";


const apiClient = axios.create({
  baseURL: UrlData,
  timeout: 10000,
});

//  Request Interceptor for Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    // const token = await GetToken();
    const token = "30882aeddb31296d8576a9fd5bd78dfbdb60909fd0a69151b51ae4def1b25d87"

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data"; // ✅ RN needs this explicitly
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  Request Interceptor for session expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Session Expired");
      
      // Clear session data and token
    //   SessionDestroy();

      //Redirect to login screen
      // navigation.navigate("Login");
      
    }

    return Promise.reject(error);
  }
);

export default apiClient;
