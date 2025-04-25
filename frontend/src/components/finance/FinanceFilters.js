import React from 'react';
import '../../styles/finance/FinanceFilters.css';

export default function FinanceFilters({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterTime,
  setFilterTime,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedQuarter,
  setSelectedQuarter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  years,
  quarters,
  incomeCategories,
  expenseCategories,
}) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>Loại:</label>
        <select value={filterType} onChange={(e) => {
          setFilterType(e.target.value);
          setFilterCategory('');
        }}>
          <option value="Thu">Thu</option>
          <option value="Chi">Chi</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Danh mục:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Tất cả</option>
          {(filterType === 'Thu' ? incomeCategories : expenseCategories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Năm:</label>
        <select value={selectedYear} onChange={(e) => {
          const newYear = e.target.value;
          setSelectedYear(newYear);
          setSelectedMonth(`${newYear}-01`);
          setSelectedQuarter(`${newYear}-Q1`);
        }}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Thời gian:</label>
        <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
          <option value="month">Theo tháng</option>
          <option value="quarter">Theo quý</option>
          <option value="range">Khoảng thời gian</option>
        </select>
      </div>

      {filterTime === 'month' && (
        <div className="filter-group">
          <label>Chọn tháng:</label>
          <input
            type="month"
            value={selectedMonth}
            min={`${selectedYear}-01`}
            max={`${selectedYear}-12`}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      )}

      {filterTime === 'quarter' && (
        <div className="filter-group">
          <label>Chọn quý:</label>
          <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
            {quarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterTime === 'range' && (
        <div className="filter-group date-range">
          <div>
            <label>Từ:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label>Đến:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}