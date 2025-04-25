import React from 'react';

const TenantTable = ({ tenants, rooms, onViewDetails, isReservationTab }) => {
  const currentDate = new Date('2025-04-25');

  const getRoomNumber = (roomId) => {
    if (!rooms || !Array.isArray(rooms)) return 'N/A';
    const room = rooms.find((room) => room.room_id === roomId);
    return room ? `${room.roomName} - ${room.floor}` : 'N/A';
  };

  // Nhóm tenants theo room_id
  const groupedTenantsByRoom = rooms.reduce((acc, room) => {
    const roomTenants = tenants.filter((tenant) => tenant.room_id === room.room_id);
    if (roomTenants.length > 0) {
      acc.push({ room, tenants: roomTenants });
    }
    return acc;
  }, []);

  const getStatus = (tenant) => {
    // Nếu đang ở tab "Khách cọc giữ chỗ" hoặc có moveInDate (khách cọc)
    if (isReservationTab || tenant.moveInDate) {
      const moveInDate = tenant.moveInDate ? new Date(tenant.moveInDate) : null;
      const isOverdue = moveInDate && moveInDate < currentDate;
      return {
        text: isOverdue ? 'Quá hạn' : 'Chuẩn bị chuyển vào',
        className: isOverdue ? 'text-red-500 font-semibold' : 'text-blue-500 font-semibold',
      };
    }
    // Nếu là khách thuê (có is_active được định nghĩa)
    if (tenant.is_active !== undefined) {
      return {
        text: tenant.is_active ? 'Đang thuê' : 'Rời đi',
        className: '',
      };
    }
    // Trường hợp không xác định
    return {
      text: 'Không xác định',
      className: '',
    };
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
              <React.Fragment key={group.room.room_id}>
                {group.tenants.map((tenant, index) => (
                  <tr key={`${group.room.room_id}-${tenant.tenant_id}`} className="hover:bg-gray-50">
                    {index === 0 && (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        rowSpan={group.tenants.length}
                      >
                        {getRoomNumber(group.room.room_id)}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tenant.phone}</td>
                    {!isReservationTab && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.is_lead_room ? 'Có' : 'Không'}
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