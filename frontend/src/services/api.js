import axios from "axios";
import { refreshToken } from "./authService";
const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Nếu cần gửi cookie hoặc token
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)
// Interceptor để tự động xử lý lỗi và token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;

        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) throw new Error("No refresh token available");

        // Gọi API refresh qua service
        const res = await refreshToken({ refreshToken: storedRefreshToken });
        const newAccessToken = res.accessToken;

        // Lưu lại accessToken mới
        localStorage.setItem("accessToken", newAccessToken);

        // Set lại Authorization header cho request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gửi lại request vừa fail
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
