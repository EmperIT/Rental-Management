
import api from './api';

// ---------- CONTRACT API ----------

// Tạo hợp đồng mới
export const createContract = async (contractData) => {
  const response = await api.post('/contract/contracts', contractData);
  return response.data;
};

// Lấy danh sách hợp đồng
export const getContracts = async (page = 1, limit = 0, roomId = '', tenantId = '', isActive = '') => {
  const response = await api.get('/contract/contracts', {
    params: { page, limit, roomId, tenantId, isActive },
  });
  return response.data;
};

// Lấy thông tin hợp đồng theo ID
export const getContractById = async (id) => {
  const response = await api.get(`/contract/contracts/${id}`);
  return response.data;
};

// Cập nhật hợp đồng
export const updateContract = async (id, contractData) => {
  const response = await api.patch(`/contract/contract/${id}`, contractData);
  return response.data;
};

// Xóa hợp đồng
export const deleteContract = async (id) => {
  const response = await api.delete(`/contract/contract/${id}`);
  return response.data;
};

// ---------- STAY RECORD API ----------

// Tạo bản ghi tạm trú mới
export const createStayRecord = async (stayRecordData) => {
  const response = await api.post('/contract/stay-records', stayRecordData);
  return response.data;
};

// Lấy danh sách bản ghi tạm trú
export const getStayRecords = async (
  page = 1,
  limit = 10,
  tenantId = '',
  status = '',
  startDateFrom = '',
  startDateTo = '',
  endDateFrom = '',
  endDateTo = ''
) => {
  const response = await api.get('/contract/stay-records', {
    params: { page, limit, tenantId, status, startDateFrom, startDateTo, endDateFrom, endDateTo },
  });
  return response.data;
};

// Lấy thông tin bản ghi tạm trú theo ID
export const getStayRecordById = async (id) => {
  const response = await api.get(`/contract/stay-records/${id}`);
  return response.data;
};

// Cập nhật bản ghi tạm trú
export const updateStayRecord = async (id, stayRecordData) => {
  const response = await api.patch(`/contract/stay-records/${id}`, stayRecordData);
  return response.data;
};

// Xóa bản ghi tạm trú
export const deleteStayRecord = async (id) => {
  const response = await api.delete(`/contract/stay-records/${id}`);
  return response.data;
};