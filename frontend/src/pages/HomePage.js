import { useState, useEffect } from 'react'; // Đảm bảo import useEffect
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import DashboardStats from '../components/dashboard/DashboardStats';
import RoomManagement from '../components/RoomManagement';
import Contract from './Contract';
import Templates from './Templates';
import { FaBars } from 'react-icons/fa';
import '../styles/HomePage.css';

function HomePage({
  showRoomManagement = false,
  showTenants = false,
  showContracts = false,
  showTemplateContracts = false,
  showRoomRentBills = false,
  showUtilitiesBills = false,
  showWifiBills = false,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsSidebarOpen(!isNowMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    if (showRoomManagement) return <RoomManagement />;
    if (showTenants) return <div>Quản lý khách (Chưa triển khai)</div>;
    if (showContracts) return <Contract />;
    if (showTemplateContracts) return <Templates />;
    if (showRoomRentBills) return <div>Quản lý tiền phòng (Chưa triển khai)</div>;
    if (showUtilitiesBills) return <div>Quản lý hóa đơn điện nước (Chưa triển khai)</div>;
    if (showWifiBills) return <div>Quản lý hóa đơn Wifi (Chưa triển khai)</div>;
    return (
      <>
        <h2 className="dashboard-title">Dashboard</h2>
        <DashboardStats />
      </>
    );
  };

  return (
    <div className="home-container">
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>
      <div className="main-content">
        <div className="navbar-wrapper">
          {isMobile && (
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <FaBars />
            </button>
          )}
          <Navbar />
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default HomePage;