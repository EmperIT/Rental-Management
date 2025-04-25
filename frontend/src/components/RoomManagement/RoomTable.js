import React from 'react';
import { FaEdit, FaTrash, FaBuilding, FaMoneyBill, FaCalendarAlt, FaRuler, FaUser, FaCalendarPlus, FaWifi } from 'react-icons/fa';

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    if (status === 'Trống') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Đang thuê') return 'bg-green-100 text-green-700';
    return 'bg-orange-100 text-orange-700'; // Đã đặt hoặc Đã cọc
  };

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'ac', label: 'Điều hòa' },
    { id: 'heater', label: 'Máy nước nóng' },
    { id: 'parking', label: 'Chỗ để xe' },
  ];

  const getAmenityLabel = (amenityId) => {
    const amenity = amenitiesList.find((item) => item.id === amenityId);
    return amenity ? amenity.label : amenityId;
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Tiêu đề phòng */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{room.roomName}</h3>
                </div>
                <div className="ml-auto">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}
                  >
                    {room.status}
                  </span>
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaBuilding className="text-blue-500 mr-2" />
                  <span>
                    <strong>Tầng/Khu/Dãy:</strong> {room.floor || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBill className="text-blue-500 mr-2" />
                  <span>
                    <strong>Giá phòng:</strong> {room.price || 'N/A'} VNĐ
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span>
                    <strong>Ngày trống:</strong> {room.availableDate || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaRuler className="text-blue-500 mr-2" />
                  <span>
                    <strong>Diện tích:</strong> {room.area || 'N/A'} m²
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUser className="text-blue-500 mr-2" />
                  <span>
                    <strong>Trưởng phòng:</strong> {room.leadTenant || 'Chưa có'}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarPlus className="text-blue-500 mr-2" />
                  <span>
                    <strong>Ngày tạo:</strong> {room.createdDate || 'N/A'}
                  </span>
                </div>
                {(room.status === 'Đã đặt' || room.status === 'Đã cọc') && (
                  <div className="flex items-center">
                    <FaMoneyBill className="text-blue-500 mr-2" />
                    <span>
                      <strong>Đặt cọc:</strong> {room.deposit || 'N/A'} VNĐ
                    </span>
                  </div>
                )}
                {/* Hiển thị tiện ích */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <FaWifi className="text-blue-500 mr-2" />
                      <span>
                        <strong>Tiện ích:</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {getAmenityLabel(amenity)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Thao tác */}
              <div className="mt-4 flex justify-end items-center">
                <div className="flex space-x-2">
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
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-sm py-6">
            Chưa có phòng trọ nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomTable;