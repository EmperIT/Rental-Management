// src/services/rentalService.js
import api from "./api";
// ---------- Room Endpoints ----------

// Tạo phòng mới
export const createRoom = async (formData) => {
  const response = await api.post(`/rental/rooms`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Lấy dữ liệu điện nước của phòng theo tháng
export const getMeterData = async (roomNumber, month) => {
  const response = await api.get(`/rental/meters`, {
    params: { roomNumber, month },
  });
  return response.data;
};

// Lấy danh sách phòng
export const findAllRooms = async (page = 0, limit = 0) => {
  const response = await api.get(`/rental/rooms`, {
    params: { page, limit },
  });
  return response.data;
};

// Lấy thông tin phòng theo ID
export const findOneRoom = async (id) => {
  const response = await api.get(`/rental/rooms/${id}`);
  return response.data;
};

// Cập nhật thông tin phòng
export const updateRoom = async (id, formData) => {
  const response = await api.patch(`/rental/rooms/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Xóa phòng
export const removeRoom = async (id) => {
  const response = await api.delete(`/rental/rooms/${id}`);
  return response.data;
};

// ---------- Tenant Endpoints ----------

// Tạo người thuê mới
export const createTenant = async (tenantData) => {
  const response = await api.post(`/rental/tenants`, tenantData);
  return response.data;
};

// Lấy danh sách người thuê theo bộ lọc
export const findAllTenantsByFilter = async (roomId, isLeadRoom, page = 0, limit = 0) => {
  const response = await api.get(`/rental/tenants`, {
    params: { roomId, isLeadRoom, page, limit },
  });
  return response.data;
};

// Lấy thông tin người thuê theo ID
export const findOneTenant = async (id) => {
  const response = await api.get(`/rental/tenants/${id}`);
  return response.data;
};

// Cập nhật thông tin người thuê
export const updateTenant = async (id, tenantData) => {
  const response = await api.patch(`/rental/tenants/${id}`, tenantData);
  return response.data;
};

// Xóa người thuê
export const removeTenant = async (id) => {
  const response = await api.delete(`/rental/tenants/${id}`);
  return response.data;
};

// ---------- Invoice Endpoints ----------

// Tạo hóa đơn mới
export const createInvoice = async (invoiceData) => {
  const response = await api.post(`/rental/invoices`, invoiceData);
  return response.data;
};

// Lấy danh sách hóa đơn theo bộ lọc
export const findAllInvoicesByFilter = async (page = 0, limit = 0, status, roomId, month) => {
  const response = await api.get(`/rental/invoices`, {
    params: { page, limit, status, roomId, month },
  });
  return response.data;
};

// Lấy thông tin hóa đơn theo ID
export const findOneInvoice = async (id) => {
  const response = await api.get(`/rental/invoices/${id}`);
  return response.data;
};

// Cập nhật thông tin hóa đơn
export const updateInvoice = async (id, invoiceData) => {
  const response = await api.patch(`/rental/invoices/${id}`, invoiceData);
  return response.data;
};

// Xóa hóa đơn
export const removeInvoice = async (id) => {
  const response = await api.delete(`/rental/invoices/${id}`);
  return response.data;
};

// Lấy số đọc điện nước mới nhất của phòng
export const findLatestReadings = async (roomId) => {
  const response = await api.get(`/rental/readings/${roomId}`);
  return response.data;
};

// Kích hoạt tự động tạo hóa đơn cho tất cả phòng
export const triggerInvoiceGeneration = async () => {
  const response = await api.post(`/rental/invoices/generate`);
  return response.data;
};

// ---------- Service Endpoints ----------

// Lấy thông tin dịch vụ theo tên
export const getService = async (name) => {
  const response = await api.get(`/rental/services/${name}`);
  return response.data;
};

// Lấy danh sách tất cả dịch vụ
export const getAllServices = async () => {
  const response = await api.get(`/rental/services`);
  return response.data;
};

// Tạo mới hoặc cập nhật dịch vụ
export const saveService = async (serviceData) => {
  const response = await api.post(`/rental/services`, serviceData);
  return response.data;
};

// Xóa một dịch vụ
export const removeService = async (name) => {
  const response = await api.delete(`/rental/services/${name}`);
  return response.data;
};

// ---------- Room Service Endpoints ----------

// Đăng ký dịch vụ cho phòng
export const addRoomService = async (roomServiceData) => {
  const response = await api.post(`/rental/room-services`, roomServiceData);
  return response.data;
};

// Lấy danh sách dịch vụ đã đăng ký của phòng
export const getRoomServices = async (roomId) => {
  const response = await api.get(`/rental/room-services/${roomId}`);
  return response.data;
};

export const updateRoomService = async (roomId, serviceName, roomServiceData) => {
  const response = await api.put(`/rental/room-services/${roomId}`, roomServiceData, {
    params: { serviceName },
  });
  return response.data;
};

// Hủy đăng ký dịch vụ cho phòng
export const removeRoomService = async (roomId, serviceName) => {
  const response = await api.delete(`/rental/room-services/${roomId}`, {
    params: { serviceName },
  });
  return response.data;
};

// ---------- Asset Endpoints ----------

// Tạo mới tài sản
export const createAsset = async (assetData) => {
  const response = await api.post(`/rental/assets`, assetData);
  return response.data;
};

// Lấy danh sách tất cả tài sản
export const getAllAssets = async () => {
  const response = await api.get(`/rental/assets`);
  return response.data;
};

// Lấy thông tin tài sản theo tên
export const getAsset = async (name) => {
  const response = await api.get(`/rental/assets/${name}`);
  return response.data;
};

// Cập nhật thông tin tài sản
export const updateAsset = async (name, assetData) => {
  const response = await api.put(`/rental/assets/${name}`, assetData);
  return response.data;
};

// Xóa tài sản
export const removeAsset = async (name) => {
  const response = await api.delete(`/rental/assets/${name}`);
  return response.data;
};

// ---------- Room Asset Endpoints ----------

// Thêm tài sản cho phòng
export const addRoomAsset = async (roomAssetData) => {
  const response = await api.post(`/rental/room-assets`, roomAssetData);
  return response.data;
};

// Lấy danh sách tài sản của phòng
export const getRoomAssets = async (roomId) => {
  const response = await api.get(`/rental/room-assets/${roomId}`);
  return response.data;
};

// Cập nhật thông tin tài sản của phòng
export const updateRoomAsset = async (roomAssetData) => {
  const response = await api.put(`/rental/room-assets`, roomAssetData);
  return response.data;
};

// Xóa tài sản khỏi phòng
export const removeRoomAsset = async (roomAssetData) => {
  const response = await api.delete(`/rental/room-assets`, {
    data: roomAssetData,
  });
  return response.data;
};

// ---------- Transaction Endpoints ----------

// Tạo mới giao dịch
export const createTransaction = async (transactionData) => {
  const response = await api.post(`/rental/transactions`, transactionData);
  return response.data;
};

// Lấy danh sách giao dịch theo bộ lọc
export const findAllTransactions = async (page = 1, limit = 10, category, type, startDate, endDate) => {
  const response = await api.get(`/rental/transactions`, {
    params: { page, limit, category, type, startDate, endDate },
  });
  return response.data;
};

// Lấy thông tin giao dịch theo ID
export const findOneTransaction = async (id) => {
  const response = await api.get(`/rental/transactions/${id}`);
  return response.data;
};

// Cập nhật thông tin giao dịch
export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/rental/transactions/${id}`, transactionData);
  return response.data;
};

// Xóa giao dịch
export const removeTransaction = async (id) => {
  const response = await api.delete(`/rental/transactions/${id}`);
  return response.data;
};