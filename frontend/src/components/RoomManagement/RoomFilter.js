import React from 'react';
import { FaSearch } from 'react-icons/fa';

const RoomFilter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  floorFilter,
  setFloorFilter,
}) => {
  const floorsList = [
    'Tầng 1',
    'Tầng 2',
    'Tầng 3',
    'Tầng 4',
    'Tầng 5',
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-1 mb-4 md:mb-0">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            placeholder="Tìm kiếm phòng trọ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-48 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 mt-4 md:mt-0 transition-all duration-300"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Trống">Trống</option>
          <option value="Đang thuê">Đang thuê</option>
          <option value="Đã đặt">Đã đặt</option>
          <option value="Đã cọc">Đã cọc</option>
        </select>
        <select
          className="w-full md:w-48 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 mt-4 md:mt-0 transition-all duration-300"
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
        >
          <option value="Tất cả">Tất cả tầng</option>
          {floorsList.map((floor) => (
            <option key={floor} value={floor}>
              {floor}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <input
            type="date"
            className="w-full md:w-48 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition-all duration-300"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            className="w-full md:w-48 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2 transition-all duration-300"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;