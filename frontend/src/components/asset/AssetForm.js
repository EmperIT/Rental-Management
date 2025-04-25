import React, { useState } from 'react';
import { FaPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/asset/AddAssetForm.css';

export default function AddAssetForm({ assets, onAddAsset, onUpdateAsset, onDeleteAsset }) {
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: '',
    unit: '',
  });
  const [editAsset, setEditAsset] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleChange = (field, value) => {
    setNewAsset((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newAsset.name || !newAsset.value || !newAsset.unit) {
      alert('Vui lòng điền đầy đủ thông tin tài sản!');
      return;
    }

    onAddAsset({
      name: newAsset.name,
      value: Number(newAsset.value),
      unit: newAsset.unit,
    });

    setNewAsset({ name: '', value: '', unit: '' });
  };

  const handleEdit = (asset) => {
    setEditAsset(asset);
    setEditValue(asset.value.toString());
  };

  const handleUpdate = () => {
    if (!editValue || isNaN(Number(editValue))) {
      alert('Vui lòng nhập giá trị hợp lệ!');
      return;
    }

    onUpdateAsset(editAsset.id, { value: Number(editValue) });
    setEditAsset(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditAsset(null);
    setEditValue('');
  };

  const isDefaultAsset = (assetId) => {
    return assetId === 1 || assetId === 2; // Bàn (id: 1) and Ghế (id: 2) are default
  };

  return (
    <div className="add-asset-form">
      <h3>Quản lý tài sản</h3>

      <div className="existing-assets">
        <h4>Tài sản hiện có:</h4>
        {assets.map((asset) => (
          <div key={asset.id} className="asset-row">
            {editAsset && editAsset.id === asset.id ? (
              <div className="edit-asset-form">
                <span>{asset.name} ({asset.unit})</span>
                <div className="edit-value-input">
                  <label>Giá trị mới:</label>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Nhập giá trị mới"
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
                  {asset.name} ({asset.value.toLocaleString()} đ/1{asset.unit})
                </span>
                <div className="asset-actions">
                  <button className="btn-edit" onClick={() => handleEdit(asset)}>
                    <FaEdit /> Sửa
                  </button>
                  {!isDefaultAsset(asset.id) && (
                    <button className="btn-delete" onClick={() => onDeleteAsset(asset.id)}>
                      <FaTimes /> Xóa
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <h4>Thêm tài sản mới</h4>
      <div className="add-asset-inputs">
        <div>
          <label>Tên tài sản</label>
          <input
            type="text"
            value={newAsset.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ví dụ: Bàn"
          />
        </div>
        <div>
          <label>Giá trị</label>
          <input
            type="number"
            value={newAsset.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="Ví dụ: 500000"
          />
        </div>
        <div>
          <label>Đơn vị</label>
          <input
            type="text"
            value={newAsset.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            placeholder="Ví dụ: Cái"
          />
        </div>
      </div>
      <button className="btn-add-asset" onClick={handleSubmit}>
        <FaPlus /> Thêm tài sản
      </button>
    </div>
  );
}