// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api.com", // change later
});

export default api;