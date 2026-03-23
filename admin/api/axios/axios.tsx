import axios from "axios";
import { Cookies } from "react-cookie";

export const BaseURL = "http://localhost:4000";
const cookies = new Cookies(); // Instance bahar create karein performance ke liye

export const AxiosInstance = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("token"); 
    if (token) {
    config.headers["x-access-token"] = token; // Aapka current
    config.headers["Authorization"] = `Bearer ${token}`; // Standard backup
}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 error aur ensure karein ki ye refresh request khud na ho
    if (
      error.response?.status === 403 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/refresh-token') 
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint call
        // Note: Direct axios use kar rahe hain taaki interceptor dobara trigger na ho
        const { data } = await axios.post(`${BaseURL}/admin/refresh-token`, {}, { withCredentials: true });

        const newAccessToken = data.token;
        cookies.set("token", newAccessToken, { path: "/" });

        // Naye token ke saath purani request ko update karein
        originalRequest.headers["x-access-token"] = newAccessToken;

        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        // Agar refresh fail ho jaye, toh logout karana best hai
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