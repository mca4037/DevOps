import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  changePassword: (passwords) => API.put('/auth/change-password', passwords),
};

// Users API calls
export const usersAPI = {
  getUsers: (params) => API.get('/users', { params }),
  getUserById: (id) => API.get(`/users/${id}`),
  getUserStats: (id) => API.get(`/users/${id}/stats`),
  getUserReviews: (id, params) => API.get(`/users/${id}/reviews`, { params }),
  searchByLocation: (data) => API.post('/users/search-by-location', data),
  getTopRated: (params) => API.get('/users/top-rated', { params }),
};

// Vehicles API calls
export const vehiclesAPI = {
  getVehicles: (params) => API.get('/vehicles', { params }),
  getVehicleById: (id) => API.get(`/vehicles/${id}`),
  getMyVehicles: () => API.get('/vehicles/my/vehicles'),
  registerVehicle: (vehicleData) => API.post('/vehicles', vehicleData),
  updateVehicle: (id, vehicleData) => API.put(`/vehicles/${id}`, vehicleData),
  updateAvailability: (id, availability) => API.put(`/vehicles/${id}/availability`, availability),
  updateLocation: (id, location) => API.put(`/vehicles/${id}/location`, location),
  deleteVehicle: (id) => API.delete(`/vehicles/${id}`),
  findNearby: (data) => API.post('/vehicles/nearby', data),
};

// Bookings API calls
export const bookingsAPI = {
  createBooking: (bookingData) => API.post('/bookings', bookingData),
  getMyBookings: (params) => API.get('/bookings/my', { params }),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  respondToBooking: (id, response) => API.put(`/bookings/${id}/respond`, response),
  updateBookingStatus: (id, status) => API.put(`/bookings/${id}/status`, status),
  cancelBooking: (id, reason) => API.put(`/bookings/${id}/cancel`, { reason }),
  addMessage: (id, message) => API.post(`/bookings/${id}/messages`, message),
  rateBooking: (id, rating) => API.post(`/bookings/${id}/rate`, rating),
  getNearbyRequests: (data) => API.post('/bookings/nearby-requests', data),
};

// Admin API calls
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getUserById: (id) => API.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => API.put(`/admin/users/${id}/status`, status),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getVehicles: (params) => API.get('/admin/vehicles', { params }),
  approveVehicle: (id, approval) => API.put(`/admin/vehicles/${id}/approve`, approval),
  getBookings: (params) => API.get('/admin/bookings', { params }),
  getBookingAnalytics: (params) => API.get('/admin/analytics/bookings', { params }),
  getVehicleAnalytics: () => API.get('/admin/analytics/vehicles'),
};

export default API;