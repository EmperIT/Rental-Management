import React from 'react';
import '../../styles/contract/ContractDetailModal.css';

const ContractDetailModal = ({ contractContent, onClose, onExport }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Hợp đồng #{contractContent?.id}</h3>
          <button className="modal-close-button" onClick={onClose}>
            Đóng
          </button>
        </div>
        <div className="modal-body">
          {contractContent ? (
            <div className="contract-content" dangerouslySetInnerHTML={{ __html: contractContent.html }} />
          ) : (
            <p>Đang tải nội dung hợp đồng...</p>
          )}
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

export default ContractDetailModal;