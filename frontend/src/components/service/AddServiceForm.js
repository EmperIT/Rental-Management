import React, { useState } from 'react';
import { FaPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/service/AddServiceForm.css';

export default function AddServiceForm({ services, onAddService, onUpdateService, onDeleteService }) {
    const [newService, setNewService] = useState({
      name: '',
      rate: '',
      unit: '',
      hasIndices: false,
    });
    const [editService, setEditService] = useState(null);
    const [editRate, setEditRate] = useState('');
  
    const handleChange = (field, value) => {
      setNewService((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleSubmit = () => {
      if (!newService.name || !newService.rate || !newService.unit) {
        alert('Vui lòng điền đầy đủ thông tin dịch vụ!');
        return;
      }
  
      onAddService({
        name: newService.name,
        rate: Number(newService.rate),
        unit: newService.unit,
        hasIndices: newService.hasIndices,
      });
  
      setNewService({ name: '', rate: '', unit: '', hasIndices: false });
    };
  
    const handleEdit = (service) => {
      setEditService(service);
      setEditRate(service.rate.toString());
    };
  
    const handleUpdate = () => {
      if (!editRate || isNaN(Number(editRate))) {
        alert('Vui lòng nhập đơn giá hợp lệ!');
        return;
      }
  
      onUpdateService(editService.id, { rate: Number(editRate) });
      setEditService(null);
      setEditRate('');
    };
  
    const handleCancelEdit = () => {
      setEditService(null);
      setEditRate('');
    };
  
    const isDefaultService = (serviceId) => {
      return serviceId === 1 || serviceId === 2; // Điện (id: 1) and Nước (id: 2) are default
    };
  
    return (
      <div className="add-service-form">
        <h3>Quản lý dịch vụ</h3>
  
        <div className="existing-services">
          <h4>Dịch vụ hiện có:</h4>
          {services.map((service) => (
            <div key={service.id} className="service-row">
              {editService && editService.id === service.id ? (
                <div className="edit-service-form">
                  <span>{service.name} ({service.unit})</span>
                  <div className="edit-rate-input">
                    <label>Đơn giá mới:</label>
                    <input
                      type="number"
                      value={editRate}
                      onChange={(e) => setEditRate(e.target.value)}
                      placeholder="Nhập đơn giá mới"
                    />
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
                    {service.name} ({service.rate.toLocaleString()} đ/1{service.unit})
                  </span>
                  <div className="service-actions">
                    <button className="btn-edit" onClick={() => handleEdit(service)}>
                      <FaEdit /> Sửa
                    </button>
                    {!isDefaultService(service.id) && (
                      <button className="btn-delete" onClick={() => onDeleteService(service.id)}>
                        <FaTimes /> Xóa
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
  
        <h4>Thêm dịch vụ mới</h4>
        <div className="add-service-inputs">
          <div>
            <label>Tên dịch vụ</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ví dụ: Điện"
            />
          </div>
          <div>
            <label>Đơn giá</label>
            <input
              type="number"
              value={newService.rate}
              onChange={(e) => handleChange('rate', e.target.value)}
              placeholder="Ví dụ: 1700"
            />
          </div>
          <div>
            <label>Đơn vị</label>
            <input
              type="text"
              value={newService.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              placeholder="Ví dụ: kWh"
            />
          </div>
          <div className="checkbox-group">
            <label>Có chỉ số</label>
            <input
              type="checkbox"
              checked={newService.hasIndices}
              onChange={(e) => handleChange('hasIndices', e.target.checked)}
            />
          </div>
        </div>
        <button className="btn-add-service" onClick={handleSubmit}>
          <FaPlus /> Thêm dịch vụ
        </button>
      </div>
    );
  }