import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaUserFriends, FaFileContract, FaFileInvoiceDollar, FaTimes, FaMoneyCheckAlt, FaCubes, FaUserCog } from 'react-icons/fa';
import { useState } from 'react';
import '../../styles/dashboard/Sidebar.css';

function Sidebar({ toggleSidebar }) {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  const handleUnimplementedClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
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
        {showMessage && (
          <div className="sidebar-message">
            Tính năng đang được phát triển!
          </div>
        )}
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
        <div className="nav-section">QUẢN LÝ HỢP ĐỒNG</div>
        <Link to="/contracts" className={`nav-subitem ${location.pathname === '/contracts' ? 'active' : ''}`}>
          <span className="nav-icon"><FaFileContract /></span>
          Quản lý hợp đồng
        </Link>
        <Link to="/templatecontracts" className={`nav-subitem ${location.pathname === '/templatecontracts' ? 'active' : ''}`}>
          <span className="nav-icon"><FaFileContract /></span>
          Mẫu hợp đồng
        </Link>
        <div className="nav-section">QUẢN LÝ HÓA ĐƠN</div>
        <Link
          to="/bills/create"
          className={`nav-subitem ${location.pathname === '/bills/create' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Tạo hóa đơn
        </Link>
        <Link
          to="/bills/edit"
          className={`nav-subitem ${location.pathname === '/bills/edit' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Chỉnh sửa hóa đơn
        </Link>
        <Link
          to="/bills/delete"
          className={`nav-subitem ${location.pathname === '/bills/delete' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Xóa hóa đơn
        </Link>
        <div className="nav-section">QUẢN LÝ DỊCH VỤ</div>
        <Link
          to="/services/utilities"
          className={`nav-subitem ${location.pathname === '/services/utilities' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Điện nước
        </Link>
        <Link
          to="/services/wifi"
          className={`nav-subitem ${location.pathname === '/services/wifi' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Wifi
        </Link>
        <div className="nav-section">QUẢN LÝ TÀI SẢN</div>
        <Link
          to="/assets"
          className={`nav-subitem ${location.pathname === '/assets' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaCubes /></span>
          Quản lý tài sản
        </Link>
        <div className="nav-section">QUẢN LÝ THU CHI</div>
        <Link
          to="/finance"
          className={`nav-subitem ${location.pathname === '/finance' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaMoneyCheckAlt /></span>
          Quản lý thu chi
        </Link>
        <div className="nav-section">QUẢN LÝ TÀI KHOẢN</div>
        <Link
          to="/accounts/manage"
          className={`nav-subitem ${location.pathname === '/accounts/manage' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaUserCog /></span>
          Quản lý tài khoản
        </Link>
        <Link
          to="/accounts/profile"
          className={`nav-subitem ${location.pathname === '/accounts/profile' ? 'active' : ''}`}
          onClick={handleUnimplementedClick}
        >
          <span className="nav-icon"><FaUserCog /></span>
          Thông tin tài khoản
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;