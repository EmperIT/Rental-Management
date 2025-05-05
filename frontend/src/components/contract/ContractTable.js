import React from 'react';
import '../../styles/contract/ContractTable.css';

// Shared utility function to compute contract status
const getContractStatus = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // Validate dates
    if (isNaN(start) || isNaN(end)) {
      return { label: 'Không hợp lệ', className: 'invalid' };
    }
    if (start > end) {
      return { label: 'Ngày không hợp lệ', className: 'invalid' };
    }

    const nearExpireThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (end < now) {
      return { label: 'Hết hiệu lực', className: 'expired' };
    } else if (end <= nearExpireThreshold && start <= now) {
      return { label: 'Sắp hết hạn', className: 'near-expire' };
    } else if (start <= now && end > now) {
      return { label: 'Đang hoạt động', className: 'active' };
    } else if (start > now) {
      return { label: 'Sắp bắt đầu', className: 'upcoming' };
    }
    return { label: 'Không xác định', className: 'unknown' };
  } catch {
    return { label: 'Không hợp lệ', className: 'invalid' };
  }
};

const ContractTable = ({ contracts, rooms, onViewDetails, onSendEmail }) => {
  // Hàm ánh xạ roomId sang roomName
  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.roomName : 'N/A';
  };

  // Hàm tính duration từ startDate và endDate
  const getDuration = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start) || isNaN(end) || start > end) return 'N/A';
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (months < 12) return `${months} tháng`;
      return `${Math.floor(months / 12)} năm${months % 12 ? ` ${months % 12} tháng` : ''}`;
    } catch {
      return 'N/A';
    }
  };

  // Hàm lấy deposit từ rooms dựa trên roomId
  const getAmount = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    const deposit = room && room.deposit ? room.deposit : null;
    return deposit ? `${deposit.toLocaleString('vi-VN')} VNĐ` : 'N/A';
  };

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
        {contracts.length === 0 ? (
          <tr>
            <td colSpan="6">Không có hợp đồng nào để hiển thị.</td>
          </tr>
        ) : (
          contracts.map((contract) => {
            const { label: statusLabel, className: statusClass } = getContractStatus(
              contract.startDate,
              contract.endDate
            );
            return (
              <tr key={contract.contractId}>
                <td>{contract.contractId}</td>
                <td>{getRoomNumber(contract.roomId)}</td>
                <td>
                  <span className={`status-badge ${statusClass}`}>
                    {statusLabel}
                  </span>
                </td>
                <td>
                  <div className="duration">
                    <div>{getDuration(contract.startDate, contract.endDate)}</div>
                    <div>
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: getProgressWidth({ start: contract.startDate, end: contract.endDate }) }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>{getAmount(contract.roomId)}</td>
                <td>
                  <button
                    className="action-button view-details"
                    onClick={() => onViewDetails(contract)}
                  >
                    Xem chi tiết
                  </button>
                 
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

// Hàm tính % tiến trình hợp đồng
const getProgressWidth = ({ start, end }) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();

    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) return '0%';
    if (now <= startDate) return '0%';
    if (now >= endDate) return '100%';

    const progress = ((now - startDate) / (endDate - startDate)) * 100;
    return `${progress.toFixed(0)}%`;
  } catch {
    return '0%';
  }
};

// Hàm format thời gian dạng dd/MM/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return 'N/A';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  } catch {
    return 'N/A';
  }
};

export default ContractTable;