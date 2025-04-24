import React from 'react';

const ExcelUpload = ({ onUpload }) => {
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newRooms = [
        {
          roomName: 'Phòng 101',
          floor: 'Tầng 1',
          price: '3,000,000',
          deposit: '1,500,000',
          area: '25',
          capacity: '2',
          availableDate: '2025-05-01',
          status: 'Trống',
        },
      ];
      onUpload(newRooms);
      alert('Đã thêm phòng từ file Excel thành công!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h5 className="text-xl font-semibold text-gray-700 mb-6">
        Thêm phòng trọ từ file Excel
      </h5>
      <p className="text-sm text-gray-600 mb-4">
        Tải xuống tệp mẫu để điền thông tin phòng trọ:{' '}
        <a href="/path-to-sample.xlsx" download className="text-indigo-600 hover:underline">
          Tải tệp mẫu
        </a>
      </p>
      <div className="mb-4">
        <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-1">
          Chọn tệp
        </label>
        <input
          type="file"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          id="excelFile"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
        />
      </div>
      <div className="flex space-x-4">
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
          onClick={() => document.getElementById('excelFile').click()}
        >
          Chọn tệp
        </button>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300"
          onClick={() => alert('Lưu file Excel (chức năng mock)')}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default ExcelUpload;