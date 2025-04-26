import React from 'react';

export default function InvoiceModal({ invoice, onClose }) {
  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal">
        <div className="cd-modal-header">
          <h3>Hóa đơn #{invoice.id}</h3>
          <button className="cd-button cd-button-close" onClick={onClose}>
            Đóng
          </button>
        </div>
        <div className="cd-pdf-view">
          <div className="cd-pdf-header">
            <h4>HÓA ĐƠN THANH TOÁN</h4>
            <p>Mã hóa đơn: {invoice.id}</p>
          </div>
          <div className="cd-pdf-section">
            <h5>Thông tin hóa đơn</h5>
            <p><strong>Tháng:</strong> {invoice.month}</p>
            <p><strong>Số tiền:</strong> {invoice.amount.toLocaleString()} đ</p>
            <p><strong>Hạn thanh toán:</strong> {invoice.dueDate}</p>
            <p><strong>Trạng thái:</strong> {invoice.status}</p>
          </div>
          <div className="cd-pdf-section">
            <h5>Chi tiết chi phí</h5>
            <p><strong>Tiền thuê:</strong> {invoice.breakdown.rent.toLocaleString()} đ</p>
            <p><strong>Dịch vụ:</strong> {invoice.breakdown.services.toLocaleString()} đ</p>
          </div>
          <div className="cd-pdf-footer">
            <p>Ngày xuất hóa đơn: {invoice.month}</p>
            <p>Người nhận: Nguyễn Văn A</p>
            <p>Người lập: Trần Thị B</p>
          </div>
        </div>
      </div>
    </div>
  );
}