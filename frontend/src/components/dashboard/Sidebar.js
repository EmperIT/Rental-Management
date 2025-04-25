import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaUserFriends, FaFileContract, FaFileInvoiceDollar, FaTimes, FaMoneyCheckAlt, FaCubes, FaUserCog, FaIdCard, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import '../../styles/dashboard/Sidebar.css';

function Sidebar({ toggleSidebar }) {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || 'tenant';
  const [showMessage, setShowMessage] = useState(false);
  const [contractDropdownOpen, setContractDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(true);

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

  // Định nghĩa quyền truy cập tương tự RoleBasedAccess.js
  const roleAccessMap = {
    '/residence-registration': ['landlord', 'manager'],
    '/rooms': ['landlord', 'manager'],
    '/tenants': ['landlord', 'manager'],
    '/contracts': ['landlord', 'manager'],
    '/templatecontracts': ['landlord', 'manager'],
    '/bills': ['landlord', 'manager'],
    '/services': ['landlord', 'manager'],
    '/assets': ['landlord', 'manager'],
    '/finance': ['landlord', 'manager'],
    '/accounts/managers': ['landlord'],
    '/accounts/tenants': ['landlord'],
    '/tenant-dashboard': ['tenant'],
    '/home': ['landlord', 'manager', 'tenant'],
    '/accounts/profile': ['landlord', 'manager', 'tenant'],
  };

  // Hàm kiểm tra xem một đường dẫn có được phép hiển thị không
  const isRouteAllowed = (path) => {
    return roleAccessMap[path]?.includes(userRole) || false;
  };

  // Kiểm tra xem dropdown có nên hiển thị (nếu có ít nhất một mục con được phép)
  const isContractDropdownVisible = isRouteAllowed('/contracts') || isRouteAllowed('/templatecontracts');
  const isAccountDropdownVisible =
    isRouteAllowed('/accounts/managers') ||
    isRouteAllowed('/accounts/tenants') ||
    isRouteAllowed('/accounts/profile') ||
    isRouteAllowed('/tenant-dashboard');

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
        {showMessage && (
          <div className="sidebar-message">
            Tính năng đang được phát triển!
          </div>
        )}
        {isRouteAllowed('/home') && (
          <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
            <span className="nav-icon"><FaHome /></span>
            Dashboard
          </Link>
        )}
        {isRouteAllowed('/rooms') && (
          <Link to="/rooms" className={`nav-item ${location.pathname === '/rooms' ? 'active' : ''}`}>
            <span className="nav-icon"><FaBuilding /></span>
            Quản lý phòng
          </Link>
        )}
        {isRouteAllowed('/tenants') && (
          <Link to="/tenants" className={`nav-item ${location.pathname === '/tenants' ? 'active' : ''}`}>
            <span className="nav-icon"><FaUserFriends /></span>
            Quản lý khách
          </Link>
        )}
        {isRouteAllowed('/residence-registration') && (
          <Link
            to="/residence-registration"
            className={`nav-item ${location.pathname === '/residence-registration' ? 'active' : ''}`}
          >
            <span className="nav-icon"><FaIdCard /></span>
            Quản lý đăng ký tạm trú
          </Link>
        )}
        {isContractDropdownVisible && (
          <div
            className="nav-section"
            onClick={toggleContractDropdown}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>QUẢN LÝ HỢP ĐỒNG</span>
            {contractDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
        {isContractDropdownVisible && contractDropdownOpen && (
          <>
            {isRouteAllowed('/contracts') && (
              <Link to="/contracts" className={`nav-subitem ${location.pathname === '/contracts' ? 'active' : ''}`}>
                <span className="nav-icon"><FaFileContract /></span>
                Quản lý hợp đồng
              </Link>
            )}
            {isRouteAllowed('/templatecontracts') && (
              <Link to="/templatecontracts" className={`nav-subitem ${location.pathname === '/templatecontracts' ? 'active' : ''}`}>
                <span className="nav-icon"><FaFileContract /></span>
                Mẫu hợp đồng
              </Link>
            )}
          </>
        )}
        {isRouteAllowed('/bills') && (
          <Link
            to="/bills"
            className={`nav-item ${location.pathname === '/bills' ? 'active' : ''}`}
            onClick={handleUnimplementedClick}
          >
            <span className="nav-icon"><FaFileInvoiceDollar /></span>
            Quản lý hóa đơn
          </Link>
        )}
        {isRouteAllowed('/services') && (
          <Link
            to="/services"
            className={`nav-item ${location.pathname === '/services' ? 'active' : ''}`}
            onClick={handleUnimplementedClick}
          >
            <span className="nav-icon"><FaFileInvoiceDollar /></span>
            Quản lý dịch vụ
          </Link>
        )}
        {isRouteAllowed('/assets') && (
          <Link
            to="/assets"
            className={`nav-item ${location.pathname === '/assets' ? 'active' : ''}`}
            onClick={handleUnimplementedClick}
          >
            <span className="nav-icon"><FaCubes /></span>
            Quản lý tài sản
          </Link>
        )}
        {isRouteAllowed('/finance') && (
          <Link
            to="/finance"
            className={`nav-item ${location.pathname === '/finance' ? 'active' : ''}`}
            onClick={handleUnimplementedClick}
          >
            <span className="nav-icon"><FaMoneyCheckAlt /></span>
            Quản lý thu chi
          </Link>
        )}
        {isAccountDropdownVisible && (
          <div
            className="nav-section"
            onClick={toggleAccountDropdown}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>QUẢN LÝ TÀI KHOẢN</span>
            {accountDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
        {isAccountDropdownVisible && accountDropdownOpen && (
          <>
            {isRouteAllowed('/accounts/managers') && (
              <Link
                to="/accounts/managers"
                className={`nav-subitem ${location.pathname === '/accounts/managers' ? 'active' : ''}`}
              >
                <span className="nav-icon"><FaUserCog /></span>
                Quản lý tài khoản Quản lý
              </Link>
            )}
            {isRouteAllowed('/accounts/tenants') && (
              <Link
                to="/accounts/tenants"
                className={`nav-subitem ${location.pathname === '/accounts/tenants' ? 'active' : ''}`}
              >
                <span className="nav-icon"><FaUserCog /></span>
                Quản lý tài khoản Khách thuê
              </Link>
            )}
            {isRouteAllowed('/accounts/profile') && (
              <Link
                to="/accounts/profile"
                className={`nav-subitem ${location.pathname === '/accounts/profile' ? 'active' : ''}`}
              >
                <span className="nav-icon"><FaUserCog /></span>
                Thông tin cá nhân
              </Link>
            )}
            {isRouteAllowed('/tenant-dashboard') && (
              <Link
                to="/tenant-dashboard"
                className={`nav-subitem ${location.pathname === '/tenant-dashboard' ? 'active' : ''}`}
              >
                <span className="nav-icon"><FaUserCog /></span>
                Thông tin tiền phòng
              </Link>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;