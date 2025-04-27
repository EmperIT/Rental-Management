// src/api/contractApi.js
import api from './api';

// ---------- CONTRACT API ----------

// Tạo hợp đồng mới
export const createContract = async (contractData) => {
  const response = await api.post('/', contractData);
  return response.data;
};

// Lấy danh sách hợp đồng
export const getContracts = async (page = 1, limit = 10, roomId = '', tenantId = '', status = '') => {
  const response = await api.get('/', {
    params: { page, limit, roomId, tenantId, status },
  });
  return response.data;
};

// Lấy thông tin hợp đồng theo ID
export const getContractById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Cập nhật hợp đồng
export const updateContract = async (id, contractData) => {
  const response = await api.patch(`/${id}`, contractData);
  return response.data;
};

// Xóa hợp đồng
export const deleteContract = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// ---------- TEMPLATE API ----------

// Tạo mẫu hợp đồng
export const createContractTemplate = async (templateData) => {
  const response = await api.post('/template', templateData);
  return response.data;
};

// Lấy danh sách mẫu hợp đồng
export const getContractTemplates = async (page = 0, limit = 10) => {
  const response = await api.get('/template', {
    params: { page, limit },
  });
  return response.data;
};

// Lấy mẫu hợp đồng theo ID
export const getContractTemplateById = async (id) => {
  const response = await api.get(`/template/${id}`);
  return response.data;
};

// Cập nhật mẫu hợp đồng
export const updateContractTemplate = async (id, templateData) => {
  const response = await api.patch(`/template/${id}`, templateData);
  return response.data;
};

// Xóa mẫu hợp đồng
export const deleteContractTemplate = async (id) => {
  const response = await api.delete(`/template/${id}`);
  return response.data;
};