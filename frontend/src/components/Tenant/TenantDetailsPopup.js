import React, { useState } from 'react';
import { FaTimes, FaEdit, FaPhone, FaEnvelope, FaKey } from 'react-icons/fa';

const TenantDetailsPopup = ({
  tenant,
  onClose,
  onEdit,
  isReservation,
  onEditReservation,
  onDeleteReservation,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    alert('Đổi mật khẩu thành công');
    setShowPasswordChange(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">Thông tin khách thuê</h2>
          <button onClick={onClose} className="popup-close-btn">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="details-content">
          <div className="details-header">
            <h3 className="details-title">{tenant.name}</h3>
            {!isReservation && (
              <button className="details-edit-btn" onClick={onEdit}>
                <FaEdit />
              </button>
            )}
            {isReservation && (
              <div className="flex space-x-3">
                <button className="details-edit-btn" onClick={onEditReservation}>
                  Sửa
                </button>
                <button className="details-delete-btn" onClick={() => onDeleteReservation(tenant.id)}>
                  Xóa
                </button>
              </div>
            )}
          </div>
          <p><span className="details-info">Số điện thoại:</span> <a href={`tel:${tenant.phone}`} className="details-info-value">{tenant.phone}</a></p>
          <p><span className="details-info">Email:</span> {tenant.email || 'N/A'}</p>
          <p><span className="details-info">CMTND/CCCD:</span> {tenant.identity_number}</p>
          <p><span className="details-info">Nhà:</span> {tenant.house}</p>
          <p><span className="details-info">Phòng:</span> {tenant.room}</p>
          {isReservation && <p><span className="details-info">Ngày vào dự kiến:</span> {tenant.moveInDate}</p>}
          <p><span className="details-info">Địa chỉ:</span> {tenant.address}, {tenant.ward}, {tenant.district}, {tenant.province}</p>
          <p><span className="details-info">Ghi chú:</span> {tenant.notes || 'N/A'}</p>
          {!isReservation && (
            <>
              <h3 className="details-subsection-title">Thông tin hợp đồng</h3>
              <p><span className="details-info">Mã hợp đồng:</span> {tenant.contract.contract_id}</p>
              <p><span className="details-info">Tiền cọc:</span> {tenant.contract.deposit}</p>
              <p><span className="details-info">Tiền thuê:</span> {tenant.contract.rent_amount}</p>
              <p><span className="details-info">Ngày bắt đầu:</span> {tenant.contract.start_date}</p>
              <p><span className="details-info">Ngày kết thúc:</span> {tenant.contract.end_date}</p>
            </>
          )}
        </div>
        {!isReservation && (
          <div className="details-actions">
            <h3 className="details-actions-title">Hành động</h3>
            <div className="details-action-buttons">
              <button
                className="details-action-button"
                onClick={() => alert('Chuyển đến màn hình nhắn tin (mock)')}
              >
                <FaEnvelope className="details-action-icon" /> Nhắn tin
              </button>
              <button className="details-action-button">
                <FaPhone className="details-action-icon" /> <a href={`tel:${tenant.phone}`}>Gọi điện</a>
              </button>
              <button
                className="details-action-button"
                onClick={() => setShowPasswordChange(true)}
              >
                <FaKey className="details-action-icon" /> Đổi mật khẩu
              </button>
            </div>
          </div>
        )}

        {showPasswordChange && (
          <div className="details-subsection">
            <h3 className="details-subsection-title">Đổi mật khẩu</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="newPassword" className="popup-label">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="popup-input"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="popup-label">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="popup-input"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button className="btn-primary" onClick={handlePasswordChange}>
                  Xác nhận
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDetailsPopup;