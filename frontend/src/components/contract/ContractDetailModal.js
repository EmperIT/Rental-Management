import React from 'react';
import '../../styles/contract/ContractDetailModal.css';

const ContractDetailModal = ({ contractContent, onClose, onExport }) => {
  console.log('ContractContent in ContractDetailModal:', contractContent); // Debug

  const contract = contractContent?.contract || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Hợp đồng #{contractContent?.id || 'N/A'}</h3>
          <button className="modal-close-button" onClick={onClose}>
            Đóng
          </button>
        </div>
        <div className="modal-body">
          <div className="contract-info">
            <h4>Thông tin hợp đồng</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Mã hợp đồng:</span>
                <span className="info-value">{contractContent?.id || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phòng:</span>
                <span className="info-value">{contract.room || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày bắt đầu:</span>
                <span className="info-value">{formatDate(contract.start)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ngày kết thúc:</span>
                <span className="info-value">{formatDate(contract.end)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Số tiền thuê:</span>
                <span className="info-value">{contract.amount || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tiền cọc:</span>
                <span className="info-value">{contract.deposit ? `${contract.deposit.toLocaleString('vi-VN')} VNĐ` : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="contract-content">
            <h4>Nội dung hợp đồng</h4>
            {contractContent?.html ? (
              <div className="contract-html-content" dangerouslySetInnerHTML={{ __html: contractContent.html }} />
            ) : (
              <p>Không có nội dung hợp đồng để hiển thị.</p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button export-button" onClick={onExport}>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

// Hàm format thời gian dạng dd/MM/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  } catch {
    return 'N/A';
  }
};

export default ContractDetailModal;