import React, { useState } from 'react';

const initialInfo = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901234567',
  address: '123 Đường Láng, Đống Đa, Hà Nội',
};

export default function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState(initialInfo);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="cd-section">
      <h3>Thông tin cá nhân</h3>
      {isEditing ? (
        <div className="cd-personal-info-form">
          <div className="cd-info-field">
            <label>Họ và tên:</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div className="cd-info-field">
            <label>Email:</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </div>
          <div className="cd-info-field">
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            />
          </div>
          <div className="cd-info-field">
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
            />
          </div>
          <button className="cd-button" onClick={handleEditToggle}>Lưu</button>
        </div>
      ) : (
        <div className="cd-personal-info-display">
          <p><strong>Họ và tên:</strong> {info.name}</p>
          <p><strong>Email:</strong> {info.email}</p>
          <p><strong>Số điện thoại:</strong> {info.phone}</p>
          <p><strong>Địa chỉ:</strong> {info.address}</p>
          <button className="cd-button" onClick={handleEditToggle}>Chỉnh sửa</button>
        </div>
      )}
    </div>
  );
}