import React from 'react';
import { FaSearch } from 'react-icons/fa';

const TenantFilter = ({
  searchTerm,
  setSearchTerm,
  houseFilter,
  setHouseFilter,
  roomFilter,
  setRoomFilter,
  houses,
  rooms,
}) => {
  return (
    <div className="filter-container">
      <div className="filter-content">
        <div className="filter-search-wrapper">
          <FaSearch className="filter-search-icon" />
          <input
            type="text"
            className="filter-input filter-search-input"
            placeholder="Tìm kiếm khách thuê"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
          >
            <option value="">Tất cả nhà</option>
            {houses.map((house, index) => (
              <option key={index} value={house}>{house}</option>
            ))}
          </select>
        </div>
        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
          >
            <option value="">Tất cả phòng</option>
            {rooms.map((room, index) => (
              <option key={index} value={room}>{room}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TenantFilter;