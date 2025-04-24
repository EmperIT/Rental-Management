
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    return status === 'Đang cho thuê' ? 'bg-green-500' : 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-gray-700 font-semibold">Tên phòng</th>
                <th className="p-4 text-gray-700 font-semibold">Tầng/Khu/Dãy</th>
                <th className="p-4 text-gray-700 font-semibold">Giá phòng</th>
                <th className="p-4 text-gray-700 font-semibold">Trạng thái</th>
                <th className="p-4 text-gray-700 font-semibold">Ngày trống</th>
                <th className="p-4 text-gray-700 font-semibold">Diện tích</th>
                <th className="p-4 text-gray-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-300">
                    <td className="p-4">{room.roomName}</td>
                    <td className="p-4">{room.floor}</td>
                    <td className="p-4">{room.price}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                          room.status
                        )}`}
                      >
                        {room.status === 'Đang cho thuê' ? 'Active' : 'Near Expire'}
                      </span>
                    </td>
                    <td className="p-4">{room.availableDate}</td>
                    <td className="p-4">{room.area} m²</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        onClick={() => onEdit(index)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        onClick={() => onDelete(index)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-sm text-gray-600">
                    Chưa có phòng trọ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomTable;