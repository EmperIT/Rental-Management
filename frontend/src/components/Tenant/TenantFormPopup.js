import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const TenantFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false, houses, rooms }) => {
  const [formData, setFormData] = useState({
    id: initialData ? initialData.id : Date.now(),
    name: '',
    phone: '',
    email: '',
    identity_number: '',
    idFrontPhoto: null,
    idBackPhoto: null,
    house: '',
    room: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    notes: '',
    is_lead_room: false,
    deposit: '',
    rent_amount: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        deposit: initialData.contract?.deposit || '',
        rent_amount: initialData.contract?.rent_amount || '',
        start_date: initialData.contract?.start_date || '',
        end_date: initialData.contract?.end_date || '',
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, identity_number, house, room, province, district, ward, deposit, rent_amount, start_date, end_date } = formData;

    if (!name || !phone || !identity_number || !house || !room || !province || !district || !ward || !deposit || !rent_amount || !start_date || !end_date) {
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
              <div>
                <label htmlFor="idFrontPhoto" className="popup-label">
                  Ảnh mặt trước CMTND/CCCD
                </label>
                <input
                  type="file"
                  className="popup-input"
                  id="idFrontPhoto"
                  name="idFrontPhoto"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="idBackPhoto" className="popup-label">
                  Ảnh mặt sau CMTND/CCCD
                </label>
                <input
                  type="file"
                  className="popup-input"
                  id="idBackPhoto"
                  name="idBackPhoto"
                  onChange={handleFormChange}
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
                <label htmlFor="rent_amount" className="popup-label">
                  Tiền thuê <span className="popup-required">*</span>
                </label>
                <input
                  type="text"
                  className="popup-input"
                  id="rent_amount"
                  name="rent_amount"
                  value={formData.rent_amount}
                  onChange={handleFormChange}
                  placeholder="5,000,000"
                  required
                />
              </div>
              <div>
                <label htmlFor="start_date" className="popup-label">
                  Ngày bắt đầu <span className="popup-required">*</span>
                </label>
                <div className="popup-date-wrapper">
                  <input
                    type="date"
                    className="popup-input"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleFormChange}
                    required
                  />
                  <FaCalendarAlt className="popup-date-icon" />
                </div>
              </div>
              <div>
                <label htmlFor="end_date" className="popup-label">
                  Ngày kết thúc <span className="popup-required">*</span>
                </label>
                <div className="popup-date-wrapper">
                  <input
                    type="date"
                    className="popup-input"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
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