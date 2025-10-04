import axios from "axios";
import config from "../../config";
const FectApi = axios.create({
  baseURL: `${config.API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

FectApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

FectApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login.");
    }
    return Promise.reject(error);
  }
);

export default FectApi;
