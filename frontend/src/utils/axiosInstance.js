import axios from "axios";
import refreshToken from "./manageTokens";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL:
    "http://beable-materiais-env.eba-peafr9cp.eu-west-3.elasticbeanstalk.com/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("jwt");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status) {
      try {
        const newToken = await refreshToken();

        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token: ", refreshError);

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

export default axiosInstance;
