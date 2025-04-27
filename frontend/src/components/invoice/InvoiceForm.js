import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../../styles/invoice/InvoiceForm.css';

export default function InvoiceForm({ isOpen, onClose, room, services, roomServices, readings, defaultBillingDay, dueDays, onSave }) {
  const [dueDate, setDueDate] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [servicesData, setServicesData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isOpen || !room.id) return;

    const initialServicesData = services.map((service) => {
      const roomService = roomServices.find(rs => rs.service?.name === service.name);
      let oldIndex = 0;
      let newIndex = 0;

      if (service.hasIndices) {
        const reading = readings[service.name.toLowerCase()];
        oldIndex = reading ? reading.lastIndex || 0 : 0;
        newIndex = roomService ? roomService.newIndex || 0 : 0;
      }

      return {
        name: service.name,
        rate: service.rate,
        unit: service.unit,
        hasIndices: service.hasIndices,
        inUse: roomService ? (roomService.isActive !== undefined ? roomService.isActive : roomService.active !== undefined ? roomService.active : true) : true,
        oldIndex,
        newIndex,
        fee: 0,
      };
    });

    setServicesData(initialServicesData);

    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + dueDays);
    setDueDate(due.toISOString().slice(0, 10));
  }, [isOpen, room.id, services, roomServices, readings, dueDays]);

  useEffect(() => {
    const totalFee = servicesData.reduce((sum, service) => {
      if (!service.inUse) return sum;
      return sum + (service.fee || 0);
    }, 0);
    setTotal(totalFee + (room.price || 0));
  }, [servicesData, room.price]);

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

  const handleSubmit = () => {
    const fees = servicesData
      .filter(service => service.inUse)
      .map(service => ({
        type: service.name.toLowerCase(),
        amount: service.fee,
        reading: service.hasIndices ? Number(service.newIndex) - Number(service.oldIndex) : null,
        description: `Tiền ${service.name.toLowerCase()} tháng ${month.slice(5)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    const invoiceData = {
      roomId: room.id,
      month: month,
      fees: fees,
      total: total,
      dueDate: dueDate,
      isPaid: false,
    };

    onSave(room.id, invoiceData);
    alert('Đã lập hóa đơn');
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
          <label>Tháng hóa đơn</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="invoice-form-group">
          <label>Hạn đóng tiền</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="invoice-form-group">
          <label>Tiền thuê phòng</label>
          <input type="number" value={room.price || 0} readOnly />
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
            Tính dịch vụ
          </button>
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