import React from 'react';

export default function ContractModal({ contract, onClose }) {
  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal">
        <div className="cd-modal-header">
          <h3>Hợp đồng #{contract.id}</h3>
          <button className="cd-button cd-button-close" onClick={onClose}>
            Đóng
          </button>
        </div>
        <div className="cd-pdf-view">
          <div className="cd-pdf-header">
            <h4>HỢP ĐỒNG THUÊ NHÀ</h4>
            <p>Mã hợp đồng: {contract.id}</p>
          </div>
          <div className="cd-pdf-section">
            <h5>Thông tin hợp đồng</h5>
            <p><strong>Ngày bắt đầu:</strong> {contract.startDate}</p>
            <p><strong>Ngày kết thúc:</strong> {contract.endDate}</p>
            <p><strong>Trạng thái:</strong> {contract.status}</p>
          </div>
          <div className="cd-pdf-section">
            <h5>Điều khoản</h5>
            <p>{contract.terms}</p>
          </div>
          <div className="cd-pdf-footer">
            <p>Ký ngày: {contract.startDate}</p>
            <p>Bên thuê: Nguyễn Văn A</p>
            <p>Bên cho thuê: Trần Thị B</p>
          </div>
        </div>
      </div>
    </div>
  );
}