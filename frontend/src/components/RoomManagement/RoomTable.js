import React from 'react';
import { FaEdit, FaTrash, FaBuilding, FaMoneyBill, FaCalendarAlt, FaRuler, FaUser, FaCalendarPlus } from 'react-icons/fa';

const RoomTable = ({ rooms, onEdit, onDelete }) => {
  const getStatusColor = (isEmpty) => {
    return isEmpty ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'; // Trống hoặc Đang thuê
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
                  <h3 className="text-lg font-semibold text-gray-800">{room.roomNumber}</h3>
                </div>
                <div className="ml-auto">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.isEmpty)}`}
                  >
                    {room.isEmpty ? 'Trống' : 'Đang thuê'}
                  </span>
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-center">
                  <FaMoneyBill className="text-blue-500 mr-2" />
                  <span>
                    <strong>Giá phòng:</strong> {room.price.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span>
                    <strong>Ngày đặt cọc:</strong>{' '}
                    {room.depositDate ? new Date(room.depositDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaRuler className="text-blue-500 mr-2" />
                  <span>
                    <strong>Diện tích:</strong> {room.area} m²
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUser className="text-blue-500 mr-2" />
                  <span>
                    <strong>Trưởng phòng:</strong> {'Chưa có'} {/* API chưa cung cấp trường này */}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarPlus className="text-blue-500 mr-2" />
                  <span>
                    <strong>Ngày tạo:</strong>{' '}
                    {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBill className="text-blue-500 mr-2" />
                  <span>
                    <strong>Đặt cọc:</strong> {room.depositPrice.toLocaleString()} VNĐ
                  </span>
                </div>
                {/* Hiển thị hình ảnh */}
                {room.images && room.images.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span>
                        <strong>Hình ảnh:</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Phòng ${room.roomNumber}`}
                          className="w-16 h-16 object-cover rounded"
                        />
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