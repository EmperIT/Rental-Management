import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { updateRoom, findAllTenantsByFilter } from '../../services/rentalService';
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
    holdingDepositPrice: initialData ? initialData.holdingDepositPrice : 0,
    depositDate: initialData ? initialData.depositDate : '',
    startDate: initialData ? initialData.startDate : '',
    gender: initialData ? initialData.gender : '',
    birthday: initialData ? (initialData.birthday || initialData.birthDate) : '',
    createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialData) {
      console.log('Initial data for TenantFormPopup:', initialData); // Debug
      setFormData({
        ...initialData,
        gender: initialData.gender || '',
        birthday: initialData.birthday || initialData.birthDate || '',
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const { name, phone, identityNumber, roomId, depositDate, startDate, birthday, gender } = formData;

    // Debug: Log formData
    console.log('Tenant formData on submit:', formData);

    // Validate required fields
    if (!name || !phone || !identityNumber || !roomId) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    // Validate date consistency for depositDate and startDate
    if (depositDate && startDate) {
      const deposit = new Date(depositDate);
      const start = new Date(startDate);
      if (deposit > start) {
        alert('Ngày bắt đầu thuê không thể sớm hơn ngày đặt cọc.');
        return;
      }
    }

    // Validate birthday (must be in the past)
    if (birthday) {
      const birth = new Date(birthday);
      const currentDate = new Date();
      if (birth > currentDate) {
        alert('Ngày sinh không thể là một ngày trong tương lai.');
        return;
      }
    }

    // Determine isActive based on startDate
    const currentDate = new Date();
    const start = startDate ? new Date(startDate) : null;
    const isActive = start ? start <= currentDate : false;

    // Determine isLeadRoom: Check if the room has any existing tenants
    let isLeadRoom = false;
    if (!isEdit) {
      try {
        const response = await findAllTenantsByFilter(roomId, undefined, 1, 1);
        const existingTenants = response.tenants || [];
        isLeadRoom = existingTenants.length === 0;
      } catch (error) {
        console.error('Lỗi khi kiểm tra khách thuê hiện có:', error);
        alert('Không thể kiểm tra trạng thái phòng: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
        return;
      }
    } else {
      isLeadRoom = initialData.isLeadRoom;
    }

    // Prepare tenant data
    const tenantData = {
      ...formData,
      isActive,
      isLeadRoom,
      startDate: startDate || null,
      birthday: birthday || null,
      gender: gender || null,
      updatedAt: new Date().toISOString(),
    };

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
              <div>
                <label htmlFor="birthday" className="popup-label">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="popup-input"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday ? formData.birthday.split('T')[0] : ''}
                  onChange={handleFormChange}
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
                <label htmlFor="gender" className="popup-label">
                  Giới tính
                </label>
                <select
                  className="popup-select"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
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