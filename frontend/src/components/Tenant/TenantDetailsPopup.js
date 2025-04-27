import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Tenant/TenantDetailsPopup.css';

const TenantDetailsPopup = ({ tenant, onClose, onEdit, onDelete, onChangeStatus, onReRent, onConvertToTenant, isReservation, rooms }) => {
  const selectedRoom = rooms.find((room) => room.id === tenant.roomId);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';
  };

  const handleChangeStatus = () => {
    const confirm = window.confirm('Bạn có chắc chắn muốn chuyển trạng thái khách thuê thành "Rời đi"?');
    if (confirm && onChangeStatus) {
      onChangeStatus(tenant, false);
    }
  };

  const handleReRent = () => {
    const confirm = window.confirm('Bạn có chắc chắn muốn cho khách thuê lại?');
    if (confirm && onReRent) {
      onReRent(tenant);
    }
  };

  const handleConvertToTenant = () => {
    const confirm = window.confirm('Bạn có chắc chắn muốn chuyển khách cọc thành khách đang thuê?');
    if (confirm && onConvertToTenant) {
      onConvertToTenant(tenant);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(tenant);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            {isReservation ? 'Chi tiết cọc giữ chỗ' : tenant.isActive ? 'Chi tiết khách đang thuê' : 'Chi tiết khách đã rời'}
          </h2>
          <button onClick={onClose} className="popup-close-btn">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="popup-content">
          {/* Thông tin khách */}
          <div className="popup-section">
            <h3 className="popup-section-title">Thông tin khách</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Họ tên:</span>
                <span className="info-value">{tenant.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Số điện thoại:</span>
                <span className="info-value">{tenant.phone || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{tenant.email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CMTND/CCCD:</span>
                <span className="info-value">{tenant.identityNumber || 'N/A'}</span>
              </div>
              {isReservation && (
                <>
                  <div className="info-item">
                    <span className="info-label">Tiền cọc giữ chỗ:</span>
                    <span className="info-value">{formatPrice(tenant.holdingDepositPrice)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ngày đặt cọc:</span>
                    <span className="info-value">{formatDate(tenant.depositDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ngày dự kiến chuyển vào:</span>
                    <span className="info-value">{formatDate(tenant.startDate)}</span>
                  </div>
                </>
              )}
              {!isReservation && (
                <>
                  <div className="info-item">
                    <span className="info-label">Địa chỉ thường trú:</span>
                    <span className="info-value">{tenant.permanentAddress || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                    <span className="info-value">{tenant.isActive ? 'Đang thuê' : 'Rời đi'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Là trưởng phòng:</span>
                    <span className="info-value">{tenant.isLeadRoom ? 'Có' : 'Không'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thông tin phòng */}
          <div className="popup-section">
            <h3 className="popup-section-title">Thông tin phòng</h3>
            {selectedRoom ? (
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Số phòng:</span>
                  <span className="info-value">{selectedRoom.roomNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái:</span>
                  <span className="info-value">{selectedRoom.isEmpty ? 'Trống' : 'Đang thuê'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giá thuê:</span>
                  <span className="info-value">{formatPrice(selectedRoom.price)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tiền cọc:</span>
                  <span className="info-value">{formatPrice(selectedRoom.depositPrice)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Diện tích:</span>
                  <span className="info-value">{selectedRoom.area || 0} m²</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sức chứa tối đa:</span>
                  <span className="info-value">{selectedRoom.maxTenants || 0} người</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày đặt cọc:</span>
                  <span className="info-value">{formatDate(selectedRoom.depositDate)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Không tìm thấy thông tin phòng</p>
            )}
          </div>
        </div>

        {/* Nút chức năng */}
        <div className="popup-buttons">
          {isReservation ? (
            <>
              <button className="btn-primary bg-green-600 hover:bg-green-700" onClick={handleConvertToTenant}>
                Chuyển thành khách thuê
              </button>
              <button className="btn-danger bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Xóa
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : tenant.isActive ? (
            <>
              <button className="btn-primary" onClick={onEdit}>
                Sửa
              </button>
              <button className="btn-danger" onClick={handleChangeStatus}>
                Chuyển trạng thái rời đi
              </button>
              <button className="btn-danger bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Xóa
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={onEdit}>
                Sửa
              </button>
              <button className="btn-success" onClick={handleReRent}>
                Cho thuê lại
              </button>
              <button className="btn-danger bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Xóa
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsPopup;