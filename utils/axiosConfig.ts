import { useAuthStore } from '@/store/auth';
import axios from 'axios';


// Tạo instance axios chung cho toàn app
const api = axios.create({
  baseURL: 'https://your-api-base-url.com', // Thay bằng URL API backend của bạn
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Middleware: Request interceptor
api.interceptors.request.use(
  (config: any) => {
    // Lấy token từ store (luôn lấy bên trong interceptor để luôn cập nhật)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Middleware: Response interceptor
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Xử lý lỗi chung (ví dụ: refresh token, thông báo lỗi, ...)
    // if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);

export default api;
