import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }:any) => {
  const token = localStorage.getItem('access_token');

  const role =  localStorage.getItem('role') 
  
  if (!token ) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
