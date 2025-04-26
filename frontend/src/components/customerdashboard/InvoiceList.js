import React, { useState } from 'react';
import InvoiceModal from './InvoiceModal';

const invoices = [
  { id: 'INV001', month: '04/2025', amount: 3500000, dueDate: '2025-04-30', status: 'Chưa thanh toán', breakdown: { rent: 3000000, services: 500000 } },
  { id: 'INV002', month: '03/2025', amount: 3200000, dueDate: '2025-03-31', status: 'Đã thanh toán', breakdown: { rent: 2800000, services: 400000 } },
];

export default function InvoiceList() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className="cd-section">
      <h3>Danh sách hóa đơn</h3>
      <table className="cd-table">
        <thead>
          <tr>
            <th>Mã hóa đơn</th>
            <th>Tháng</th>
            <th>Số tiền</th>
            <th>Hạn thanh toán</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.month}</td>
              <td>{invoice.amount.toLocaleString()} đ</td>
              <td>{invoice.dueDate}</td>
              <td>{invoice.status}</td>
              <td>
                <button
                  className="cd-button cd-button-view"
                  onClick={() => handleViewDetails(invoice)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={handleCloseModal} />
      )}
    </div>
  );
}