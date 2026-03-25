import axios from "axios";
import { Cookies } from "react-cookie";

export const BaseURL = "http://localhost:4000";
const cookies = new Cookies(); 

export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("token"); 
    if (token) {
    config.headers["x-access-token"] = token; 
    config.headers["Authorization"] = `Bearer ${token}`; 
}
    return config;
  },
  (error) => Promise.reject(error)
);
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/refresh-token') 
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${BaseURL}/admin/refresh-token`, {}, { withCredentials: true });

        const newAccessToken = data.token;
        cookies.set("token", newAccessToken, { path: "/" });
        originalRequest.headers["x-access-token"] = newAccessToken;

        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        cookies.remove("token", { path: "/" });
        if (typeof window !== "undefined") {
          window.location.href = "/admin/auth/signin";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);