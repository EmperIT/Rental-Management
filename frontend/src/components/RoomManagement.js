import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/dashboard/DashboardContent.css';

const RoomManagement = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [rooms, setRooms] = useState([]);
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
  });

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

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newRooms = [
        {
          roomName: 'Phòng 101',
          floor: 'Tầng 1',
          price: '3,000,000',
          deposit: '1,500,000',
          area: '25',
          capacity: '2',
          availableDate: '2025-05-01',
        },
      ];
      setRooms((prev) => [...prev, ...newRooms]);
      alert('Đã thêm phòng từ file Excel thành công!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { roomName, floor, price, deposit, area, capacity, availableDate } = formData;

    if (!roomName || !floor || !price || !deposit || !area || !capacity || !availableDate) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    setRooms((prev) => [...prev, { ...formData }]);
    alert('Thêm phòng trọ thành công!');

    setFormData({
      roomName: '',
      floor: '',
      price: '',
      deposit: '',
      area: '',
      capacity: '',
      availableDate: '',
      amenities: [],
      photos: [],
    });
  };

  return (
    <>
      <h2 className="dashboard-title">Quản lý Phòng trọ</h2>

      <div className="mb-4">
        <button
          className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setActiveTab('manual')}
        >
          Thêm phòng trọ
        </button>
        <button
          className={`btn ${activeTab === 'excel' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('excel')}
        >
          Thêm từ Excel
        </button>
      </div>

      {activeTab === 'manual' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Tạo phòng trọ</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="roomName" className="form-label">
                    Tên phòng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="roomName"
                    name="roomName"
                    value={formData.roomName}
                    onChange={handleFormChange}
                    placeholder="Phòng 101"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="floor" className="form-label">
                    Tầng/Khu/Dãy <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleFormChange}
                    placeholder="Tầng 1"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Giá phòng <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="3,000,000"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="deposit" className="form-label">
                    Đặt cọc <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deposit"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleFormChange}
                    placeholder="1,500,000"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="area" className="form-label">
                    Diện tích (m²) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleFormChange}
                    placeholder="25"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="capacity" className="form-label">
                    Số người phù hợp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    placeholder="2"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="availableDate" className="form-label">
                    Ngày phòng sắp trống <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="availableDate"
                    name="availableDate"
                    value={formData.availableDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tiện ích</label>
                  <div className="d-flex flex-wrap">
                    {amenitiesList.map((amenity) => (
                      <div className="form-check me-3" key={amenity.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={amenity.id}
                          name="amenity.id"
                          checked={formData.amenities.includes(amenity.id)}
                          onChange={handleFormChange}
                        />
                        <label className="form-check-label" htmlFor={amenity.id}>
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="photos" className="form-label">Ảnh phòng</label>
                  <input
                    type="file"
                    className="form-control"
                    id="photos"
                    name="photos"
                    multiple
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary me-2">
                  Lưu
                </button>
                <button
                  type="submit"
                  className="btn btn-outline-primary"
                  onClick={() => alert('Lưu và thêm phòng khác (chức năng mock)')}
                >
                  Lưu và thêm phòng khác
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'excel' && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Thêm phòng trọ từ file Excel</h5>
            <p>
              Tải xuống tệp mẫu để điền thông tin phòng trọ:{' '}
              <a href="/path-to-sample.xlsx" download className="btn btn-link p-0">
                Tải tệp mẫu
              </a>
            </p>
            <div className="mb-3">
              <label htmlFor="excelFile" className="form-label">Chọn tệp</label>
              <input
                type="file"
                className="form-control"
                id="excelFile"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
              />
            </div>
            <button className="btn btn-primary" onClick={() => document.getElementById('excelFile').click()}>
              Chọn tệp
            </button>
            <button className="btn btn-primary ms-2" onClick={() => alert('Lưu file Excel (chức năng mock)')}>
              Lưu
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h5 className="card-header">Danh sách phòng trọ</h5>
        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tên phòng</th>
                <th>Tầng/Khu/Dãy</th>
                <th>Giá phòng</th>
                <th>Đặt cọc</th>
                <th>Diện tích</th>
                <th>Số người</th>
                <th>Ngày trống</th>
                <th>Tiện ích</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <tr key={index}>
                    <td>{room.roomName}</td>
                    <td>{room.floor}</td>
                    <td>{room.price}</td>
                    <td>{room.deposit}</td>
                    <td>{room.area} m²</td>
                    <td>{room.capacity}</td>
                    <td>{room.availableDate}</td>
                    <td>{room.amenities.join(', ') || 'Không có'}</td>
                    <td>
                      <Link to="#" className="btn btn-sm btn-icon">
                        <FaEdit />
                      </Link>
                      <Link to="#" className="btn btn-sm btn-icon">
                        <FaTrash />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    Chưa có phòng trọ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RoomManagement;