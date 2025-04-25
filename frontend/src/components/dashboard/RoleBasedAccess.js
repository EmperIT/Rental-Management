import { Navigate, useLocation } from 'react-router-dom';

function RoleBasedAccess({ allowedRoles, children }) {
  const userRole = localStorage.getItem('userRole') || 'tenant';
  const location = useLocation();

  const roleAccessMap = {
    '/residence-registration': ['landlord', 'manager'],
    '/accounts/managers': ['landlord'],
    '/accounts/tenants': ['landlord'],
    '/tenant-dashboard': ['tenant'],
  };

  const isAllowed = roleAccessMap[location.pathname]
    ? roleAccessMap[location.pathname].includes(userRole)
    : allowedRoles.includes(userRole);

  return isAllowed ? children : <Navigate to="/home" replace />;
}

export default RoleBasedAccess;