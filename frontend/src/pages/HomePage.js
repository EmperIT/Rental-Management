import { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import DashboardStats from '../components/dashboard/DashboardStats';
import RoomManagement from './RoomManagement';
import TenantManagementPage from './TenantManagementPage';
import Contract from './Contract';
import Templates from './Templates';
import InvoicePage from './InvoicePage';
import ServicePage from './ServicePage';
import AssetPage from './AssetPage';
import FinancePage from './FinancePage';
import AccountManagementPage from './AccountManagementPage';
import ProfilePage from './ProfilePage';
import { FaBars } from 'react-icons/fa';
import '../styles/HomePage.css';

function HomePage({
  showRoomManagement = false,
  showTenants = false,
  showResidenceRegistration = false,
  showContracts = false,
  showTemplateContracts = false,
  showBills = false,
  showServices = false,
  showAssets = false,
  showFinance = false,
  showAccountManagement = false,
  showProfile = false,
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
    console.log('Rendering HomePage with props:', {
      showRoomManagement,
      showTenants,
      showResidenceRegistration,
      showContracts,
      showTemplateContracts,
      showBills,
      showServices,
      showAssets,
      showFinance,
      showAccountManagement,
      showProfile,
    });
    if (showRoomManagement) return <RoomManagement />;
    if (showTenants) return <TenantManagementPage />;
    if (showResidenceRegistration) return <div>Quản lý hóa đơn (Chưa triển khai)</div>;
    if (showContracts) return <Contract />;
    if (showTemplateContracts) return <Templates />;
    if (showBills) return <div><InvoicePage /></div>;
    if (showServices) return <div><ServicePage /></div>;
    if (showAssets) return <div><AssetPage /></div>;
    if (showFinance) return <div><FinancePage /></div>;
    if (showAccountManagement) return <AccountManagementPage />;
    if (showProfile) return <ProfilePage />;
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