export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'vehicle_owner' | 'admin';
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  address?: {
    street?: string;
    village?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  
  // Farmer specific fields
  farmSize?: number;
  cropsGrown?: string[];
  
  // Vehicle owner specific fields
  licenseNumber?: string;
  experience?: number;
  rating?: number;
  totalRatings?: number;
  earnings?: number;
  completedTrips?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  owner: string | User;
  vehicleType: 'tractor' | 'tempo' | 'truck' | 'mini_truck' | 'pickup' | 'auto_rickshaw';
  vehicleNumber: string;
  brand: string;
  model: string;
  year?: number;
  capacity: {
    weight: number;
    volume?: number;
  };
  images?: string[];
  documents?: {
    registration?: string;
    insurance?: string;
    permit?: string;
  };
  isVerified: boolean;
  isAvailable: boolean;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  baseLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  serviceAreas?: Array<{
    district: string;
    state: string;
    maxDistance: number;
  }>;
  pricing: {
    baseRate: number;
    perKgRate?: number;
    minimumCharge?: number;
  };
  features?: string[];
  rating?: number;
  totalRatings?: number;
  totalTrips?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  farmer: string | User;
  vehicle?: string | Vehicle;
  driver?: string | User;
  produce: {
    type: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'livestock' | 'other';
    items: Array<{
      name: string;
      quantity: number;
      unit: 'kg' | 'quintal' | 'ton' | 'pieces' | 'bags';
    }>;
    totalWeight: number;
    isPerishable: boolean;
    specialInstructions?: string;
  };
  locations: {
    pickup: {
      address: string;
      coordinates: [number, number];
      contactPerson?: string;
      contactPhone?: string;
    };
    dropoff: {
      address: string;
      coordinates: [number, number];
      contactPerson?: string;
      contactPhone?: string;
    };
  };
  timing: {
    preferredDate: string;
    preferredTime: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  };
  pricing: {
    estimatedCost?: number;
    finalCost?: number;
    distance?: number;
    currency: string;
  };
  status: 'pending' | 'accepted' | 'en_route_pickup' | 'picked_up' | 'en_route_delivery' | 'delivered' | 'cancelled' | 'rejected';
  timeline: Array<{
    status: string;
    timestamp: string;
    notes?: string;
    location?: [number, number];
  }>;
  rating?: {
    farmerRating?: {
      rating: number;
      comment?: string;
      timestamp: string;
    };
    driverRating?: {
      rating: number;
      comment?: string;
      timestamp: string;
    };
  };
  documents?: {
    invoices?: string[];
    receipts?: string[];
    photos?: string[];
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'card';
  cancellationReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'farmer' | 'vehicle_owner';
  address?: {
    street?: string;
    village?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  
  // Farmer specific
  farmSize?: number;
  cropsGrown?: string[];
  
  // Vehicle owner specific
  licenseNumber?: string;
  experience?: number;
}

export interface SocketContextType {
  socket: any;
  isConnected: boolean;
  joinRoom: (userId: string, userType: string) => void;
  leaveRoom: () => void;
}

export interface DashboardStats {
  totalBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  totalEarnings?: number;
  averageRating?: number;
  recentBookings?: Booking[];
}

export interface AdminDashboardData {
  overview: {
    totalUsers: number;
    totalFarmers: number;
    totalDrivers: number;
    totalVehicles: number;
    totalBookings: number;
    newUsersThisWeek: number;
    newBookingsThisWeek: number;
    completedBookingsThisMonth: number;
  };
  pendingVerifications: {
    users: number;
    vehicles: number;
  };
  bookingStats: Array<{
    _id: string;
    count: number;
  }>;
  revenueStats: {
    totalRevenue: number;
    averageBookingValue: number;
  };
  produceStats: Array<{
    _id: string;
    count: number;
    totalWeight: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}