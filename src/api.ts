import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const URL = "http://103.109.37.70:8000";
// Kiểm tra accessToken có hết hạn không
const checkExpiredToken = (token: string | null): boolean => {
  if (!token) return false;
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Tạo instance axios
const instance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Thêm interceptor để xử lý token
instance.interceptors.request.use(
  async (config) => {
    const url = config.url || "";

    // Chỉ kiểm tra token nếu URL KHÔNG chứa 'auth'
    if (!url.includes("auth")) {
      const token = localStorage.getItem("access_token");

      if (!token) { 
        window.location.href = "/login";
        return Promise.reject(new Error("No token available"));
      }

      if (checkExpiredToken(token)) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
