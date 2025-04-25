import React, { useState, useEffect } from 'react';
import TemporaryResidenceForm from '../components/temporary/TemporaryResidenceForm';
import TemporaryResidenceTable from '../components/temporary/TemporaryResidenceTable';
import TemporaryResidenceExport from '../components/temporary/TemporaryResidenceExport';
import '../styles/template/temporaryresidence.css';

const TemporaryResidenceManagement = () => {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [residents, setResidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [rooms] = useState([
    { room_id: '1', roomName: 'Phòng 101', floor: 'Tầng 1' },
    { room_id: '2', roomName: 'Phòng 102', floor: 'Tầng 2' },
    { room_id: '3', roomName: 'Phòng 103', floor: 'Tầng 1' },
  ]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddResident = (residentData) => {
    if (residents.some((r) => r.id_number === residentData.id_number)) {
      alert('Số CCCD/CMND này đã được khai báo. Vui lòng kiểm tra lại!');
      return;
    }

    const newResident = {
      resident_id: Date.now(),
      ...residentData,
      status: 'Chờ xác nhận',
      create_at: new Date().toISOString(),
      expiry_date: new Date(
        new Date(residentData.start_date).setFullYear(
          new Date(residentData.start_date).getFullYear() + 2
        )
      ).toISOString(),
    };
    setResidents((prev) => [...prev, newResident]);
    setShowFormPopup(false);
  };

  const handleUpdateStatus = (residentId, newStatus) => {
    setResidents((prev) =>
      prev.map((resident) =>
        resident.resident_id === residentId
          ? { ...resident, status: newStatus }
          : resident
      )
    );
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = window.XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = window.XLSX.utils.sheet_to_json(worksheet);

      const importedResidents = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        const startDateStr = row['Ngày bắt đầu ở trọ'];
        const startDate = startDateStr ? new Date(startDateStr) : null;

        if (!startDate || isNaN(startDate.getTime())) {
          errors.push(`Hàng ${index + 2}: Ngày bắt đầu ở trọ không hợp lệ (${startDateStr}).`);
          return;
        }

        const resident = {
          resident_id: Date.now() + Math.random(),
          full_name: row['Họ và tên'] || '',
          birth_date: row['Ngày sinh'] || '',
          id_number: row['Số CCCD/CMND'] || '',
          issue_date: row['Ngày cấp'] || '',
          issue_place: row['Nơi cấp'] || '',
          phone_number: row['Số điện thoại'] || '',
          hometown: row['Quê quán'] || '',
          permanent_address: row['Nơi thường trú'] || '',
          start_date: startDate.toISOString(),
          room_number: row['Số phòng thuê'] || '',
          status: 'Chờ xác nhận',
          create_at: new Date().toISOString(),
          expiry_date: new Date(
            startDate.setFullYear(startDate.getFullYear() + 2)
          ).toISOString(),
        };

        importedResidents.push(resident);
      });

      const validResidents = importedResidents.filter((r) => {
        const existingResident = residents.find(
          (resident) => resident.id_number === r.id_number
        );
        if (existingResident) {
          errors.push(`Số CCCD/CMND ${r.id_number} đã tồn tại. Bỏ qua bản ghi này.`);
          return false;
        }
        return true;
      });

      if (errors.length > 0) {
        alert(`Có lỗi khi nhập dữ liệu:\n${errors.join('\n')}\nVui lòng kiểm tra và thử lại.`);
      }

      if (validResidents.length > 0) {
        setResidents((prev) => [...prev, ...validResidents]);
        alert(`${validResidents.length} bản ghi đã được nhập thành công!`);
      } else if (errors.length === 0) {
        alert('Không có dữ liệu hợp lệ để nhập.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Họ và tên": "Nguyễn Văn A",
        "Ngày sinh": "1995-05-20",
        "Số CCCD/CMND": "123456789",
        "Ngày cấp": "2015-05-20",
        "Nơi cấp": "Hà Nội",
        "Số điện thoại": "0912345678",
        "Quê quán": "Thanh Hóa",
        "Nơi thường trú": "Số 123, Đường Láng, Đống Đa, Hà Nội",
        "Ngày bắt đầu ở trọ": "2025-04-01",
        "Số phòng thuê": "Phòng 101"
      },
      {
        "Họ và tên": "Trần Thị B",
        "Ngày sinh": "1998-08-15",
        "Số CCCD/CMND": "987654321",
        "Ngày cấp": "2018-08-15",
        "Nơi cấp": "TP. Hồ Chí Minh",
        "Số điện thoại": "0987654321",
        "Quê quán": "Đà Nẵng",
        "Nơi thường trú": "Số 456, Đường Lê Lợi, Quận 1, TP. HCM",
        "Ngày bắt đầu ở trọ": "2025-04-10",
        "Số phòng thuê": "Phòng 102"
      },
      {
        "Họ và tên": "",
        "Ngày sinh": "YYYY-MM-DD",
        "Số CCCD/CMND": "",
        "Ngày cấp": "YYYY-MM-DD",
        "Nơi cấp": "",
        "Số điện thoại": "",
        "Quê quán": "",
        "Nơi thường trú": "",
        "Ngày bắt đầu ở trọ": "YYYY-MM-DD",
        "Số phòng thuê": "Phòng 101/Phòng 102/Phòng 103"
      }
    ];

    const worksheet = window.XLSX.utils.json_to_sheet(templateData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu khai báo tạm trú');
    window.XLSX.writeFile(workbook, 'Mau_Khai_Bao_Tam_Tru.xlsx');
  };

  const currentDate = new Date();
  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - currentDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const waitingCount = residents.filter((r) => r.status === 'Chờ xác nhận').length;
  const declaredCount = residents.filter((r) => r.status === 'Đã khai báo').length;
  const expiredCount = residents.filter((r) => r.status === 'Hết hiệu lực').length;
  const expiringSoonCount = residents.filter(
    (r) => r.status === 'Đã khai báo' && isExpiringSoon(r.expiry_date)
  ).length;

  const floors = [...new Set(rooms.map((room) => room.roomName))];
  const filteredResidents = residents.filter((resident) => {
    let statusMatch = true;
    if (statusFilter) {
      statusMatch = resident.status === statusFilter;
    }

    let roomMatch = true;
    if (roomFilter) {
      roomMatch = resident.room_number === roomFilter;
    }

    return statusMatch && roomMatch;
  });

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="header">
          <h1 className="header-title">Quản lý tạm trú</h1>
          <div className="header-buttons">
            <button className="btn-primary" onClick={() => setShowFormPopup(true)}>
              Thêm khai báo tạm trú
            </button>
            <button className="btn-secondary" onClick={handleDownloadTemplate}>
              Tải mẫu Excel
            </button>
            <label className="btn-secondary">
              Nhập từ Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                style={{ display: 'none' }}
              />
            </label>
            <TemporaryResidenceExport residents={filteredResidents} rooms={rooms} />
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3 className="summary-title">Chờ xác nhận</h3>
            <p className="summary-value">{waitingCount}</p>
          </div>
          <div className="summary-card">
            <h3 className="summary-title">Đã khai báo</h3>
            <p className="summary-value">{declaredCount}</p>
          </div>
          <div className="summary-card">
            <h3 className="summary-title">Hết hiệu lực</h3>
            <p className="summary-value">{expiredCount}</p>
          </div>
          <div className="summary-card">
            <h3 className="summary-title">Sắp hết hạn</h3>
            <p className="summary-value">{expiringSoonCount}</p>
          </div>
        </div>

        <div className="filter-container">
          <div className="filter-content">
            <div className="filter-select-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đã khai báo">Đã khai báo</option>
                <option value="Hết hiệu lực">Hết hiệu lực</option>
              </select>
            </div>
            <div className="filter-select-wrapper">
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}  // Sửa lỗi ở đây
                className="filter-select"
              >
                <option value="">Tất cả phòng</option>
                {floors.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <TemporaryResidenceTable
          residents={filteredResidents}
          rooms={rooms}
          onUpdateStatus={handleUpdateStatus}
        />

        {showFormPopup && (
          <TemporaryResidenceForm
            onClose={() => setShowFormPopup(false)}
            onSubmit={handleAddResident}
            rooms={rooms}
          />
        )}
      </div>
    </div>
  );
};

export default TemporaryResidenceManagement;