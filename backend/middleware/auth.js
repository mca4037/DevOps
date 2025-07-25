const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Check if user is farmer
const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    res.status(403).json({ message: 'Farmer access required' });
  }
};

// Check if user is vehicle owner
const vehicleOwnerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'vehicle_owner') {
    next();
  } else {
    res.status(403).json({ message: 'Vehicle owner access required' });
  }
};

module.exports = { protect, adminOnly, farmerOnly, vehicleOwnerOnly };