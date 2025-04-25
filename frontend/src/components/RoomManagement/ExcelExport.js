import React from 'react';

// Hàm để xuất dữ liệu ra file Excel
const exportToExcel = (data, fileName) => {
  // Kiểm tra xem thư viện XLSX có được load chưa
  const XLSX = window.XLSX;
  if (!XLSX) {
    alert('Thư viện XLSX không được tải. Vui lòng kiểm tra kết nối.');
    return;
  }

  // Chuyển dữ liệu thành worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  // Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách phòng trọ');

  // Xuất file Excel
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExcelExport = ({ rooms }) => {
  const handleExportExcel = () => {
    if (!rooms || rooms.length === 0) {
      alert('Không có dữ liệu phòng trọ để xuất!');
      return;
    }

    // Chuẩn bị dữ liệu để xuất
    const exportData = rooms.map((room, index) => ({
      STT: index + 1,
      'Tên phòng': room.roomName,
      'Tầng': room.floor,
      'Giá thuê': room.price.toLocaleString('vi-VN') + ' VNĐ',
      'Tiền cọc': room.deposit.toLocaleString('vi-VN') + ' VNĐ',
      'Diện tích': room.area + ' m²',
      'Sức chứa': room.capacity + ' người',
      'Ngày trống': room.availableDate,
      'Trạng thái': room.status,
    }));

    // Gọi hàm xuất file Excel
    exportToExcel(exportData, 'Danh_sach_phong_tro');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h5 className="text-xl font-semibold text-gray-700 mb-6">
        Xuất danh sách phòng trọ ra Excel
      </h5>
      <p className="text-sm text-gray-600 mb-4">
        Nhấn vào nút bên dưới để xuất danh sách phòng trọ ra file Excel.
      </p>
      <button
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
        onClick={handleExportExcel}
      >
        Xuất Excel
      </button>
    </div>
  );
};

export default ExcelExport;