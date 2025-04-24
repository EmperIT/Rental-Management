import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import HomePage from '../pages/HomePage';

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
          path="/contracts"
          element={<PrivateRoute element={<HomePage showContracts={true} />} />}
        />
        <Route
          path="/templatecontracts"
          element={<PrivateRoute element={<HomePage showTemplateContracts={true} />} />}
        />
        <Route
          path="/bills/create"
          element={<PrivateRoute element={<HomePage showBillCreate={true} />} />}
        />
        <Route
          path="/bills/edit"
          element={<PrivateRoute element={<HomePage showBillEdit={true} />} />}
        />
        <Route
          path="/bills/delete"
          element={<PrivateRoute element={<HomePage showBillDelete={true} />} />}
        />
        <Route
          path="/services/utilities"
          element={<PrivateRoute element={<HomePage showUtilitiesBills={true} />} />}
        />
        <Route
          path="/services/wifi"
          element={<PrivateRoute element={<HomePage showWifiBills={true} />} />}
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
          path="/accounts/manage"
          element={<PrivateRoute element={<HomePage showAccountManagement={true} />} />}
        />
        <Route
          path="/accounts/profile"
          element={<PrivateRoute element={<HomePage showProfile={true} />} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;