import axios from "axios";

// Base API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// User API functions (placeholder for future development)
export const userAPI = {
  // TODO: Implement user profile update
  updateProfile: (userData) => api.put("/users/profile", userData),

  // TODO: Implement user profile get
  getProfile: () => api.get("/users/profile"),

  // TODO: Implement password change
  changePassword: (currentPassword, newPassword) =>
    api.put("/users/password", { currentPassword, newPassword }),

  // TODO: Implement user deletion
  deleteAccount: () => api.delete("/users/account"),
};

// Data API functions (placeholder for future development)
export const dataAPI = {
  // TODO: Implement data fetching
  getData: () => api.get("/data"),

  // TODO: Implement data creation
  createData: (data) => api.post("/data", data),

  // TODO: Implement data update
  updateData: (id, data) => api.put(`/data/${id}`, data),

  // TODO: Implement data deletion
  deleteData: (id) => api.delete(`/data/${id}`),
};

// File upload API functions (placeholder for future development)
export const uploadAPI = {
  // TODO: Implement file upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // TODO: Implement multiple file upload
  uploadMultipleFiles: (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    return api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Notification API functions (placeholder for future development)
export const notificationAPI = {
  // TODO: Implement get notifications
  getNotifications: () => api.get("/notifications"),

  // TODO: Implement mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  // TODO: Implement mark all notifications as read
  markAllAsRead: () => api.put("/notifications/read-all"),

  // TODO: Implement delete notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
