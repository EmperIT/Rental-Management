
import api from './api';

// ---------- CONTRACT API ----------

// Tạo hợp đồng mới

export const createContract = async (contractData) => {
  try {
    console.log('Sending contract data to /contract/contracts:', JSON.stringify(contractData, null, 2));
    const response = await api.post('/contract/contracts', contractData);
    console.log('Create contract response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create contract error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw error.response?.data || error;
  }
};

export const getContracts = async (page, limit, roomId, tenantId, isActive) => {
  const params = { page, limit, roomId, tenantId, isActive };
  console.log('Fetching contracts with params:', params);
  const response = await api.get('/contract/contracts', { params });
  return response.data;
};

export const getContractById = async (contractId) => {
  console.log('Fetching contract by ID:', contractId);
  const response = await api.get(`/contract/contracts/${contractId}`);
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