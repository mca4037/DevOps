const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalDrivers = await User.countDocuments({ role: 'vehicle_owner' });
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Get recent statistics
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    const newBookingsThisWeek = await Booking.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    const completedBookingsThisMonth = await Booking.countDocuments({
      status: 'delivered',
      createdAt: { $gte: lastMonth }
    });

    // Get pending verifications
    const pendingUserVerifications = await User.countDocuments({
      isVerified: false,
      role: { $in: ['farmer', 'vehicle_owner'] }
    });

    const pendingVehicleVerifications = await Vehicle.countDocuments({
      isVerified: false
    });

    // Get booking status distribution
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get revenue statistics (if payment integration exists)
    const revenueStats = await Booking.aggregate([
      {
        $match: {
          status: 'delivered',
          'pricing.finalCost': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.finalCost' },
          averageBookingValue: { $avg: '$pricing.finalCost' }
        }
      }
    ]);

    // Get produce type distribution
    const produceStats = await Booking.aggregate([
      {
        $group: {
          _id: '$produce.type',
          count: { $sum: 1 },
          totalWeight: { $sum: '$produce.totalWeight' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      dashboard: {
        overview: {
          totalUsers,
          totalFarmers,
          totalDrivers,
          totalVehicles,
          totalBookings,
          newUsersThisWeek,
          newBookingsThisWeek,
          completedBookingsThisMonth
        },
        pendingVerifications: {
          users: pendingUserVerifications,
          vehicles: pendingVehicleVerifications
        },
        bookingStats,
        revenueStats: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
        produceStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { 
      role, 
      verified, 
      active, 
      page = 1, 
      limit = 20, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let query = {};
    
    if (role) query.role = role;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (active !== undefined) query.isActive = active === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all vehicles for admin management
// @route   GET /api/admin/vehicles
// @access  Private (Admin only)
router.get('/vehicles', protect, adminOnly, async (req, res) => {
  try {
    const { 
      vehicleType, 
      verified, 
      available, 
      page = 1, 
      limit = 20, 
      search 
    } = req.query;
    
    let query = {};
    
    if (vehicleType) query.vehicleType = vehicleType;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (available !== undefined) query.isAvailable = available === 'true';
    
    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      vehicles,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all bookings for admin management
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const { 
      status, 
      produceType, 
      page = 1, 
      limit = 20, 
      dateFrom, 
      dateTo 
    } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (produceType) query['produce.type'] = produceType;
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const bookings = await Booking.find(query)
      .populate('farmer', 'name email phone')
      .populate('driver', 'name email phone')
      .populate('vehicle', 'vehicleType vehicleNumber brand model')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Verify vehicle
// @route   PUT /api/admin/vehicles/:id/verify
// @access  Private (Admin only)
router.put('/vehicles/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { isVerified, adminNotes } = req.body;
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { 
        isVerified,
        adminNotes 
      },
      { new: true }
    ).populate('owner', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      message: `Vehicle ${isVerified ? 'verified' : 'rejected'} successfully`,
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update booking admin notes
// @route   PUT /api/admin/bookings/:id/notes
// @access  Private (Admin only)
router.put('/bookings/:id/notes', protect, adminOnly, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { adminNotes },
      { new: true }
    ).populate([
      { path: 'farmer', select: 'name email phone' },
      { path: 'driver', select: 'name email phone' },
      { path: 'vehicle', select: 'vehicleType vehicleNumber brand model' }
    ]);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Admin notes updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const { period = '30', type = 'overview' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let analytics = {};

    if (type === 'overview' || type === 'all') {
      // User registration trends
      const userTrends = await User.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              role: "$role"
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.date": 1 }
        }
      ]);

      // Booking trends
      const bookingTrends = await Booking.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              status: "$status"
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.date": 1 }
        }
      ]);

      analytics.userTrends = userTrends;
      analytics.bookingTrends = bookingTrends;
    }

    if (type === 'produce' || type === 'all') {
      // Produce analytics
      const produceAnalytics = await Booking.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: "$produce.type",
            totalBookings: { $sum: 1 },
            totalWeight: { $sum: "$produce.totalWeight" },
            averageWeight: { $avg: "$produce.totalWeight" },
            completedBookings: {
              $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
            }
          }
        },
        {
          $sort: { totalBookings: -1 }
        }
      ]);

      analytics.produceAnalytics = produceAnalytics;
    }

    if (type === 'vehicles' || type === 'all') {
      // Vehicle analytics
      const vehicleAnalytics = await Vehicle.aggregate([
        {
          $group: {
            _id: "$vehicleType",
            totalVehicles: { $sum: 1 },
            verifiedVehicles: {
              $sum: { $cond: ["$isVerified", 1, 0] }
            },
            availableVehicles: {
              $sum: { $cond: ["$isAvailable", 1, 0] }
            },
            averageRating: { $avg: "$rating" }
          }
        },
        {
          $sort: { totalVehicles: -1 }
        }
      ]);

      analytics.vehicleAnalytics = vehicleAnalytics;
    }

    res.json({
      success: true,
      period: days,
      analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private (Admin only)
router.get('/export/:type', protect, adminOnly, async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json', dateFrom, dateTo } = req.query;

    let query = {};
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    let data = [];

    switch (type) {
      case 'users':
        data = await User.find(query).select('-password').lean();
        break;
      case 'vehicles':
        data = await Vehicle.find(query).populate('owner', 'name email').lean();
        break;
      case 'bookings':
        data = await Booking.find(query)
          .populate('farmer', 'name email')
          .populate('driver', 'name email')
          .populate('vehicle', 'vehicleType vehicleNumber')
          .lean();
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
      return res.send(csv);
    }

    res.json({
      success: true,
      type,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router;