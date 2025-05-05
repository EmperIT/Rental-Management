import React, { useState } from 'react';
import { FaPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/service/AddServiceForm.css';

export default function AddServiceForm({ services, onAddService, onUpdateService, onDeleteService }) {
  const [newService, setNewService] = useState({
    name: '',
    rate: '',
    unit: '',
    type: 'FEE', // Default to FEE
  });
  const [editService, setEditService] = useState(null);
  const [editFields, setEditFields] = useState({ rate: '', unit: '', type: '' });

  const handleChange = (field, value) => {
    setNewService((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newService.name || !newService.rate || !newService.unit || !newService.type) {
      alert('Vui lòng điền đầy đủ thông tin dịch vụ!');
      return;
    }

    if (services.some((s) => s.name.toUpperCase() === newService.name.toUpperCase())) {
      alert('Tên dịch vụ đã tồn tại!');
      return;
    }

    const serviceData = {
      name: newService.name.toUpperCase(),
      rate: Number(newService.rate),
      unit: newService.unit,
      type: newService.type,
      hasIndices: newService.type === 'CONFIG',
    };
    console.log('Adding new service:', serviceData);

    onAddService(serviceData);

    setNewService({ name: '', rate: '', unit: '', type: 'FEE' });
  };

  const handleEdit = (service) => {
    setEditService(service);
    setEditFields({
      rate: service.rate.toString(),
      unit: service.unit,
      type: service.type,
    });
  };

  const handleUpdate = () => {
    if (!editFields.rate || isNaN(Number(editFields.rate)) || !editFields.unit || !editFields.type) {
      alert('Vui lòng nhập đầy đủ và hợp lệ các thông tin!');
      return;
    }

    const updatedFields = {
      rate: Number(editFields.rate),
      unit: editFields.unit,
      type: editFields.type,
    };
    console.log('Updating service:', { id: editService.id, ...updatedFields });

    onUpdateService(editService.id, updatedFields);
    setEditService(null);
    setEditFields({ rate: '', unit: '', type: '' });
  };

  const handleCancelEdit = () => {
    setEditService(null);
    setEditFields({ rate: '', unit: '', type: '' });
  };

  console.log('Services in AddServiceForm:', services);

  return (
    <div className="add-service-form">
      <h3>Quản lý dịch vụ</h3>

      <div className="existing-services">
        <h4>Dịch vụ hiện có:</h4>
        {services.length === 0 ? (
          <p>Không có dịch vụ nào.</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="service-row">
              {editService && editService.id === service.id ? (
                <div className="edit-service-form">
                  <span>{service.name}</span>
                  <div className="edit-rate-input">
                    <label>Đơn giá mới:</label>
                    <input
                      type="number"
                      value={editFields.rate}
                      onChange={(e) => handleEditChange('rate', e.target.value)}
                      placeholder="Nhập đơn giá mới"
                    />
                  </div>
                  <div className="edit-rate-input">
                    <label>Đơn vị:</label>
                    <input
                      type="text"
                      value={editFields.unit}
                      onChange={(e) => handleEditChange('unit', e.target.value)}
                      placeholder="Nhập đơn vị"
                    />
                  </div>
                  <div className="edit-rate-input">
                    <label>Loại dịch vụ:</label>
                    <select
                      value={editFields.type}
                      onChange={(e) => handleEditChange('type', e.target.value)}
                    >
                      <option value="FEE">FEE</option>
                      <option value="CONFIG">CONFIG</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleUpdate}>
                      <FaSave /> Lưu
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      <FaTimes /> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>
                    {service.name} ({service.rate.toLocaleString()} đ/1{service.unit}, {service.type})
                  </span>
                  <div className="service-actions">
                    <button className="btn-edit" onClick={() => handleEdit(service)}>
                      <FaEdit /> Sửa
                    </button>
                    <button className="btn-delete" onClick={() => onDeleteService(service.id)}>
                      <FaTimes /> Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <h4>Thêm dịch vụ mới</h4>
      <div className="add-service-inputs">
        <div>
          <label>Tên dịch vụ</label>
          <input
            type="text"
            value={newService.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ví dụ: PARKING_FEE"
          />
        </div>
        <div>
          <label>Đơn giá</label>
          <input
            type="number"
            value={newService.rate}
            onChange={(e) => handleChange('rate', e.target.value)}
            placeholder="Ví dụ: 50000"
          />
        </div>
        <div>
          <label>Đơn vị</label>
          <input
            type="text"
            value={newService.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="Ví dụ: tháng"
          />
        </div>
        <div>
          <label>Loại dịch vụ</label>
          <select
            value={newService.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="FEE">FEE</option>
            <option value="CONFIG">CONFIG</option>
          </select>
        </div>
      </div>
      <button className="btn-add-service" onClick={handleSubmit}>
        <FaPlus /> Thêm dịch vụ
      </button>
    </div>
  );
}