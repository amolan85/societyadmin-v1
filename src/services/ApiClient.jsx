import axios from "axios";
import UrlData from "../utils/Url";
import { GetToken, SessionDestroy } from "../utils/SessionManagement";


const apiClient = axios.create({
  baseURL: UrlData,
  timeout: 10000,
});

//  Request Interceptor for Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await GetToken();
    window.dispatchEvent(new Event("show-loader"));
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
  (error) => {
    
    window.dispatchEvent(new Event("hide-loader"));
    return Promise.reject(error);
  }
);

//  Request Interceptor for session expiration
apiClient.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new Event("hide-loader"));
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      
      // Clear session data and token
      SessionDestroy();

      //Redirect to login screen
      // navigation.navigate("Login");
      
    }
    window.dispatchEvent(new Event("hide-loader"));
    return Promise.reject(error);
  }
);

export default apiClient;
