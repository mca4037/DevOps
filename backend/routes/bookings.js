const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { protect, farmerOnly, vehicleOwnerOnly, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Farmer)
router.post('/', protect, farmerOnly, [
  body('vehicle').isMongoId().withMessage('Valid vehicle ID is required'),
  body('produce.type').isIn(['grains', 'vegetables', 'fruits', 'dairy', 'livestock', 'equipment', 'seeds', 'fertilizer', 'other']).withMessage('Invalid produce type'),
  body('produce.name').notEmpty().withMessage('Produce name is required'),
  body('produce.quantity.amount').isFloat({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('produce.quantity.unit').isIn(['kg', 'tons', 'quintal', 'bags', 'boxes', 'liters']).withMessage('Invalid quantity unit'),
  body('pickup.address.street').notEmpty().withMessage('Pickup street address is required'),
  body('pickup.address.city').notEmpty().withMessage('Pickup city is required'),
  body('pickup.address.state').notEmpty().withMessage('Pickup state is required'),
  body('pickup.address.pincode').notEmpty().withMessage('Pickup pincode is required'),
  body('pickup.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid pickup latitude is required'),
  body('pickup.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid pickup longitude is required'),
  body('dropoff.address.street').notEmpty().withMessage('Dropoff street address is required'),
  body('dropoff.address.city').notEmpty().withMessage('Dropoff city is required'),
  body('dropoff.address.state').notEmpty().withMessage('Dropoff state is required'),
  body('dropoff.address.pincode').notEmpty().withMessage('Dropoff pincode is required'),
  body('dropoff.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid dropoff latitude is required'),
  body('dropoff.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid dropoff longitude is required'),
  body('pickup.preferredTime.date').isISO8601().withMessage('Valid pickup date is required')
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

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findById(req.body.vehicle).populate('owner');
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    if (!vehicle.isActive || !vehicle.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for booking'
      });
    }

    // Calculate distance
    const distance = calculateDistance(
      req.body.pickup.coordinates.latitude,
      req.body.pickup.coordinates.longitude,
      req.body.dropoff.coordinates.latitude,
      req.body.dropoff.coordinates.longitude
    );

    // Calculate pricing
    const baseAmount = distance * vehicle.pricePerKm;
    const totalAmount = baseAmount; // Can add additional charges later

    const bookingData = {
      ...req.body,
      farmer: req.user._id,
      vehicleOwner: vehicle.owner._id,
      distance: distance,
      pricing: {
        baseAmount,
        totalAmount,
        additionalCharges: {
          loading: 0,
          unloading: 0,
          waiting: 0,
          toll: 0
        }
      }
    };

    const booking = await Booking.create(bookingData);

    // Populate the booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('farmer', 'name phone email')
      .populate('vehicle', 'vehicleNumber vehicleType capacity')
      .populate('vehicleOwner', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
});

// @desc    Get bookings for current user
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    } else if (req.user.role === 'vehicle_owner') {
      query.vehicleOwner = req.user._id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('farmer', 'name phone email')
      .populate('vehicle', 'vehicleNumber vehicleType capacity')
      .populate('vehicleOwner', 'name phone email')
      .sort({ createdAt: -1 })
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
    console.error('My bookings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your bookings'
    });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('farmer', 'name phone email address')
      .populate('vehicle', 'vehicleNumber vehicleType capacity features')
      .populate('vehicleOwner', 'name phone email address')
      .populate('communication.sender', 'name role');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    const hasAccess = booking.farmer._id.toString() === req.user._id.toString() ||
                     booking.vehicleOwner._id.toString() === req.user._id.toString() ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    });
  }
});

