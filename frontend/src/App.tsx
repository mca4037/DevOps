import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FarmerDashboard from './pages/farmer/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import BookingForm from './pages/farmer/BookingForm';
import VehicleRegistration from './pages/driver/VehicleRegistration';
import BookingDetails from './pages/BookingDetails';
import Profile from './pages/Profile';

// Loading Component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
  </div>
);

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Register />} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Farmer Routes */}
          <Route path="/farmer/dashboard" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/book-transport" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <BookingForm />
            </ProtectedRoute>
          } />

          {/* Driver Routes */}
          <Route path="/driver/dashboard" element={
            <ProtectedRoute allowedRoles={['vehicle_owner']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver/register-vehicle" element={
            <ProtectedRoute allowedRoles={['vehicle_owner']}>
              <VehicleRegistration />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/booking/:id" element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          } />

          {/* Default redirect based on user role */}
          <Route path="*" element={
            user ? <Navigate to={getDashboardPath(user.role)} /> : <Navigate to="/" />
          } />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function getDashboardPath(role: string): string {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'vehicle_owner':
      return '/driver/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;