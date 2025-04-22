import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBuilding, FaUserFriends, FaFileContract, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';
import '../../styles/dashboard/Sidebar.css';

function Sidebar({ toggleSidebar }) {
  const location = useLocation();

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
          to="/bills/room-rent"
          className={`nav-subitem ${location.pathname === '/bills/room-rent' ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Quản lý tiền phòng
        </Link>
        <Link
          to="/bills/utilities"
          className={`nav-subitem ${location.pathname === '/bills/utilities' ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Điện nước
        </Link>
        <Link
          to="/bills/wifi"
          className={`nav-subitem ${location.pathname === '/bills/wifi' ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaFileInvoiceDollar /></span>
          Wifi
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;