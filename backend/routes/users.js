const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (public information only)
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    let query = { isActive: true, role: { $ne: 'admin' } };

    if (role && ['farmer', 'vehicle_owner'].includes(role)) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('name role rating totalRatings address.city address.state createdAt')
      .sort({ rating: -1, createdAt: -1 })
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

// @desc    Get user by ID (public information)
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name role rating totalRatings address.city address.state createdAt profileImage');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let stats = {
      rating: user.rating,
      totalRatings: user.totalRatings,
      memberSince: user.createdAt
    };

    // Get role-specific statistics
    if (user.role === 'vehicle_owner') {
      const Vehicle = require('../models/Vehicle');
      const Booking = require('../models/Booking');

      const [vehicles, completedTrips, totalEarnings] = await Promise.all([
        Vehicle.find({ owner: user._id, isActive: true }),
        Booking.countDocuments({ vehicleOwner: user._id, status: 'completed' }),
        Booking.aggregate([
          { $match: { vehicleOwner: user._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
        ])
      ]);

      stats.vehiclesOwned = vehicles.length;
      stats.completedTrips = completedTrips;
      stats.totalEarnings = totalEarnings[0]?.total || 0;

    } else if (user.role === 'farmer') {
      const Booking = require('../models/Booking');

      const [totalBookings, completedBookings, totalSpent] = await Promise.all([
        Booking.countDocuments({ farmer: user._id }),
        Booking.countDocuments({ farmer: user._id, status: 'completed' }),
        Booking.aggregate([
          { $match: { farmer: user._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
        ])
      ]);

      stats.totalBookings = totalBookings;
      stats.completedBookings = completedBookings;
      stats.totalSpent = totalSpent[0]?.total || 0;
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('User stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
});

// @desc    Get user reviews/ratings
// @route   GET /api/users/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.params.id);

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const Booking = require('../models/Booking');

    let matchQuery = {};
    let ratingField = '';

    if (user.role === 'vehicle_owner') {
      matchQuery = { vehicleOwner: user._id, 'rating.farmerRating.rating': { $exists: true } };
      ratingField = 'rating.farmerRating';
    } else if (user.role === 'farmer') {
      matchQuery = { farmer: user._id, 'rating.vehicleOwnerRating.rating': { $exists: true } };
      ratingField = 'rating.vehicleOwnerRating';
    }

    const reviews = await Booking.find(matchQuery)
      .populate('farmer', 'name')
      .populate('vehicleOwner', 'name')
      .populate('vehicle', 'vehicleNumber vehicleType')
      .select(`${ratingField} createdAt farmer vehicleOwner vehicle`)
      .sort({ [`${ratingField}.timestamp`]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(matchQuery);

    // Transform the data to make it easier to use
    const transformedReviews = reviews.map(booking => {
      const rating = user.role === 'vehicle_owner' 
        ? booking.rating.farmerRating 
        : booking.rating.vehicleOwnerRating;
      
      return {
        rating: rating.rating,
        review: rating.review,
        timestamp: rating.timestamp,
        reviewerName: user.role === 'vehicle_owner' 
          ? booking.farmer.name 
          : booking.vehicleOwner.name,
        bookingDate: booking.createdAt,
        vehicle: booking.vehicle
      };
    });

    res.json({
      success: true,
      count: transformedReviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reviews: transformedReviews
    });
  } catch (error) {
    console.error('User reviews fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user reviews'
    });
  }
});

// @desc    Search users by location
// @route   POST /api/users/search-by-location
// @access  Public
router.post('/search-by-location', [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('radius').optional().isFloat({ min: 1, max: 500 }).withMessage('Radius must be between 1-500 km'),
  body('role').optional().isIn(['farmer', 'vehicle_owner']).withMessage('Invalid role')
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

    const { latitude, longitude, radius = 50, role } = req.body;

    let query = {
      isActive: true,
      role: { $ne: 'admin' },
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('name role rating totalRatings address.city address.state createdAt')
      .limit(20);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Location-based user search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching users by location'
    });
  }
});

// @desc    Get top rated users
// @route   GET /api/users/top-rated
// @access  Public
router.get('/top-rated', async (req, res) => {
  try {
    const { role, limit = 10 } = req.query;

    let query = { 
      isActive: true, 
      role: { $ne: 'admin' },
      rating: { $gt: 0 },
      totalRatings: { $gte: 3 } // At least 3 ratings to be considered
    };

    if (role && ['farmer', 'vehicle_owner'].includes(role)) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('name role rating totalRatings address.city address.state profileImage')
      .sort({ rating: -1, totalRatings: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Top rated users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top rated users'
    });
  }
});

module.exports = router;