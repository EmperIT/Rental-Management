import React from 'react';

// Hàm để xuất dữ liệu ra file Excel
const exportToExcel = (data, fileName) => {
  const XLSX = window.XLSX;
  if (!XLSX) {
    alert('Thư viện XLSX không được tải. Vui lòng kiểm tra kết nối.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách khách thuê');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExcelExport = ({ tenants, reservations, rooms }) => {
  const handleExportExcel = () => {
    if (!tenants && !reservations) {
      alert('Không có dữ liệu khách thuê để xuất!');
      return;
    }

    // Gộp dữ liệu khách thuê, khách đã rời, và khách cọc
    const allTenants = [
      ...tenants.map((tenant) => ({
        ...tenant,
        type: tenant.is_active ? 'Khách đang thuê' : 'Khách đã rời',
      })),
      ...reservations.map((reservation) => ({
        ...reservation,
        type: 'Khách cọc',
      })),
    ];

    if (allTenants.length === 0) {
      alert('Không có dữ liệu khách thuê để xuất!');
      return;
    }

    // Chuẩn bị dữ liệu để xuất
    const exportData = allTenants.map((tenant, index) => {
      // Tìm thông tin phòng để lấy tên phòng và tầng
      const room = rooms.find((r) => r.room_id === tenant.room_id) || {};
      return {
        STT: index + 1,
        'Họ tên': tenant.name || 'N/A',
        'Phòng': room.roomName || 'N/A',
        'Tầng': room.floor || 'N/A',
        'Email': tenant.email || 'N/A',
        'Số điện thoại': tenant.phone || 'N/A',
        'Trạng thái': tenant.type,
        'Ngày tạo': new Date(tenant.create_at).toLocaleDateString('vi-VN'),
      };
    });

    // Gọi hàm xuất file Excel
    exportToExcel(exportData, 'Danh_sach_khach_thue');
  };

  return (
    <button
      className="btn-secondary"
      onClick={handleExportExcel}
    >
      Xuất Excel
    </button>
  );
};

export default ExcelExport;