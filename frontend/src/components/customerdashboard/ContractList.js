import React, { useState } from 'react';
import ContractModal from './ContractModal';

const contracts = [
  { id: 'HD001', startDate: '2025-01-01', endDate: '2025-12-31', status: 'Đang hoạt động', terms: 'Thanh toán hàng tháng, không được chuyển nhượng.' },
  { id: 'HD002', startDate: '2024-06-01', endDate: '2025-05-31', status: 'Đang hoạt động', terms: 'Đặt cọc 1 tháng, thanh toán trước ngày 5.' },
];

export default function ContractList() {
  const [selectedContract, setSelectedContract] = useState(null);

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
  };

  const handleCloseModal = () => {
    setSelectedContract(null);
  };

  return (
    <div className="cd-section">
      <h3>Danh sách hợp đồng</h3>
      <table className="cd-table">
        <thead>
          <tr>
            <th>Mã hợp đồng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td>{contract.id}</td>
              <td>{contract.startDate}</td>
              <td>{contract.endDate}</td>
              <td>{contract.status}</td>
              <td>
                <button
                  className="cd-button cd-button-view"
                  onClick={() => handleViewDetails(contract)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedContract && (
        <ContractModal contract={selectedContract} onClose={handleCloseModal} />
      )}
    </div>
  );
}