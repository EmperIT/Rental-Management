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

const CreateContractModal = ({
  isOpen,
  onClose,
  onContractCreated,
  createContract,
  rooms,
  allServices,
  allAssets,
  roomServicesMap,
  roomAssetsMap,
  fetchTenantsForRoom,
  createTenant,
}) => {
  const [duration, setDuration] = useState(12);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [guests, setGuests] = useState([{ name: '', phone: '', email: '' }]);

  // Thông tin hợp đồng
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [deposit, setDeposit] = useState('');

  // Chu kỳ thu tiền
  const [paymentCycle, setPaymentCycle] = useState('1 tháng');
  const [paymentDate, setPaymentDate] = useState(1);

  // State cho dịch vụ và tài sản
  const [roomServices, setRoomServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [roomAssets, setRoomAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [tempServices, setTempServices] = useState([]);
  const [tempAssets, setTempAssets] = useState([]);
  const [selectAllServices, setSelectAllServices] = useState(false);
  const [selectAllAssets, setSelectAllAssets] = useState(false);
  const [tenantsForRoom, setTenantsForRoom] = useState([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update room-specific services, assets, rental price, deposit, and tenants when a room is selected
  useEffect(() => {
    if (!selectedRoomId) {
      setRoomServices([]);
      setRoomAssets([]);
      setSelectedServices([]);
      setSelectedAssets([]);
      setRentPrice('');
      setDeposit('');
      setGuests([{ name: '', phone: '', email: '' }]);
      setTenantsForRoom([]);
      return;
    }
    let isMounted = true;
    // Get room-specific services and assets
    const servicesForRoom = roomServicesMap[selectedRoomId] || [];
    const assetsForRoom = roomAssetsMap[selectedRoomId] || [];

    setRoomServices(servicesForRoom);
    setSelectedServices(servicesForRoom);
    setTempServices(servicesForRoom);

    setRoomAssets(assetsForRoom);
    setSelectedAssets(assetsForRoom);
    setTempAssets(assetsForRoom);

    // Get rental price and deposit
    const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    if (selectedRoom) {
      setRentPrice(selectedRoom.price ? selectedRoom.price.toString() : '');
      setDeposit(selectedRoom.depositPrice ? selectedRoom.depositPrice.toString() : '');
    }

    // Get tenants for the selected room
    // Fetch tenants for the selected room
    const fetchTenants = async () => {
      const fetchedTenants = await fetchTenantsForRoom(selectedRoomId);      setTenantsForRoom(fetchedTenants);
      if (tenantsForRoom.length > 0) {
        const mappedGuests = tenantsForRoom.map((tenant) => ({
          name: tenant.name || '',
          phone: tenant.phone || '',
          email: tenant.email || '',
        }));
        setGuests(mappedGuests);
      } else {
        setGuests([{ name: '', phone: '', email: '' }]);
      }
    };
    fetchTenants();
  }, [selectedRoomId, roomServicesMap, roomAssetsMap, fetchTenantsForRoom, rooms]);

  useEffect(() => {
    if (duration > 0) {
      const newEndDate = new Date(startDate);
      newEndDate.setMonth(newEndDate.getMonth() + duration);
      setEndDate(newEndDate);
    } else if (customEndDate) {
      setEndDate(customEndDate);
    }
  }, [duration, startDate, customEndDate]);

  useEffect(() => {
    setSelectAllServices(tempServices.length === allServices.length);
  }, [tempServices, allServices]);

  useEffect(() => {
    setSelectAllAssets(tempAssets.length === allAssets.length);
  }, [tempAssets, allAssets]);

  const handleAddGuest = () => {
    setGuests([...guests, { name: '', phone: '', email: '' }]);
    setTenantsForRoom((prev) => prev.length > 0 ? [] : prev);
    
  };

  const handleRemoveGuest = (index) => {
    const updated = guests.filter((_, idx) => idx !== index);
    setGuests(updated);
    if(updated.length === 0 || index < tenantsForRoom.length) {
      setTenantsForRoom([]);
    }
  };

  const handleChangeGuest = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
    if (tenantsForRoom && index < tenantsForRoom.length) {
      const originalTenanta = tenantsForRoom[index];
      const modifiedTenant = updatedGuests[index];
      if(
        originalTenanta.name !== modifiedTenant.name || 
        originalTenanta.phone !== modifiedTenant.phone ||
        originalTenanta.email !== modifiedTenant.email
      ){
        setTenantsForRoom((prev) => {prev.slice(0, index)});
      }
    } else if(!tenantsForRoom){
      console.warn('tenantsForRoom is undefined in handleChangeGuest:', { index, field, value, guests });
    }
  };

  const handleSelectAllServices = () => {
    if (selectAllServices) {
      setTempServices([]);
    } else {
      setTempServices(allServices);
    }
    setSelectAllServices(!selectAllServices);
  };

  const handleSelectAllAssets = () => {
    if (selectAllAssets) {
      setTempAssets([]);
    } else {
      setTempAssets(allAssets);
    }
    setSelectAllAssets(!selectAllAssets);
  };

  const handleServiceChange = (service) => {
    const isSelected = tempServices.some((s) => s.name === service.name);
    if (isSelected) {
      setTempServices(tempServices.filter((s) => s.name !== service.name));
    } else {
      setTempServices([...tempServices, service]);
    }
  };

  const handleAssetChange = (asset) => {
    const isSelected = tempAssets.includes(asset);
    if (isSelected) {
      setTempAssets(tempAssets.filter((a) => a !== asset));
    } else {
      setTempAssets([...tempAssets, asset]);
    }
  };

  const applyServices = () => {
    setSelectedServices(tempServices);
    setIsServiceModalOpen(false);
  };

  const applyAssets = () => {
    setSelectedAssets(tempAssets);
    setIsAssetModalOpen(false);
  };

  const handleCreateContract = async () => {
    if (!selectedRoomId) {
      alert('Vui lòng chọn phòng!');
      return;
    }

    if (guests.length === 0 || !guests[0].name) {
      alert('Vui lòng thêm ít nhất một khách thuê và nhập tên!');
      return;
    }

    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc!');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let tenantId;
      // Use existing tenantId if available and not modified, otherwise create a new tenant
      if (tenantsForRoom.length > 0 && guests[0].name === tenantsForRoom[0].name && guests[0].phone === tenantsForRoom[0].phone && guests[0].email === tenantsForRoom[0].email) {
        tenantId = tenantsForRoom[0].id; // Use existing tenantId
      } else {
        const primaryGuest = guests[0];
        const tenantData = {
          name: primaryGuest.name,
          phone: primaryGuest.phone,
          email: primaryGuest.email,
          roomId: selectedRoomId,
          isLeadRoom: true,
        };
        tenantId = await createTenant(tenantData);
      }
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const contractData = {
        roomId: selectedRoomId,
        tenantId: tenantId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        content: generateContractContent(),
      };

      console.log('Creating contract with data:', contractData);

      const response = await createContract(contractData);
      console.log('Create contract response:', response);

      alert('Tạo hợp đồng thành công!');

      onContractCreated();

      onClose();

      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định.';
      setError('Không thể tạo hợp đồng: ' + errorMessage);
      alert('Không thể tạo hợp đồng: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDuration(12);
    setStartDate(new Date());
    setEndDate(null);
    setCustomEndDate(null);
    setGuests([{ name: '', phone: '', email: '' }]);
    setTenantsForRoom([]);
    setSelectedRoomId('');
    setRentPrice('');
    setDeposit('');
    setPaymentCycle('1 tháng');
    setPaymentDate(1);
    setSelectedServices([]);
    setSelectedAssets([]);
    setTempServices([]);
    setTempAssets([]);
    setSelectAllServices(false);
    setSelectAllAssets(false);
  };

  const generateContractContent = () => {
    const room = rooms.find((r) => r.id === selectedRoomId)?.roomNumber || 'N/A';
    const tenantName = guests[0].name || 'N/A';
    const formattedStartDate = startDate.toLocaleDateString('vi-VN');
    const formattedEndDate = endDate.toLocaleDateString('vi-VN');

    return `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
------***------
HỢP ĐỒNG THUÊ PHÒNG TRỌ

Hôm nay, ngày ${new Date().toLocaleDateString('vi-VN')}, chúng tôi gồm:

BÊN CHO THUÊ (BÊN A):
- Họ và tên: [Tên chủ nhà]
- Địa chỉ: [Địa chỉ chủ nhà]

BÊN THUÊ (BÊN B):
- Họ và tên: ${tenantName}
- Số điện thoại: ${guests[0].phone || 'N/A'}
- Email: ${guests[0].email || 'N/A'}

Đã thỏa thuận và ký kết hợp đồng thuê phòng trọ với các điều khoản sau:

Điều 1: Đối tượng hợp đồng
- Bên A đồng ý cho Bên B thuê phòng số ${room}.
- Giá thuê: ${Number(rentPrice).toLocaleString('vi-VN')} VNĐ/tháng.
- Tiền cọc: ${Number(deposit).toLocaleString('vi-VN')} VNĐ.

Điều 2: Thời hạn thuê
- Thời gian thuê: từ ngày ${formattedStartDate} đến ngày ${formattedEndDate}.
- Chu kỳ thu tiền: ${paymentCycle}, ngày thu tiền mỗi kỳ: ngày ${paymentDate}.

Điều 3: Dịch vụ áp dụng
${selectedServices.map((s) => `- ${s.name}: ${s.price || 'N/A'}`).join('\n')}

Điều 4: Tài sản trong phòng
${selectedAssets.map((a) => `- ${a}`).join('\n')}

Điều 5: Điều khoản khác
- Các bên cam kết thực hiện đúng các điều khoản trong hợp đồng.
- Hợp đồng có hiệu lực từ ngày ký.

ĐẠI DIỆN BÊN A                ĐẠI DIỆN BÊN B
(Ký, ghi rõ họ tên)          (Ký, ghi rõ họ tên)
    `;
  };

  if (!isOpen) return null;

  return (
    <div className="ccm-modal-overlay">
      <div className="ccm-modal">
        <h2>Thêm hợp đồng</h2>

        {error && <div className="ccm-error">{error}</div>}
        {loading && <div className="ccm-loading">Đang tạo hợp đồng...</div>}

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
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Phòng {room.roomNumber}
                </option>
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
            setSelectAllServices(selectedServices.length === allServices.length);
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
              <span className="ccm-service-price">{service.price || 'N/A'}</span>
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
              {allServices.map((service, idx) => (
                <div key={idx} className="ccm-checkbox-item">
                  <input
                    type="checkbox"
                    checked={tempServices.some((s) => s.name === service.name)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <label>
                    {service.name} - {service.price || 'N/A'}
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
            setSelectAllAssets(selectedAssets.length === allAssets.length);
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
              {allAssets.map((asset, idx) => (
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
          <button onClick={onClose} disabled={loading}>Đóng</button>
          <button className="ccm-primary" onClick={handleCreateContract} disabled={loading}>
            Tạo hợp đồng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContractModal;