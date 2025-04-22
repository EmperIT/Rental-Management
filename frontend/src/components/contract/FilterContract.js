import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/contract/FilterContract.css";

const FilterContract = ({ statusFilter, setStatusFilter, startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className="filter-contract">
      {/* Bộ lọc trạng thái */}
      <select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value)} 
        className="filter-select"
      >
        <option value="All">Tất cả</option>
        <option value="Active">Đang hoạt động</option>
        <option value="Near Expire">Gần hết hạn</option>
        <option value="Expired">Đã hết hạn</option>
      </select>

      {/* Chọn khoảng thời gian */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Từ ngày"
          className="filter-date"
        />
        <span> - </span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Đến ngày"
          className="filter-date"
        />
      </div>
  );
};

export default FilterContract;
