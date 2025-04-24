import React from 'react';

const SummaryCards = ({ rooms }) => {
  const activeRooms = rooms.filter((room) => room.status === 'Đang cho thuê').length;
  const vacantRooms = rooms.filter((room) => room.status === 'Trống').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-700">Tổng số phòng</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{rooms.length}</p>
        <p className="text-sm text-blue-500 mt-1">+{rooms.length} phòng</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-700">Phòng đang cho thuê</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{activeRooms}</p>
        <p className="text-sm text-blue-500 mt-1">+{activeRooms} phòng</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-700">Phòng trống</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{vacantRooms}</p>
        <p className="text-sm text-red-500 mt-1">+{vacantRooms} phòng</p>
      </div>
    </div>
  );
};

export default SummaryCards;