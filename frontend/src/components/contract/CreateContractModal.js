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
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentCycle, setPaymentCycle] = useState('1 tháng');
  const [paymentDate, setPaymentDate] = useState(1);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Debug rooms prop
  useEffect(() => {
    console.log('Rooms prop in CreateContractModal:', rooms);
  }, [rooms]);

  useEffect(() => {
    if (!selectedRoomId) {
      setRoomServices([]);
      setRoomAssets([]);
      setSelectedServices([]);
      setTempServices([]);
      setSelectedAssets([]);
      setTempAssets([]);
      setRentPrice('');
      setDeposit('');
      setGuests([{ name: '', phone: '', email: '' }]);
      setTenantsForRoom([]);
      return;
    }

    const fetchRoomData = async () => {
      try {
        console.log('roomServicesMap cho phòng', selectedRoomId, ':', roomServicesMap[selectedRoomId]);
        const servicesForRoom = (roomServicesMap[selectedRoomId] || []).map(s => ({
          id: s.id,
          name: s.name,
          price: s.price, // Adjusted to match roomServicesMap structure
          unit: s.unit,
        })).filter(
          s => s && s.id && s.name && s.name !== 'Dịch vụ không xác định' && typeof s.price === 'number' && s.unit
        );
        console.log('Filtered servicesForRoom:', servicesForRoom);

        const assetsForRoom = (roomAssetsMap[selectedRoomId] || []).filter(
          a => a && a.id && a.name
        );

        setRoomServices(servicesForRoom);
        setSelectedServices(servicesForRoom);
        setTempServices(servicesForRoom);

        setRoomAssets(assetsForRoom);
        setSelectedAssets(assetsForRoom.map(a => a.name));
        setTempAssets(assetsForRoom.map(a => a.name));

        const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
        if (selectedRoom) {
          setRentPrice(selectedRoom.price ? selectedRoom.price.toString() : '');
          setDeposit(selectedRoom.deposit ? selectedRoom.deposit.toString() : ''); // Use deposit instead of depositPrice
        }

        const fetchedTenants = await fetchTenantsForRoom(selectedRoomId);
        console.log('Tenants cho room', selectedRoomId, ':', fetchedTenants);
        setTenantsForRoom(fetchedTenants);
        if (fetchedTenants.length > 0) {
          setGuests(fetchedTenants.map(tenant => ({
            name: tenant.name || '',
            phone: tenant.phone || '',
            email: tenant.email || '',
          })));
        } else {
          setGuests([{ name: '', phone: '', email: '' }]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu phòng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      }
    };

    fetchRoomData();
  }, [selectedRoomId, roomServicesMap, roomAssetsMap, rooms, fetchTenantsForRoom]);

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
    setSelectAllServices(tempServices.length === roomServices.length && roomServices.length > 0);
  }, [tempServices, roomServices]);

  useEffect(() => {
    setSelectAllAssets(tempAssets.length === roomAssets.length && roomAssets.length > 0);
  }, [tempAssets, roomAssets]);

  const handleAddGuest = () => {
    setGuests([...guests, { name: '', phone: '', email: '' }]);
  };

  const handleRemoveGuest = (index) => {
    setGuests(prev => prev.filter((_, idx) => idx !== index));
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`guest${index}`];
      return newErrors;
    });
  };

  const handleChangeGuest = (index, field, value) => {
    setGuests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`guest${index}`];
      return newErrors;
    });
  };

  const handleSelectAllServices = () => {
    if (selectAllServices) {
      setTempServices([]);
    } else {
      setTempServices(roomServices);
    }
    setSelectAllServices(!selectAllServices);
  };

  const handleSelectAllAssets = () => {
    if (selectAllAssets) {
      setTempAssets([]);
    } else {
      setTempAssets(roomAssets.map(a => a.name));
    }
    setSelectAllAssets(!selectAllAssets);
  };

  const handleServiceChange = (service) => {
    if (!service || !service.id || !service.name || typeof service.price !== 'number' || !service.unit) return;
    setTempServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const handleAssetChange = (asset) => {
    setTempAssets(prev => {
      const isSelected = prev.includes(asset);
      if (isSelected) {
        return prev.filter(a => a !== asset);
      }
      return [...prev, asset];
    });
  };

  const applyServices = () => {
    setSelectedServices(tempServices.filter(s => s && s.id && s.name && typeof s.price === 'number' && s.unit));
    setIsServiceModalOpen(false);
  };

  const applyAssets = () => {
    setSelectedAssets(tempAssets);
    setIsAssetModalOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedRoomId) {
      errors.room = 'Vui lòng chọn phòng!';
    }
    if (!rentPrice || isNaN(rentPrice) || Number(rentPrice) <= 0) {
      errors.rentPrice = 'Vui lòng nhập giá thuê hợp lệ!';
    }
    if (!deposit || isNaN(deposit) || Number(deposit) < 0) {
      errors.deposit = 'Vui lòng nhập tiền cọc hợp lệ!';
    }
    if (!startDate) {
      errors.startDate = 'Vui lòng chọn ngày bắt đầu!';
    }
    if (!endDate) {
      errors.endDate = 'Vui lòng chọn ngày kết thúc!';
    }
    if (endDate && startDate && endDate <= startDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu!';
    }
    if (guests.length === 0 || !guests[0].name) {
      errors.guest0 = 'Vui lòng thêm ít nhất một khách thuê và nhập tên!';
    }
    guests.forEach((guest, idx) => {
      if (guest.name && !guest.phone) {
        errors[`guest${idx}`] = 'Vui lòng nhập số điện thoại cho khách!';
      }
      if (guest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
        errors[`guest${idx}`] = 'Email không hợp lệ!';
      }
    });
    if (paymentDate < 1 || paymentDate > 28) {
      errors.paymentDate = 'Ngày thu tiền phải từ 1 đến 28!';
    }
    if (selectedServices.length === 0) {
      errors.services = 'Vui lòng chọn ít nhất một dịch vụ!';
    }
    if (selectedServices.some(s => !s || !s.id || !s.name || typeof s.price !== 'number' || !s.unit)) {
      errors.services = 'Danh sách dịch vụ không hợp lệ! Vui lòng kiểm tra lại.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateContract = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const tenantIds = await Promise.all(
        guests.map(async (guest, idx) => {
          if (!guest.name) return null;

          const existingTenants = guest.email ? await fetchTenantsForRoom(selectedRoomId, guest.email) : [];
          console.log('Existing tenants cho guest', guest.email, ':', existingTenants);
          if (existingTenants.length > 0) {
            const tenant = existingTenants[0];
            if (tenant.roomId !== selectedRoomId) {
              throw new Error(`Tenant ${tenant.name} (ID: ${tenant.id}) không liên kết với phòng ${selectedRoomId}`);
            }
            return tenant.id;
          }

          const tenantData = {
            name: guest.name,
            phone: guest.phone || '',
            email: guest.email || '',
            roomId: selectedRoomId,
            isLeadRoom: idx === 0,
            isActive: true,
          };
          console.log('Tạo tenant mới với dữ liệu:', tenantData);
          const tenantId = await createTenant(tenantData);
          console.log('Tenant mới tạo:', { tenantId, tenantData });
          return tenantId;
        })
      );

      const primaryTenantId = tenantIds[0];
      if (!primaryTenantId) {
        throw new Error('Không thể tạo hoặc tìm người thuê chính.');
      }

      if (!selectedRoomId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('roomId không hợp lệ.');
      }
      if (!primaryTenantId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('tenantId không hợp lệ.');
      }
      const content = generateContractContent();
      if (!content || content.length > 10000) {
        throw new Error('Nội dung hợp đồng không hợp lệ hoặc quá dài.');
      }

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      const contractData = {
        roomId: selectedRoomId,
        tenantId: primaryTenantId,
        content,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        services: selectedServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          unit: s.unit,
        })),
      };

      console.log('Dữ liệu hợp đồng trước khi gửi:', JSON.stringify(contractData, null, 2));
      await createContract(contractData);
      alert('Tạo hợp đồng thành công!');
      onContractCreated();
      onClose();
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định.';
      if (errorMessage.includes('Internal server error')) {
        setError('Lỗi tạo hợp đồng: Dữ liệu không hợp lệ. Vui lòng kiểm tra phòng, người thuê, dịch vụ và định dạng ngày.');
      } else if (errorMessage.includes('roomId')) {
        setError('Lỗi: Phòng không hợp lệ hoặc không tồn tại.');
      } else if (errorMessage.includes('tenantId')) {
        setError('Lỗi: Người thuê không hợp lệ hoặc không liên kết với phòng.');
      } else {
        setError('Không thể tạo hợp đồng: ' + errorMessage);
      }
      console.error('Chi tiết lỗi:', {
        message: errorMessage,
        response: err.response?.data,
        status: err.response?.status,
      });
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
    setFieldErrors({});
    setError(null);
  };

  const generateContractContent = () => {
    const room = rooms.find((r) => r.id === selectedRoomId)?.roomName || 'N/A'; // Use roomName
    const tenantName = guests[0].name || 'N/A';
    const formattedStartDate = startDate.toLocaleDateString('vi-VN');
    const formattedEndDate = endDate.toLocaleDateString('vi-VN');

    const validServices = selectedServices.filter(s => s && s.id && s.name && typeof s.price === 'number' && s.unit);
    console.log('Dịch vụ hợp lệ cho nội dung:', JSON.stringify(validServices, null, 2));

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
${validServices.length > 0 ? validServices.map(s => `- ${s.name}: ${s.price.toLocaleString('vi-VN')} ${s.unit}`).join('\n') : '- Không có dịch vụ.'}

Điều 4: Tài sản trong phòng
${selectedAssets.length > 0 ? selectedAssets.map(a => `- ${a}`).join('\n') : '- Không có tài sản.'}

Điều 5: Các khách thuê
${guests.map((g, idx) => `- ${g.name} (SĐT: ${g.phone || 'N/A'}, Email: ${g.email || 'N/A'})`).join('\n')}

Điều 6: Điều khoản khác
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

        <label>Thời hạn hợp đồng</label>
        <select onChange={(e) => setDuration(Number(e.target.value))} value={duration}>
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.months}>{opt.label}</option>
          ))}
        </select>
        {fieldErrors.duration && <div className="ccm-field-error">{fieldErrors.duration}</div>}

        <div className="ccm-date-row">
          <div className="ccm-date-field">
            <label>Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
            {fieldErrors.startDate && <div className="ccm-field-error">{fieldErrors.startDate}</div>}
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
            {fieldErrors.endDate && <div className="ccm-field-error">{fieldErrors.endDate}</div>}
          </div>
        </div>

        <h3>Thông tin hợp đồng</h3>
        <div className="ccm-contract-info-row">
          <div className="ccm-contract-field">
            <label>Phòng thuê</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Chọn phòng</option>
              {rooms.length === 0 ? (
                <option value="" disabled>Không có phòng nào</option>
              ) : (
                rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Phòng {room.roomName || 'N/A'}
                  </option>
                ))
              )}
            </select>
            {fieldErrors.room && <div className="ccm-field-error">{fieldErrors.room}</div>}
          </div>
          <div className="ccm-contract-field">
            <label>Giá thuê (VNĐ)</label>
            <input
              type="number"
              placeholder="Nhập giá thuê"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
            />
            {fieldErrors.rentPrice && <div className="ccm-field-error">{fieldErrors.rentPrice}</div>}
          </div>
          <div className="ccm-contract-field">
            <label>Tiền cọc (VNĐ)</label>
            <input
              type="number"
              placeholder="Nhập tiền cọc"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
            {fieldErrors.deposit && <div className="ccm-field-error">{fieldErrors.deposit}</div>}
          </div>
        </div>

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
            {fieldErrors.paymentDate && <div className="ccm-field-error">{fieldErrors.paymentDate}</div>}
          </div>
        </div>

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
            {fieldErrors[`guest${idx}`] && <div className="ccm-field-error">{fieldErrors[`guest${idx}`]}</div>}
          </div>
        ))}
        <button onClick={handleAddGuest} className="ccm-add-guest-btn">+ Thêm khách</button>

        <h3>Dịch vụ áp dụng</h3>
        <button
          onClick={() => {
            setTempServices(selectedServices);
            setIsServiceModalOpen(true);
          }}
          className="ccm-add-item-btn"
        >
          + Thêm dịch vụ
        </button>
        <div className="ccm-services-grid">
          {selectedServices.map((service, idx) => (
            <div key={service.id || idx} className="ccm-service-card">
              <span className="ccm-service-name">{service.name || 'N/A'}</span>
              <span className="ccm-service-price">{service.price.toLocaleString('vi-VN')} {service.unit || ''}</span>
            </div>
          ))}
        </div>
        {fieldErrors.services && <div className="ccm-field-error">{fieldErrors.services}</div>}

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
              {roomServices.map((service) => (
                <div key={service.id} className="ccm-checkbox-item">
                  <input
                    type="checkbox"
                    checked={tempServices.some(s => s.id === service.id)}
                    onChange={() => handleServiceChange(service)}
                    disabled={!service.name || typeof service.price !== 'number' || !service.unit}
                  />
                  <label>
                    {service.name || 'Dịch vụ không xác định'} - {service.price.toLocaleString('vi-VN')} {service.unit || ''}
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

        <h3>Tài sản có trong phòng</h3>
        <button
          onClick={() => {
            setTempAssets(selectedAssets);
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
              {roomAssets.map((asset) => (
                <div key={asset.id} className="ccm-checkbox-item">
                  <input
                    type="checkbox"
                    checked={tempAssets.includes(asset.name)}
                    onChange={() => handleAssetChange(asset.name)}
                  />
                  <label>{asset.name}</label>
                </div>
              ))}
              <div className="ccm-modal-actions">
                <button onClick={() => setIsAssetModalOpen(false)}>Hủy</button>
                <button className="ccm-primary" onClick={applyAssets}>Áp dụng</button>
              </div>
            </div>
          </div>
        )}

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