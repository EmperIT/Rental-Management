import React, { useState } from 'react';
import InvoiceDetailModal from './InvoiceDetailModal';
import '../../styles/invoice/RoomDetailModal.css';

const RoomDetailModal = ({ room, onClose }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const filteredInvoices = room.invoices.filter((invoice) => {
    const invoiceMonth = invoice.month;
    const matchesMonth = filterMonth === '' || invoiceMonth === filterMonth;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'due' ? new Date(invoice.dueDate) < new Date() : new Date(invoice.dueDate) >= new Date());
    return matchesMonth && matchesStatus;
  });

  return (
    <div className="room-detail-modal-overlay">
      <div className="room-detail-modal">
        <div className="room-detail-modal-header">
          <h3>Chi tiết phòng {room.name}</h3>
          <button className="close-button" onClick={onClose}>Đóng</button>
        </div>
        <div className="room-detail-modal-content">
          <div className="room-info">
            <h4>Thông tin phòng</h4>
            <p><strong>Chủ phòng:</strong> {room.owner}</p>
            <p><strong>Số điện thoại:</strong> {room.phone}</p>
            <p><strong>Hết hạn hợp đồng:</strong> {room.contractEnd}</p>
            <p><strong>Trạng thái:</strong> {room.status}</p>
            <p><strong>Giá thuê:</strong> {room.price.toLocaleString()} đ/tháng</p>
            <p><strong>Số khách:</strong> {room.guests}</p>
            <p><strong>Tầng:</strong> {room.floor}</p>
          </div>
          <div className="invoices-section">
            <h4>Danh sách hóa đơn</h4>
            <div className="invoice-filters">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="due">Đã quá hạn</option>
                <option value="not-due">Chưa quá hạn</option>
              </select>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
            {filteredInvoices.length > 0 ? (
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Mã hóa đơn</th>
                    <th>Tháng</th>
                    <th>Tổng tiền</th>
                    <th>Hạn đóng</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.month}</td>
                      <td>{invoice.total.toLocaleString()} đ</td>
                      <td>{invoice.dueDate}</td>
                      <td>{invoice.isPaid ? 'Đã thanh toán' : new Date(invoice.dueDate) < new Date() ? 'Đã quá hạn' : 'Chưa quá hạn'}</td>
                      <td>
                        <button onClick={() => handleViewInvoice(invoice)}>Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Chưa có hóa đơn nào.</p>
            )}
          </div>
        </div>
      </div>
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          room={room}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default RoomDetailModal;