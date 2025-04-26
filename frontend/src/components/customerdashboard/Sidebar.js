import React from 'react';

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="cd-sidebar">
      <h2>Tra cứu</h2>
      <ul>
        <li
          className={activeSection === 'contracts' ? 'cd-active' : ''}
          onClick={() => setActiveSection('contracts')}
        >
          Hợp đồng
        </li>
        <li
          className={activeSection === 'temp-residence' ? 'cd-active' : ''}
          onClick={() => setActiveSection('temp-residence')}
        >
          Đơn tạm trú
        </li>
        <li
          className={activeSection === 'personal-info' ? 'cd-active' : ''}
          onClick={() => setActiveSection('personal-info')}
        >
          Thông tin cá nhân
        </li>
        <li
          className={activeSection === 'invoices' ? 'cd-active' : ''}
          onClick={() => setActiveSection('invoices')}
        >
          Hóa đơn
        </li>
      </ul>
    </div>
  );
}