import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const RoomFormPopup = ({ onClose, onSubmit, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    price: '',
    depositPrice: '',
    area: '',
    depositDate: '',
    maxTenants: '',
    isEmpty: true,
    images: [],
    newImages: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        roomNumber: initialData.roomNumber || '',
        price: initialData.price || '',
        depositPrice: initialData.depositPrice || '',
        area: initialData.area || '',
        depositDate: initialData.depositDate ? new Date(initialData.depositDate).toISOString().split('T')[0] : '',
        maxTenants: initialData.maxTenants || '',
        isEmpty: initialData.isEmpty ?? true,
        images: initialData.images || [],
        newImages: [],
      });
    }
  }, [initialData]);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        newImages: Array.from(e.target.files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'isEmpty' ? value === 'true' : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { roomNumber, price, depositPrice, area, maxTenants } = formData;

    if (!roomNumber || !price || !depositPrice || !area || !maxTenants) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    const submitData = {
      ...formData,
      price: Number(formData.price),
      depositPrice: Number(formData.depositPrice),
      area: Number(formData.area),
      maxTenants: Number(formData.maxTenants),
      isEmpty: formData.isEmpty === true || formData.isEmpty === 'true',
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            {isEdit ? 'Sửa phòng trọ' : 'Thêm phòng trọ'}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleFormChange}
                  placeholder="A101"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="3500000"
                  required
                />
              </div>
              <div>
                <label htmlFor="depositPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Đặt cọc <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="depositPrice"
                  name="depositPrice"
                  value={formData.depositPrice}
                  onChange={handleFormChange}
                  placeholder="1000000"
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
                  placeholder="32"
                  required
                />
              </div>
              <div>
                <label htmlFor="maxTenants" className="block text-sm font-medium text-gray-700 mb-1">
                  Số người tối đa <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="maxTenants"
                  name="maxTenants"
                  value={formData.maxTenants}
                  onChange={handleFormChange}
                  placeholder="2"
                  required
                />
              </div>
              {isEdit && (
                <div>
                  <label htmlFor="depositDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày đặt cọc
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    id="depositDate"
                    name="depositDate"
                    value={formData.depositDate}
                    readOnly
                  />
                </div>
              )}
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh phòng
                </label>
                {isEdit && formData.images.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Ảnh hiện tại:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Phòng ${formData.roomNumber}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFormChange}
                />
              </div>
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