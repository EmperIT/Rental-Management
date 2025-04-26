import React from 'react';

const exportToExcel = (data, fileName) => {
  const XLSX = window.XLSX;
  if (!XLSX) {
    alert('Thư viện XLSX không được tải. Vui lòng kiểm tra kết nối.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách tạm trú');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const TemporaryResidenceExport = ({ residents, rooms }) => {
  const handleExportExcel = () => {
    if (!residents || residents.length === 0) {
      alert('Không có dữ liệu tạm trú để xuất!');
      return;
    }

    const exportData = residents.map((resident, index) => {
      const room = rooms.find((r) => r.roomName === resident.room_number) || {};
      return {
        STT: index + 1,
        'Họ tên': resident.full_name || 'N/A',
        'Số CCCD': resident.id_number || 'N/A',
        'Số điện thoại': resident.phone_number || 'N/A',
        'Quê quán': resident.hometown || 'N/A',
        'Nơi thường trú': resident.permanent_address || 'N/A',
        'Phòng': resident.room_number || 'N/A',
        'Tầng': room.floor || 'N/A',
        'Ngày bắt đầu': new Date(resident.start_date).toLocaleDateString('vi-VN'),
        'Ngày hết hạn': new Date(resident.expiry_date).toLocaleDateString('vi-VN'),
        'Trạng thái': resident.status,
      };
    });

    exportToExcel(exportData, 'Danh_sach_tam_tru');
  };

  return (
    <button className="btn-secondary" onClick={handleExportExcel}>
      Xuất Excel
    </button>
  );
};

export default TemporaryResidenceExport;