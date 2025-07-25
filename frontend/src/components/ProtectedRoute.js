import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { Alert, Container } from 'react-bootstrap';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required role is specified
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You don't have permission to access this page. 
            {requiredRole && ` This page requires ${requiredRole} privileges.`}
          </p>
          <hr />
          <p className="mb-0">
            Please contact the administrator if you believe this is an error.
          </p>
        </Alert>
      </Container>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;