import React from 'react';

const TenantTable = ({ tenants, onView, isReservation }) => {
  return (
    <div className="table-container">
      <div className="table-content">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">Họ tên</th>
                <th className="table-header-cell">Số điện thoại</th>
                <th className="table-header-cell">Nhà</th>
                <th className="table-header-cell">Phòng</th>
                {isReservation && (
                  <th className="table-header-cell">Ngày vào dự kiến</th>
                )}
                <th className="table-header-cell">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length > 0 ? (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="table-row">
                    <td className="table-cell">{tenant.name}</td>
                    <td className="table-cell">{tenant.phone}</td>
                    <td className="table-cell">{tenant.house}</td>
                    <td className="table-cell">{tenant.room}</td>
                    {isReservation && (
                      <td className="table-cell">{tenant.moveInDate}</td>
                    )}
                    <td className="table-cell">
                      <button
                        className="table-action-btn"
                        onClick={() => onView(tenant)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isReservation ? 6 : 5} className="table-empty">
                    Chưa có khách thuê nào.
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

export default TenantTable;