const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get all users with pagination and filters
// @route   GET /api/users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { role, verified, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Role filter
    if (role) {
      query.role = role;
    }
    
    // Verification filter
    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update user verification status
// @route   PUT /api/users/:id/verify
// @access  Private (Admin only)
router.put('/:id/verify', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update user active status
// @route   PUT /api/users/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get nearby users
// @route   GET /api/users/nearby
// @access  Private
router.get('/nearby/:userType', protect, async (req, res) => {
  try {
    const { userType } = req.params;
    const { latitude, longitude, maxDistance = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    if (!['farmer', 'vehicle_owner'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const users = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'distance',
          maxDistance: parseFloat(maxDistance) * 1000, // Convert to meters
          spherical: true,
          query: {
            role: userType,
            isActive: true,
            isVerified: true,
            _id: { $ne: req.user._id } // Exclude current user
          }
        }
      },
      {
        $project: {
          password: 0
        }
      },
      {
        $sort: { distance: 1 }
      },
      {
        $limit: 20
      }
    ]);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const totalVerified = await User.countDocuments({ isVerified: true });
    const totalActive = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        verified: totalVerified,
        active: totalActive,
        byRole: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;