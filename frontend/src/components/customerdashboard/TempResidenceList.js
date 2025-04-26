import React from 'react';

const tempResidences = [
  { id: 'TR001', submissionDate: '2025-02-15', status: 'Đã duyệt' },
  { id: 'TR002', submissionDate: '2024-11-10', status: 'Đang xử lý' },
];

export default function TempResidenceList() {
  return (
    <div className="cd-section">
      <h3>Danh sách đơn tạm trú</h3>
      <table className="cd-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Ngày nộp</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {tempResidences.map((form) => (
            <tr key={form.id}>
              <td>{form.id}</td>
              <td>{form.submissionDate}</td>
              <td>{form.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}