const express = require('express');
const { body, validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');
const { protect, vehicleOwnerOnly, adminOnly, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Register a new vehicle
// @route   POST /api/vehicles
// @access  Private (Vehicle Owner)
router.post('/', protect, vehicleOwnerOnly, [
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleType').isIn(['truck', 'mini_truck', 'pickup', 'tractor', 'tempo', 'van']).withMessage('Invalid vehicle type'),
  body('capacity.weight').isNumeric().isFloat({ min: 100 }).withMessage('Weight capacity must be at least 100 kg'),
  body('pricePerKm').isNumeric().isFloat({ min: 1 }).withMessage('Price per km must be at least ₹1')
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

    const vehicleData = {
      ...req.body,
      owner: req.user._id
    };

    const vehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully. Awaiting admin approval.',
      vehicle
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this number already exists'
      });
    }
    console.error('Vehicle registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vehicle registration'
    });
  }
});

// @desc    Get all vehicles with filters
// @route   GET /api/vehicles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      vehicleType,
      city,
      state,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius = 50,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isActive: true, isAvailable: true };

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    if (minCapacity || maxCapacity) {
      query['capacity.weight'] = {};
      if (minCapacity) query['capacity.weight'].$gte = parseFloat(minCapacity);
      if (maxCapacity) query['capacity.weight'].$lte = parseFloat(maxCapacity);
    }

    if (minPrice || maxPrice) {
      query.pricePerKm = {};
      if (minPrice) query.pricePerKm.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerKm.$lte = parseFloat(maxPrice);
    }

    // Location-based search
    if (latitude && longitude) {
      query['currentLocation.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    } else if (city || state) {
      const locationQuery = {};
      if (city) locationQuery['operatingAreas.city'] = new RegExp(city, 'i');
      if (state) locationQuery['operatingAreas.state'] = new RegExp(state, 'i');
      query = { ...query, ...locationQuery };
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name phone rating totalRatings')
      .sort({ rating: -1, createdAt: -1 })
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
    console.error('Vehicle fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicles'
    });
  }
});

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name phone email rating totalRatings address');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    console.error('Vehicle fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching vehicle'
    });
  }
});

// @desc    Get vehicles owned by current user
// @route   GET /api/vehicles/my/vehicles
// @access  Private (Vehicle Owner)
router.get('/my/vehicles', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    console.error('My vehicles fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your vehicles'
    });
  }
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Vehicle Owner)
router.put('/:id', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    // Don't allow updating certain fields
    delete req.body.owner;
    delete req.body.isActive;
    delete req.body.totalTrips;
    delete req.body.rating;
    delete req.body.totalRatings;

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    console.error('Vehicle update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle'
    });
  }
});

// @desc    Update vehicle availability
// @route   PUT /api/vehicles/:id/availability
// @access  Private (Vehicle Owner)
router.put('/:id/availability', protect, vehicleOwnerOnly, [
  body('isAvailable').isBoolean().withMessage('Availability must be true or false')
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

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    vehicle.isAvailable = req.body.isAvailable;
    await vehicle.save();

    res.json({
      success: true,
      message: `Vehicle marked as ${req.body.isAvailable ? 'available' : 'unavailable'}`,
      vehicle
    });
  } catch (error) {
    console.error('Vehicle availability update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle availability'
    });
  }
});

// @desc    Update vehicle location
// @route   PUT /api/vehicles/:id/location
// @access  Private (Vehicle Owner)
router.put('/:id/location', protect, vehicleOwnerOnly, [
  body('coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
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

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vehicle'
      });
    }

    vehicle.currentLocation = req.body;
    await vehicle.save();

    res.json({
      success: true,
      message: 'Vehicle location updated successfully',
      location: vehicle.currentLocation
    });
  } catch (error) {
    console.error('Vehicle location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating vehicle location'
    });
  }
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Vehicle Owner)
router.delete('/:id', protect, vehicleOwnerOnly, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user owns the vehicle
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this vehicle'
      });
    }

    // Check if vehicle has active bookings
    const activeBookings = await require('../models/Booking').countDocuments({
      vehicle: req.params.id,
      status: { $in: ['pending', 'accepted', 'confirmed', 'pickup_scheduled', 'in_transit'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active bookings'
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Vehicle deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting vehicle'
    });
  }
});

// @desc    Get nearby vehicles for farmers
// @route   POST /api/vehicles/nearby
// @access  Private (Farmers)
router.post('/nearby', protect, [
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

    const { latitude, longitude, radius = 50, vehicleType, minCapacity } = req.body;

    let query = {
      isActive: true,
      isAvailable: true,
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    };

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    if (minCapacity) {
      query['capacity.weight'] = { $gte: minCapacity };
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name phone rating totalRatings')
      .limit(20);

    res.json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    console.error('Nearby vehicles search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching nearby vehicles'
    });
  }
});

module.exports = router;