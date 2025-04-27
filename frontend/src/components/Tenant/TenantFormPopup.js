import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { updateRoom } from '../../services/rentalService';
import '../../styles/Tenant/TenantFormPopup.css';

const TenantFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false, rooms }) => {
  const [formData, setFormData] = useState({
    id: initialData ? initialData.id : '',
    roomId: initialData ? initialData.roomId : '',
    name: initialData ? initialData.name : '',
    email: initialData ? initialData.email : '',
    phone: initialData ? initialData.phone : '',
    identityNumber: initialData ? initialData.identityNumber : '',
    permanentAddress: initialData ? initialData.permanentAddress : '',
    isLeadRoom: initialData ? initialData.isLeadRoom : false,
    isActive: initialData ? initialData.isActive : true,
    holdingDepositPrice: initialData ? initialData.holdingDepositPrice : 0,
    depositDate: initialData ? initialData.depositDate : '',
    startDate: initialData ? initialData.startDate : '',
    createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      roomId: roomId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, identityNumber, roomId, depositDate } = formData;

    if (!name || !phone || !identityNumber || !roomId) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    const tenantData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    // Cập nhật depositDate của phòng nếu có depositDate từ khách thuê
    if (depositDate) {
      const selectedRoom = rooms.find((room) => room.id === roomId);
      if (selectedRoom) {
        try {
          await updateRoom(roomId, {
            ...selectedRoom,
            depositDate: depositDate,
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Lỗi khi cập nhật depositDate của phòng:', error);
          alert('Không thể cập nhật ngày đặt cọc của phòng: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
          return;
        }
      }
    }

    onSubmit(tenantData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            {isEdit ? 'Sửa thông tin khách thuê' : 'Thêm khách thuê'}
          </h2>
          <button onClick={onClose} className="popup-close-btn">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="popup-form-grid">
            <div className="popup-form-section">
              <div>
                <label htmlFor="name" className="popup-label">
                  Họ tên <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="popup-label">
                  Số điện thoại <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="0901234567"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="popup-label">
                  Email
                </label>
                <input
                  type="email"
                  className="popup-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label htmlFor="identityNumber" className="popup-label">
                  CMTND/CCCD <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="identityNumber"
                  name="identityNumber"
                  value={formData.identityNumber}
                  onChange={handleFormChange}
                  placeholder="123456789"
                  required
                />
              </div>
            </div>
            <div className="popup-form-section">
              <div>
                <label htmlFor="roomId" className="popup-label">
                  Chọn phòng <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleRoomChange}
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms && rooms.length > 0 ? (
                    rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {`${room.roomNumber || 'N/A'} - ${room.isEmpty ? 'Trống' : 'Đang thuê'} - ${formatPrice(room.price)}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Không có phòng nào
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="permanentAddress" className="popup-label">
                  Địa chỉ thường trú
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleFormChange}
                  placeholder="Số 123, Đường ABC, Quận XYZ, TP. HCM"
                />
              </div>
              <div>
                <label htmlFor="holdingDepositPrice" className="popup-label">
                  Tiền cọc giữ chỗ
                </label>
                <input
                  type="number"
                  className="popup-input"
                  id="holdingDepositPrice"
                  name="holdingDepositPrice"
                  value={formData.holdingDepositPrice}
                  onChange={handleFormChange}
                  placeholder="1000000"
                />
              </div>
              <div>
                <label htmlFor="depositDate" className="popup-label">
                  Ngày đặt cọc
                </label>
                <input
                  type="date"
                  className="popup-input"
                  id="depositDate"
                  name="depositDate"
                  value={formData.depositDate ? formData.depositDate.split('T')[0] : ''}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="startDate" className="popup-label">
                  Ngày bắt đầu thuê
                </label>
                <input
                  type="date"
                  className="popup-input"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="isLeadRoom" className="popup-label">
                  Là trưởng phòng
                </label>
                <input
                  type="checkbox"
                  id="isLeadRoom"
                  name="isLeadRoom"
                  checked={formData.isLeadRoom}
                  onChange={handleFormChange}
                  className="popup-checkbox"
                />
              </div>
              <div>
                <label htmlFor="isActive" className="popup-label">
                  Trạng thái hoạt động
                </label>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="popup-checkbox"
                />
              </div>
            </div>
          </div>
          <div className="popup-buttons">
            <button type="submit" className="btn-primary">
              {isEdit ? 'Cập nhật' : 'Thêm khách thuê'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantFormPopup;