import React from 'react';

const TemporaryResidenceTable = ({ residents, rooms, onUpdateStatus }) => {
  const currentDate = new Date();

  const getRoomNumber = (roomId) => {
    if (!rooms || !Array.isArray(rooms)) return 'N/A';
    const room = rooms.find((room) => room.room_id === roomId);
    return room ? `${room.roomName} - ${room.floor}` : 'N/A';
  };

  const groupedResidentsByRoom = rooms.reduce((acc, room) => {
    const roomResidents = residents.filter(
      (resident) => resident.room_number === room.roomName
    );
    if (roomResidents.length > 0) {
      acc.push({ room, residents: roomResidents });
    }
    return acc;
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return false;
    const diffDays = Math.ceil((expiry - currentDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) return false;
    return expiry < currentDate;
  };

  const handleStatusChange = (residentId, newStatus) => {
    const resident = residents.find((r) => r.resident_id === residentId);
    if (!resident) return;

    if (newStatus === 'Hết hiệu lực' && !isExpired(resident.expiry_date)) {
      if (!window.confirm('Ngày hết hạn chưa tới. Bạn có chắc chắn muốn đặt trạng thái "Hết hiệu lực"?')) {
        return;
      }
    }
    if (newStatus === 'Đã khai báo' && resident.status === 'Chờ xác nhận') {
      if (!window.confirm('Xác nhận đã gửi thông tin cho công an phường?')) {
        return;
      }
    }
    onUpdateStatus(residentId, newStatus);
  };

  const handleSendNotification = (resident) => {
    let message = '';
    const status = resident.status || 'Chờ xác nhận';

    if (status === 'Chờ xác nhận') {
      message = `Bạn ${resident.full_name} chưa hoàn tất khai báo tạm trú. Vui lòng kiểm tra lại!`;
    } else if (status === 'Đã khai báo' && isExpiringSoon(resident.expiry_date)) {
      message = `Tạm trú của bạn ${resident.full_name} sắp hết hạn vào ${formatDate(resident.expiry_date)}. Vui lòng gia hạn!`;
    } else if (status === 'Đã khai báo') {
      message = `Thông tin tạm trú của bạn ${resident.full_name} đã được xác nhận và gửi cho công an phường.`;
    } else {
      message = `Không có thông báo phù hợp cho trạng thái "${status}" của bạn ${resident.full_name}.`;
    }

    alert(`Gửi thông báo qua Zalo/SMS: ${message}`);
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>PHÒNG</th>
            <th>HỌ TÊN</th>
            <th>SỐ ĐIỆN THOẠI</th>
            <th>TRẠNG THÁI</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {groupedResidentsByRoom.length > 0 ? (
            groupedResidentsByRoom.map((group) => (
              <React.Fragment key={group.room.room_id}>
                {group.residents.map((resident, index) => (
                  <tr key={resident.resident_id}>
                    {index === 0 && (
                      <td rowSpan={group.residents.length}>
                        {getRoomNumber(group.room.room_id)}
                      </td>
                    )}
                    <td>{resident.full_name || 'N/A'}</td>
                    <td>{resident.phone_number || 'N/A'}</td>
                    <td>
                      <select
                        value={resident.status || 'Chờ xác nhận'}
                        onChange={(e) => handleStatusChange(resident.resident_id, e.target.value)}
                        className="form-input"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã khai báo">Đã khai báo</option>
                        <option value="Hết hiệu lực">Hết hiệu lực</option>
                      </select>
                      {isExpiringSoon(resident.expiry_date) && (
                        <span className="text-danger ml-2">
                          (Sắp hết hạn)
                        </span>
                      )}
                      {isExpired(resident.expiry_date) && resident.status !== 'Hết hiệu lực' && (
                        <span className="text-danger ml-2">
                          (Đã hết hạn)
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-primary mr-2"
                        onClick={() => {
                          const details = `
                            Họ tên: ${resident.full_name || 'N/A'}\n
                            Số CCCD: ${resident.id_number || 'N/A'}\n
                            Ngày sinh: ${formatDate(resident.birth_date)}\n
                            Ngày cấp: ${formatDate(resident.issue_date)}\n
                            Nơi cấp: ${resident.issue_place || 'N/A'}\n
                            Số điện thoại: ${resident.phone_number || 'N/A'}\n
                            Quê quán: ${resident.hometown || 'N/A'}\n
                            Nơi thường trú: ${resident.permanent_address || 'N/A'}\n
                            Ngày bắt đầu: ${formatDate(resident.start_date)}\n
                            Ngày hết hạn: ${formatDate(resident.expiry_date)}\n
                            Trạng thái: ${resident.status || 'Chờ xác nhận'}
                          `;
                          alert('Chi tiết cư dân:\n' + details);
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleSendNotification(resident)}
                        disabled={resident.status === 'Hết hiệu lực'}
                      >
                        Gửi thông báo
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="table-empty">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TemporaryResidenceTable;