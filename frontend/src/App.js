import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Farmer pages
import FarmerDashboard from './pages/farmer/Dashboard';
import BookVehicle from './pages/farmer/BookVehicle';
import MyBookings from './pages/farmer/MyBookings';
import BookingDetails from './pages/farmer/BookingDetails';

// Vehicle Owner pages
import VehicleOwnerDashboard from './pages/vehicleowner/Dashboard';
import VehicleManagement from './pages/vehicleowner/VehicleManagement';
import BookingRequests from './pages/vehicleowner/BookingRequests';
import MyVehicles from './pages/vehicleowner/MyVehicles';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import VehicleApproval from './pages/admin/VehicleApproval';
import BookingMonitoring from './pages/admin/BookingMonitoring';
import Analytics from './pages/admin/Analytics';

// Common pages
import VehicleSearch from './pages/VehicleSearch';
import NotFound from './pages/NotFound';

import './App.css';

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container-fluid">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vehicles" element={<VehicleSearch />} />

          {/* Protected common routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Farmer routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/book-vehicle"
            element={
              <ProtectedRoute requiredRole="farmer">
                <BookVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/bookings"
            element={
              <ProtectedRoute requiredRole="farmer">
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/bookings/:id"
            element={
              <ProtectedRoute requiredRole="farmer">
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* Vehicle Owner routes */}
          <Route
            path="/vehicle-owner/dashboard"
            element={
              <ProtectedRoute requiredRole="vehicle_owner">
                <VehicleOwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-owner/vehicles"
            element={
              <ProtectedRoute requiredRole="vehicle_owner">
                <MyVehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-owner/manage-vehicles"
            element={
              <ProtectedRoute requiredRole="vehicle_owner">
                <VehicleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-owner/booking-requests"
            element={
              <ProtectedRoute requiredRole="vehicle_owner">
                <BookingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-owner/bookings/:id"
            element={
              <ProtectedRoute requiredRole="vehicle_owner">
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute requiredRole="admin">
                <VehicleApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="admin">
                <BookingMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Redirect routes */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

// Component to redirect to appropriate dashboard based on user role
function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case 'farmer':
      return <Navigate to="/farmer/dashboard" replace />;
    case 'vehicle_owner':
      return <Navigate to="/vehicle-owner/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;