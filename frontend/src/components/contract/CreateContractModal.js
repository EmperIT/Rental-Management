import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/contract/CreateContractModal.css";

const DURATION_OPTIONS = [
  { label: '6 tháng', months: 6 },
  { label: '1 năm', months: 12 },
  { label: '2 năm', months: 24 },
  { label: 'Tùy chỉnh', months: 0 },
];

const FAKE_ROOMS = ['Phòng 101', 'Phòng 102', 'Phòng 203'];
const FAKE_SERVICES = [
  { name: 'Điện', price: '3.500đ/kWh' },
  { name: 'Nước', price: '20.000đ/m³' },
  { name: 'Internet', price: '100.000đ/tháng' },
];
const FAKE_ASSETS = ['Giường', 'Tủ lạnh', 'Máy giặt', 'Bàn học'];

// Danh sách dịch vụ và tài sản có thể chọn thêm
const ADDITIONAL_SERVICES = [
  { name: 'Vệ sinh', price: '50.000đ/lần' },
  { name: 'Giữ xe', price: '80.000đ/tháng' },
];
const ADDITIONAL_ASSETS = ['Bếp điện', 'Điều hòa', 'Tivi'];

const CreateContractModal = ({ isOpen, onClose }) => {
  const [duration, setDuration] = useState(12);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [guests, setGuests] = useState([{ name: '', phone: '', email: '' }]);

  // Thông tin hợp đồng
  const [selectedRoom, setSelectedRoom] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [deposit, setDeposit] = useState('');

  // Chu kỳ thu tiền
  const [paymentCycle, setPaymentCycle] = useState('1 tháng');
  const [paymentDate, setPaymentDate] = useState(1); // ngày trong tháng

  // State cho dịch vụ và tài sản
  const [selectedServices, setSelectedServices] = useState(FAKE_SERVICES);
  const [selectedAssets, setSelectedAssets] = useState(FAKE_ASSETS);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [tempServices, setTempServices] = useState(FAKE_SERVICES);
  const [tempAssets, setTempAssets] = useState(FAKE_ASSETS);
  const [selectAllServices, setSelectAllServices] = useState(false);
  const [selectAllAssets, setSelectAllAssets] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const newEndDate = new Date(startDate);
      newEndDate.setMonth(newEndDate.getMonth() + duration);
      setEndDate(newEndDate);
    } else if (customEndDate) {
      setEndDate(customEndDate);
    }
  }, [duration, startDate, customEndDate]);

  // Cập nhật trạng thái chọn tất cả dịch vụ
  useEffect(() => {
    const allServices = [...FAKE_SERVICES, ...ADDITIONAL_SERVICES];
    setSelectAllServices(tempServices.length === allServices.length);
  }, [tempServices]);

  // Cập nhật trạng thái chọn tất cả tài sản
  useEffect(() => {
    const allAssets = [...FAKE_ASSETS, ...ADDITIONAL_ASSETS];
    setSelectAllAssets(tempAssets.length === allAssets.length);
  }, [tempAssets]);

  const handleAddGuest = () => {
    setGuests([...guests, { name: '', phone: '', email: '' }]);
  };

  const handleRemoveGuest = (index) => {
    const updated = guests.filter((_, idx) => idx !== index);
    setGuests(updated);
  };

  const handleChangeGuest = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
  };

  // Xử lý chọn tất cả dịch vụ
  const handleSelectAllServices = () => {
    if (selectAllServices) {
      setTempServices([]);
    } else {
      setTempServices([...FAKE_SERVICES, ...ADDITIONAL_SERVICES]);
    }
    setSelectAllServices(!selectAllServices);
  };

  // Xử lý chọn tất cả tài sản
  const handleSelectAllAssets = () => {
    if (selectAllAssets) {
      setTempAssets([]);
    } else {
      setTempAssets([...FAKE_ASSETS, ...ADDITIONAL_ASSETS]);
    }
    setSelectAllAssets(!selectAllAssets);
  };

  // Xử lý chọn dịch vụ
  const handleServiceChange = (service) => {
    const isSelected = tempServices.some((s) => s.name === service.name);
    if (isSelected) {
      setTempServices(tempServices.filter((s) => s.name !== service.name));
    } else {
      setTempServices([...tempServices, service]);
    }
  };

  // Xử lý chọn tài sản
  const handleAssetChange = (asset) => {
    const isSelected = tempAssets.includes(asset);
    if (isSelected) {
      setTempAssets(tempAssets.filter((a) => a !== asset));
    } else {
      setTempAssets([...tempAssets, asset]);
    }
  };

  // Áp dụng dịch vụ
  const applyServices = () => {
    setSelectedServices(tempServices);
    setIsServiceModalOpen(false);
  };

  // Áp dụng tài sản
  const applyAssets = () => {
    setSelectedAssets(tempAssets);
    setIsAssetModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ccm-modal-overlay">
      <div className="ccm-modal">
        <h2>Thêm hợp đồng</h2>

        {/* Thời hạn */}
        <label>Thời hạn hợp đồng</label>
        <select onChange={(e) => setDuration(Number(e.target.value))} value={duration}>
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.months}>{opt.label}</option>
          ))}
        </select>

        <div className="ccm-date-row">
          <div className="ccm-date-field">
            <label>Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
          </div>
          <div className="ccm-date-field">
            <label>Ngày kết thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setDuration(0);
                setCustomEndDate(date);
              }}
              dateFormat="dd/MM/yyyy"
              minDate={startDate}
            />
          </div>
        </div>

        {/* Thông tin hợp đồng */}
        <h3>Thông tin hợp đồng</h3>
        <div className="ccm-contract-info-row">
          <div className="ccm-contract-field">
            <label>Phòng thuê</label>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
              <option value="">Chọn phòng</option>
              {FAKE_ROOMS.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
          <div className="ccm-contract-field">
            <label>Giá thuê (VNĐ)</label>
            <input
              type="number"
              placeholder="Nhập giá thuê"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
            />
          </div>
          <div className="ccm-contract-field">
            <label>Tiền cọc (VNĐ)</label>
            <input
              type="number"
              placeholder="Nhập tiền cọc"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <h3>Thanh toán</h3>
        <div className="ccm-payment-info-row">
          <div className="ccm-payment-field">
            <label>Chu kỳ thu tiền</label>
            <select value={paymentCycle} onChange={(e) => setPaymentCycle(e.target.value)}>
              <option value="1 tháng">1 tháng</option>
              <option value="3 tháng">3 tháng</option>
            </select>
          </div>
          <div className="ccm-payment-field">
            <label>Ngày thu tiền mỗi kỳ (1 - 28)</label>
            <input
              type="number"
              min={1}
              max={28}
              value={paymentDate}
              onChange={(e) => setPaymentDate(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Danh sách khách */}
        <h3>Thông tin khách thuê</h3>
        <p>Tổng số khách: {guests.length}</p>
        {guests.map((guest, idx) => (
          <div key={idx} className="ccm-guest-info">
            <input
              placeholder="Tên khách"
              value={guest.name}
              onChange={(e) => handleChangeGuest(idx, 'name', e.target.value)}
            />
            <input
              placeholder="SĐT"
              value={guest.phone}
              onChange={(e) => handleChangeGuest(idx, 'phone', e.target.value)}
            />
            <input
              placeholder="Email"
              value={guest.email}
              onChange={(e) => handleChangeGuest(idx, 'email', e.target.value)}
            />
            <button className="ccm-remove-btn" onClick={() => handleRemoveGuest(idx)}>Xoá</button>
          </div>
        ))}
        <button onClick={handleAddGuest} className="ccm-add-guest-btn">+ Thêm khách</button>

        {/* Dịch vụ */}
        <h3>Dịch vụ áp dụng</h3>
        <button
          onClick={() => {
            setTempServices(selectedServices);
            setSelectAllServices(
              selectedServices.length === [...FAKE_SERVICES, ...ADDITIONAL_SERVICES].length
            );
            setIsServiceModalOpen(true);
          }}
          className="ccm-add-item-btn"
        >
          + Thêm dịch vụ
        </button>
        <div className="ccm-services-grid">
          {selectedServices.map((service, idx) => (
            <div key={idx} className="ccm-service-card">
              <span className="ccm-service-name">{service.name}</span>
              <span className="ccm-service-price">{service.price}</span>
            </div>
          ))}
        </div>

        {/* Modal chọn dịch vụ */}
        {isServiceModalOpen && (
          <div className="ccm-modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="ccm-modal ccm-selection-modal">
              <h2>Chọn dịch vụ</h2>
              <div className="ccm-checkbox-item ccm-select-all">
                <input
                  type="checkbox"
                  checked={selectAllServices}
                  onChange={handleSelectAllServices}
                />
                <label>Chọn tất cả</label>
              </div>
              {[...FAKE_SERVICES, ...ADDITIONAL_SERVICES].map((service, idx) => (
                <div key={idx} className="ccm-checkbox-item">
                  <input
                    type="checkbox"
                    checked={tempServices.some((s) => s.name === service.name)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <label>
                    {service.name} - {service.price}
                  </label>
                </div>
              ))}
              <div className="ccm-modal-actions">
                <button onClick={() => setIsServiceModalOpen(false)}>Hủy</button>
                <button className="ccm-primary" onClick={applyServices}>Áp dụng</button>
              </div>
            </div>
          </div>
        )}

        {/* Tài sản */}
        <h3>Tài sản có trong phòng</h3>
        <button
          onClick={() => {
            setTempAssets(selectedAssets);
            setSelectAllAssets(
              selectedAssets.length === [...FAKE_ASSETS, ...ADDITIONAL_ASSETS].length
            );
            setIsAssetModalOpen(true);
          }}
          className="ccm-add-item-btn"
        >
          + Thêm tài sản
        </button>
        <div className="ccm-assets-grid">
          {selectedAssets.map((asset, idx) => (
            <div key={idx} className="ccm-asset-item">
              <span>{asset}</span>
            </div>
          ))}
        </div>

        {/* Modal chọn tài sản */}
        {isAssetModalOpen && (
          <div className="ccm-modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="ccm-modal ccm-selection-modal">
              <h2>Chọn tài sản</h2>
              <div className="ccm-checkbox-item ccm-select-all">
                <input
                  type="checkbox"
                  checked={selectAllAssets}
                  onChange={handleSelectAllAssets}
                />
                <label>Chọn tất cả</label>
              </div>
              {[...FAKE_ASSETS, ...ADDITIONAL_ASSETS].map((asset, idx) => (
                <div key={idx} className="ccm-checkbox-item">
                  <input
                    type="checkbox"
                    checked={tempAssets.includes(asset)}
                    onChange={() => handleAssetChange(asset)}
                  />
                  <label>{asset}</label>
                </div>
              ))}
              <div className="ccm-modal-actions">
                <button onClick={() => setIsAssetModalOpen(false)}>Hủy</button>
                <button className="ccm-primary" onClick={applyAssets}>Áp dụng</button>
              </div>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="ccm-modal-actions">
          <button onClick={onClose}>Đóng</button>
          <button className="ccm-primary">Tạo hợp đồng</button>
        </div>
      </div>
    </div>
  );
};

export default CreateContractModal;