import React from 'react';
import '../../styles/contract/ContractTable.css';

const ContractTable = ({ contracts, onViewDetails, onSendEmail }) => {
  return (
    <table className="contract-table">
      <thead>
        <tr>
          <th># Mã HĐ</th>
          <th>Phòng</th>
          <th>Trạng thái</th>
          <th>Thời hạn</th>
          <th>Số tiền</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((contract) => (
          <tr key={contract.id}>
            <td>{contract.id}</td>
            <td>{contract.room}</td>
            <td>
              <span className={`status-badge ${contract.status.replace(/\s/g, '-').toLowerCase()}`}>
                {contract.status}
              </span>
            </td>
            <td>
              <div className="duration">
                <div>{contract.duration}</div>
                <div>
                  {formatDate(contract.start)} - {formatDate(contract.end)}
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: getProgressWidth(contract) }}></div>
                </div>
              </div>
            </td>
            <td>{contract.amount}</td>
            <td>
              <button className="action-button view-details" onClick={() => onViewDetails(contract)}>
                Xem chi tiết
              </button>
              <button className="action-button send-email" onClick={() => onSendEmail(contract)}>
                Gửi email
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Hàm tính % tiến trình hợp đồng
const getProgressWidth = (contract) => {
  const start = new Date(contract.start);
  const end = new Date(contract.end);
  const now = new Date();

  if (now <= start) return '0%';
  if (now >= end) return '100%';

  const progress = ((now - start) / (end - start)) * 100;
  return `${progress.toFixed(0)}%`;
};

// Hàm format thời gian dạng dd/MM/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export default ContractTable;