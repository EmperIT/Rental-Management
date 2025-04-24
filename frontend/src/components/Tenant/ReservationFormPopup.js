import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const ReservationFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false, houses, rooms }) => {
  const [formData, setFormData] = useState({
    id: initialData ? initialData.id : Date.now(),
    name: '',
    phone: '',
    email: '',
    idNumber: '',
    house: '',
    room: '',
    deposit: '',
    moveInDate: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, idNumber, house, room, deposit, moveInDate } = formData;

    if (!name || !phone || !idNumber || !house || !room || !deposit || !moveInDate) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            {isEdit ? 'Sửa cọc giữ chỗ' : 'Thêm cọc giữ chỗ'}
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
                <label htmlFor="idNumber" className="popup-label">
                  CMTND/CCCD <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleFormChange}
                  placeholder="123456789"
                  required
                />
              </div>
            </div>
            <div className="popup-form-section">
              <div>
                <label htmlFor="house" className="popup-label">
                  Chọn nhà <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="house"
                  name="house"
                  value={formData.house}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn nhà</option>
                  {houses.map((house, index) => (
                    <option key={index} value={house}>{house}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="room" className="popup-label">
                  Chọn phòng <span className="popup-required">*</span>
                </label>
                <select
                  className="popup-select"
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((room, index) => (
                    <option key={index} value={room}>{room}</option>
                  ))}
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
                  value={formData.deposit}
                  onChange={handleFormChange}
                  placeholder="1,000,000"
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
                    value={formData.moveInDate}
                    onChange={handleFormChange}
                    required
                  />
                  <FaCalendarAlt className="popup-date-icon" />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="popup-label">
                  Ghi chú
                </label>
                <textarea
                  className="popup-textarea"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Ghi chú thêm"
                />
              </div>
            </div>
          </div>
          <div className="popup-buttons">
            <button
              type="submit"
              className="btn-primary"
            >
              Xác nhận
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationFormPopup;