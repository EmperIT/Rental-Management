import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaUserFriends, FaFileContract, FaFileInvoiceDollar, FaTimes, FaMoneyCheckAlt, FaCubes, FaUserCog, FaIdCard, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import '../../styles/dashboard/Sidebar.css';

function Sidebar({ toggleSidebar }) {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [contractDropdownOpen, setContractDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleUnimplementedClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const toggleContractDropdown = () => {
    setContractDropdownOpen(!contractDropdownOpen);
  };

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">R</span>
          <span className="logo-text">RentHub</span>
        </div>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
          <span className="nav-icon"><FaHome /></span>
          Dashboard
        </Link>
        <Link to="/rooms" className={`nav-item ${location.pathname === '/rooms' ? 'active' : ''}`}>
          <span className="nav-icon"><FaBuilding /></span>
          Quản lý phòng
        </Link>
        <Link to="/tenants" className={`nav-item ${location.pathname === '/tenants' ? 'active' : ''}`}>
          <span className="nav-icon"><FaUserFriends /></span>
          Quản lý khách
        </Link>
        <Link
          to="/residence-registration"
          className={`nav-item ${location.pathname === '/residence-registration' ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaIdCard /></span>
          Quản lý đăng ký tạm trú
        </Link>

        {/* Dropdown for Quản lý hợp đồng */}
        <div className="nav-section" onClick={toggleContractDropdown} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>QUẢN LÝ HỢP ĐỒNG</span>
          {contractDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {contractDropdownOpen && (
          <>
            <Link to="/contracts" className={`nav-subitem ${location.pathname === '/contracts' ? 'active' : ''}`}>
              <span className="nav-icon"><FaFileContract /></span>
              Quản lý hợp đồng
            </Link>
            <Link to="/templatecontracts" className={`nav-subitem ${location.pathname === '/templatecontracts' ? 'active' : ''}`}>
              <span className="nav-icon"><FaFileContract /></span>
              Mẫu hợp đồng
            </Link>
          </>
        )}

        <Link
          to="/bills"
          className={`nav-item ${location.pathname === '/bills' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Quản lý hóa đơn
        </Link>
        <Link
          to="/services"
          className={`nav-item ${location.pathname === '/services' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Quản lý dịch vụ
        </Link>
        <Link
          to="/assets"
          className={`nav-item ${location.pathname === '/assets' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaCubes /></span>
          Quản lý tài sản
        </Link>
        <Link
          to="/finance"
          className={`nav-item ${location.pathname === '/finance' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaMoneyCheckAlt /></span>
          Quản lý thu chi
        </Link>

        {/* Dropdown for Quản lý tài khoản */}
        <div className="nav-section" onClick={toggleAccountDropdown} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>QUẢN LÝ TÀI KHOẢN</span>
          {accountDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {accountDropdownOpen && (
          <>
            <Link
              to="/accounts/manage"
              className={`nav-subitem ${location.pathname === '/accounts/manage' ? 'active' : ''}`}
            >
              <span className="nav-icon"><FaUserCog /></span>
              Quản lý tài khoản
            </Link>
            <Link
              to="/accounts/profile"
              className={`nav-subitem ${location.pathname === '/accounts/profile' ? 'active' : ''}`}
            >
              <span className="nav-icon"><FaUserCog /></span>
              Thông tin tài khoản
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;