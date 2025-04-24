import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const RoomFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    roomName: '',
    floor: '',
    price: '',
    deposit: '',
    area: '',
    capacity: '',
    availableDate: '',
    amenities: [],
    photos: [],
    status: 'Trống',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'ac', label: 'Điều hòa' },
    { id: 'heater', label: 'Máy nước nóng' },
    { id: 'parking', label: 'Chỗ để xe' },
  ];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, name]
          : prev.amenities.filter((item) => item !== name),
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        photos: Array.from(e.target.files),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { roomName, floor, price, deposit, area, capacity, availableDate, status } = formData;

    if (!roomName || !floor || !price || !deposit || !area || !capacity || !availableDate || !status) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            {isEdit ? 'Sửa phòng trọ' : 'Thêm phòng trọ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="roomName"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleFormChange}
                  placeholder="Phòng 101"
                  required
                />
              </div>
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                  Tầng/Khu/Dãy <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleFormChange}
                  placeholder="Tầng 1"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="3,000,000"
                  required
                />
              </div>
              <div>
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">
                  Đặt cọc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleFormChange}
                  placeholder="1,500,000"
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Diện tích (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleFormChange}
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Số người phù hợp <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="2"
                  required
                />
              </div>
              <div>
                <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày phòng sắp trống <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="availableDate"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Trống">Trống</option>
                  <option value="Đang cho thuê">Đang cho thuê</option>
                </select>
              </div>
              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh phòng
                </label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="photos"
                  name="photos"
                  multiple
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiện ích</label>
            <div className="flex flex-wrap gap-3">
              {amenitiesList.map((amenity) => (
                <div className="flex items-center" key={amenity.id}>
                  <input
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    type="checkbox"
                    id={amenity.id}
                    name={amenity.id}
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={handleFormChange}
                  />
                  <label className="ml-2 text-sm text-gray-600" htmlFor={amenity.id}>
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-md font-medium"
            >
              {isEdit ? 'Cập nhật' : 'Lưu'}
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md font-medium"
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

export default RoomFormPopup;