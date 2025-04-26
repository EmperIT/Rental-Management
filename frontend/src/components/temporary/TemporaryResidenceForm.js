import React, { useState } from 'react';

const TemporaryResidenceForm = ({ onClose, onSubmit, rooms }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    id_number: '',
    issue_date: '',
    issue_place: '',
    phone_number: '',
    hometown: '',
    permanent_address: '',
    start_date: '',
    room_number: '',
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const phoneRegex = /^[0-9]{10,11}$/;
    const idRegex = /^[0-9]{9,12}$/;
    const today = new Date();
    const birthDate = name === 'birth_date' && value ? new Date(value) : null;
    const issueDate = name === 'issue_date' && value ? new Date(value) : null;
    const startDate = name === 'start_date' && value ? new Date(value) : null;

    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          newErrors.full_name = 'Họ và tên không được để trống';
        } else {
          delete newErrors.full_name;
        }
        break;
      case 'birth_date':
        if (!value) {
          newErrors.birth_date = 'Ngày sinh không được để trống';
        } else if (!birthDate || isNaN(birthDate.getTime()) || birthDate >= today) {
          newErrors.birth_date = 'Ngày sinh không hợp lệ, phải trước ngày hiện tại';
        } else {
          delete newErrors.birth_date;
        }
        break;
      case 'id_number':
        if (!value) {
          newErrors.id_number = 'Số CCCD/CMND không được để trống';
        } else if (!idRegex.test(value)) {
          newErrors.id_number = 'Số CCCD/CMND phải là số và có 9-12 chữ số';
        } else {
          delete newErrors.id_number;
        }
        break;
      case 'issue_date':
        if (!value) {
          newErrors.issue_date = 'Ngày cấp không được để trống';
        } else if (!issueDate || isNaN(issueDate.getTime()) || issueDate >= today) {
          newErrors.issue_date = 'Ngày cấp không hợp lệ, phải trước ngày hiện tại';
        } else {
          delete newErrors.issue_date;
        }
        break;
      case 'issue_place':
        if (!value.trim()) {
          newErrors.issue_place = 'Nơi cấp không được để trống';
        } else {
          delete newErrors.issue_place;
        }
        break;
      case 'phone_number':
        if (!value) {
          newErrors.phone_number = 'Số điện thoại không được để trống';
        } else if (!phoneRegex.test(value)) {
          newErrors.phone_number = 'Số điện thoại phải là số và có 10-11 chữ số';
        } else {
          delete newErrors.phone_number;
        }
        break;
      case 'hometown':
        if (!value.trim()) {
          newErrors.hometown = 'Quê quán không được để trống';
        } else {
          delete newErrors.hometown;
        }
        break;
      case 'permanent_address':
        if (!value.trim()) {
          newErrors.permanent_address = 'Nơi thường trú không được để trống';
        } else {
          delete newErrors.permanent_address;
        }
        break;
      case 'start_date':
        if (!value) {
          newErrors.start_date = 'Ngày bắt đầu ở trọ không được để trống';
        } else if (!startDate || isNaN(startDate.getTime()) || startDate < today) {
          newErrors.start_date = 'Ngày bắt đầu ở trọ phải từ hôm nay trở đi';
        } else {
          delete newErrors.start_date;
        }
        break;
      case 'room_number':
        if (!value) {
          newErrors.room_number = 'Vui lòng chọn phòng';
        } else {
          delete newErrors.room_number;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10,11}$/;
    const idRegex = /^[0-9]{9,12}$/;
    const today = new Date();
    const birthDate = formData.birth_date ? new Date(formData.birth_date) : null;
    const issueDate = formData.issue_date ? new Date(formData.issue_date) : null;
    const startDate = formData.start_date ? new Date(formData.start_date) : null;

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Họ và tên không được để trống';
    }
    if (!formData.birth_date) {
      newErrors.birth_date = 'Ngày sinh không được để trống';
    } else if (!birthDate || isNaN(birthDate.getTime()) || birthDate >= today) {
      newErrors.birth_date = 'Ngày sinh không hợp lệ, phải trước ngày hiện tại';
    }
    if (!formData.id_number) {
      newErrors.id_number = 'Số CCCD/CMND không được để trống';
    } else if (!idRegex.test(formData.id_number)) {
      newErrors.id_number = 'Số CCCD/CMND phải là số và có 9-12 chữ số';
    }
    if (!formData.issue_date) {
      newErrors.issue_date = 'Ngày cấp không được để trống';
    } else if (!issueDate || isNaN(issueDate.getTime()) || issueDate >= today) {
      newErrors.issue_date = 'Ngày cấp không hợp lệ, phải trước ngày hiện tại';
    }
    if (!formData.issue_place.trim()) {
      newErrors.issue_place = 'Nơi cấp không được để trống';
    }
    if (!formData.phone_number) {
      newErrors.phone_number = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại phải là số và có 10-11 chữ số';
    }
    if (!formData.hometown.trim()) {
      newErrors.hometown = 'Quê quán không được để trống';
    }
    if (!formData.permanent_address.trim()) {
      newErrors.permanent_address = 'Nơi thường trú không được để trống';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Ngày bắt đầu ở trọ không được để trống';
    } else if (!startDate || isNaN(startDate.getTime()) || startDate < today) {
      newErrors.start_date = 'Ngày bắt đầu ở trọ phải từ hôm nay trở đi';
    }
    if (!formData.room_number) {
      newErrors.room_number = 'Vui lòng chọn phòng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      alert('Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu trước khi gửi.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Khai báo tạm trú</h2>
        <div className="form-group">
          <label>Họ và tên <span className="text-danger">*</span></label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.full_name && <span className="text-danger">{errors.full_name}</span>}
        </div>
        <div className="form-group">
          <label>Ngày sinh <span className="text-danger">*</span></label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.birth_date && <span className="text-danger">{errors.birth_date}</span>}
        </div>
        <div className="form-group">
          <label>Số CCCD/CMND <span className="text-danger">*</span></label>
          <input
            type="text"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.id_number && <span className="text-danger">{errors.id_number}</span>}
        </div>
        <div className="form-group">
          <label>Ngày cấp <span className="text-danger">*</span></label>
          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.issue_date && <span className="text-danger">{errors.issue_date}</span>}
        </div>
        <div className="form-group">
          <label>Nơi cấp <span className="text-danger">*</span></label>
          <input
            type="text"
            name="issue_place"
            value={formData.issue_place}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.issue_place && <span className="text-danger">{errors.issue_place}</span>}
        </div>
        <div className="form-group">
          <label>Số điện thoại <span className="text-danger">*</span></label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.phone_number && <span className="text-danger">{errors.phone_number}</span>}
        </div>
        <div className="form-group">
          <label>Quê quán <span className="text-danger">*</span></label>
          <textarea
            name="hometown"
            value={formData.hometown}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.hometown && <span className="text-danger">{errors.hometown}</span>}
        </div>
        <div className="form-group">
          <label>Nơi thường trú <span className="text-danger">*</span></label>
          <textarea
            name="permanent_address"
            value={formData.permanent_address}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.permanent_address && <span className="text-danger">{errors.permanent_address}</span>}
        </div>
        <div className="form-group">
          <label>Ngày bắt đầu ở trọ <span className="text-danger">*</span></label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          />
          {errors.start_date && <span className="text-danger">{errors.start_date}</span>}
        </div>
        <div className="form-group">
          <label>Số phòng thuê <span className="text-danger">*</span></label>
          <select
            name="room_number"
            value={formData.room_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
          >
            <option value="">Chọn phòng</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.roomName}>
                {room.roomName}
              </option>
            ))}
          </select>
          {errors.room_number && <span className="text-danger">{errors.room_number}</span>}
        </div>
        <div className="form-buttons">
          <button className="btn-primary" onClick={handleSubmit}>
            Gửi
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporaryResidenceForm;