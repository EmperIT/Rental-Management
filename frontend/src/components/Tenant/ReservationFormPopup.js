import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import '../../styles/Tenant/ReservationFormPopup.css';

const ReservationFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false, rooms }) => {
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
    is_active: false,
    create_at: initialData ? initialData.create_at : new Date().toISOString(),
    update_at: new Date().toISOString(),
    contract: initialData?.contract || null,
  });

  const [filteredRooms, setFilteredRooms] = useState(rooms || []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    setFilteredRooms(rooms || []);
  }, [rooms]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deposit') {
      setFormData((prev) => ({
        ...prev,
        contract: {
          ...prev.contract,
          deposit: value ? parseInt(value.replace(/[^0-9]/g, '')) : 0,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    const selectedRoom = filteredRooms.find((room) => room.room_id === roomId);
    setFormData((prev) => ({
      ...prev,
      room_id: roomId,
      contract: selectedRoom
        ? {
            contract_id: `HD${Date.now()}`,
            deposit: selectedRoom.deposit || 0,
            rent_amount: selectedRoom.price || 0,
            start_date: prev.moveInDate || new Date().toISOString().split('T')[0],
            end_date: prev.moveInDate
              ? new Date(new Date(prev.moveInDate).setFullYear(new Date(prev.moveInDate).getFullYear() + 1)).toISOString().split('T')[0]
              : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          }
        : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, identity_number, room_id, moveInDate, contract } = formData;

    if (!name || !phone || !identity_number || !room_id || !moveInDate || !contract?.deposit) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    onSubmit(formData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">{isEdit ? 'Sửa cọc giữ chỗ' : 'Thêm cọc giữ chỗ'}</h2>
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
                  {filteredRooms && filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
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
                <label htmlFor="deposit" className="popup-label">
                  Tiền cọc <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="deposit"
                  name="deposit"
                  value={formData.contract ? formatPrice(formData.contract.deposit) : ''}
                  onChange={handleFormChange}
                  placeholder="1,500,000"
                  required
                />
              </div>
              <div>
                <label htmlFor="moveInDate" className="popup-label">
                  Ngày vào dự kiến <span className="popup-required">*</span>
                </label>
                <div className="popup-date-wrapper">
                  <input
                    type="date"
                    className="popup-input"
                    id="moveInDate"
                    name="moveInDate"
                    value={formData.moveInDate || ''}
                    onChange={handleFormChange}
                    required
                  />
                  <FaCalendarAlt className="popup-date-icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="popup-buttons">
            <button type="submit" className="btn-primary">
              Xác nhận
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

export default ReservationFormPopup;