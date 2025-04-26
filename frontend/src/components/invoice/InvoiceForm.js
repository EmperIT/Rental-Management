import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';
import '../../styles/invoice/InvoiceForm.css';

const initialServices = [
  { name: 'Điện', rate: 1700, unit: 'kWh', hasIndices: true },
  { name: 'Nước', rate: 18000, unit: 'm³', hasIndices: true },
  { name: 'Rác', rate: 15000, unit: 'Tháng', hasIndices: false },
  { name: 'Wifi', rate: 50000, unit: 'Tháng', hasIndices: false },
];

export default function InvoiceForm({ isOpen, onClose, room, reasons, defaultBillingDay, onSave }) {
  const [reason, setReason] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [servicesData, setServicesData] = useState(
    initialServices.map((service) => ({
      ...service,
      inUse: true,
      oldIndex: '',
      newIndex: '',
      fee: 0,
    }))
  );
  const [serviceCharge, setServiceCharge] = useState(0);
  const [rentCharge, setRentCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [daysUsed, setDaysUsed] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    setReason('1');
    const today = new Date();
    const isoToday = today.toISOString().slice(0, 10);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);

    setStartDate(isoToday);
    setEndDate(last);
    setDueDate(last);
    setServicesData(
      initialServices.map((service) => ({
        ...service,
        inUse: true,
        oldIndex: '',
        newIndex: '',
        fee: 0,
      }))
    );
  }, [isOpen]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDaysUsed(0);
      setRentCharge(0);
      return;
    }

    const daysThisMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    setDaysInMonth(daysThisMonth);
    const actualDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
    setDaysUsed(actualDays);
    const calculatedRent = Math.round((room.price / daysThisMonth) * actualDays);
    setRentCharge(calculatedRent);
  }, [startDate, endDate, room.price]);

  useEffect(() => {
    const totalServiceCharge = servicesData.reduce((sum, service) => {
      if (!service.inUse) return sum;
      return sum + (service.fee || 0);
    }, 0);
    setServiceCharge(totalServiceCharge);
  }, [servicesData]);

  useEffect(() => {
    setTotal(rentCharge + serviceCharge);
  }, [rentCharge, serviceCharge]);

  const calcService = () => {
    const updatedServices = servicesData.map((service) => {
      if (!service.inUse) return { ...service, fee: 0 };
      if (service.hasIndices) {
        const usage = Number(service.newIndex) - Number(service.oldIndex);
        const fee = usage >= 0 ? usage * service.rate : 0;
        return { ...service, fee };
      }
      return { ...service, fee: service.rate };
    });
    setServicesData(updatedServices);
  };

  const handleToggleService = (index) => {
    const updatedServices = [...servicesData];
    updatedServices[index].inUse = !updatedServices[index].inUse;
    updatedServices[index].oldIndex = '';
    updatedServices[index].newIndex = '';
    updatedServices[index].fee = 0;
    setServicesData(updatedServices);
  };

  const handleOldIndexChange = (index, value) => {
    const updatedServices = [...servicesData];
    updatedServices[index].oldIndex = value;
    setServicesData(updatedServices);
  };

  const handleNewIndexChange = (index, value) => {
    const updatedServices = [...servicesData];
    updatedServices[index].newIndex = value;
    setServicesData(updatedServices);
  };

  const handleDueDateChange = (value) => {
    setDueDate(value);
    setEndDate(value);
  };

  const handleReasonChange = (value) => {
    setReason(value);
    if (value === '1') {
      const today = new Date();
      const isoToday = today.toISOString().slice(0, 10);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
      setStartDate(isoToday);
      setEndDate(last);
      setDueDate(last);
    } else if (value === '2') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      const billingDay = Math.min(defaultBillingDay, lastDayOfMonth);
      const due = new Date(year, month, billingDay).toISOString().slice(0, 10);

      setStartDate(new Date(year, month, 1).toISOString().slice(0, 10));
      setEndDate(new Date(year, month + 1, 0).toISOString().slice(0, 10));
      setDueDate(due);
    }
  };

  const handleSubmit = () => {
    const invoice = {
      id: `INV-${room.id}-${Date.now()}`, // Tạo ID hóa đơn duy nhất
      reason: reasons.find((r) => r.id === reason).title,
      startDate,
      endDate,
      dueDate,
      services: servicesData,
      serviceCharge,
      rentCharge,
      total,
      daysUsed,
      daysInMonth,
      createdAt: new Date().toISOString()
    };
    onSave(room.id, invoice);
    alert('Đã lập hóa đơn');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal">
        <div className="invoice-modal-header">
          <h3>Lập hóa đơn {room.name}</h3>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <div className="invoice-form-group">
          <label>Lý do lập hóa đơn</label>
          <select value={reason} onChange={(e) => handleReasonChange(e.target.value)}>
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <div className="invoice-form-group">
          <label>Hạn đóng tiền</label>
          <input type="date" value={dueDate} onChange={(e) => handleDueDateChange(e.target.value)} />
        </div>

        <div className="invoice-form-group invoice-dates">
          <div>
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label>Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="invoice-form-group rent-breakdown enhanced-rent-display">
          <div className="breakdown-text">
            <span>
              <strong>{daysUsed}</strong> ngày
            </span>
            <span>x</span>
            <span>
              {room.price.toLocaleString()} đ / {daysInMonth} ngày
            </span>
          </div>
          <div className="breakdown-total">
            <strong>Thành tiền:</strong> {rentCharge.toLocaleString()} đ
          </div>
        </div>

        <div className="invoice-form-group">
          <label>Dịch vụ tính tiền</label>
          {servicesData.map((service, index) => (
            <div key={service.name} className="service-item">
              <div className="service-header">
                <span>
                  Tiền {service.name.toLowerCase()} ({service.rate.toLocaleString()} đ/1{service.unit})
                </span>
                <div className="service-controls">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={service.inUse}
                      onChange={() => handleToggleService(index)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              {service.inUse && service.hasIndices && (
                <div className="service-indices">
                  <div>
                    <label>Số cũ:</label>
                    <input
                      type="number"
                      value={service.oldIndex}
                      onChange={(e) => handleOldIndexChange(index, e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Số mới:</label>
                    <input
                      type="number"
                      value={service.newIndex}
                      onChange={(e) => handleNewIndexChange(index, e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="service-status">
                {service.inUse
                  ? service.hasIndices
                    ? `Số: [${service.oldIndex || 0} - ${service.newIndex || 0}]`
                    : `1 ${service.unit} x ${service.rate.toLocaleString()} đ`
                  : 'Không sử dụng'}
              </div>
            </div>
          ))}
        </div>

        <div className="service-actions">
          <button className="btn-calc" onClick={calcService}>
            <FaCog /> Tính dịch vụ
          </button>
        </div>

        <div className="invoice-form-group">
          <label>Phí dịch vụ</label>
          <input type="number" value={serviceCharge} readOnly />
        </div>

        <div className="invoice-form-group">
          <label>Tổng hóa đơn</label>
          <input type="number" value={total} readOnly />
        </div>

        <div className="invoice-modal-actions">
          <button onClick={onClose}>Hủy</button>
          <button className="btn-submit" onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}