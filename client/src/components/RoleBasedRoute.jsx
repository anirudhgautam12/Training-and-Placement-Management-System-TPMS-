import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is loaded and their role is included in allowedRoles, allow access
  // For the sake of this template, if user role is missing we'll assume they aren't authorized
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // Otherwise, fallback to an unauthorized page or dashboard home.
  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute;
