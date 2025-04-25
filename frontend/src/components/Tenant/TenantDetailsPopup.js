import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Tenant/TenantDetailsPopup.css';

const TenantDetailsPopup = ({ tenant, onClose, onEdit, onChangeStatus, onReRent, onConvertToTenant, isReservation, rooms }) => {
  const selectedRoom = rooms.find((room) => room.room_id === tenant.room_id);

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

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            {isReservation ? 'Chi tiết cọc giữ chỗ' : tenant.is_active ? 'Chi tiết khách đang thuê' : 'Chi tiết khách đã rời'}
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
                <span className="info-value">{tenant.identity_number || tenant.idNumber || 'N/A'}</span>
              </div>
              {isReservation && (
                <>
                  <div className="info-item">
                    <span className="info-label">Tỉnh/Thành phố:</span>
                    <span className="info-value">{tenant.province || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Quận/Huyện:</span>
                    <span className="info-value">{tenant.district || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phường/Xã:</span>
                    <span className="info-value">{tenant.ward || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">{tenant.address || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ngày dự kiến chuyển vào:</span>
                    <span className="info-value">{formatDate(tenant.moveInDate)}</span>
                  </div>
                </>
              )}
              {!isReservation && (
                <>
                  <div className="info-item">
                    <span className="info-label">Địa chỉ thường trú:</span>
                    <span className="info-value">{tenant.address || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                    <span className="info-value">
                      {tenant.is_active ? 'Đang thuê' : 'Rời đi'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Là trưởng phòng:</span>
                    <span className="info-value">{tenant.is_lead_room ? 'Có' : 'Không'}</span>
                  </div>
                  {!tenant.is_active && tenant.reason_for_leaving && (
                    <div className="info-item">
                      <span className="info-label">Lý do rời đi:</span>
                      <span className="info-value">{tenant.reason_for_leaving}</span>
                    </div>
                  )}
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
                  <span className="info-label">Tên phòng:</span>
                  <span className="info-value">{selectedRoom.roomName || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tầng:</span>
                  <span className="info-value">{selectedRoom.floor || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái:</span>
                  <span className="info-value">{selectedRoom.status || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giá thuê:</span>
                  <span className="info-value">{formatPrice(selectedRoom.price)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tiền cọc:</span>
                  <span className="info-value">{formatPrice(selectedRoom.deposit)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Diện tích:</span>
                  <span className="info-value">{selectedRoom.area || 0} m²</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sức chứa:</span>
                  <span className="info-value">{selectedRoom.capacity || 0} người</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày có thể thuê:</span>
                  <span className="info-value">{selectedRoom.availableDate || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Không tìm thấy thông tin phòng</p>
            )}
          </div>

          {/* Thông tin hợp đồng - Chỉ hiển thị cho khách thuê, không hiển thị cho khách cọc */}
          {!isReservation && tenant.contract && (
            <div className="popup-section">
              <h3 className="popup-section-title">Thông tin hợp đồng</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Mã hợp đồng:</span>
                  <span className="info-value">{tenant.contract.contract_id || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tiền cọc:</span>
                  <span className="info-value">{formatPrice(tenant.contract.deposit)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tiền thuê:</span>
                  <span className="info-value">{formatPrice(tenant.contract.rent_amount)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày bắt đầu:</span>
                  <span className="info-value">{formatDate(tenant.contract.start_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày kết thúc:</span>
                  <span className="info-value">{formatDate(tenant.contract.end_date)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nút chức năng */}
        <div className="popup-buttons">
          {isReservation ? (
            <>
              <button className="btn-primary bg-green-600 hover:bg-green-700" onClick={handleConvertToTenant}>
                Chuyển thành khách thuê
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : tenant.is_active ? (
            <>
              <button className="btn-primary" onClick={onEdit}>
                Sửa
              </button>
              <button className="btn-danger" onClick={handleChangeStatus}>
                Chuyển trạng thái rời đi
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