// @desc    Accept/Reject booking (Vehicle Owner)
// @route   PUT /api/bookings/:id/respond
// @access  Private (Vehicle Owner)
router.put('/:id/respond', protect, vehicleOwnerOnly, [
  body('action').isIn(['accept', 'reject']).withMessage('Action must be accept or reject'),
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the vehicle for this booking
    if (booking.vehicleOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this booking'
      });
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending status'
      });
    }

    const { action, notes } = req.body;
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    await booking.updateStatus(newStatus, req.user._id, notes);

    res.json({
      success: true,
      message: `Booking ${action}ed successfully`,
      booking
    });
  } catch (error) {
    console.error('Booking response error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error responding to booking'
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Vehicle Owner)
router.put('/:id/status', protect, vehicleOwnerOnly, [
  body('status').isIn(['confirmed', 'pickup_scheduled', 'in_transit', 'delivered', 'completed']).withMessage('Invalid status'),
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the vehicle for this booking
    if (booking.vehicleOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const { status, notes } = req.body;

    // Validate status progression
    const validTransitions = {
      'accepted': ['confirmed', 'cancelled'],
      'confirmed': ['pickup_scheduled', 'cancelled'],
      'pickup_scheduled': ['in_transit', 'cancelled'],
      'in_transit': ['delivered'],
      'delivered': ['completed']
    };

    if (!validTransitions[booking.status] || !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${booking.status} to ${status}`
      });
    }

    await booking.updateStatus(status, req.user._id, notes);

    // Update vehicle status if needed
    if (status === 'in_transit') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'in_transit' });
    } else if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'idle' });
      // Increment trip count
      const vehicle = await Vehicle.findById(booking.vehicle);
      await vehicle.incrementTrips();
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Farmer or Vehicle Owner)
router.put('/:id/cancel', protect, [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has permission to cancel
    const canCancel = booking.farmer.toString() === req.user._id.toString() ||
                     booking.vehicleOwner.toString() === req.user._id.toString();

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (['delivered', 'completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled in current status'
      });
    }

    await booking.updateStatus('cancelled', req.user._id, req.body.reason);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    });
  }
});

// @desc    Add message to booking
// @route   POST /api/bookings/:id/messages
// @access  Private (Farmer or Vehicle Owner involved in booking)
router.post('/:id/messages', protect, [
  body('message').notEmpty().withMessage('Message is required'),
  body('messageType').optional().isIn(['text', 'location', 'image']).withMessage('Invalid message type')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is involved in this booking
    const isInvolved = booking.farmer.toString() === req.user._id.toString() ||
                      booking.vehicleOwner.toString() === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message in this booking'
      });
    }

    const { message, messageType = 'text' } = req.body;

    await booking.addMessage(req.user._id, message, messageType);

    res.json({
      success: true,
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding message'
    });
  }
});

// @desc    Submit rating and review
// @route   POST /api/bookings/:id/rate
// @access  Private (Farmer or Vehicle Owner)
router.post('/:id/rate', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isString().withMessage('Review must be a string')
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }

    const { rating, review } = req.body;
    const isFarmer = booking.farmer.toString() === req.user._id.toString();
    const isVehicleOwner = booking.vehicleOwner.toString() === req.user._id.toString();

    if (!isFarmer && !isVehicleOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this booking'
      });
    }

    // Update rating in booking
    if (isFarmer) {
      if (booking.rating.farmerRating.rating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this booking'
        });
      }
      booking.rating.farmerRating = {
        rating,
        review,
        timestamp: new Date()
      };
      
      // Update vehicle owner's rating
      const vehicleOwner = await User.findById(booking.vehicleOwner);
      await vehicleOwner.updateRating(rating);
      
      // Update vehicle rating
      const vehicle = await Vehicle.findById(booking.vehicle);
      await vehicle.updateRating(rating);
      
    } else if (isVehicleOwner) {
      if (booking.rating.vehicleOwnerRating.rating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this booking'
        });
      }
      booking.rating.vehicleOwnerRating = {
        rating,
        review,
        timestamp: new Date()
      };
      
      // Update farmer's rating
      const farmer = await User.findById(booking.farmer);
      await farmer.updateRating(rating);
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting rating'
    });
  }
});

// @desc    Get nearby booking requests for vehicle owners
// @route   POST /api/bookings/nearby-requests
// @access  Private (Vehicle Owner)
router.post('/nearby-requests', protect, vehicleOwnerOnly, [
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('radius').optional().isFloat({ min: 1, max: 200 }).withMessage('Radius must be between 1-200 km')
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

    const { latitude, longitude, radius = 50 } = req.body;

    // Get user's vehicles
    const userVehicles = await Vehicle.find({ 
      owner: req.user._id, 
      isActive: true, 
      isAvailable: true 
    });

    if (userVehicles.length === 0) {
      return res.json({
        success: true,
        count: 0,
        bookings: [],
        message: 'No active vehicles found'
      });
    }

    const vehicleIds = userVehicles.map(v => v._id);

    // Find nearby pending bookings for user's vehicles
    const bookings = await Booking.find({
      vehicle: { $in: vehicleIds },
      status: 'pending',
      'pickup.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    })
    .populate('farmer', 'name phone rating')
    .populate('vehicle', 'vehicleNumber vehicleType')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Nearby requests fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby requests'
    });
  }
});

module.exports = router;