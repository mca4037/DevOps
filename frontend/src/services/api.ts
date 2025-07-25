import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
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

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.status >= 400) {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  auth = {
    login: (email: string, password: string) =>
      this.api.post('/auth/login', { email, password }),
    
    register: (userData: any) =>
      this.api.post('/auth/register', userData),
    
    getProfile: () =>
      this.api.get('/auth/me'),
    
    updateProfile: (userData: any) =>
      this.api.put('/auth/profile', userData),
    
    updateLocation: (latitude: number, longitude: number) =>
      this.api.put('/auth/location', { latitude, longitude }),
  };

  // Vehicle endpoints
  vehicles = {
    getMyVehicles: () =>
      this.api.get('/vehicles/my-vehicles'),
    
    addVehicle: (vehicleData: FormData) =>
      this.api.post('/vehicles', vehicleData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    
    updateVehicle: (id: string, vehicleData: FormData) =>
      this.api.put(`/vehicles/${id}`, vehicleData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    
    searchVehicles: (params: any) =>
      this.api.get('/vehicles/search', { params }),
    
    getVehicle: (id: string) =>
      this.api.get(`/vehicles/${id}`),
    
    updateAvailability: (id: string, isAvailable: boolean) =>
      this.api.put(`/vehicles/${id}/availability`, { isAvailable }),
    
    updateLocation: (id: string, latitude: number, longitude: number) =>
      this.api.put(`/vehicles/${id}/location`, { latitude, longitude }),
    
    deleteVehicle: (id: string) =>
      this.api.delete(`/vehicles/${id}`),
  };

  // Booking endpoints
  bookings = {
    createBooking: (bookingData: any) =>
      this.api.post('/bookings', bookingData),
    
    getMyBookings: (params?: any) =>
      this.api.get('/bookings/my-bookings', { params }),
    
    getMyTrips: (params?: any) =>
      this.api.get('/bookings/my-trips', { params }),
    
    getAvailableBookings: (params?: any) =>
      this.api.get('/bookings/available', { params }),
    
    getBooking: (id: string) =>
      this.api.get(`/bookings/${id}`),
    
    acceptBooking: (id: string, vehicleId: string) =>
      this.api.put(`/bookings/${id}/accept`, { vehicleId }),
    
    updateStatus: (id: string, status: string, notes?: string, location?: [number, number]) =>
      this.api.put(`/bookings/${id}/status`, { status, notes, location }),
    
    rateBooking: (id: string, rating: number, comment?: string) =>
      this.api.put(`/bookings/${id}/rate`, { rating, comment }),
    
    cancelBooking: (id: string, reason: string) =>
      this.api.put(`/bookings/${id}/cancel`, { reason }),
  };

  // User endpoints
  users = {
    getUsers: (params?: any) =>
      this.api.get('/users', { params }),
    
    getUser: (id: string) =>
      this.api.get(`/users/${id}`),
    
    getNearbyUsers: (userType: string, params: any) =>
      this.api.get(`/users/nearby/${userType}`, { params }),
    
    getUserStats: () =>
      this.api.get('/users/stats/overview'),
    
    verifyUser: (id: string, isVerified: boolean) =>
      this.api.put(`/users/${id}/verify`, { isVerified }),
    
    updateUserStatus: (id: string, isActive: boolean) =>
      this.api.put(`/users/${id}/status`, { isActive }),
  };

  // Admin endpoints
  admin = {
    getDashboard: () =>
      this.api.get('/admin/dashboard'),
    
    getUsers: (params?: any) =>
      this.api.get('/admin/users', { params }),
    
    getVehicles: (params?: any) =>
      this.api.get('/admin/vehicles', { params }),
    
    getBookings: (params?: any) =>
      this.api.get('/admin/bookings', { params }),
    
    verifyVehicle: (id: string, isVerified: boolean, adminNotes?: string) =>
      this.api.put(`/admin/vehicles/${id}/verify`, { isVerified, adminNotes }),
    
    updateBookingNotes: (id: string, adminNotes: string) =>
      this.api.put(`/admin/bookings/${id}/notes`, { adminNotes }),
    
    getAnalytics: (params?: any) =>
      this.api.get('/admin/analytics', { params }),
    
    exportData: (type: string, params?: any) =>
      this.api.get(`/admin/export/${type}`, { params }),
  };

  // Health check
  health = () => this.api.get('/health');
}

export const apiService = new ApiService();
export default apiService;