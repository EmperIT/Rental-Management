import { Navigate } from 'react-router-dom';

function RoleBasedAccess({ allowedRoles, children }) {
  // Mock current user role (replace with auth context or API call)
  const currentUserRole = localStorage.getItem('userRole') || 'tenant_regular';

  if (!allowedRoles.includes(currentUserRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default RoleBasedAccess;