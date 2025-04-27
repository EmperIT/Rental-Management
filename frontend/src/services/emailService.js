import api from "./api";

// Gửi email hóa đơn
export const sendInvoiceEmail = async (invoiceData) => {
    const response = await api.post(`/email/invoice`, invoiceData);
    return response.data;
  };
  
  // Gửi email xác minh tài khoản
  export const sendVerificationEmail = async (verificationData) => {
    const response = await api.post(`/email/verification`, verificationData);
    return response.data;
  };
  
  // Gửi email đặt lại mật khẩu
  export const sendPasswordResetEmail = async (resetData) => {
    const response = await api.post(`/email/reset-password`, resetData);
    return response.data;
  };
  
  // Gửi email thông báo
  export const sendNotificationEmail = async (notificationData) => {
    const response = await api.post(`/email/notification`, notificationData);
    return response.data;
  };