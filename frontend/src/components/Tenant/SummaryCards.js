import React from 'react';

const SummaryCards = ({ currentTenants, pastTenants, reservations }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3 className="stat-title">Khách đang thuê</h3>
        <p className="stat-value">{currentTenants.length}</p>
      </div>
      <div className="stat-card">
        <h3 className="stat-title">Khách đã rời</h3>
        <p className="stat-value">{pastTenants.length}</p>
      </div>
      <div className="stat-card">
        <h3 className="stat-title">Khách cọc</h3>
        <p className="stat-value">{reservations.length}</p>
      </div>
    </div>
  );
};

export default SummaryCards;