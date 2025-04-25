import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import HomePage from '../pages/HomePage';
import AccountManagementPage from '../pages/AccountManagementPage';
import ProfilePage from '../pages/ProfilePage';
import RoomManagement from '../pages/RoomManagement';
import TenantManagementPage from '../pages/TenantManagementPage';
import Contract from '../pages/Contract';
import Templates from '../pages/Templates';
import TenantDashboardPage from '../pages/TenantDashboardPage';

const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage" replace />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/home"
          element={<PrivateRoute element={<HomePage />} />}
        />
        <Route
          path="/rooms"
          element={<PrivateRoute element={<HomePage showRoomManagement={true} />} />}
        />
        <Route
          path="/tenants"
          element={<PrivateRoute element={<HomePage showTenants={true} />} />}
        />
        <Route
          path="/residence-registration"
          element={<PrivateRoute element={<HomePage showResidenceRegistration={true} />} />}
        />
        <Route
          path="/contracts"
          element={<PrivateRoute element={<HomePage showContracts={true} />} />}
        />
        <Route
          path="/templatecontracts"
          element={<PrivateRoute element={<HomePage showTemplateContracts={true} />} />}
        />
        <Route
          path="/bills"
          element={<PrivateRoute element={<HomePage showBills={true} />} />}
        />
        <Route
          path="/services"
          element={<PrivateRoute element={<HomePage showServices={true} />} />}
        />
        <Route
          path="/assets"
          element={<PrivateRoute element={<HomePage showAssets={true} />} />}
        />
        <Route
          path="/finance"
          element={<PrivateRoute element={<HomePage showFinance={true} />} />}
        />
        <Route
          path="/accounts/managers"
          element={<PrivateRoute element={<HomePage showManagerAccounts={true} />} />}
        />
        <Route
          path="/accounts/tenants"
          element={<PrivateRoute element={<HomePage showTenantAccounts={true} />} />}
        />
        <Route
          path="/accounts/profile"
          element={<PrivateRoute element={<HomePage showProfile={true} />} />}
        />
        <Route
          path="/tenant-dashboard"
          element={<PrivateRoute element={<HomePage showTenantDashboard={true} />} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;