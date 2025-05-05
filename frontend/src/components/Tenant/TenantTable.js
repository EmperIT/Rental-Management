import React from 'react';

const TenantTable = ({ tenants, rooms, onViewDetails, isReservationTab }) => {
  const currentDate = new Date();

  // Hàm lấy số phòng
  const getRoomNumber = (roomId) => {
    if (!rooms || !Array.isArray(rooms)) return 'N/A';
    const room = rooms.find((room) => room.id === roomId);
    return room ? room.roomNumber : 'N/A';
  };

  // Nhóm tenants theo roomId
  const groupedTenantsByRoom = rooms.reduce((acc, room) => {
    const roomTenants = tenants.filter((tenant) => tenant.roomId === room.id);
    if (roomTenants.length > 0) {
      acc.push({ room, tenants: roomTenants });
    }
    return acc;
  }, []);

  // Hàm xác định trạng thái
  const getStatus = (tenant) => {
    const startDate = tenant.startDate ? new Date(tenant.startDate) : null;
    const depositDate = tenant.depositDate ? new Date(tenant.depositDate) : null;

    if (isReservationTab) {
      const isOverdue = startDate && startDate < currentDate;
      return {
        text: isOverdue ? 'Quá hạn' : 'Khách cọc',
        className: isOverdue ? 'text-red-500 font-semibold' : 'text-blue-500 font-semibold',
      };
    } else {
      if (!tenant.isActive) {
        return {
          text: 'Đã rời',
          className: 'text-gray-500 font-semibold',
        };
      } else if (!depositDate) {
        return {
          text: 'Sắp chuyển đến',
          className: 'text-yellow-500 font-semibold',
        };
      } else if (depositDate && !startDate) {
        return {
          text: 'Đã cọc',
          className: 'text-green-500 font-semibold',
        };
      } else if (startDate && startDate <= currentDate) {
        return {
          text: 'Đang thuê',
          className: 'text-blue-500 font-semibold',
        };
      }
      return {
        text: 'Không xác định',
        className: '',
      };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
            {!isReservationTab && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trưởng phòng</th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {groupedTenantsByRoom.length > 0 ? (
            groupedTenantsByRoom.map((group, groupIndex) => (
              <React.Fragment key={group.room.id}>
                {group.tenants.map((tenant, index) => (
                  <tr key={`${group.room.id}-${tenant.id}`} className="hover:bg-gray-50">
                    {index === 0 && (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={group.tenants.length}
                      >
                        {getRoomNumber(group.room.id)}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tenant.phone}</td>
                    {!isReservationTab && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.isLeadRoom ? 'Có' : 'Không'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatus(tenant).className}>
                        {getStatus(tenant).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => {
                          if (typeof onViewDetails === 'function') {
                            onViewDetails(tenant);
                          } else {
                            console.warn('onViewDetails is not a function');
                          }
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={isReservationTab ? 5 : 6} className="px-6 py-4 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TenantTable;