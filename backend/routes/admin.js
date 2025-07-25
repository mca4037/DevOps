const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect, adminOnly);

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalVehicleOwners,
      totalVehicles,
      activeVehicles,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'vehicle_owner' }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ isActive: true, isAvailable: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    // Recent activity
    const recentBookings = await Booking.find()
      .populate('farmer', 'name')
      .populate('vehicleOwner', 'name')
      .populate('vehicle', 'vehicleNumber vehicleType')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalFarmers,
          totalVehicleOwners,
          totalVehicles,
          activeVehicles,
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentActivity: {
          recentBookings,
          recentUsers
        }
      }
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const {
      role,
      isActive,
      isVerified,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { role: { $ne: 'admin' } };

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional data based on role
    let additionalData = {};

    if (user.role === 'vehicle_owner') {
      additionalData.vehicles = await Vehicle.find({ owner: user._id });
      additionalData.bookings = await Booking.find({ vehicleOwner: user._id })
        .populate('farmer', 'name')
        .populate('vehicle', 'vehicleNumber')
        .sort({ createdAt: -1 })
        .limit(10);
    } else if (user.role === 'farmer') {
      additionalData.bookings = await Booking.find({ farmer: user._id })
        .populate('vehicleOwner', 'name')
        .populate('vehicle', 'vehicleNumber vehicleType')
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.json({
      success: true,
      user,
      ...additionalData
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('isActive must be true or false'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be true or false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { isActive, isVerified } = req.body;

    user.isActive = isActive;
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status'
    });
  }
});

// @desc    Get all vehicles with filters
// @route   GET /api/admin/vehicles
// @access  Private (Admin)
router.get('/vehicles', async (req, res) => {
  try {
    const {
      vehicleType,
      isActive,
      isAvailable,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    if (vehicleType) query.vehicleType = vehicleType;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    if (search) {
      query.$or = [
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { vehicleType: { $regex: search, $options: 'i' } }
      ];
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name email phone')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      vehicles
    });
  } catch (error) {
    console.error('Vehicles fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicles'
    });
  }
});

// @desc    Approve/Reject vehicle
// @route   PUT /api/admin/vehicles/:id/approve
// @access  Private (Admin)
router.put('/vehicles/:id/approve', [
  body('isActive').isBoolean().withMessage('isActive must be true or false'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    vehicle.isActive = req.body.isActive;
    await vehicle.save();

    res.json({
      success: true,
      message: `Vehicle ${req.body.isActive ? 'approved' : 'rejected'} successfully`,
      vehicle
    });
  } catch (error) {
    console.error('Vehicle approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle status'
    });
  }
});

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Private (Admin)
router.get('/bookings', async (req, res) => {
  try {
    const {
      status,
      farmerId,
      vehicleOwnerId,
      vehicleId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (farmerId) query.farmer = farmerId;
    if (vehicleOwnerId) query.vehicleOwner = vehicleOwnerId;
    if (vehicleId) query.vehicle = vehicleId;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const bookings = await Booking.find(query)
      .populate('farmer', 'name email phone')
      .populate('vehicleOwner', 'name email phone')
      .populate('vehicle', 'vehicleNumber vehicleType')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      bookings
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
});

// @desc    Get booking analytics
// @route   GET /api/admin/analytics/bookings
// @access  Private (Admin)
router.get('/analytics/bookings', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      bookingsByStatus,
      bookingsByProduceType,
      revenueOverTime,
      topVehicleOwners,
      topFarmers
    ] = await Promise.all([
      // Bookings by status
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Bookings by produce type
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$produce.type', count: { $sum: 1 } } }
      ]),

      // Revenue over time (by day)
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            revenue: { $sum: '$pricing.totalAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Top vehicle owners by completed trips
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: '$vehicleOwner', completedTrips: { $sum: 1 }, revenue: { $sum: '$pricing.totalAmount' } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'owner' } },
        { $unwind: '$owner' },
        { $project: { name: '$owner.name', email: '$owner.email', completedTrips: 1, revenue: 1 } },
        { $sort: { completedTrips: -1 } },
        { $limit: 10 }
      ]),

      // Top farmers by bookings
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$farmer', totalBookings: { $sum: 1 }, totalSpent: { $sum: '$pricing.totalAmount' } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'farmer' } },
        { $unwind: '$farmer' },
        { $project: { name: '$farmer.name', email: '$farmer.email', totalBookings: 1, totalSpent: 1 } },
        { $sort: { totalBookings: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        period,
        bookingsByStatus,
        bookingsByProduceType,
        revenueOverTime,
        topVehicleOwners,
        topFarmers
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
});

// @desc    Get vehicle analytics
// @route   GET /api/admin/analytics/vehicles
// @access  Private (Admin)
router.get('/analytics/vehicles', async (req, res) => {
  try {
    const [
      vehiclesByType,
      vehiclesByStatus,
      utilizationStats,
      avgRatings
    ] = await Promise.all([
      // Vehicles by type
      Vehicle.aggregate([
        { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
      ]),

      // Vehicles by status
      Vehicle.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Vehicle utilization
      Vehicle.aggregate([
        {
          $project: {
            vehicleType: 1,
            totalTrips: 1,
            isActive: 1,
            utilizationRate: {
              $cond: {
                if: { $gt: ['$totalTrips', 0] },
                then: { $divide: ['$totalTrips', 100] }, // Assuming 100 as max trips for calculation
                else: 0
              }
            }
          }
        },
        {
          $group: {
            _id: '$vehicleType',
            avgUtilization: { $avg: '$utilizationRate' },
            totalVehicles: { $sum: 1 },
            activeVehicles: { $sum: { $cond: ['$isActive', 1, 0] } }
          }
        }
      ]),

      // Average ratings by vehicle type
      Vehicle.aggregate([
        { $match: { rating: { $gt: 0 } } },
        { $group: { _id: '$vehicleType', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        vehiclesByType,
        vehiclesByStatus,
        utilizationStats,
        avgRatings
      }
    });
  } catch (error) {
    console.error('Vehicle analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicle analytics'
    });
  }
});

// @desc    Delete user (soft delete - deactivate)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      $or: [{ farmer: user._id }, { vehicleOwner: user._id }],
      status: { $in: ['pending', 'accepted', 'confirmed', 'pickup_scheduled', 'in_transit'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active bookings'
      });
    }

    // Soft delete - deactivate user
    user.isActive = false;
    await user.save();

    // Deactivate user's vehicles if vehicle owner
    if (user.role === 'vehicle_owner') {
      await Vehicle.updateMany(
        { owner: user._id },
        { isActive: false, isAvailable: false }
      );
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

module.exports = router;