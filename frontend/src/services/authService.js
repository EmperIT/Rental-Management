// src/api/authApi.js
import api from "./api";

// Đăng nhập
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

// Làm mới token
export const refreshToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  const response = await api.post('/auth', userData);
  return response.data;
};

// Lấy danh sách người dùng
export const getUsers = async (page = 0, limit = 0) => {
  const response = await api.get('/auth', {
    params: { page, limit },
  });
  return response.data;
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
  const response = await api.get(`/auth/${id}`);
  return response.data;
};

// Cập nhật người dùng
export const updateUser = async (id, userData) => {
  const response = await api.patch(`/auth/${id}`, userData);
  return response.data;
};