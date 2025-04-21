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
          path="/bills/room-rent"
          element={<PrivateRoute element={<HomePage showRoomRentBills={true} />} />}
        />
        <Route
          path="/bills/utilities"
          element={<PrivateRoute element={<HomePage showUtilitiesBills={true} />} />}
        />
        <Route
          path="/bills/wifi"
          element={<PrivateRoute element={<HomePage showWifiBills={true} />} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;