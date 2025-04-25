import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Tenant/TenantFormPopup.css';

const TenantFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false, rooms, onUpdateRoom }) => {
  const [formData, setFormData] = useState({
    tenant_id: initialData ? initialData.tenant_id : Date.now(),
    room_id: '',
    name: '',
    email: '',
    phone: '',
    identity_number: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    is_lead_room: false,
    is_active: true,
    create_at: initialData ? initialData.create_at : new Date().toISOString(),
    update_at: new Date().toISOString(),
    contract: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        update_at: new Date().toISOString(),
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
    const selectedRoom = rooms.find((room) => room.room_id === roomId);
    setFormData((prev) => ({
      ...prev,
      room_id: roomId,
      roomName: selectedRoom?.roomName || '',
      floor: selectedRoom?.floor || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, identity_number, room_id, province, district, ward } = formData;

    if (!name || !phone || !identity_number || !room_id || !province || !district || !ward) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    const permanent_address = `${formData.address ? formData.address + ', ' : ''}${formData.ward}, ${formData.district}, ${formData.province}`;

    const selectedRoom = rooms.find((room) => room.room_id === formData.room_id);

    let contract = formData.contract;
    if (!isEdit && formData.is_lead_room && selectedRoom) {
      contract = {
        contract_id: `HD${Date.now()}`,
        deposit: selectedRoom.deposit,
        rent_amount: selectedRoom.price,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      };
    }

    const tenantData = {
      ...formData,
      permanent_address,
      contract,
    };

    let account = null;
    if (formData.is_lead_room) {
      account = {
        username: formData.email || formData.phone,
        password: 'Password123!',
      };
    }

    if (!isEdit && selectedRoom) {
      const updatedRoom = { ...selectedRoom };
      if (updatedRoom.status === 'Trống') {
        updatedRoom.status = 'Đã thuê';
      }
      if (formData.is_lead_room) {
        updatedRoom.leadTenant = formData.name;
      }
      onUpdateRoom(updatedRoom);
    }

    onSubmit(tenantData, account);
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
                <label htmlFor="identity_number" className="popup-label">
                  CMTND/CCCD <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="identity_number"
                  name="identity_number"
                  value={formData.identity_number}
                  onChange={handleFormChange}
                  placeholder="123456789"
                  required
                />
              </div>
            </div>
            <div className="popup-form-section">
              <div>
                <label htmlFor="room_id" className="popup-label">
                  Chọn phòng <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="room_id"
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleRoomChange}
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms && rooms.length > 0 ? (
                    rooms.map((room) => (
                      <option key={room.room_id} value={room.room_id}>
                        {`${room.roomName || 'N/A'} - ${room.floor || 'N/A'} - ${room.status || 'N/A'} - ${formatPrice(room.price)}`}
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
                <label htmlFor="province" className="popup-label">
                  Tỉnh/Thành phố <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                </select>
              </div>
              <div>
                <label htmlFor="district" className="popup-label">
                  Quận/Huyện <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn quận/huyện</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận Ba Đình">Quận Ba Đình</option>
                </select>
              </div>
              <div>
                <label htmlFor="ward" className="popup-label">
                  Phường/Xã <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="ward"
                  name="ward"
                  value={formData.ward}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn phường/xã</option>
                  <option value="Phường 1">Phường 1</option>
                  <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                </select>
              </div>
              <div>
                <label htmlFor="address" className="popup-label">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="123 Đường Láng"
                />
              </div>
              <div>
                <label htmlFor="is_lead_room" className="popup-label">
                  Là trưởng phòng
                </label>
                <input
                  type="checkbox"
                  id="is_lead_room"
                  name="is_lead_room"
                  checked={formData.is_lead_room}
                  onChange={handleFormChange}
                  className="popup-checkbox"
                />
              </div>
              <div>
                <label htmlFor="is_active" className="popup-label">
                  Trạng thái hoạt động
                </label>
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
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